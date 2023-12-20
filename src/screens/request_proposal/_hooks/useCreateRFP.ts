import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import {
	USD_ASSET,
	USD_DECIMALS,
	USD_ICON,
} from 'src/constants/chains'
import config from 'src/constants/config.json'
import { createWorkspaceAndGrant } from 'src/generated/mutation/createRFP'
import { executeMutation } from 'src/graphql/apollo'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import getErrorMessage from 'src/libraries/utils/error'
import logger from 'src/libraries/utils/logger'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { RFPFormContext } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'

export default function useCreateRFP() {
	const [currentStep, setCurrentStep] = useState<number | undefined>()
	const [transactionHash, setTransactionHash] = useState<string>()
	const { setRole } = useContext(GrantsProgramContext)!
	const { rfpData, grantId, setGrantId, chainId, setExecutionType } = useContext(RFPFormContext)!

	const router = useRouter()
	// const {
	// 	call: workspaceCreateCall,
	// 	isBiconomyInitialised: isBiconomyInitialisedWorkspaceCreate,
	// } = useFunctionCall({
	// 	chainId,
	// 	contractName: 'workspace',
	// 	setTransactionStep: () => {
	// 		setCurrentStep(0)
	// 	},
	// })
	// const {
	// 	call: grantCreateCall,
	// 	isBiconomyInitialised: isBiconomyInitialisedGrantCreate,
	// } = useFunctionCall({
	// 	chainId,
	// 	contractName: 'grantFactory',
	// 	title: 'Grant Program created on-chain!',
	// 	setTransactionStep: setCurrentStep,
	// 	setTransactionHash: setTransactionHash,
	// })

	// const isBiconomyInitialised = useMemo(() => {
	// 	return (
	// 		isBiconomyInitialisedWorkspaceCreate && isBiconomyInitialisedGrantCreate
	// 	)
	// }, [isBiconomyInitialisedWorkspaceCreate, isBiconomyInitialisedGrantCreate])

	const { scwAddress, webwallet } = useContext(WebwalletContext)!

	const toast = useCustomToast()

	const createRFP = async() => {
		try {
			const fieldMap: { [key: string]: ApplicantDetailsFieldType } = {}
			rfpData?.allApplicantDetails?.forEach((field) => {
				fieldMap[field.id] = field
			})
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			setCurrentStep(0)
			const variables = {
				ownerId: scwAddress!,
				title: rfpData?.proposalName!,
				bio: '',
				about: '',
				logoIpfsHash: config.defaultDAOImageHash,
				coverImageIpfsHash: config.defaultDAOImageHash,
				creatorPublicKey: webwallet?.publicKey!,
				rewardAsset: USD_ASSET,
				rewardCommitted: rfpData?.amount.toString(),
				tokenLabel: 'USD',
				tokenAddress: USD_ASSET,
				tokenIconHash: USD_ICON,
				tokenDecimal: USD_DECIMALS.toString(),
				payoutType: rfpData?.payoutMode!,
				link: rfpData?.link!,
				reviewType: rfpData?.reviewMechanism!,
				fields:  fieldMap,
			}
			const data = await executeMutation(createWorkspaceAndGrant, variables)
			//   const data = await executeMutation(updateFundsTransferTransactionStatus, variables);

			logger.info('data', data)
			setExecutionType('submit')
			if(data) {
				const grantId = data.createWorkspace.record._id
				setGrantId(grantId)
				setTransactionHash(data.createWorkspace.recordId)
				// onComplete redirect to grant page
				setRole('admin')
				router.push({
					pathname: '/dashboard',
					query: {
						grantId: data.createWorkspace.record._id,
						chainId,
						role: 'admin'
					}
				})
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
