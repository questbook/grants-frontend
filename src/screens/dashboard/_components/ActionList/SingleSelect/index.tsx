import { useContext, useMemo } from 'react'
import { Box, Button, Divider, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
// import Milestones from 'src/screens/dashboard/_components/ActionList/SingleSelect/Milestones'
import Payouts from 'src/screens/dashboard/_components/ActionList/SingleSelect/Payouts'
import ReviewProposal from 'src/screens/dashboard/_components/ActionList/SingleSelect/ReviewProposal'
import Reviews from 'src/screens/dashboard/_components/ActionList/SingleSelect/Reviews'
import { DashboardContext, ModalContext } from 'src/screens/dashboard/Context'

function SingleSelect() {
	const buildComponent = () => {
		return showSubmitReviewPanel ? reviewerComponent() : adminComponent()
	}

	const adminComponent = () => {
		return (
			<Flex
				h='100%'
				w='100%'
				direction='column'>
				{/* <Milestones /> */}
				<Divider />
				<Reviews />
				<Divider />
				<Payouts />
				<Box mt='auto' />
				<Divider />
				{
					(role !== 'reviewer' && role !== 'community') && (
						<Flex
							px={5}
							py={4}>
							<Button
								isDisabled={
									role === 'builder' ? proposal?.applicantId?.toLowerCase() !== scwAddress?.toLowerCase() || (proposal?.state !== 'submitted' && proposal?.state !== 'resubmit') :
								  true
								}
								w='100%'
								variant='primaryMedium'
								onClick={
									() => {
										if(role === 'builder') {
											if(proposal?.state !== 'submitted' && proposal?.state !== 'resubmit') {
												toast({
													title: 'Oops! This proposal is not in the right state to be resubmitted.',
													description: `This proposal has already been ${proposal?.state}. It cannot be resubmitted.`,
													status: 'error',
													duration: 7000,
												})
												return
											} else if(proposal?.applicantId?.toLowerCase() !== scwAddress?.toLowerCase()) {
												toast({
													title: 'Oops! You are not the applicant of this proposal.',
													description: 'Only the applicant of this proposal can resubmit it.',
													status: 'error',
													duration: 7000,
												})
												return
											}

											router.push({ pathname: '/proposal_form', query: {
												proposalId: proposal?.id,
												chainId,
											} })
										} else {
											setIsFundingMethodModalOpen(true)
										}
									}
								}>
								{role === 'builder' ? 'Resubmit proposal' : 'Fund builder'}
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
				w='100%'
				direction='column'>
				<ReviewProposal />
			</Flex>
		)
	}

	const router = useRouter()
	const toast = useCustomToast()
	const { scwAddress } = useContext(WebwalletContext)!
	const { role } = useContext(GrantsProgramContext)!
	const { setIsFundingMethodModalOpen } = useContext(ModalContext)!
	// const { setIsModalOpen } = useContext(FundBuilderContext)!
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