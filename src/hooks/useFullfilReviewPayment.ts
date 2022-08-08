import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useERC20Contract from './contracts/useERC20Contract'
import useQBContract from './contracts/useQBContract'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'

export default function useFulfillReviewPayment(
	workspaceId: string,
	reviewIds: string[],
	applicationsIds: string[],
	totalAmount: BigNumber,
	submitPayment: boolean,
	reviewerAddress?: string,
	reviewCurrencyAddress?: string,
) {
	const [error, setError] = React.useState<string>()
	const [fulfillLoading, setFulfillLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [fulfillPaymentData, setFulfillPaymentData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { workspace } = apiClients
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const applicationReviewerContract = useQBContract('reviews', chainId)
	const rewardContract = useERC20Contract(reviewCurrencyAddress)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()

	useEffect(() => {
		// console.log(totalAmount);
		if(!totalAmount) {
			setError(undefined)
			setIncorrectNetwork(false)
		} else if(fulfillPaymentData) {
			setFulfillPaymentData(undefined)
			setIncorrectNetwork(false)
		}
	}, [totalAmount, fulfillPaymentData])

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

		if(fulfillLoading) {
			return
		}

		console.log('YES')

		async function fulfillPayment() {
			console.log('YES2')

			setFulfillLoading(true)
			try {
				const txnApprove = await rewardContract.approve(
					applicationReviewerContract.address,
					totalAmount,
				)
				await txnApprove.wait()

				console.log('WENT THROUGH')

				const fulfillPaymenTxn = await applicationReviewerContract.fulfillPayment(
					workspaceId,
					applicationsIds,
					reviewerAddress!,
					reviewIds,
					reviewCurrencyAddress!,
					totalAmount,
				)

				const updateTxnData = await fulfillPaymenTxn.wait()

				setFulfillPaymentData(updateTxnData)
				setFulfillLoading(false)
			} catch(e: any) {
				const message = getErrorMessage(e)
				setError(message)
				setFulfillLoading(false)
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
			if(!submitPayment) {
				return
			}

			if(!workspaceId) {
				return
			}

			if(fulfillPaymentData) {
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
				setFulfillLoading(false)
				return
			}

			if(chainId !== currentChainId) {
				if(switchNetwork && chainId) {
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setFulfillLoading(false)
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

			fulfillPayment()
		} catch(e: any) {
			const message = getErrorMessage(e)
			setError(message)
			setFulfillLoading(false)
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
		fulfillLoading,
		toast,
		fulfillPaymentData,
		workspace,
		accountData,
		networkData,
		currentChainId,
		chainId,
		incorrectNetwork,
		reviewIds,
		reviewerAddress,
		reviewCurrencyAddress,
	])

	return [
		fulfillPaymentData,
		getExplorerUrlForTxHash(currentChainId, fulfillPaymentData?.transactionHash),
		fulfillLoading,
		error,
	]
}
