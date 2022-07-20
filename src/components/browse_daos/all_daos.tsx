import { Grid, GridItem } from '@chakra-ui/react'
import { Workspace } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import DaoCard from './dao_card'

function AllDaosGrid({ allWorkspaces }:{allWorkspaces: any}) {
	return (
		<Grid
			templateColumns='repeat(3, 1fr)'
			gap={6}>
			{
				allWorkspaces.map((workspace: Workspace, index: number) => (
					<GridItem key={index}>
						<DaoCard
							logo={getUrlForIPFSHash(workspace.icon)}
							name={workspace.name}
							daoId={workspace.workspaceID}
							chainId={getSupportedChainIdFromSupportedNetwork(workspace.chainID)} />
					</GridItem>
				))
			}
		</Grid>
	)
}

export default AllDaosGrid