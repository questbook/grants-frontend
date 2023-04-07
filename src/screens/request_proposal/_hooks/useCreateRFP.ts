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
import { validateRequest } from 'src/libraries/validator'
import { WebwalletContext } from 'src/pages/_app'
import { GrantFields } from 'src/screens/request_proposal/_utils/types'
import { RFPFormContext } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'

export default function useCreateRFP() {
	const [currentStep, setCurrentStep] = useState<number | undefined>()
	const [transactionHash, setTransactionHash] = useState<string>()

	const { rfpData, grantId, setGrantId, chainId, setExecutionType } = useContext(RFPFormContext)!

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
		contractName: 'grantFactory',
		title: 'Grant Program created on-chain!',
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
			if(!isBiconomyInitialised) {
				throw new Error('Biconomy is not initialised')
			}

			logger.info({ rfpData }, 'rfpData')

			const uploadedImageHash = config.defaultDAOImageHash

			const workspaceCreateData = {
				title: rfpData?.proposalName!,
				about: '',
				logoIpfsHash: uploadedImageHash,
				creatorId: scwAddress!,
				creatorPublicKey: webwallet?.publicKey,
				socials: [],
				supportedNetworks: [getSupportedValidatorNetworkFromChainId(chainId)],
			}

			let fileIPFSHash = ''
			if(rfpData?.doc) {
				const fileCID = await uploadToIPFS(rfpData?.doc!)
				logger.info('fileCID', fileCID)
				fileIPFSHash = fileCID.hash
			}

			const fieldMap: { [key: string]: ApplicantDetailsFieldType } = {}
			rfpData?.allApplicantDetails?.forEach((field) => {
				fieldMap[field.id] = field
			})

			const data: GrantFields = {
				workspaceId: '0x0', // WILL BE FILLED LATER
				title: rfpData?.proposalName,
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
				fields: fieldMap,
				grantManagers: [scwAddress!],
			}

			if(rfpData?.reviewMechanism) {
				data['reviewType'] = rfpData?.reviewMechanism
			}

			const rubricData = {
				rubric: {
					rubric: rfpData?.rubrics,
					isPrivate: false,
				},
			}

			// 1. Validate workspace create, grant create and rubric data
			await validateRequest('WorkspaceCreateRequest', workspaceCreateData)
			await validateRequest('GrantCreateRequest', data)
			if(rfpData?.reviewMechanism !== '') {
				await validateRequest('RubricSetRequest', rubricData)
			}

			// 2. Upload the workspace data to IPFS
			const { hash: workspaceCreateIpfsHash } = await uploadToIPFS(JSON.stringify(workspaceCreateData))
			if(!workspaceCreateIpfsHash) {
				throw new Error('Error uploading workspace create data')
			}

			// 3. Create the workspace
			let methodArgs = [workspaceCreateIpfsHash, new Uint8Array(32), '', '0']
			logger.info({ methodArgs }, 'Workspace create method args')

			const workspaceCreateReceipt = await workspaceCreateCall({
				method: 'createWorkspace',
				args: methodArgs,
				shouldWaitForBlock: false,
				showToast: false,
			})
			if(!workspaceCreateReceipt) {
				throw new Error('Error creating workspace')
			}

			// 4. Parse the workspace create event to get the workspace id
			const event = await getEventData(
				workspaceCreateReceipt,
				'WorkspaceCreated',
				WorkspaceRegistryAbi,
			)

			if(!event) {
				throw new Error('Error getting workspace id')
			}

			// 5. Get the workspace id
			const workspaceId = Number(event.args[0].toBigInt())
			logger.info('workspace_id', workspaceId)
			if(!workspaceId) {
				throw new Error('Workspace ID not found')
			}

			data.workspaceId = workspaceId.toString()

			// 6. Upload the grant data to IPFS
			const { hash: grantCreateIPFSHash } = await uploadToIPFS(JSON.stringify(data))

			const rubricHash = rfpData?.reviewMechanism !== '' ? (await uploadToIPFS(JSON.stringify(rubricData))).hash : ''
			logger.info('rubric hash', rubricHash)

			// 7. Create the grant
			methodArgs = [
				workspaceId.toString(),
				grantCreateIPFSHash,
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
				throw new Error('Error creating grant')
			}

			await addAuthorizedOwner(workspaceId, webwallet?.address!, scwAddress!, chainId.toString(), 'this is the safe addres - to be updated in the new flow')

			const grantEvent = await getEventData(
				grantCreateReceipt,
				'GrantCreated',
				GrantFactoryAbi,
			)
			logger.info('grantEvent', grantEvent)
			setExecutionType('submit')
			if(grantEvent) {
				const grantId = grantEvent.args[0].toString().toLowerCase()
				setGrantId(grantId)
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
