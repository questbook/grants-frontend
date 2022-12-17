import { useCallback, useContext, useEffect, useMemo } from 'react'
import { convertToRaw, EditorState } from 'draft-js'
import { COMMUNICATION_ADDRESS } from 'src/constants/addresses'
import { defaultChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { usePiiForComment } from 'src/libraries/utils/pii'
import { PIIForCommentType } from 'src/libraries/utils/types'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
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
	const { proposals, selectedGrant, selectedProposals } =
    useContext(DashboardContext)!

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return (
			getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ??
      defaultChainId
		)
	}, [proposal])

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

	const { encrypt, decrypt } = usePiiForComment(
		proposal?.grant?.workspace?.id,
		proposal?.id,
		webwallet?.publicKey,
		chainId,
	)

	const toast = useCustomToast()
	const communicationContract = useQBContract('communication', chainId)

	const test = useCallback(async() => {
		// const messageHash = (
		// 	await uploadToIPFS(
		// 		JSON.stringify(convertToRaw(message.getCurrentContent())),
		// 	)
		// ).hash
		const json: PIIForCommentType = {
			sender: scwAddress,
			message: 'QmY8R2HfnFGVSBCjN81jduN6DS14YEw5mEg5MJCoD3MqTy',
			timestamp: Math.floor(Date.now() / 1000),
			role,
		}

		await encrypt(json)

		logger.info(json, 'Encrypted JSON (Comment Test)')

		// const pii = []
		// for(const val in json?.pii) {
		// 	pii.push({
		// 		id: val,
		// 		data: json?.pii[val]
		// 	})
		// }

		const pii = [
			{
				id: '0x49920f0eda519956db28fe3300003881d73ad611ce8a82d5812bfe895c1e00f1-0x4c451d0db11071633ecfbc53e915a2164b9c7ecf',
				data: '1z62xZmwICKw0MxX+0NRK5jcN7HN/gJTn4c7AmwIiHoo6IyCTDzi5i3dfuYk7zgU+uofvyUkXV/tw4n8/iTAYQc+ljjg+GeUjprjkGXkMov4644XGpKzPa1B0KWLddHvtvY8NMl9R+Js22Iu5N6YWnYm0+ykxg6rwdfaYFqVcoTHCQqBkhDwNCAfbt/szIqMuUuu+fLAckywkTBYiDDG6g==',
			},
			{
				id: '0x49920f0eda519956db28fe3300003881d73ad611ce8a82d5812bfe895c1e00f1-0x5e0a4d86a57966a307afa088898e9e659ddac947',
				data: 'uk2Pku8Kotl0hF49V3QiFqHXVXrL3Dw+HGDZG9tl/ryd3xBr4Q5EMhdOl9kVtB7j/fMNdiliqu+ECKVX2gksOtTC6jNLeSJVbPppQ8uyGUdL4Ol12yKrE6T4IQtL+f+tT63gfenBN+rdaGrIF/YBVedsl2g2DIg+DVfcBmhByvFdduq94uZtmbeRVOQBK+5pLjS3XfNB2ojLxbVWsVQPkA==',
			},
			{
				id: '0x49920f0eda519956db28fe3300003881d73ad611ce8a82d5812bfe895c1e00f1-0xb875927ebd7afdc2913f2d15f0ab94671015933a',
				data: 'wwBP9EDAtPLTGe01lnLwrxd0HgQSIHXG7g+XJoBH17QyH+RWuZBms+zjKVsAOFlPA7yljT37KsbU8H0sf+J8TxrYboeqzcFYAZLL2Umy13YeV4KRgwwyJgxTOjMoutU8XX+6KhMHCZWdPvZWa7xKpc5UUP3NM5nJE0DQqEqtj2TwTfdUSTkc8EpVcfuIqvHRGmze6cck1MCZ08GxCSwk+w==',
			},
			{
				id: '0x49920f0eda519956db28fe3300003881d73ad611ce8a82d5812bfe895c1e00f1-0xd1bfd92ab161983e007aade98312b83eeca14f9a',
				data: 'KRbW+MeSHXUtDv6UX83dPTUcTgaZgr4rSvHsp5aktZs5+G+ocZWCcFMUS5g0LNYnMxRCn4laBMS6W3DTx6wxlhptC741uq69+0ZlG+jsTZfcWivWBafLcr3+eheIil1RgAN4c1SwnNjwsRC7Uq6vjSAFuiWYTgcaypP078sP0dZOYWc34Z41UUlaFWM+kP1/LwsZ8JQQCNugpHGqPiYLuA==',
			},
		]

		logger.info(pii, 'PII (Comment Test)')

		const data = { commentsEncryptedData: pii }
		const decryptedData = await decrypt(data)

		logger.info({ data, decryptedData }, 'Decrypted JSON (Comment Test)')
	}, [scwAddress, role, encrypt, decrypt])

	const addComment = useCallback(
		async(message: EditorState) => {
			try {
				if(
					!webwallet ||
          !biconomyWalletClient ||
          typeof biconomyWalletClient === 'string' ||
          !scwAddress ||
          !selectedGrant?.id ||
          !proposal?.id
				) {
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

				logger.info({ json }, 'Encrypted JSON (Comment)')

				const commentHash = (await uploadToIPFS(JSON.stringify(json))).hash
				logger.info({ commentHash }, 'Comment Hash (Comment)')

				const methodArgs = [
					proposal.grant.workspace.id,
					selectedGrant.id,
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
					setStep(1)
					const { receipt, txFee } = await getTransactionDetails(
						response,
						chainId.toString(),
					)
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
		[
			webwallet,
			biconomy,
			biconomyWalletClient,
			scwAddress,
			chainId,
			role,
			selectedGrant,
			proposal,
		],
	)

	useEffect(() => {
		test()
	}, [])

	return {
		addComment: useMemo(
			() => addComment,
			[webwallet, biconomy, biconomyWalletClient, scwAddress, chainId, role],
		),
		isBiconomyInitialised,
	}
}

export default useAddComment
