import { Grid, GridItem } from '@chakra-ui/react'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import DaoCard from './dao_card'

function AllDaosGrid({ allWorkspaces }) {
	return (
		<Grid
			templateColumns='repeat(3, 1fr)'
			gap={6}>
			{
				allWorkspaces.map((workspace, index) => (
					<GridItem key={index}>
						<DaoCard
							logo={getUrlForIPFSHash(workspace.logoIpfsHash)}
							name={workspace.title}
							daoId={workspace.id}
							chainId={getSupportedChainIdFromSupportedNetwork(workspace.supportedNetworks[0])} />
					</GridItem>
				))
			}
		</Grid>
	)
}

export default AllDaosGrid