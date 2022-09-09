import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import useGrantContract from 'src/hooks/contracts/useGrantContract'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

export default function useWithdrawFunds(
	setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>,
	finalAmount?: string,
	rewardAddress?: string,
	grantAddress?: string,
	address?: string,
	submitClicked?: boolean,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const grantContract = useGrantContract(grantAddress)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	// const { webwallet } = useContext(WebwalletContext)!

	// const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
	// 	chainId: chainId?.toString()!
	// })


	useEffect(() => {
		if(finalAmount) {
			setError(undefined)
			setIncorrectNetwork(false)
		} else if(transactionData) {
			setTransactionData(undefined)
			setIncorrectNetwork(false)
		}
	}, [finalAmount, transactionData, address])

	useEffect(() => {
		if(submitClicked) {
			setError(undefined)
			setIncorrectNetwork(false)
			setSubmitClicked(false)
		}
	}, [setSubmitClicked, submitClicked])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [grantContract])

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

		async function validate() {
			setLoading(true)
			try {

				// if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
				// 	throw new Error('Zero wallet is not ready')
				// }

				const transferTxn1 = await grantContract.withdrawFunds(
					rewardAddress!,
					finalAmount!,
					address!,
				)
				const depositTransactionData = await transferTxn1.wait()

				// const transferTxn = await sendGaslessTransaction(
				// 	biconomy,
				// 	grantContract,
				// 	'withdrawFunds',
				// 	[rewardAddress!,
				// 		finalAmount!,
				// 		address!, ],
				// 	grantAddress || '0x0000000000000000000000000000000000000000',
				// 	biconomyWalletClient,
				// 	scwAddress,
				// 	webwallet,
				// 	`${currentChainId}`,
				// 	bicoDapps[currentChainId].webHookId,
				// 	nonce
				// )

				// const depositTransactionData = await getTransactionReceipt(transferTxn, currentChainId.toString())


				setTransactionData(depositTransactionData)
				setLoading(false)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
			if(!finalAmount) {
				return
			}

			if(!rewardAddress) {
				return
			}

			if(!address) {
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
					logger.info('SWITCH NETWORK (use-withdraw-funds.tsx 1): ', chainId)
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(chainId !== currentChainId) {
				if(switchNetwork && chainId) {
					logger.info('SWITCH NETWORK (use-withdraw-funds.tsx 2): ', chainId)
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(
				!grantContract
        || grantContract.address
          === '0x0000000000000000000000000000000000000000'
        || !grantContract.signer
        || !grantContract.provider
			) {
				return
			}

			validate()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		grantContract,
		workspace,
		accountData,
		networkData,
		currentChainId,
		rewardAddress,
		address,
		finalAmount,
		chainId,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
		error,
	]
}
