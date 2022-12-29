import { useCallback, useContext, useMemo } from 'react'
import { Contract, ethers } from 'ethers'
import { CHAIN_INFO } from 'src/constants/chains'
import ApplicationReviewRegistryAbi from 'src/contracts/abi/ApplicationReviewRegistryAbi.json'
import useQBContract from 'src/hooks/contracts/useQBContract'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { useContractRead, useProvider } from 'wagmi'

function useAssignReviewers() {
	const { chainId, subgraphClients } = useContext(ApiClientsContext)!
	const { selectedGrant } = useContext(DashboardContext)!

	const provider = useProvider()

	const applicationReviewRegistry = useQBContract('reviews', chainId)

	const assignReviewers = useCallback(async() => {
		if(!selectedGrant) {
			return
		}

		logger.info(applicationReviewRegistry)
		// const val = await refetch()
		// logger.info('Auto assignment is enabled', await isEnabled(), val)

		// logger.info(provider)
		const provider = new ethers.providers.JsonRpcProvider(`${CHAIN_INFO[chainId].rpcUrls[0]}${process.env.NEXT_PUBLIC_INFURA_ID}`)
		const contract = new Contract(applicationReviewRegistry.address, ApplicationReviewRegistryAbi, provider)
		const txn = await contract.hasAutoAssigningEnabled(selectedGrant.id)
		logger.info(txn)
		// If auto assignment is enabled, and not reflected on the frontend, then send a mock transaction
		// If auto assignment is enabled, but reflected on the frontend, then send an update transaction
		// If auto assignment is disabled, then send an enable transaction
	}, [applicationReviewRegistry, selectedGrant])

	return { assignReviewers: useMemo(() => assignReviewers, [applicationReviewRegistry, selectedGrant]) }
}

export default useAssignReviewers