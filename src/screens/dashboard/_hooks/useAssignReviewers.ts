import { useCallback, useContext, useMemo } from 'react'
import useQBContract from 'src/hooks/contracts/useQBContract'
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

	const applicationReviewRegistry = useQBContract('reviews', chainId)
	const { call } = useFunctionCall({ chainId, contractName: 'reviews' })

	const assignReviewers = useCallback(async(reviewers: string[], active: boolean[]) => {
		if(!selectedGrant || !workspace || !proposal) {
			return
		}

		logger.info({ reviewers }, 'Config')

		await call({ method: 'assignReviewers', args: [workspace.id, proposal.id, selectedGrant.id, reviewers, active] })

	}, [applicationReviewRegistry, selectedGrant, proposal, workspace])

	return { assignReviewers: useMemo(() => assignReviewers, [applicationReviewRegistry, selectedGrant, proposal, workspace]) }
}

export default useAssignReviewers