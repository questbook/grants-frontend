import { Grid, GridItem } from '@chakra-ui/react'
import config from 'src/constants/config.json'
import SupportedChainId from 'src/generated/SupportedChainId'
import RFPCard from 'src/screens/discover/_components/RFPCard'
import { BuilderGrant, PersonalGrant, ReviewerGrant } from 'src/screens/discover/_utils/types'
import getAvatar from 'src/utils/avatarUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'


type PersonalRFPGridProps = {
  personalGrants: PersonalGrant[]
  reviewerGrants: ReviewerGrant[]
  isAdmin: boolean
  builderGrants: BuilderGrant[]
  unsavedDomainVisibleState?: { [_: number]: { [_: string]: boolean } }
  onDaoVisibilityUpdate?: (daoId: string, chainId: SupportedChainId, visibleState: boolean) => void
  hasMore?: boolean
  fetchMore?: (reset?: boolean | undefined) => void
}

function PersonalRFPGrid({
	personalGrants,
	onDaoVisibilityUpdate,
	unsavedDomainVisibleState,
	isAdmin,
	builderGrants,
	reviewerGrants
}: PersonalRFPGridProps) {
	return (
		<Grid
			w='100%'
			// maxWidth='1280px'

			templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(4, 1fr)' }}
			gap={8}

		>
			{
				personalGrants?.map((grant, index: number) => {
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
								role={grant.managers.filter(manager => manager.member?.actorId === grant.workspace.ownerId)[0]?.member?.accessLevel}
								grantId={grant.id}
								isAcceptingApplications={grant.acceptingApplications}
							/>
						</GridItem>
					)
				})
			}
			{
				reviewerGrants?.map((reviewerGrant, index: number) => {
					const workspaceChainId = getSupportedChainIdFromSupportedNetwork(reviewerGrant.grant.workspace.supportedNetworks[0])

					return (
						<GridItem key={index}>
							<RFPCard
								isAdmin={isAdmin}
								isVisible={unsavedDomainVisibleState?.[workspaceChainId!]?.[reviewerGrant.grant.workspace.id] ?? reviewerGrant.grant.workspace.isVisible}
								onVisibilityUpdate={(visibleState) => onDaoVisibilityUpdate?.(reviewerGrant.grant.workspace.id, workspaceChainId!, visibleState)}
								logo={
									reviewerGrant.grant.workspace.logoIpfsHash === config.defaultDAOImageHash ?
										getAvatar(true, reviewerGrant.grant.title) :
										getUrlForIPFSHash(reviewerGrant.grant.workspace.logoIpfsHash!)
								}
								name={reviewerGrant.grant.title}
								deadline={reviewerGrant.grant.deadline!}
								chainId={workspaceChainId}
								noOfApplicants={reviewerGrant.grant.applications.length}
								totalAmount={reviewerGrant.grant.workspace.totalGrantFundingDisbursedUSD}
								role='Reviewer'
								grantId={reviewerGrant.grant.id}
								isAcceptingApplications={reviewerGrant.grant.acceptingApplications}
							/>
						</GridItem>
					)
				})
			}
			{
				builderGrants?.map((grant, index: number) => {
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
								role='Builder'
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

export default PersonalRFPGrid
