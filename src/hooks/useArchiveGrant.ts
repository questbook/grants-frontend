import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ContractTransaction } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useAccount, useNetwork } from 'wagmi'
import ErrorToast from '../components/ui/toasts/errorToast'
import useGrantContract from './contracts/useGrantContract'
import useQBContract from './contracts/useQBContract'
import useChainId from './utils/useChainId'

export default function useArchiveGrant(newState: boolean, changeCount: number, grantId?: string) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData } = useAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients
	const grantContract = useGrantContract(grantId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const grantFactoryContract = useQBContract('grantFactory', chainId)

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

	}, [grantContract])

	useEffect(() => {
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
			console.log('grant ID', grantId)
			console.log('workspace Id', Number(workspace?.id).toString())
			console.log('workspace address', WORKSPACE_REGISTRY_ADDRESS[currentChainId])
			console.log('new state', newState)
			let archiveGrantTransaction: ContractTransaction
			try {
				if(chainId === 42220) {
					archiveGrantTransaction = await grantContract.updateGrantAccessibility(newState)
				} else {
					archiveGrantTransaction = await grantFactoryContract.updateGrantAccessibility(
						grantId!,
						Number(workspace?.id).toString(),
						WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
						newState)
				}

				const archiveGrantTransactionData = await archiveGrantTransaction.wait()

				setTransactionData(archiveGrantTransactionData)
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
		error,
	]
}
