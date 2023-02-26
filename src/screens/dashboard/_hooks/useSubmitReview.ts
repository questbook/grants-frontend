import { useContext, useMemo } from 'react'
import { APPLICATION_REVIEW_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { defaultChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import logger from 'src/libraries/logger'
import { useGenerateReviewData } from 'src/libraries/utils/reviews'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { bicoDapps, getTransactionDetails, sendGaslessTransaction } from 'src/libraries/utils/gasless'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'

interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
}

function useSubmitReview({ setNetworkTransactionModalStep, setTransactionHash }: Props) {
	const { subgraphClients } = useContext(ApiClientsContext)!
	const { webwallet } = useContext(WebwalletContext)!
	const { grant } = useContext(GrantsProgramContext)!
	const { selectedProposals, proposals, review } = useContext(DashboardContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const applicationReviewRegistryContract = useQBContract('reviews', chainId)

	const { nonce } = useQuestbookAccount()
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString(),
	})

	const isBiconomyInitialised = useMemo(() => {
		return biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId && biconomy.networkId.toString() === chainId.toString()
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, chainId])

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const { generateReviewData } = useGenerateReviewData({
		grantId: grant?.id!,
		applicationId: proposal?.id!,
		isPrivate: grant?.rubric?.isPrivate || false,
		chainId,
	})

	const submitReview = async() => {
		try {
			if(!webwallet || !biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress || !grant?.workspace?.id || !grant || !proposal?.id || !review) {
				return
			}

			const shouldAssignAndReview = proposal.applicationReviewers.find(reviewer => reviewer.member.actorId === scwAddress.toLowerCase()) === undefined
			logger.info({ review }, 'Review to be submitted')

			setNetworkTransactionModalStep(0)
			logger.info({ review }, 'useSubmitReview: (review)')

			const { ipfsHash } = await generateReviewData({ items: review?.items! })

			const methodArgs = shouldAssignAndReview ? [grant?.workspace.id, proposal.id, grant.id, scwAddress, true, ipfsHash] : [grant?.workspace.id, proposal.id, grant.id, ipfsHash]
			logger.info({ methodArgs }, 'useSubmitProposal: (Method args)')

			const response = await sendGaslessTransaction(
				biconomy,
				applicationReviewRegistryContract,
				shouldAssignAndReview ? 'assignAndReview' : 'submitReview',
				methodArgs,
				APPLICATION_REVIEW_REGISTRY_ADDRESS[chainId],
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)
			logger.info({ response }, 'useSubmitReview: (Response)')

			// Step - 7: If the proposal is submitted successfully, then create the mapping between the email and the scwAddress
			if(response) {
				setNetworkTransactionModalStep(1)
				const { receipt, txFee } = await getTransactionDetails(response, chainId.toString())
				setTransactionHash(receipt?.transactionHash)
				setNetworkTransactionModalStep(2)

				logger.info({ receipt, txFee }, 'useSubmitReview: (Receipt)')
				await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)
				setNetworkTransactionModalStep(3)
			} else {
				setNetworkTransactionModalStep(undefined)
			}
		} catch(e) {
			logger.error(e, 'useSubmitReview: (Error)')
			setNetworkTransactionModalStep(undefined)
		}
	}

	return {
		submitReview, isBiconomyInitialised
	}
}

export default useSubmitReview