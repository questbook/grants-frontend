import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import CustomToast from '../components/ui/toasts/customToast'
import ErrorToast from '../components/ui/toasts/errorToast'
import useERC20Contract from './contracts/useERC20Contract'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'

export default function useDepositFunds(
	finalAmount?: BigNumber,
	rewardAddress?: string,
	grantAddress?: string,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const rewardContract = useERC20Contract(rewardAddress)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	useEffect(() => {
		if(finalAmount) {
			setError(undefined)
			setIncorrectNetwork(false)
		} else if(transactionData) {
			setTransactionData(undefined)
			setIncorrectNetwork(false)
		}
	}, [finalAmount, transactionData])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [rewardContract])

	async function validate() {
		setLoading(true)
		try {
			toastRef.current = toast({
				position: 'top',
				render: () => CustomToast({
					content: 'Go to your Gnosis wallet to approve transaction',
					close: () => {
						if(toastRef.current) {
							toast.close(toastRef.current)
						}
					},
				}),
			})
			const transferTxn = rewardContract.transfer(
			grantAddress!,
			finalAmount!,
			)

			await rewardContract.once('Transfer', (from, to, amount, event) => {
				if(from === accountData?.address && to === utils.getAddress(grantAddress!)) {
					setTransactionData(event)
					setLoading(false)
				}
			})

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

		// console.log('calling createGrant');


		try {
			if(!finalAmount) {
				return
			}

			if(!grantAddress) {
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

			if(finalAmount.isZero()) {
				throw new Error('Amount entered should be more than 0!')
			}

			if(finalAmount.isNegative()) {
				throw new Error('Amount entered cannot be negative!')
			}

			if(
				!rewardContract
        || rewardContract.address
          === '0x0000000000000000000000000000000000000000'
        || !rewardContract.signer
        || !rewardContract.provider
			) {
				return
			}

			validate()
			if(transactionData) {
				return
			}

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
		rewardContract,
		workspace,
		accountData,
		networkData,
		currentChainId,
		grantAddress,
		finalAmount,
		chainId,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
	]
}
