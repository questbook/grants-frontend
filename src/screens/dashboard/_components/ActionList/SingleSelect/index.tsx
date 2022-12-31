import { useContext, useMemo } from 'react'
import { Box, Button, Divider, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { ApiClientsContext } from 'src/pages/_app'
import Milestones from 'src/screens/dashboard/_components/ActionList/SingleSelect/Milestones'
import Payouts from 'src/screens/dashboard/_components/ActionList/SingleSelect/Payouts'
import ReviewProposal from 'src/screens/dashboard/_components/ActionList/SingleSelect/ReviewProposal'
import Reviews from 'src/screens/dashboard/_components/ActionList/SingleSelect/Reviews'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function SingleSelect() {
	const buildComponent = () => {
		return (role === 'admin' && !showSubmitReviewPanel) ? adminComponent() : (role === 'reviewer' || showSubmitReviewPanel) ? reviewerComponent() : role === 'builder' ? builderComponent() : <Flex />
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
				<Flex
					px={5}
					py={4}>
					<Button
						disabled={proposals?.length === 0}
						w='100%'
						variant='primaryMedium'
						onClick={
							() => {
								setIsModalOpen(true)
							}
						}>
						Fund builder
					</Button>
				</Flex>
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

	const builderComponent = () => {
		return (
			<Flex
				h='100%'
				direction='column'>
				<Milestones />
				<Divider />
				<Payouts />
				<Box mt='auto' />
				<Divider />
				<Flex
					px={5}
					py={4}>
					<Button
						disabled={proposals?.length === 0}
						w='100%'
						variant='primaryMedium'
						onClick={
							() => {
								router.push({ pathname: '/proposal_form', query: {
									proposalId: proposal?.id,
									chainId,
								} })
							}
						}>
						Resubmit proposal
					</Button>
				</Flex>
			</Flex>
		)
	}

	const router = useRouter()
	const { role } = useContext(ApiClientsContext)!
	const { setIsModalOpen } = useContext(FundBuilderContext)!
	const { proposals, selectedProposals, showSubmitReviewPanel } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ?? defaultChainId
	}, [proposal])

	return buildComponent()
}

export default SingleSelect