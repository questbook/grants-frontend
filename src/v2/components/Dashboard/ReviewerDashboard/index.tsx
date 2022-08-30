import { useContext, useMemo, useState } from 'react'
import { Box, Button, Flex } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import Loader from 'src/components/ui/loader'
import { defaultChainId } from 'src/constants/chains'
import {
	useGetInitialReviewedApplicationGrantsQuery,
	useGetInitialToBeReviewedApplicationGrantsQuery,
} from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ApplicationsTable, { APPLICATIONS_TABLE_PAGE_SIZE } from 'src/v2/components/Dashboard/ReviewerDashboard/ApplicationsTable'

function ReviewerDashboard() {
	const [showPendingReviews, setShowPendingReviews] = useState(true)

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	const { client } = subgraphClients[chainId]

	const { data: accountData } = useQuestbookAccount()

	const variables = {
		reviewerAddress: accountData!.address!.toLowerCase(),
		reviewerAddressStr: accountData!.address!,
		applicationsCount: APPLICATIONS_TABLE_PAGE_SIZE,
	}

	const { data } = showPendingReviews ?
		useGetInitialToBeReviewedApplicationGrantsQuery({ client, variables }) :
		useGetInitialReviewedApplicationGrantsQuery({ client, variables })

	const grants = useMemo(() => {
		if(!data) {
			return
		}

		return data.grantReviewerCounters.map((application) => application.grant)
	}, [data])

	return (
		<Flex
			direction='column'>
			<Box h={30} />
			<Box
				bg='#f0f0f7'
				padding='5px'>
				<Flex gap='5px'>
					<Button
						bg={showPendingReviews ? 'white' : 'transparent'}
						color={showPendingReviews ? 'black' : '#7D7DA0'}
						onClick={() => setShowPendingReviews(true)}
						borderRadius='5px'
						padding='10px'>
						To Be Reviewed
					</Button>
					<Button
						bg={showPendingReviews ? 'transparent' : 'white'}
						color={showPendingReviews ? '#7D7DA0' : 'black'}
						onClick={() => setShowPendingReviews(false)}
						borderRadius='5px'
						padding='10px'>
						Reviews Done
					</Button>
				</Flex>
			</Box>
			<Box h={5} />
			{
				grants === undefined ? <Loader /> : grants.map((grant) => (
					<ApplicationsTable
						key={grant.id}
						grant={grant}
						reviewerId={accountData!.address!}
						initialApplications={grant.applications}
						showToBeReviewedApplications={showPendingReviews}
					/>
				))
			}
		</Flex>
	)
}

export default ReviewerDashboard
