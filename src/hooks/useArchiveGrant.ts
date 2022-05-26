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

export default function useArchiveGrant(newState: boolean, changeCount: number, grantId?: string) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData } = useAccount()
	const { data: networkData } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients
	const grantContract = useGrantContract(grantId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()

	useEffect(() => {
		if(newState) {
			setError(undefined)
		}
	}, [newState])

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

			try {
				const archiveGrantTransaction = await grantContract.updateGrantAccessibility(newState)
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

			if(!currentChainId) {
				throw new Error('not connected to valid network')
			}

			if(!workspace) {
				throw new Error('not connected to workspace')
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
		currentChainId
			? `${CHAIN_INFO[currentChainId].explorer.transactionHash}${transactionData?.transactionHash}`
			: '',
		loading,
		error,
	]
}
