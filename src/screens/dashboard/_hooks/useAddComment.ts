import { useCallback, useContext, useMemo } from 'react'
import { convertToRaw, EditorState } from 'draft-js'
import { COMMUNICATION_ADDRESS } from 'src/constants/addresses'
import { defaultChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { usePiiForComment } from 'src/libraries/utils/pii'
import { PIIForCommentType } from 'src/types'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import useQuickReplies from 'src/screens/dashboard/_hooks/useQuickReplies'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getErrorMessage from 'src/utils/errorUtils'
import {
	bicoDapps,
	getTransactionDetails,
	sendGaslessTransaction,
} from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

interface Props {
  setStep: (step: number | undefined) => void
  setTransactionHash: (hash: string) => void
}

function useAddComment({ setStep, setTransactionHash }: Props) {
	const { role, subgraphClients } = useContext(ApiClientsContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!

	const { quickReplies } = useQuickReplies()

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return (getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ?? defaultChainId)
	}, [proposal?.grant?.workspace])

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

	const { encrypt } = usePiiForComment(
		proposal?.grant?.workspace?.id,
		[proposal?.id ?? ''],
		webwallet?.publicKey,
		chainId,
	)

	const toast = useCustomToast()
	const communicationContract = useQBContract('communication', chainId)

	const addComment = useCallback(
		async(message: EditorState, tags: number[]) => {
			try {
				if(
					!webwallet || !biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress || !proposal?.id || !proposal?.grant?.id || !proposal?.grant?.workspace?.id
				) {
					logger.info({ webwallet, biconomyWalletClient, scwAddress, proposal, grant: proposal?.grant?.id, workspace: !proposal?.grant?.workspace?.id }, 'Missing Data (Comment)')
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
					tags: quickReplies[role]?.filter((_, index) => tags.includes(index)).map((reply) => reply.id),
					role,
				}

				const data: {[appId: string]: PIIForCommentType} = {}
				data[proposal.id] = json
				const finalData = role !== 'community' ? await encrypt(data) : data

				logger.info(finalData, 'Encrypted JSON (Comment)')

				const commentHash = (await uploadToIPFS(JSON.stringify(finalData[proposal.id]))).hash
				logger.info({ commentHash }, 'Comment Hash (Comment)')

				const methodArgs = [
					proposal.grant.workspace.id,
					proposal.grant.id,
					proposal.id,
					role !== 'community',
					commentHash,
				]
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
					nonce,
				)
				logger.info({ response }, 'Response (Comment)')

				if(response) {
					const { receipt, txFee } = await getTransactionDetails(
						response,
						chainId.toString(),
					)

					setStep(1)
					setTransactionHash(receipt?.transactionHash)
					logger.info({ receipt, txFee }, 'Receipt: (Comment)')
					await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

					setStep(2)

					toast({
						duration: 5000,
						title: 'Added comment successfully!',
						status: 'success',
						onCloseComplete: () => {
							setStep(undefined)
						}
					})
					return true
				} else {
					setStep(undefined)
					return false
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
				return false
			}
		},
		[
			webwallet,
			biconomy,
			biconomyWalletClient,
			scwAddress,
			chainId,
			role,
			proposal,
		],
	)

	return {
		addComment: useMemo(
			() => addComment,
			[webwallet, biconomy, biconomyWalletClient, scwAddress, chainId, role, proposal],
		),
		isBiconomyInitialised,
	}
}

export default useAddComment
