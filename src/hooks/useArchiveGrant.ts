import React, { useContext, useEffect, useMemo } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'


export default function useArchiveGrant(newState: boolean, changeCount: number, grantId?: string) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useMemo(() => networkData.id, [networkData])
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	const grantFactoryContract = useQBContract('grantFactory', chainId)
	const workspaceRegistryContract = useQBContract('workspace', chainId)

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()
		// targetContractABI: GrantABI,
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = React.useState(false)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised])

	const { webwallet } = useContext(WebwalletContext)!

	useEffect(() => {
		if(newState) {
			setError(undefined)
			setIncorrectNetwork(false)
		}
	}, [newState])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [grantFactoryContract])

	useEffect(() => {
		// console.log('RErERERERE', changeCount, error, loading)
		if(changeCount === 0) {
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
				// const archiveGrantTransaction = await grantContract.updateGrantAccessibility(newState)
				// const archiveGrantTransactionData = await archiveGrantTransaction.wait()

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				// console.log('workspace_id', workspace?.id)
				const response = await sendGaslessTransaction(
					biconomy,
					grantFactoryContract,
					'updateGrantAccessibility',
					[grantId, workspace?.id, workspaceRegistryContract.address, newState ],
					grantFactoryContract.address,
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

				const { receipt, txFee } = await getTransactionDetails(response, currentChainId.toString())

				await chargeGas(Number(workspace?.id), Number(txFee))

				setTransactionData(receipt)
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

			if(getSupportedChainIdFromWorkspace(workspace) !== currentChainId) {
				throw new Error('connected to wrong network')
			}

			if(!validatorApi) {
				throw new Error('validatorApi or workspaceId is not defined')
			}

			// console.log('grantFactoryContract', grantFactoryContract)
			if(
				!grantFactoryContract
        || grantFactoryContract.address
          === '0x0000000000000000000000000000000000000000'

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
		grantFactoryContract,
		validatorApi,
		workspace,
		accountData,
		networkData,
		currentChainId,
		newState,
		changeCount,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
		isBiconomyInitialised,
		error,
	]
}
