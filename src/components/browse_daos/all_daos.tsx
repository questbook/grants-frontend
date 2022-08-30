import { Grid, GridItem } from '@chakra-ui/react'
import DaoCard from 'src/components/browse_daos/dao_card'
import GetStartedCard from 'src/components/browse_daos/get_started_card'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'

function AllDaosGrid({ allWorkspaces }: {allWorkspaces: any}) {
	return (
		<Grid
			w='100%'
			maxWidth='1280px'

			templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
			gap={6}

		>
			{
				allWorkspaces.map((workspace: any, index: number) => {
					if(index === 0) {
						return (
							<>
								<GridItem key='get-started'>
									<GetStartedCard />
								</GridItem>
								<GridItem key={index}>
									<DaoCard
										logo={getUrlForIPFSHash(workspace.icon)}
										name={workspace.name}
										daoId={workspace.workspaceID}
										chainId={getSupportedChainIdFromSupportedNetwork(workspace.chainID)}
										noOfApplicants={workspace.noOfApplicants}
										totalAmount={workspace.amount} />
								</GridItem>
							</>
						)
					}

					return (
						<GridItem key={index}>
							<DaoCard
								logo={getUrlForIPFSHash(workspace.icon)}
								name={workspace.name}
								daoId={workspace.workspaceID}
								chainId={getSupportedChainIdFromSupportedNetwork(workspace.chainID)}
								noOfApplicants={workspace.noOfApplicants}
								totalAmount={workspace.amount} />
						</GridItem>
					)
				}

				)
			}
		</Grid>
	)
}

export default AllDaosGrid