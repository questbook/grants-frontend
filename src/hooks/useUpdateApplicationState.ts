import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useQBContract from './contracts/useQBContract'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'
import { useBiconomy } from './gasless/useBiconomy'
import { apiKey, getTransactionReceipt, sendGaslessTransaction, webHookId } from 'src/utils/gaslessUtils'
import { APPLICATION_REGISTRY_ADDRESS } from 'src/constants/addresses'

export default function useUpdateApplicationState(
	data: string,
	applicationId: string | undefined,
	state: number | undefined,
	submitClicked: boolean,
	setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const applicationContract = useQBContract('applications', chainId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		apiKey: apiKey,
	})


	useEffect(() => {
		if(state) {
			setError(undefined)
			setLoading(false)
			setIncorrectNetwork(false)
		}
	}, [state])

	useEffect(() => {
		if(submitClicked) {
			setIncorrectNetwork(false)
			setSubmitClicked(false)
		}
	}, [setSubmitClicked, submitClicked])

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
			console.log('DATA: ', data)
			try {

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					return
				}

				const {
					data: { ipfsHash },
				} = await validatorApi.validateGrantApplicationUpdate({
					feedback: data.length === 0 ? '  ' : data,
				})
				if(!ipfsHash) {
					throw new Error('Error validating grant data')
				}

				// const updateTxn = await applicationContract.updateApplicationState(
				// 	Number(applicationId),
				// 	Number(workspace!.id),
				// 	state!,
				// 	ipfsHash,
				// )
				// const updateTxnData = await updateTxn.wait()

				const transactionHash = await sendGaslessTransaction(
					biconomy,
					applicationContract,
					'updateApplicationState',
					[Number(applicationId),
						Number(workspace!.id),
						state!,
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
			if(!state) {
				return
			}

			if(state !== 2) {
				if(!data) {
					return
				}
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
		workspace,
		accountData,
		networkData,
		currentChainId,
		applicationId,
		state,
		data,
		incorrectNetwork,
		chainId,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
		error,
	]
}
