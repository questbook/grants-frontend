import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { GrantApplicationRequest } from '@questbook/service-validator-client'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { APPLICATION_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import strings from 'src/constants/strings.json'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { addAuthorizedUser, bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import logger from 'src/utils/logger'

export default function useSubmitApplication(
	data: GrantApplicationRequest,
	setCurrentStep: (step: number | undefined) => void,
	chainId?: SupportedChainId,
	grantId?: string,
	workspaceId?: string,
) {
	console.log('application data', data)
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: networkData, switchNetwork, network } = useNetwork()
	const [shouldRefreshNonce, setShouldRefreshNonce] = React.useState<boolean>()
	const { data: accountData, nonce } = useQuestbookAccount(shouldRefreshNonce)

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, subgraphClients } = apiClients

	const currentChainId = useChainId()
	const applicationRegistryContract = useQBContract('applications', chainId)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()


	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString(),
		shouldRefreshNonce: shouldRefreshNonce
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = React.useState(false)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])


	useEffect(() => {

		if(currentChainId !== network) {
			logger.info('SWITCH NETWORK (use-submit-application.tsx 1): ', currentChainId)
			switchNetwork(currentChainId)
		}

	}, [network, currentChainId])

	useEffect(() => {
		if(data) {
			// console.log('Application data', data)
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

		if(!webwallet) {
			return
		}

		if(nonce && nonce !== 'Token expired') {
			return
		}


		addAuthorizedUser(webwallet?.address)
			.then(() => {
				setShouldRefreshNonce(true)
			})
			// .catch((err) => console.log("Couldn't add authorized user", err))
	}, [webwallet, nonce, shouldRefreshNonce])

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
		// // console.log('calling createGrant');

		async function validate() {
			setLoading(true)
			// // console.log('calling validate');
			try {
				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				setCurrentStep(0)

				const detailsHash = (
					await uploadToIPFS(data.fields.projectDetails[0].value)
				).hash
				// eslint-disable-next-line no-param-reassign
				data.fields.projectDetails[0].value = detailsHash
				console.log('Details hash: ', data)
				const {
					data: { ipfsHash },
				} = await validatorApi.validateGrantApplicationCreate(data)
				// console.log(ipfsHash)
				if(!ipfsHash) {
					throw new Error('Error validating grant data')
				}

				setCurrentStep(1)

				const response = await sendGaslessTransaction(
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

				setCurrentStep(2)

				if(response) {
					const { receipt, txFee } = await getTransactionDetails(response, currentChainId.toString())
					await subgraphClients[currentChainId].waitForBlock(receipt?.blockNumber)

					setCurrentStep(3)

					setTransactionData(receipt)
					await chargeGas(Number(workspaceId), Number(txFee))

					setCurrentStep(4)
				}

				const CACHE_KEY = strings.cache.apply_grant
				const cacheKey = `${chainId}-${CACHE_KEY}-${grantId}`
				// console.log('Deleting cache key: ', cacheKey)
				if(typeof window !== 'undefined') {
					localStorage.removeItem(cacheKey)
				}

				setLoading(false)
				setCurrentStep(5)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch(e: any) {
				setCurrentStep(undefined)
				const message = getErrorMessage(e)
				setError(message)
				setLoading(false)
				setCurrentStep(undefined)
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
					logger.info('SWITCH NETWORK (use-submit-application.tsx 2): ', chainId)
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(chainId !== currentChainId) {
				if(switchNetwork && chainId) {
					logger.info('SWITCH NETWORK (use-submit-application.tsx 3): ', chainId)
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(!validatorApi) {
				throw new Error('validatorApi or workspaceId is not defined')
			}

			if(!webwallet) {
				throw new Error('Your webwallet is not initialized, please contact support')
			}

			if(
				!applicationRegistryContract
        || applicationRegistryContract.address
          === '0x0000000000000000000000000000000000000000'
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
		isBiconomyInitialised,
		error,
	]
}
