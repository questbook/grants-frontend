import { useCallback, useContext, useMemo } from 'react'
import { Contract, ethers } from 'ethers'
import { CHAIN_INFO } from 'src/constants/chains'
import ApplicationReviewRegistryAbi from 'src/contracts/abi/ApplicationReviewRegistryAbi.json'
import useQBContract from 'src/hooks/contracts/useQBContract'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'

// interface Props {
// 	setNetworkTransactionModalStep: (step: number | undefined) => void
// 	setTransactionHash: (hash: string) => void
// }

function useAssignReviewers() {
	const { workspace, chainId } = useContext(ApiClientsContext)!
	const { selectedGrant } = useContext(DashboardContext)!

	const applicationReviewRegistry = useQBContract('reviews', chainId)

	const { call } = useFunctionCall({ chainId, contractName: 'reviews' })

	const isEnabled = useCallback(async() => {
		if(!selectedGrant) {
			return false
		}

		const provider = new ethers.providers.JsonRpcProvider(`${CHAIN_INFO[chainId].rpcUrls[0]}${process.env.NEXT_PUBLIC_INFURA_ID}`)
		const contract = new Contract(CHAIN_INFO[chainId].qbContracts['reviews'], ApplicationReviewRegistryAbi, provider)
		const txn = await contract.hasAutoAssigningEnabled(selectedGrant.id)
		return txn
	}, [selectedGrant, chainId])

	const getCurrReviewers = useCallback(async() => {
		if(!selectedGrant) {
			return false
		}

		const provider = new ethers.providers.JsonRpcProvider(`${CHAIN_INFO[chainId].rpcUrls[0]}${process.env.NEXT_PUBLIC_INFURA_ID}`)
		const contract = new Contract(CHAIN_INFO[chainId].qbContracts['reviews'], ApplicationReviewRegistryAbi, provider)
		for(let i = 0; i < 10; ++i) {
			try {
				const txn = await contract.reviewers(selectedGrant.id, i)
				logger.info(txn)
			} catch(e) {
				logger.info(i)
				break
			}
		}
	}, [selectedGrant, chainId])

	const getCounts = useCallback(async(reviewers: string[]) => {
		if(!selectedGrant) {
			return []
		}

		const provider = new ethers.providers.JsonRpcProvider(`${CHAIN_INFO[chainId].rpcUrls[0]}${process.env.NEXT_PUBLIC_INFURA_ID}`)
		const contract = new Contract(CHAIN_INFO[chainId].qbContracts['reviews'], ApplicationReviewRegistryAbi, provider)
		const counts = Array(reviewers.length).fill(0)
		for(let i = 0; i < reviewers.length; ++i) {
			const txn = await contract.reviewerAssignmentCounts(selectedGrant.id, reviewers[i])
			logger.info(reviewers[i], txn)
			counts[i] = txn
		}

		return counts
	}, [selectedGrant, chainId])

	const assignReviewers = useCallback(async(reviewers: string[], numberOfReviewersPerApplication: number) => {
		if(!selectedGrant || !workspace) {
			return
		}

		logger.info({ reviewers, numberOfReviewersPerApplication }, 'Config')

		const enabled = await isEnabled()
		logger.info(enabled)
		if(enabled) {
			await getCurrReviewers()
			const counts = await getCounts(reviewers)
			reviewers.sort((a, b) => counts[reviewers.indexOf(a)] - counts[reviewers.indexOf(b)])
		}

		// If auto assignment is enabled, and not reflected on the frontend, then send a mock transaction
		// If auto assignment is enabled, and reflected on the frontend, then send an update transaction
		if(enabled) {
			await call({
				method: 'updateAutoAssignmentOfReviewers',
				args: [workspace.id, selectedGrant.id, reviewers, numberOfReviewersPerApplication, !selectedGrant.shouldAutoAssignReviewers]
			})
		// If auto assignment is disabled, then send an enable transaction
		} else if(!enabled) {
			await call({
				method: 'enableAutoAssignmentOfReviewers',
				args: [workspace.id, selectedGrant.id, reviewers, numberOfReviewersPerApplication]
			})
		}

		await getCurrReviewers()
	}, [applicationReviewRegistry, selectedGrant])

	return { assignReviewers: useMemo(() => assignReviewers, [applicationReviewRegistry, selectedGrant]) }
}

export default useAssignReviewers