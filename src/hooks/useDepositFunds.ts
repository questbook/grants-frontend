import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useNetwork } from 'wagmi'
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
	const { data: accountData } = useQuestbookAccount()
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

		async function validate() {
			setLoading(true)
			// console.log('calling validate');
			try {
				const transferTxn = await rewardContract.transfer(
					grantAddress!,
					finalAmount!,
				)
				const depositTransactionData = await transferTxn.wait()

				setTransactionData(depositTransactionData)
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
			if(!finalAmount) {
				return
			}

			if(!grantAddress) {
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
