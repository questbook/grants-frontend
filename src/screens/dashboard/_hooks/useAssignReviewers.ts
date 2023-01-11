import { useContext, useMemo } from 'react'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { ApiClientsContext, GrantsProgramContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'

interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
}

function useAssignReviewers({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { workspace, chainId } = useContext(ApiClientsContext)!
	const { grant } = useContext(GrantsProgramContext)!
	const { selectedProposals, proposals } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'reviews', setTransactionStep: setNetworkTransactionModalStep, setTransactionHash })

	const assignReviewers = async(reviewers: string[], active: boolean[]) => {
		if(!grant || !workspace || !proposal) {
			return
		}

		logger.info({ reviewers }, 'Config')

		await call({ method: 'assignReviewers', args: [workspace.id, proposal.id, grant.id, reviewers, active] })

	}

	return { assignReviewers, isBiconomyInitialised }
}

export default useAssignReviewers