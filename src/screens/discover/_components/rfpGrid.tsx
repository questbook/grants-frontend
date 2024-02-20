import { Grid, GridItem } from '@chakra-ui/react'
import SupportedChainId from 'src/generated/SupportedChainId'
import logger from 'src/libraries/logger'
import { getSupportedChainIdFromSupportedNetwork } from 'src/libraries/utils/validations'
import RFPCard from 'src/screens/discover/_components/RFPCard'
import { GrantType } from 'src/screens/discover/_utils/types'

type RFPGridProps = {
	type: 'all' | 'personal'
	grants: GrantType[]
	unsavedDomainVisibleState?: { [_: number]: { [_: string]: boolean } }
	onDaoVisibilityUpdate?: (daoId: string, chainId: SupportedChainId, visibleState: boolean) => void
	onSectionGrantsUpdate?: (chainId: SupportedChainId, grantId: string) => void
	changedVisibilityState?: string
	filter?: string
}

function RFPGrid({
	type,
	grants,
	onDaoVisibilityUpdate,
	onSectionGrantsUpdate,
	unsavedDomainVisibleState,
	changedVisibilityState,
	filter,
}: RFPGridProps) {
	const buildComponent = () => (
		<Grid
			w='100%'
			templateColumns={{ md: 'repeat(1, 1fr)', lg: 'repeat(2, 1fr)' }}
			gap={8}
		>
			{
				grants?.filter((g) => g.title.toLowerCase().includes(filter?.toLowerCase() || '')).map((grant, index: number) => {
					const workspaceChainId = getSupportedChainIdFromSupportedNetwork(grant.workspace.supportedNetworks[0])

					const role = type === 'all' ? undefined : grant.role
					logger.info('role', role, grant)
					return (
						<GridItem
						 key={index}>
							<RFPCard
								isVisible={unsavedDomainVisibleState?.[workspaceChainId!]?.[grant.workspace.id] ?? grant.workspace.isVisible}
								onVisibilityUpdate={(visibleState) => onDaoVisibilityUpdate?.(grant.workspace.id, workspaceChainId!, visibleState)}
								onSectionGrantsUpdate={() => onSectionGrantsUpdate?.(workspaceChainId!, grant.id)}
								chainId={workspaceChainId}
								grant={grant}
								role={role}
								changedVisibilityState={changedVisibilityState}
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