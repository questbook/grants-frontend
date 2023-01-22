import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import {
	APPLICATION_REGISTRY_ADDRESS,
	WORKSPACE_REGISTRY_ADDRESS,
} from 'src/constants/addresses'
import { SupportedChainId, USD_ASSET, USD_DECIMALS } from 'src/constants/chains'
import strings from 'src/constants/strings.json'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import { WebwalletContext } from 'src/contexts/WebwalletContext'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash, parseAmount } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import logger from 'src/utils/logger'
import {
	getSupportedChainIdFromWorkspace,
	getSupportedValidatorNetworkFromChainId,
} from 'src/utils/validationUtils'

// @TODO fix grantContract

export default function useCreateGrant(
	data: any,
	setCurrentStep: (step: number | undefined) => void,
	chainId?: SupportedChainId,
	workspaceId?: string,
) {
	const { validatorApi, workspace, subgraphClients } = useContext(ApiClientsContext)!
	const { webwallet } = useContext(WebwalletContext)!

	chainId = chainId || getSupportedChainIdFromWorkspace(workspace)

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()!
		// targetContractABI: GrantFactoryAbi,
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = React.useState(false)

	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()
	const grantContract = useQBContract('grantFactory', chainId)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])

	useEffect(() => {
		// console.log('data', data)
		if(data) {
			setError(undefined)
			setIncorrectNetwork(false)
		}
	}, [data])

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

		// console.log('YEEES')

		async function validate() {
			setLoading(true)
			// console.log('calling validate')
			try {
				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				setCurrentStep(0)
				const isEVM = workspace?.safe?.chainId !== '900001'
				const detailsHash = (await uploadToIPFS(data.details)).hash
				let reward

				if(isEVM) {
					console.log('reward', data.reward)
					reward = {
						committed: data.reward,
						asset: USD_ASSET
					}
				} else {
					reward = {
						committed: parseAmount(data.reward, undefined, USD_DECIMALS),
						asset: USD_ASSET
					}
				}

				const {
					data: { ipfsHash },
				} = await validatorApi.validateGrantCreate({
					title: data.title,
					summary: data.summary,
					details: detailsHash,
					deadline: data.date,
					reward,
					creatorId: accountData?.address!,
					workspaceId: getSupportedValidatorNetworkFromChainId(
						(chainId || getSupportedChainIdFromWorkspace(workspace))!,
					),
					fields: data.fields,
					grantManagers: data.grantManagers.length ? data.grantManagers : [accountData!.address],
				})

				// console.log('ipfsHash', ipfsHash)

				if(!ipfsHash) {
					throw new Error('Error validating grant data')
				}

				let rubricHash = ''
				if(data?.rubric) {
					const {
						data: { ipfsHash: auxRubricHash },
					} = await validatorApi.validateRubricSet({
						rubric: data?.rubric,
					})

					if(!auxRubricHash) {
						throw new Error('Error validating rubric data')
					}

					rubricHash = auxRubricHash
				}

				setCurrentStep(1)

				const methodArgs = [
					workspaceId || Number(workspace?.id).toString(),
					ipfsHash,
					rubricHash,
					WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
					APPLICATION_REGISTRY_ADDRESS[currentChainId!],
				]

				// console.log('THESE ARE METHODS', methodArgs)

				const response = await sendGaslessTransaction(
					biconomy,
					grantContract,
					'createGrant',
					methodArgs,
					grantContract.address,
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${currentChainId}`,
					bicoDapps[currentChainId].webHookId,
					nonce
				)

				if(!response) {
					return
				}

				setCurrentStep(2)
				const { txFee, receipt } = await getTransactionDetails(response, currentChainId.toString())
				await subgraphClients[currentChainId].waitForBlock(receipt?.blockNumber)

				setCurrentStep(3)

				await chargeGas(Number(workspaceId || Number(workspace?.id).toString()), Number(txFee), chainId)

				const CACHE_KEY = strings.cache.create_grant
				const cacheKey = `${chainId || getSupportedChainIdFromWorkspace(workspace)}-${CACHE_KEY}-${workspace?.id}`
				// console.log('Deleting key: ', cacheKey)
				if(typeof window !== 'undefined') {
					localStorage.removeItem(cacheKey)
				}

				setTransactionData(receipt)
				setLoading(false)
				setCurrentStep(5)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch(e: any) {
				setCurrentStep(undefined)
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

			if(!accountData || !accountData.address) {
				throw new Error('not connected to wallet')
			}

			if(!workspace) {
				throw new Error('not connected to workspace')
			}

			if(!currentChainId) {
				if(switchNetwork && chainId) {
					// console.log(' (CREATE GRANT HOOK) Switch Network (!currentChainId): ', workspace, chainId)
					logger.info('SWITCH NETWORK (use-create-grant.tsx 1): ', chainId)
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(chainId !== currentChainId) {
				if(switchNetwork && chainId) {
					// console.log(' (CREATE GRANT HOOK) Switch Network: (chainId !== currentChainId)', workspace, chainId)
					logger.info('SWITCH NETWORK (use-create-grant.tsx 2): ', chainId)
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
				!grantContract
				|| grantContract.address
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
		grantContract,
		validatorApi,
		workspace,
		accountData,
		networkData,
		currentChainId,
		biconomyWalletClient,
		scwAddress,
		chainId,
		workspaceId,
		data,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(chainId || getSupportedChainIdFromWorkspace(workspace), transactionData?.transactionHash),
		loading,
		isBiconomyInitialised,
		error,
	]
}
