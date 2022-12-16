import { useCallback, useContext, useMemo } from 'react'
import { convertToRaw, EditorState } from 'draft-js'
import { COMMUNICATION_ADDRESS } from 'src/constants/addresses'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { usePiiForComment } from 'src/libraries/utils/pii'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'

interface Props {
    setStep: (step: number | undefined) => void
    setTransactionHash: (hash: string) => void
}

function useAddComment({
	setStep, setTransactionHash
}: Props) {
	const { workspace, chainId, role, subgraphClients } = useContext(ApiClientsContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { proposals, selectedGrant, selectedProposals } = useContext(DashboardContext)!

	const {
		biconomyDaoObj: biconomy,
		biconomyWalletClient,
		loading: biconomyLoading,
	} = useBiconomy({
		chainId: chainId?.toString(),
	})

	const { nonce } = useQuestbookAccount()

	const isBiconomyInitialised = useMemo(() => {
		return (
			biconomy &&
      biconomyWalletClient &&
      scwAddress &&
      !biconomyLoading &&
      chainId &&
      biconomy.networkId &&
      biconomy.networkId.toString() === chainId.toString()
		)
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, chainId])

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const { encrypt } = usePiiForComment(
		workspace?.id,
		proposal?.id,
		proposal?.applicantId,
		proposal?.applicantPublicKey,
		chainId,
	)

	const toast = useCustomToast()
	const communicationContract = useQBContract('communication', chainId)

	const addComment = useCallback(
		async(message: EditorState) => {
			try {
				if(!webwallet || !biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress || !workspace?.id || !selectedGrant?.id || !proposal?.id) {
					return
				}

				setStep(0)
				const messageHash = (
					await uploadToIPFS(
						JSON.stringify(convertToRaw(message.getCurrentContent())),
					)
				).hash
				const json = {
					sender: scwAddress,
					message: messageHash,
					timestamp: Math.floor(Date.now() / 1000),
					role,
				}

				if(role !== 'community') {
					await encrypt(json)
				}

				const commentHash = (await uploadToIPFS(JSON.stringify(json))).hash
				logger.info({ commentHash }, 'Comment Hash (Comment)')

				const methodArgs = [workspace.id, selectedGrant.id, proposal.id, role !== 'community', commentHash]
				logger.info({ methodArgs }, 'Method Args (Comment)')

				const response = await sendGaslessTransaction(
					biconomy,
					communicationContract,
					'addComment',
					methodArgs,
					COMMUNICATION_ADDRESS[chainId],
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${chainId}`,
					bicoDapps[chainId].webHookId,
					nonce
				)
				logger.info({ response }, 'Response (Comment)')

				if(response) {
					setStep(1)
					const { receipt, txFee } = await getTransactionDetails(response, chainId.toString())
					setTransactionHash(receipt?.transactionHash)
					logger.info({ receipt, txFee }, 'Receipt: (Comment)')
					await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

					setStep(2)
				} else {
					setStep(undefined)
				}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch(error: any) {
				const message = getErrorMessage(error)
				setStep(undefined)
				toast({
					duration: 5000,
					status: 'error',
					title: message,
				})
			}
		},
		[webwallet, biconomy, biconomyWalletClient, scwAddress, workspace, chainId, role, selectedGrant, proposal],
	)

	return {
		addComment: useMemo(() => addComment, [webwallet, biconomy, biconomyWalletClient, scwAddress, workspace, chainId, role]),
		isBiconomyInitialised
	}
}

export default useAddComment
