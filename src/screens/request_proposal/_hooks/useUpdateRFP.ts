import React, { useContext } from 'react'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { USD_ASSET, USD_DECIMALS, USD_ICON } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import getErrorMessage from 'src/libraries/utils/error'
import logger from 'src/libraries/utils/logger'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { GrantFields } from 'src/screens/request_proposal/_utils/types'
import { RFPFormContext } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'

export default function useUpdateRFP() {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [currentStep, setCurrentStep] = React.useState<number>()
	const [transactionHash, setTransactionHash] = React.useState<string>()
	const { role } = useContext(GrantsProgramContext)!
	const { scwAddress } = useContext(WebwalletContext)!
	const { rfpData, grantId, workspaceId, chainId, setExecutionType } = useContext(RFPFormContext)!

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'grantFactory', setTransactionStep: setCurrentStep, setTransactionHash: setTransactionHash })

	const customToast = useCustomToast()

	const updateRFP = async() => {
		if(role !== 'admin') {
			customToast({
				title: 'You are not authorized to perform this action',
				description: 'Only an admin can edit the grant program details. Try again with a different account.',
				status: 'error'
			})

			return
		}

		setLoading(true)

		const { proposalName, rubrics, allApplicantDetails, link, reviewMechanism, payoutMode, amount, milestones } = rfpData

		const fieldMap: {[key: string]: ApplicantDetailsFieldType} = {}
		allApplicantDetails?.forEach((field) => {
			fieldMap[field.id] = field
		})

		const processedData: GrantFields = {
			title: proposalName,
			fields: fieldMap,
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
			creatorId: scwAddress!,
			workspaceId: Number(workspaceId).toString(),
		}

		if(reviewMechanism) {
			processedData['reviewType'] = reviewMechanism
		}

		if(milestones) {
			processedData['milestones'] = milestones
		}

		try {
			if(!isBiconomyInitialised) {
				throw new Error('Zero wallet is not ready')
			}

			const { hash: rfpUpdateIpfsHash } = await validateAndUploadToIpfs('GrantUpdateRequest', processedData)
			if(!rfpUpdateIpfsHash) {
				throw new Error('Error validating grant data')
			}

			logger.info({ rfpUpdateIpfsHash }, 'UpdateWorkspace IPFS')

			let rubricHash = ''
			if(reviewMechanism !== '') {
				logger.info('rubrics', rubrics)
				const { hash: auxRubricHash } = await validateAndUploadToIpfs('RubricSetRequest', {
					rubric: {
						rubric: rubrics,
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
			await call({ method: 'updateGrant', args: methodArgs })
			setExecutionType('edit')
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
		currentStep,
		txHash: transactionHash,
		loading,
		error,
		role
	}
}
