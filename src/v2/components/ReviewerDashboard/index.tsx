import { Box, Flex } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { ApplicationState } from '../../../generated/graphql'
import ApplicationsTable from './ApplicationsTable'

function ReviewerDashboard() {
	const { data: accountData } = useAccount()

	const reviewDoneStates = Object.values(ApplicationState)
	// all states except 'submitted'
	const submittedIdx = reviewDoneStates.indexOf(ApplicationState.Submitted)
	reviewDoneStates.splice(submittedIdx, 1)

	return (
		<Flex
			direction={'column'}>
			<Box h={30} />
			<ApplicationsTable
				reviewerId={accountData!.address!}
				showApplicationState={false}
				showReviewButton={true}
				header={'Reviews - waiting on you'}
				applicationStateIn={[ApplicationState.Submitted]} />
			<Box h={10} />
			<ApplicationsTable
				reviewerId={accountData!.address!}
				showApplicationState={true}
				showReviewButton={false}
				header={'Reviews done'}
				applicationStateIn={reviewDoneStates} />
			<Box h={10} />
		</Flex>
	)
}

export default ReviewerDashboard
