import { useContext, useMemo, useState } from 'react'
import {
	APPLICATION_REGISTRY_ADDRESS,
	WORKSPACE_REGISTRY_ADDRESS,
} from 'src/constants/addresses'
import {
	USD_ASSET,
	USD_DECIMALS,
	USD_ICON,
} from 'src/constants/chains'
import config from 'src/constants/config.json'
import GrantFactoryAbi from 'src/contracts/abi/GrantFactoryAbi.json'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import getErrorMessage from 'src/libraries/utils/error'
import {
	addAuthorizedOwner,
	getEventData,
} from 'src/libraries/utils/gasless'
import { uploadToIPFS } from 'src/libraries/utils/ipfs'
import logger from 'src/libraries/utils/logger'
import { getSupportedValidatorNetworkFromChainId } from 'src/libraries/utils/validations'
import { validateAndUploadToIpfs } from 'src/libraries/validator'
import { WebwalletContext } from 'src/pages/_app'
import { GrantFields } from 'src/screens/request_proposal/_utils/types'
import { RFPFormContext } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'

export default function useCreateRFP() {
	const [currentStep, setCurrentStep] = useState<number | undefined>()
	const [transactionHash, setTransactionHash] = useState<string>()

	const { rfpData, grantId, setGrantId, chainId } = useContext(RFPFormContext)!

	const {
		call: workspaceCreateCall,
		isBiconomyInitialised: isBiconomyInitialisedWorkspaceCreate,
	} = useFunctionCall({
		chainId,
		contractName: 'workspace',
		setTransactionStep: () => {
			setCurrentStep(0)
		},
	})
	const {
		call: grantCreateCall,
		isBiconomyInitialised: isBiconomyInitialisedGrantCreate,
	} = useFunctionCall({
		chainId,
		contractName: 'workspace',
		setTransactionStep: setCurrentStep,
		setTransactionHash: setTransactionHash,
	})

	const isBiconomyInitialised = useMemo(() => {
		return (
			isBiconomyInitialisedWorkspaceCreate && isBiconomyInitialisedGrantCreate
		)
	}, [isBiconomyInitialisedWorkspaceCreate, isBiconomyInitialisedGrantCreate])

	const { scwAddress, webwallet } = useContext(WebwalletContext)!

	const toast = useCustomToast()

	const createRFP = async() => {
		try {
			const uploadedImageHash = config.defaultDAOImageHash
			const { hash: workspaceCreateIpfsHash } = await validateAndUploadToIpfs(
				'WorkspaceCreateRequest',
				{
					title: rfpData?.proposalName!,
					about: '',
					logoIpfsHash: uploadedImageHash,
					creatorId: scwAddress!,
					creatorPublicKey: webwallet?.publicKey,
					socials: [],
					supportedNetworks: [getSupportedValidatorNetworkFromChainId(chainId)],
				},
			)

			if(!workspaceCreateIpfsHash) {
				throw new Error('Error validating grant data')
			}

			// if (!selectedSafeNetwork || !network) {
			// 	throw new Error('No network specified')
			// }

			if(!chainId) {
				throw new Error('No network specified')
			}

			if(!isBiconomyInitialised) {
				return
			}

			// setCurrentStepIndex(1)
			const methodArgs = [workspaceCreateIpfsHash, new Uint8Array(32), '', '0']
			logger.info({ methodArgs }, 'Workspace create method args')

			const workspaceCreateReceipt = await workspaceCreateCall({
				method: 'createWorkspace',
				args: methodArgs,
				shouldWaitForBlock: false,
			})
			if(!workspaceCreateReceipt) {
				return
			}

			// setCurrentStepIndex(1)
			const event = await getEventData(
				workspaceCreateReceipt,
				'WorkspaceCreated',
				WorkspaceRegistryAbi,
			)
			if(event) {
				const workspaceId = Number(event.args[0].toBigInt())
				logger.info('workspace_id', workspaceId)

				// createGrant()
				let fileIPFSHash = ''
				if(rfpData?.doc) {
					const fileCID = await uploadToIPFS(rfpData?.doc!)
					logger.info('fileCID', fileCID)
					fileIPFSHash = fileCID.hash
				}

				const fieldMap: {[key: string]: ApplicantDetailsFieldType} = {}
				rfpData?.allApplicantDetails?.forEach((field) => {
					fieldMap[field.id] = field
				})

				const data: GrantFields = {
					title: rfpData?.proposalName,
					startDate: rfpData?.startDate,
					endDate: rfpData?.endDate,
					// details: allApplicantDetails!,
					link: rfpData?.link!,
					docIpfsHash: fileIPFSHash,
					reward: {
						asset: USD_ASSET,
						committed: rfpData?.amount.toString(),
						token: {
							label: 'USD',
							address: USD_ASSET,
							decimal: USD_DECIMALS.toString(),
							iconHash: USD_ICON,
						},
					},
					payoutType: rfpData?.payoutMode,
					milestones: rfpData?.milestones,
					creatorId: scwAddress!,
					workspaceId: workspaceId.toString()!,
					fields: fieldMap,
					grantManagers: [scwAddress!],
				}

				if(rfpData?.reviewMechanism) {
					data['reviewType'] = rfpData?.reviewMechanism
				}

				// validate grant data
				const { hash: grantCreateIpfsHash } = await validateAndUploadToIpfs(
					'GrantCreateRequest',
					data,
				)

				let rubricHash = ''
				if(rfpData?.reviewMechanism !== '') {
					const { hash: auxRubricHash } = await validateAndUploadToIpfs(
						'RubricSetRequest',
						{
							rubric: {
								rubric: rfpData?.rubrics,
								isPrivate: false,
							},
						},
					)

					if(auxRubricHash) {
						rubricHash = auxRubricHash
					}
				}

				logger.info('rubric hash', rubricHash)
				if(workspaceId) {
					const methodArgs = [
						workspaceId.toString(),
						grantCreateIpfsHash,
						rubricHash,
						WORKSPACE_REGISTRY_ADDRESS[chainId!],
						APPLICATION_REGISTRY_ADDRESS[chainId!],
					]
					logger.info('methodArgs for grant creation', methodArgs)

					const grantCreateReceipt = await grantCreateCall({
						method: 'createGrant',
						args: methodArgs,
					})

					if(!grantCreateReceipt) {
						return
					}

					await addAuthorizedOwner(workspaceId, webwallet?.address!, scwAddress!, chainId.toString(), 'this is the safe addres - to be updated in the new flow')

					const grantEvent = await getEventData(
						grantCreateReceipt,
						'GrantCreated',
						GrantFactoryAbi,
					)
					logger.info('grantEvent', grantEvent)
					if(grantEvent) {
						const grantId = grantEvent.args[0].toString().toLowerCase()
						setGrantId(grantId)
					}
				} else {
					logger.info('workspaceId not found')
				}
			}

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			const message = getErrorMessage(e)
			logger.info('error', message)
			toast({
				position: 'top',
				title: message,
				status: 'error',
			})
		}
	}

	return {
		grantId,
		createRFP,
		currentStep,
		txHash: transactionHash,
	}
}
