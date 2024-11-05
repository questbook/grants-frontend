import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { updateGrant } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import getErrorMessage from 'src/libraries/utils/error'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { RFPFormContext } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'

export default function useUpdateRFP() {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [currentStep, setCurrentStep] = React.useState<number>()
	const [transactionHash, setTransactionHash] = React.useState<string>()
	const { role, grant } = useContext(GrantsProgramContext)!
	const { scwAddress } = useContext(WebwalletContext)!
	const { rfpData, grantId, workspaceId, chainId, setExecutionType } = useContext(RFPFormContext)!
	const { setCreatingProposalStep } = useContext(WebwalletContext)!
	const router = useRouter()
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

		if(!grant?.acceptingApplications) {
			customToast({
				title: 'Cannot update - Grant is closed',
				description: 'This grant is closed and can no longer be modified. Only open grants can be updated.',
				status: 'error'
			})
			return
		}

		setLoading(true)

		const { allApplicantDetails } = rfpData

		const fieldMap: {[key: string]: ApplicantDetailsFieldType} = {}
		allApplicantDetails?.forEach((field) => {
			fieldMap[field.id] = field
		})

		// const processedData: GrantFields = {
		// 	title: proposalName,
		// 	fields: fieldMap,
		// 	link: link,
		// 	docIpfsHash: '',
		// 	payoutType: payoutMode,
		// 	// reviewType: reviewMechanism,
		// 	reward: {
		// 		asset: USD_ASSET!,
		// 		committed: amount.toString()!,
		// 		token: {
		// 			label: 'USD',
		// 			address: USD_ASSET!,
		// 			decimal: USD_DECIMALS.toString(),
		// 			iconHash: USD_ICON
		// 		}
		// 	},
		// 	// milestones: milestones,
		// 	creatorId: scwAddress!,
		// 	workspaceId: Number(workspaceId).toString(),
		// }

		const variables = {
			id: grantId,
			ownerId: scwAddress!,
			title: rfpData?.proposalName!,
			bio: '',
			about: '',
			rewardCommitted: rfpData?.amount.toString(),
			payoutType: rfpData?.payoutMode!,
			link: rfpData?.link!,
			reviewType: rfpData?.reviewMechanism!,
			fields:  fieldMap,
			milestones: rfpData?.milestones,
			workspace: workspaceId?.toString(),
			rubrics: rfpData?.rubrics,
		}

		try {
			const update = await executeMutation(updateGrant, variables)
			setTransactionHash(update.updateGrant.recordId)
			setExecutionType('edit')
			if(update) {
				const grantId = update.updateGrant.recordId
				setCreatingProposalStep(1)
				router.push({
					pathname: '/dashboard',
					query: {
						grantId: grantId,
						chainId,
						role: 'admin'
					}
				})
			}
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
