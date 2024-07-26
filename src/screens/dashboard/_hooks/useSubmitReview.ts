import { useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { assignReviewersMutation, submitReviewsMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import logger from 'src/libraries/logger'
import { AmplitudeContext } from 'src/libraries/utils/amplitude'
import { useGenerateReviewData } from 'src/libraries/utils/reviews'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'

interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
}

function useSubmitReview({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { webwallet, scwAddress } = useContext(WebwalletContext)!
	const { grant } = useContext(GrantsProgramContext)!
	const { selectedProposals, proposals, review, refreshProposals } = useContext(DashboardContext)!
	const { trackAmplitudeEvent } = useContext(AmplitudeContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])


	const { generateReviewData } = useGenerateReviewData({
		grantId: grant?.id!,
		applicationId: proposal?.id!,
		isPrivate: grant?.rubric?.isPrivate || false,
		chainId,
	})

	const submitReview = async() => {
		try {
			if(!webwallet || !scwAddress || !grant?.workspace?.id || !grant || !proposal?.id || !review) {
				return
			}

			const shouldAssignAndReview = proposal.applicationReviewers.find(reviewer => reviewer.member.actorId === scwAddress.toLowerCase()) === undefined
			logger.info({ review }, 'Review to be submitted')
			const { ipfsHash } = await generateReviewData({ items: review?.items! })

			const methodArgs = shouldAssignAndReview ? [grant?.workspace.id, proposal.id, grant.id, scwAddress, true, ipfsHash] : [grant?.workspace.id, proposal.id, grant.id, ipfsHash]
			logger.info({ methodArgs }, 'useSubmitProposal: (Method args)')
			if(shouldAssignAndReview) {
  				const AssignReviewersVariables = {
					workspaceId: grant.workspace.id,
					applicationId: proposal.id,
					grantAddress: grant.id,
					reviewers: [scwAddress],
					active: [true]
				}
				const SubmitReviewVariables = {
					workspaceId: grant.workspace.id,
					applicationId: proposal.id,
					grantAddress: grant.id,
					metadata: ipfsHash,
					reviewerAddress: scwAddress
				}
				const updateReview = await executeMutation(submitReviewsMutation, SubmitReviewVariables)
				const updateAssignReviewers = await executeMutation(assignReviewersMutation, AssignReviewersVariables)
				setTransactionHash(updateReview?.submitReviews?.recordId)
				if(!updateReview?.submitReviews?.recordId || !updateAssignReviewers?.assignReviewers?.recordId) {
					throw new Error('Failed to submit review')
				}
			} else {
				const variables = {
					workspaceId: grant.workspace.id,
					applicationId: proposal.id,
					grantAddress: grant.id,
					metadata: ipfsHash,
					reviewerAddress: scwAddress
				}
				const updateReview = await executeMutation(submitReviewsMutation, variables)
				setTransactionHash(updateReview?.submitReviews?.recordId)
				if(!updateReview?.submitReviews?.recordId) {
					throw new Error('Failed to submit review')
				}
			}

			trackAmplitudeEvent('proposal_evaluation', {
				programName: grant.title,
				proposalId: proposal.id,
				reviewerAddress: scwAddress,
			})

			await refreshProposals(true)

		} catch(e) {
			logger.error(e, 'useSubmitReview: (Error)')
			setNetworkTransactionModalStep(undefined)
		}
	}

	return {
		submitReview
	}
}

export default useSubmitReview