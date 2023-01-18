import { Grid, GridItem } from '@chakra-ui/react'
import SupportedChainId from 'src/generated/SupportedChainId'
import logger from 'src/libraries/logger'
import RFPCard from 'src/screens/discover/_components/RFPCard'
import { GrantType } from 'src/screens/discover/_utils/types'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'


type RFPGridProps = {
	type: 'all' | 'personal'
	grants: GrantType[]
	unsavedDomainVisibleState?: { [_: number]: { [_: string]: boolean } }
	onDaoVisibilityUpdate?: (daoId: string, chainId: SupportedChainId, visibleState: boolean) => void
}

function RFPGrid({
	type,
	grants,
	onDaoVisibilityUpdate,
	unsavedDomainVisibleState,
}: RFPGridProps) {
	const buildComponent = () => (
		<Grid
			w='100%'
			templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(4, 1fr)' }}
			gap={8}
		>
			{
				grants?.map((grant, index: number) => {
					const workspaceChainId = getSupportedChainIdFromSupportedNetwork(grant.workspace.supportedNetworks[0])

					const role = type === 'all' ? undefined : grant.role
					logger.info('role', role)
					return (
						<GridItem key={index}>
							<RFPCard
								isVisible={unsavedDomainVisibleState?.[workspaceChainId!]?.[grant.workspace.id] ?? grant.workspace.isVisible}
								onVisibilityUpdate={(visibleState) => onDaoVisibilityUpdate?.(grant.workspace.id, workspaceChainId!, visibleState)}
								chainId={workspaceChainId}
								grant={grant}
								role={role}
							/>
						</GridItem>
					)
				})
			}
		</Grid>
	)

	return buildComponent()
}

export default RFPGrid
