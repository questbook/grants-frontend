import React, { useContext, useEffect, useMemo, useState } from 'react'
import { GRANT_FACTORY_ADDRESS, WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { defaultChainId, USD_ASSET, USD_DECIMALS, USD_ICON } from 'src/constants/chains'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import { GrantProgramContext } from 'src/contexts/GrantProgramContext'
import { WebwalletContext } from 'src/contexts/WebwalletContext'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { GrantFields } from 'src/screens/request_proposal/_utils/types'
import { RFPFormContext } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'
import getErrorMessage from 'src/utils/errorUtils'
import { addAuthorizedUser, bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

export default function useUpdateRFP(setCurrentStep: (step: number | undefined) => void) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [transactionData, setTransactionData] = React.useState<any>()

	const { subgraphClients } = useContext(ApiClientsContext)!
	const { grant, role } = useContext(GrantProgramContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { RFPEditFormData, grantId, workspaceId } = useContext(RFPFormContext)!

	const grantFactoryContract = useQBContract('grantFactory', chainId)

	const { webwallet } = useContext(WebwalletContext)!

	const [shouldRefreshNonce, setShouldRefreshNonce] = useState<boolean>()
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = React.useState(false)
	const { data: accountDataWebwallet, nonce } = useQuestbookAccount(shouldRefreshNonce)

	const customToast = useCustomToast()

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])


	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [grantFactoryContract])

	useEffect(() => {
		// console.log("add_user", nonce, webwallet)
		if(nonce && nonce !== 'Token expired') {
			return
		}

		if(webwallet) {
			addAuthorizedUser(webwallet?.address)
				.then(() => {
					setShouldRefreshNonce(true)
					// console.log('Added authorized user', webwallet.address)
				})
			// .catch((err) => console.log("Couldn't add authorized user", err))
		}
	}, [webwallet, nonce])

	const updateRFP = async() => {
		if(role !== 'admin') {
			customToast({
				title: 'You are not authorized to perform this action',
				status: 'error'
			})

			return
		}

		setLoading(true)

		const { proposalName, startDate, endDate, rubrics, allApplicantDetails, link, reviewMechanism, payoutMode, amount, milestones } = RFPEditFormData
		const allFieldsObject: {[key: string]: ApplicantDetailsFieldType} = {}

		if(allApplicantDetails) {
			for(let i = 0; i < allApplicantDetails.length; i++) {
				allFieldsObject[allApplicantDetails[i].id] = allApplicantDetails[i]
			}
		}

		const processedRubrics: { [key: number]: { title: string, details: string, maximumPoints: number } } = {}
		if(rubrics) {
			Object.keys(rubrics).forEach((key, index) => {
				processedRubrics[index] = {
					title: rubrics[index],
					details: '',
					maximumPoints: 5
				}
			})
		}

		const processedData: GrantFields = {
			title: proposalName,
			startDate: startDate,
			endDate: endDate,
			fields: allFieldsObject,
			link: link,
			docIpfsHash: '',
			payoutType: payoutMode,
			// reviewType: reviewMechanism,
			reward: {
				asset: USD_ASSET!,
				committed: amount.toString()!,
				token: {
					label: 'USD',
					address: USD_ASSET!,
					decimal: USD_DECIMALS.toString(),
					iconHash: USD_ICON
				}
			},
			// milestones: milestones,
			creatorId: accountDataWebwallet!.address!,
			workspaceId: Number(workspaceId).toString(),
		}

		if(reviewMechanism) {
			processedData['reviewType'] = reviewMechanism
		}

		if(milestones) {
			processedData['milestones'] = milestones
		}

		try {
			setCurrentStep(0)
			if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
				throw new Error('Zero wallet is not ready')
			}

			logger.info({ RFPEditFormData }, 'UpdateRFP')
			const { hash: rfpUpdateIpfsHash } = await validateAndUploadToIpfs('GrantUpdateRequest', processedData)
			if(!rfpUpdateIpfsHash) {
				throw new Error('Error validating grant data')
			}

			logger.info({ rfpUpdateIpfsHash }, 'UpdateWorkspace IPFS')

			let rubricHash = ''
			if(reviewMechanism === 'rubrics') {
				logger.info('rubrics', processedRubrics)
				const { hash: auxRubricHash } = await validateAndUploadToIpfs('RubricSetRequest', {
					rubric: {
						rubric: processedRubrics,
						isPrivate: false
					},
				})

				if(auxRubricHash) {
					rubricHash = auxRubricHash
				}
			}

			logger.info('rubric hash', rubricHash)

			const methodArgs = [grantId, Number(workspaceId), rfpUpdateIpfsHash, rubricHash, WORKSPACE_REGISTRY_ADDRESS[chainId] ]
			logger.info({ methodArgs }, 'Update RFP Method args')
			const response = await sendGaslessTransaction(
				biconomy,
				grantFactoryContract,
				'updateGrant',
				methodArgs,
				GRANT_FACTORY_ADDRESS[chainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			setCurrentStep(1)

			if(response) {
				const { receipt, txFee } = await getTransactionDetails(response, chainId.toString())
				setTransactionData(receipt)

				setCurrentStep(2)

				await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

				setCurrentStep(3)
				if(grant?.workspace?.id) {
					await chargeGas(Number(grant?.workspace?.id), Number(txFee), chainId)
				}
			}

			setCurrentStep(4)

			setLoading(false)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setCurrentStep(undefined)
			const message = getErrorMessage(e)
			setError(message)
			setLoading(false)
			customToast({
				position: 'top',
				title: message,
				status: 'error',
			})
		}
	}

	return {
		updateRFP,
		txHash: transactionData?.transactionHash,
		loading,
		error,
		role
	}

}


