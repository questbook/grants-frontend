/* eslint-disable eqeqeq */
import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { APPLICATION_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { apiKey, getTransactionReceipt, sendGaslessTransaction, webHookId } from 'src/utils/gaslessUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useQBContract from './contracts/useQBContract'
import { useBiconomy } from './gasless/useBiconomy'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'

export default function useRequestMilestoneApproval(
	data: any,
	chainId: SupportedChainId | undefined,
	applicationId: string | undefined,
	milestoneIndex: number | undefined,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi } = apiClients
	const currentChainId = useChainId()
	const applicationContract = useQBContract('applications', chainId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		apiKey: apiKey,
		// targetContractABI: ApplicationReviewRegistryAbi,
	})

	if(chainId) {
		// eslint-disable-next-line no-param-reassign
		chainId = parseInt(chainId as unknown as string, 10)
	}

	useEffect(() => {
		if(data) {
			setError(undefined)
			setLoading(false)
			setIncorrectNetwork(false)
		}
	}, [data])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [applicationContract])

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
			// console.log('calling validate');
			try {

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					return
				}

				const {
					data: { ipfsHash },
				} = await validatorApi.validateApplicationMilestoneUpdate(data)
				if(!ipfsHash) {
					throw new Error('Error validating grant data')
				}

				// const updateTxn = await applicationContract.requestMilestoneApproval(
				// 	applicationId!,
				// 	Number(milestoneIndex),
				// 	ipfsHash,
				// )
				// const updateTxnData = await updateTxn.wait()

				const transactionHash = await sendGaslessTransaction(
					biconomy,
					applicationContract,
					'requestMilestoneApproval',
					[applicationId!,
						Number(milestoneIndex),
						ipfsHash, ],
					APPLICATION_REGISTRY_ADDRESS[currentChainId],
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${currentChainId}`,
					webHookId,
					nonce
				)

				const updateTransactionData = await getTransactionReceipt(transactionHash, currentChainId.toString())

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
			// console.log(data);
			// console.log(milestoneIndex);
			// console.log(applicationId);
			// console.log(Number.isNaN(milestoneIndex));
			if(Number.isNaN(milestoneIndex)) {
				return
			}

			if(!data) {
				return
			}

			if(!applicationId) {
				return
			}

			if(transactionData) {
				return
			}

			if(!chainId) {
				return
			}

			if(!accountData || !accountData.address) {
				throw new Error('not connected to wallet')
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

			if(!validatorApi) {
				throw new Error('validatorApi or workspaceId is not defined')
			}

			if(
				!applicationContract
        || applicationContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationContract.signer
        || !applicationContract.provider
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
		applicationContract,
		validatorApi,
		chainId,
		accountData,
		networkData,
		currentChainId,
		applicationId,
		milestoneIndex,
		data,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(chainId, transactionData?.transactionHash),
		loading,
		error,
	]
}
