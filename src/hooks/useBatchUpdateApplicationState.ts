import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useQBContract from './contracts/useQBContract'
import { useBiconomy } from './gasless/useBiconomy'
import { useNetwork } from './gasless/useNetwork'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'

export default function useBatchUpdateApplicationState(
	data:string,
	applicationIds: number[],
	state: number,
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
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = React.useState<number>()

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()!
		// targetContractABI: GrantFactoryAbi,
	})


	const [isBiconomyInitialised, setIsBiconomyInitialised] = React.useState(false)

	useEffect(() => {
		const isBiconomyLoading = localStorage.getItem('isBiconomyLoading') === 'true'
		console.log('rree', isBiconomyLoading, biconomyLoading)
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised])

	useEffect(() => {
		if(state) {
			setError(undefined)
			setLoading(false)
			setIncorrectNetwork(false)
		}
	}, [state])


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


		if(!submitClicked) {
			return
		}

		// if(submitClicked) {
		// 	setIncorrectNetwork(false)
		// 	setSubmitClicked(false)
		// }

		async function validate() {
			setNetworkTransactionModalStep(1)
			setLoading(true)
			// console.log('calling validate');
			// console.log('DATA: ', data)
			try {
				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}
				// const {
				// 	data: { ipfsHash },
				// } = await validatorApi.validateGrantApplicationUpdate({
				// 	feedback: data.length === 0 ? '  ' : data,
				// })
				// if(!ipfsHash) {
				// 	throw new Error('Error validating grant data')
				// }
				// const updateTxn = await applicationContract.batchUpdateApplicationState(
				// 	applicationIds,
				// 	Array(applicationIds.length).fill(state),
				// 	Number(workspace!.id),
				// )
				// const updateTxnData = await updateTxn.wait()

				const methodArgs = [
					applicationIds,
					Array(applicationIds.length).fill(state),
					Number(workspace!.id),
				]

				console.log('THESE ARE METHODS', methodArgs)

				const response = await sendGaslessTransaction(
					biconomy,
					applicationContract,
					'batchUpdateApplicationState',
					methodArgs,
					applicationContract.address,
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

				setNetworkTransactionModalStep(2)

				const { txFee, receipt } = await getTransactionDetails(response, currentChainId.toString())

				await chargeGas(Number(workspace?.id), Number(txFee))

				setNetworkTransactionModalStep(3)

				setTransactionData(receipt)
				setLoading(false)
				setSubmitClicked(false)

				setTimeout(() => {
					setNetworkTransactionModalStep(undefined)
				}, 2000)
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

			// if(state !== 2) {
			// 	if(!data) {
			// 		return
			// 	}
			// }

			if(!applicationIds) {
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

			setNetworkTransactionModalStep(0)

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
		applicationIds,
		state,
		data,
		incorrectNetwork,
		chainId,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
		isBiconomyInitialised,
		error,
		networkTransactionModalStep
	]
}
