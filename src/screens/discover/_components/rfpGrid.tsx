import { Grid, GridItem } from '@chakra-ui/react'
import LoadMoreCard from 'src/components/browse_daos/loadMoreCard'
import config from 'src/constants/config.json'
import SupportedChainId from 'src/generated/SupportedChainId'
import RFPCard from 'src/screens/discover/_components/RFPCard'
import { Grant } from 'src/screens/discover/_utils/types'
import getAvatar from 'src/utils/avatarUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'


type AllRFPsGridProps = {
  grants: Grant[]
  isAdmin: boolean
  unsavedDomainVisibleState?: { [_: number]: { [_: string]: boolean } }
  onDaoVisibilityUpdate?: (daoId: string, chainId: SupportedChainId, visibleState: boolean) => void
  hasMore?: boolean
  fetchMore?: (reset?: boolean | undefined) => void
  role?: string
}

function AllRFPsGrid({
	grants,
	onDaoVisibilityUpdate,
	unsavedDomainVisibleState,
	isAdmin,
	hasMore,
	fetchMore,
}: AllRFPsGridProps) {
	return (
		<Grid
			w='100%'
			// maxWidth='1280px'

			templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(4, 1fr)' }}
			gap={8}

		>
			{
				grants?.map((grant, index: number) => {
					const workspaceChainId = getSupportedChainIdFromSupportedNetwork(grant.workspace.supportedNetworks[0])

					return (
						<GridItem key={index}>
							<RFPCard
								isAdmin={isAdmin}
								isVisible={unsavedDomainVisibleState?.[workspaceChainId!]?.[grant.workspace.id] ?? grant.workspace.isVisible}
								onVisibilityUpdate={(visibleState) => onDaoVisibilityUpdate?.(grant.workspace.id, workspaceChainId!, visibleState)}
								logo={
									grant.workspace.logoIpfsHash === config.defaultDAOImageHash ?
										getAvatar(true, grant.title) :
										getUrlForIPFSHash(grant.workspace.logoIpfsHash!)
								}
								name={grant.title}
								deadline={grant.deadline!}
								chainId={workspaceChainId}
								noOfApplicants={grant.applications.length}
								totalAmount={grant.workspace.totalGrantFundingDisbursedUSD}
								grantId={grant.id}
								isAcceptingApplications={grant.acceptingApplications}
							/>
						</GridItem>
					)
				})
			}
			{/* {
				hasMore && (
					<GridItem key='load-more'>
						<LoadMoreCard onClick={() => fetchMore?.()} />
					</GridItem>
				)
			} */}
		</Grid>
	)
}

export default AllRFPsGrid
