import { Grid, GridItem } from '@chakra-ui/react'
import DaoCard from 'src/components/browse_daos/dao_card'
import GetStartedCard from 'src/components/browse_daos/get_started_card'
import LoadMoreCard from 'src/components/browse_daos/loadMoreCard'
import config from 'src/constants/config.json'
import { GetDaOsForExploreQuery } from 'src/generated/graphql'
import getAvatar from 'src/utils/avatarUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

type Workspace = GetDaOsForExploreQuery['workspaces'][0]

type AllDaosGridProps = {
	workspaces: Workspace[]
	isAdmin: boolean
	unsavedDaosVisibleState?: { [_: string]: boolean },
	onDaoVisibilityUpdate?: (daoId: string, visibleState: boolean) => void
	renderGetStarted: boolean
	hasMore?: boolean
	fetchMore?: (reset?: boolean | undefined) => void
}

function AllDaosGrid({
	workspaces,
	renderGetStarted,
	onDaoVisibilityUpdate,
	unsavedDaosVisibleState,
	isAdmin,
	hasMore,
	fetchMore
}: AllDaosGridProps) {
	return (
		<Grid
			w='100%'
			maxWidth='1280px'

			templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
			gap={6}

		>
			{
				renderGetStarted && (
					<GridItem key='get-started'>
						<GetStartedCard />
					</GridItem>
				)
			}
			{
				workspaces.map((workspace, index: number) => (
					<GridItem key={index}>
						<DaoCard
							isAdmin={isAdmin}
							isVisible={unsavedDaosVisibleState?.[workspace.id] ?? workspace.isVisible}
							onVisibilityUpdate={(visibleState) => onDaoVisibilityUpdate?.(workspace.id, visibleState)}
							logo={
								workspace.logoIpfsHash === config.defaultDAOImageHash ?
									getAvatar(true, workspace.title) :
									getUrlForIPFSHash(workspace.logoIpfsHash!)
							}
							name={workspace.title}
							daoId={workspace.id}
							chainId={getSupportedChainIdFromWorkspace(workspace)}
							noOfApplicants={workspace.numberOfApplications}
							totalAmount={workspace.totalGrantFundingDisbursedUSD} />
					</GridItem>
				))
			}
			{
				hasMore && (
					<GridItem key='load-more'>
						<LoadMoreCard onClick={() => fetchMore?.()} />
					</GridItem>
				)
			}
		</Grid>
	)
}

export default AllDaosGrid
