import React, { useContext, useEffect, useMemo } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import {
	apiKey,
	getTransactionReceipt,
	sendGaslessTransaction,
	webHookId
} from 'src/utils/gaslessUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useQBContract from './contracts/useQBContract'
import { useBiconomy } from './gasless/useBiconomy'
import { useNetwork } from './gasless/useNetwork'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'

export default function useApproveMilestone(
	data: any,
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
	const { validatorApi, workspace } = apiClients
	const currentChainId = useMemo(() => networkData.id, [networkData])
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const applicationContract = useQBContract('applications', chainId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		apiKey: apiKey,
		targetContractABI: ApplicationRegistryAbi,
	})

	const { webwallet } = useContext(WebwalletContext)!

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
				const {
					data: { ipfsHash },
				} = await validatorApi.validateApplicationMilestoneUpdate(data)
				if(!ipfsHash) {
					throw new Error('Error validating grant data')
				}

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					return
				}

				const transactionHash = await sendGaslessTransaction(
					biconomy,
					applicationContract,
					'approveMilestone',
					[applicationId!,
						Number(milestoneIndex),
						Number(workspace!.id),
						ipfsHash, ],
					applicationContract.address,
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
		milestoneIndex,
		data,
		chainId,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
	]
}
