import { useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { assignReviewersMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import logger from 'src/libraries/logger'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'

interface Props {
	setTransactionHash: (hash: string) => void
}

function useAssignReviewers({ setTransactionHash }: Props) {
	const { grant } = useContext(GrantsProgramContext)!
	const { selectedProposals, proposals, refreshProposals } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])
	logger.info({ chainId }, 'Config')
	// const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'reviews', setTransactionStep: setNetworkTransactionModalStep, setTransactionHash })

	const assignReviewers = async(reviewers: string[], active: boolean[]) => {
		if(!grant || !proposal) {
			return
		}

		logger.info({ reviewers }, 'Config')
		const variables = {
			workspaceId: grant.workspace.id,
			applicationId: proposal.id,
			grantAddress: grant.id,
			reviewers,
			active
		}
		const data = await executeMutation(assignReviewersMutation, variables)
		// await call({ method: 'assignReviewers', args: [grant.workspace.id, proposal.id, grant.id, reviewers, active] })
		setTransactionHash(data?.assignReviewers?.recordId)
		refreshProposals(true)
		window.location.reload()
	}

	return { assignReviewers }
}

export default useAssignReviewers