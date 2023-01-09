import { useContext, useMemo } from 'react'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'

function useAssignReviewers() {
	const { workspace, chainId } = useContext(ApiClientsContext)!
	const { selectedGrant, selectedProposals, proposals } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'reviews' })

	const assignReviewers = async(reviewers: string[], active: boolean[]) => {
		if(!selectedGrant || !workspace || !proposal) {
			return
		}

		logger.info({ reviewers }, 'Config')

		await call({ method: 'assignReviewers', args: [workspace.id, proposal.id, selectedGrant.id, reviewers, active] })

	}

	return { assignReviewers, isBiconomyInitialised }
}

export default useAssignReviewers