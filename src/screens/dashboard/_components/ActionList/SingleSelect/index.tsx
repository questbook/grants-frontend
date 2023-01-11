import { useContext, useMemo } from 'react'
import { Box, Button, Divider, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import Milestones from 'src/screens/dashboard/_components/ActionList/SingleSelect/Milestones'
import Payouts from 'src/screens/dashboard/_components/ActionList/SingleSelect/Payouts'
import ReviewProposal from 'src/screens/dashboard/_components/ActionList/SingleSelect/ReviewProposal'
import Reviews from 'src/screens/dashboard/_components/ActionList/SingleSelect/Reviews'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function SingleSelect() {
	const buildComponent = () => {
		return showSubmitReviewPanel ? reviewerComponent() : adminComponent()
	}

	const adminComponent = () => {
		return (
			<Flex
				h='100%'
				direction='column'>
				<Reviews />
				<Divider />
				<Milestones />
				<Divider />
				<Payouts />
				<Box mt='auto' />
				<Divider />
				{
					role !== 'reviewer' && (
						<Flex
							px={5}
							py={4}>
							<Button
								disabled={role === 'builder' ? (proposal?.applicantId !== scwAddress?.toLowerCase() || proposal?.state !== 'submitted') : proposal?.state !== 'submitted'}
								w='100%'
								variant='primaryMedium'
								onClick={
									() => {
										if(role === 'community') {
											router.push({ pathname: '/proposal_form', query: {
												grantId: grant?.id,
												chainId,
											} })
										} else if(role === 'builder') {
											router.push({ pathname: '/proposal_form', query: {
												proposalId: proposal?.id,
												chainId,
											} })
										} else {
											setIsModalOpen(true)
										}
									}
								}>
								{role === 'community' ? 'Submit Proposal' : role === 'builder' ? 'Resubmit proposal' : 'Fund builder'}
							</Button>
						</Flex>
					)
				}
			</Flex>
		)
	}

	const reviewerComponent = () => {
		return (
			<Flex
				h='100%'
				direction='column'>
				<ReviewProposal />
			</Flex>
		)
	}

	const router = useRouter()
	const { scwAddress } = useContext(WebwalletContext)!
	const { grant, role } = useContext(GrantsProgramContext)!
	const { setIsModalOpen } = useContext(FundBuilderContext)!
	const { proposals, selectedProposals, showSubmitReviewPanel } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ?? defaultChainId
	}, [proposal])

	return buildComponent()
}

export default SingleSelect