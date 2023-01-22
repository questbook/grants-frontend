import { useContext, useMemo } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { GrantProgramContext } from 'src/contexts/GrantProgramContext'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
}

function useAssignReviewers({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { grant } = useContext(GrantProgramContext)!
	const { selectedProposals, proposals } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'reviews', setTransactionStep: setNetworkTransactionModalStep, setTransactionHash })

	const assignReviewers = async(reviewers: string[], active: boolean[]) => {
		if(!grant || !proposal) {
			return
		}

		logger.info({ reviewers }, 'Config')

		await call({ method: 'assignReviewers', args: [grant.workspace.id, proposal.id, grant.id, reviewers, active] })

	}

	return { assignReviewers, isBiconomyInitialised }
}

export default useAssignReviewers