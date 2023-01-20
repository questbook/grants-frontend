// import { useContext } from 'react'
// import { Grid, GridItem } from '@chakra-ui/react'
// import config from 'src/constants/config.json'
// import SupportedChainId from 'src/generated/SupportedChainId'
// import RFPCard from 'src/screens/discover/_components/RFPCard'
// import { DiscoverContext } from 'src/screens/discover/Context'
// import getAvatar from 'src/utils/avatarUtils'
// import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
// import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'


// type PersonalRFPGridProps = {
//   unsavedDomainVisibleState?: { [_: number]: { [_: string]: boolean } }
//   onDaoVisibilityUpdate?: (daoId: string, chainId: SupportedChainId, visibleState: boolean) => void
// }

// function PersonalRFPGrid({
// 	onDaoVisibilityUpdate,
// 	unsavedDomainVisibleState,
// }: PersonalRFPGridProps) {
// 	const buildComponent = () => (
// 		<Grid
// 			w='100%'
// 			templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(4, 1fr)' }}
// 			gap={8}
// 		>
// 			{
// 				grantsForYou?.map((grant, index: number) => {
// 					const workspaceChainId = getSupportedChainIdFromSupportedNetwork(grant.workspace.supportedNetworks[0])

// 					return (
// 						<GridItem key={index}>
// 							<RFPCard
// 								isVisible={unsavedDomainVisibleState?.[workspaceChainId!]?.[grant.workspace.id] ?? grant.workspace.isVisible}
// 								onVisibilityUpdate={(visibleState) => onDaoVisibilityUpdate?.(grant.workspace.id, workspaceChainId!, visibleState)}
// 								logo={
// 									grant.workspace.logoIpfsHash === config.defaultDAOImageHash ?
// 										getAvatar(true, grant.title) :
// 										getUrlForIPFSHash(grant.workspace.logoIpfsHash!)
// 								}
// 								name={grant.title}
// 								deadline={grant.deadline!}
// 								chainId={workspaceChainId}
// 								noOfApplicants={grant.applications.length}
// 								totalAmount={grant.workspace.totalGrantFundingDisbursedUSD}
// 								role={grant.managers.filter(manager => manager.member?.actorId === grant.workspace.ownerId)[0]?.member?.accessLevel}
// 								grantId={grant.id}
// 								isAcceptingApplications={grant.acceptingApplications}
// 							/>
// 						</GridItem>
// 					)
// 				})
// 			}
// 		</Grid>
// 	)

// 	const { grantsForYou } = useContext(DiscoverContext)!

// 	return buildComponent()
// }

// export default PersonalRFPGrid

export default {}