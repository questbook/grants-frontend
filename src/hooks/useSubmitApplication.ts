import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { GrantApplicationRequest } from '@questbook/service-validator-client'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { APPLICATION_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, getTransactionReceipt, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import strings from '../constants/strings.json'
import useQBContract from './contracts/useQBContract'
import { useBiconomy } from './gasless/useBiconomy'
import { useNetwork } from './gasless/useNetwork'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'

export default function useSubmitApplication(
	data: GrantApplicationRequest,
	chainId?: SupportedChainId,
	grantId?: string,
	workspaceId?: string,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork, network } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi } = apiClients

	const currentChainId = useChainId()
	const applicationRegistryContract = useQBContract('applications', chainId)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()


	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: chainId?.toString()
	})

	useEffect(() => {

		if(currentChainId !== network) {
			switchNetwork(currentChainId)
		}

	}, [network, currentChainId])

	useEffect(() => {
		if(data) {
			console.log('Application data', data)
			setError(undefined)
			setIncorrectNetwork(false)
		}
	}, [data])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [applicationRegistryContract])

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

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				const detailsHash = (
					await uploadToIPFS(data.fields.projectDetails[0].value)
				).hash
				// eslint-disable-next-line no-param-reassign
				data.fields.projectDetails[0].value = detailsHash
				console.log('Details hash: ', detailsHash)
				const {
					data: { ipfsHash },
				} = await validatorApi.validateGrantApplicationCreate(data)
				console.log(ipfsHash)
				if(!ipfsHash) {
					throw new Error('Error validating grant data')
				}

				// const txn = await applicationRegistryContract.submitApplication(
				// 	grantId!,
				// 	Number(workspaceId).toString(),
				// 	ipfsHash,
				// 	data.milestones.length,
				// )
				// const txnData = await txn.wait()

				const transactionHash = await sendGaslessTransaction(
					biconomy,
					applicationRegistryContract,
					'submitApplication',
					[grantId!,
						Number(workspaceId).toString(),
						ipfsHash,
						data.milestones.length, ],
					APPLICATION_REGISTRY_ADDRESS[currentChainId],
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${currentChainId}`,
					bicoDapps[currentChainId].webHookId,
					nonce
				)


				const transactionData = await getTransactionReceipt(transactionHash, currentChainId.toString())

				const CACHE_KEY = strings.cache.apply_grant
				const cacheKey = `${chainId}-${CACHE_KEY}-${grantId}`
				console.log('Deleting cache key: ', cacheKey)
				if(typeof window !== 'undefined') {
					localStorage.removeItem(cacheKey)
				}

				setTransactionData(transactionData)
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
				!applicationRegistryContract
        || applicationRegistryContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationRegistryContract.signer
        || !applicationRegistryContract.provider
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
		applicationRegistryContract,
		validatorApi,
		accountData,
		networkData,
		currentChainId,
		chainId,
		data,
		grantId,
		workspaceId,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(chainId, transactionData?.transactionHash),
		loading,
		error,
	]
}
