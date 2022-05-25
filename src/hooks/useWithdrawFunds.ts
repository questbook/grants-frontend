import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { CHAIN_INFO } from 'src/constants/chainInfo'
import getErrorMessage from 'src/utils/errorUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useAccount, useNetwork } from 'wagmi'
import ErrorToast from '../components/ui/toasts/errorToast'
import useGrantContract from './contracts/useGrantContract'
import useChainId from './utils/useChainId'

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
	const [{ data: accountData }] = useAccount()
	const [{ data: networkData }, switchNetwork] = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const grantContract = useGrantContract(grantAddress)
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
				const transferTxn = await grantContract.withdrawFunds(
					rewardAddress,
					finalAmount,
					address,
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
				!grantContract
        || grantContract.address
          === '0x0000000000000000000000000000000000000000'
        || !grantContract.signer
        || !grantContract.provider
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
		currentChainId
			? `${CHAIN_INFO[currentChainId]
				.explorer.transactionHash}${transactionData?.transactionHash}`
			: '',
		loading,
		error,
	]
}
