import { useContext, useMemo, useState } from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { ApiClientsContext } from '../../../../../pages/_app'
import Loader from '../../../../components/ui/loader'
import { defaultChainId } from '../../../../constants/chains'
import {
	ApplicationState, useGetGrantsForReviewerInWorkspaceQuery,
} from '../../../../generated/graphql'
import {
	getSupportedChainIdFromWorkspace,
} from '../../../../utils/validationUtils'
import ApplicationsTable from './ApplicationsTable'

function ReviewerDashboard() {
	const [showPendingReviews, setShowPendingReviews] = useState(true)

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[chainId]

	const { data: accountData } = useAccount()

	const { data } = useGetGrantsForReviewerInWorkspaceQuery({
		client,
		variables: {
			workspaceId: workspace!.id!,
			reviewerId: accountData!.address!,
		},
	})

	const grants = useMemo(() => {
		if(!data) {
			return
		}

		return data.grantApplications.map((application) => application.grant)
	}, [data])


	const reviewDoneStates = Object.values(ApplicationState)
	// all states except 'submitted' and 'resubmit'
	const submittedIdx = reviewDoneStates.indexOf(ApplicationState.Submitted)
	reviewDoneStates.splice(submittedIdx, 1)
	const resubmitIdx = reviewDoneStates.indexOf(ApplicationState.Resubmit)
	reviewDoneStates.splice(resubmitIdx, 1)

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
			{
				grants === undefined ? <Loader /> : grants.map((grant) => (
					<>
						<Text
							fontSize={25}
							fontWeight={'bold'}>
							{grant.title}
						</Text>
						<Box h={2} />
						<ApplicationsTable
							reviewerId={accountData!.address!}
							grantId={grant.id}
							showApplicationState={!showPendingReviews}
							applicationStateIn={showPendingReviews ? [ApplicationState.Submitted] : reviewDoneStates}
						/>
					</>
				))
			}
		</Flex>
	)
}

export default ReviewerDashboard
