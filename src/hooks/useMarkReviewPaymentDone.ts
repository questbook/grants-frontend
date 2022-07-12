import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
// import { BigNumber } from 'ethers';
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useAccount, useNetwork } from 'wagmi'
import ErrorToast from '../components/ui/toasts/errorToast'
import useApplicationReviewRegistryContract from './contracts/useApplicationReviewRegistryContract'
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
	const { data: accountData } = useAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const applicationReviewerContract = useApplicationReviewRegistryContract(chainId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()

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
				const markPaymentTxb = await applicationReviewerContract.markPaymentDone(
					workspaceId,
					applicationsIds,
					reviewerAddress!,
					reviewIds,
					reviewCurrencyAddress!,
					totalAmount,
					transactionHash!,
				)

				const updateTxnData = await markPaymentTxb.wait()

				setTransactionData(updateTxnData)
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
