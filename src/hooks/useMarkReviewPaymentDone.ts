import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { APPLICATION_REVIEW_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, getTransactionReceipt, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useQBContract from './contracts/useQBContract'
import { useBiconomy } from './gasless/useBiconomy'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'

export default function useMarkReviewPaymentDone(
	workspaceId: string,
	reviewIds: string[],
	applicationsIds: string[],
	totalAmount: BigNumber,
	submitMarkDone: boolean,
	reviewerAddress?: string,
	reviewCurrencyAddress?: string,
	transactionHash?: string,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients

	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const applicationReviewerContract = useQBContract('reviews', chainId)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: chainId?.toString()
		// targetContractABI: ApplicationReviewRegistryAbi,
	})

	useEffect(() => {
		// console.log(totalAmount);
		if(!totalAmount) {
			setError(undefined)
			setIncorrectNetwork(false)
		} else if(transactionData) {
			setTransactionData(undefined)
			setIncorrectNetwork(false)
		}
	}, [totalAmount, transactionData])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [applicationReviewerContract])

	useEffect(() => {
		if(incorrectNetwork) {
			return
		}

		if(error) {
			return
		}

		if(loading) {
			return
		}

		// console.log('YES');

		async function markAsDone() {
			// console.log('YES2');

			setLoading(true)
			try {
				// const markPaymentTxb1 = await applicationReviewerContract.markPaymentDone(
				// 	workspaceId,
				// 	applicationsIds,
				// 	reviewerAddress!,
				// 	reviewIds,
				// 	reviewCurrencyAddress!,
				// 	totalAmount,
				// 	transactionHash!,
				// )

				// const updateTxnData = await markPaymentTxb1.wait()

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				const markPaymentTxb = await sendGaslessTransaction(
					biconomy,
					applicationReviewerContract,
					'markPaymentDone',
					[workspaceId,
						applicationsIds,
						reviewerAddress!,
						reviewIds,
						reviewCurrencyAddress!,
						totalAmount,
						transactionHash!, ],
					APPLICATION_REVIEW_REGISTRY_ADDRESS[currentChainId],
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${currentChainId}`,
					bicoDapps[currentChainId].webHookId,
					nonce
				)

				const updateTransactionData = await getTransactionReceipt(markPaymentTxb, currentChainId.toString())

				setTransactionData(updateTransactionData)
				setLoading(false)
			} catch(e: any) {
				const message = getErrorMessage(e)
				setError(message)
				setLoading(false)
				toastRef.current = toast({
					position: 'top',
					render: () => ErrorToast({
						content: message,
						close: () => {
							if(toastRef.current) {
								toast.close(toastRef.current)
							}
						},
					}),
				})
			}
		}

		try {
			if(!submitMarkDone) {
				return
			}

			if(!workspaceId) {
				return
			}

			if(transactionData) {
				return
			}

			if(!accountData || !accountData.address) {
				throw new Error('not connected to wallet')
			}

			if(!workspace) {
				throw new Error('not connected to workspace')
			}

			if(!currentChainId) {
				if(switchNetwork && chainId) {
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(chainId !== currentChainId) {
				if(switchNetwork && chainId) {
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(
				!applicationReviewerContract
        || applicationReviewerContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationReviewerContract.signer
        || !applicationReviewerContract.provider
			) {
				return
			}

			markAsDone()
		} catch(e: any) {
			const message = getErrorMessage(e)
			setError(message)
			setLoading(false)
			toastRef.current = toast({
				position: 'top',
				render: () => ErrorToast({
					content: message,
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
		}

	}, [
		error,
		loading,
		toast,
		transactionData,
		workspace,
		accountData,
		networkData,
		currentChainId,
		chainId,
		incorrectNetwork,
		reviewIds,
		transactionHash,
		reviewerAddress,
		reviewCurrencyAddress,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
	]
}
