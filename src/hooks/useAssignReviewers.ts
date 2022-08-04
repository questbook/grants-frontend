import React, { useContext, useEffect, useMemo } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { APPLICATION_REVIEW_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { apiKey, getTransactionReceipt, sendGaslessTransaction, webHookId } from 'src/utils/gaslessUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useQBContract from './contracts/useQBContract'
import { useBiconomy } from './gasless/useBiconomy'
import { useNetwork } from './gasless/useNetwork'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'

export default function useAssignReviewers(
	data: any,
	chainId?: SupportedChainId,
	workspaceId?: string,
	grantAddress?: string,
	applicationId?: string,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients


	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		apiKey: apiKey,
		// targetContractABI: ApplicationReviewRegistryAbi,
	})

	if(!chainId) {
		// eslint-disable-next-line no-param-reassign
		chainId = getSupportedChainIdFromWorkspace(workspace)
	}

	const applicationReviewContract = useQBContract('reviews', chainId)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useMemo(() => networkData.id, [networkData])

	useEffect(() => {
		console.log('data', data)
		if(data) {
			setError(undefined)
			setIncorrectNetwork(false)
		}
	}, [data])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [applicationReviewContract])

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
				// console.log(workspaceId || Number(workspace?.id).toString());
				// console.log('ipfsHash', ipfsHash);
				// console.log(
				//   WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
				//   APPLICATION_REGISTRY_ADDRESS[currentChainId!],
				// );

				// const createGrantTransaction = await applicationReviewContract.assignReviewers(
				// 	workspaceId || workspace!.id,
				// 	applicationId!,
				// 	grantAddress!,
				// 	data.reviewers,
				// 	data.active,
				// )
				// const createGrantTransactionData = await createGrantTransaction.wait()

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					return
				}

				const transactionHash = await sendGaslessTransaction(
					biconomy,
					applicationReviewContract,
					'assignReviewers',
					[workspaceId || workspace!.id,
						applicationId!,
						grantAddress!,
						data.reviewers,
						data.active, ],
					APPLICATION_REVIEW_REGISTRY_ADDRESS[currentChainId],
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
			if(!data) {
				return
			}

			if(!grantAddress) {
				return
			}

			if(!applicationId) {
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

			if(!validatorApi) {
				throw new Error('validatorApi or workspaceId is not defined')
			}

			if(
				!applicationReviewContract
        || applicationReviewContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationReviewContract.signer
        || !applicationReviewContract.provider
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
		applicationReviewContract,
		validatorApi,
		workspace,
		accountData,
		networkData,
		currentChainId,
		chainId,
		workspaceId,
		data,
		grantAddress,
		applicationId,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(chainId || getSupportedChainIdFromWorkspace(workspace), transactionData?.transactionHash),
		loading,
		error,
	]
}
