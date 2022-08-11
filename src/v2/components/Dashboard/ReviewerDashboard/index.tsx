import { useState } from 'react'
import { Box, Button, Flex } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { ApplicationState } from '../../../../generated/graphql'
import ApplicationsTable from './ApplicationsTable'

function ReviewerDashboard() {
	const [showPendingReviews, setShowPendingReviews] = useState(true)

	const { data: accountData } = useAccount()

	const reviewDoneStates = Object.values(ApplicationState)
	// all states except 'submitted'
	const submittedIdx = reviewDoneStates.indexOf(ApplicationState.Submitted)
	reviewDoneStates.splice(submittedIdx, 1)

	return (
		<Flex
			direction={'column'}>
			<Box h={30} />
			<Box
				bg={'#f0f0f7'}
				padding={'5px'}>
				<Flex gap={'5px'}>
					<Button
						bg={showPendingReviews ? 'white' : 'transparent'}
						color={showPendingReviews ? 'black' : '#7D7DA0'}
						onClick={() => setShowPendingReviews(true)}
						borderRadius={'5px'}
						padding={'10px'}>
            Reviews - waiting on you
					</Button>
					<Button
						bg={showPendingReviews ? 'transparent' : 'white'}
						color={showPendingReviews ? '#7D7DA0' : 'black'}
						onClick={() => setShowPendingReviews(false)}
						borderRadius={'5px'}
						padding={'10px'}>
            Reviews done
					</Button>
				</Flex>
			</Box>
			<Box h={5} />
			<ApplicationsTable
				reviewerId={accountData!.address!}
				showApplicationState={!showPendingReviews}
				showReviewButton={showPendingReviews}
				applicationStateIn={showPendingReviews ? [ApplicationState.Submitted] : reviewDoneStates}
			/>
		</Flex>
	)
}

export default ReviewerDashboard
