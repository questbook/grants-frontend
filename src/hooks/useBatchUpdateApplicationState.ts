import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import logger from 'src/utils/logger'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'

export default function useBatchUpdateApplicationState(
	data: string,
	applicationIds: number[],
	state: number,
	submitClicked: boolean,
	setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>,
	setNetworkTransactionModalStep: (step: number | undefined) => void
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace, subgraphClients } = apiClients
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const applicationContract = useQBContract('applications', chainId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()!
		// targetContractABI: GrantFactoryAbi,
	})


	const [isBiconomyInitialised, setIsBiconomyInitialised] = React.useState(false)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			// console.log('Hifff')
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])

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
			// // console.log('calling validate');
			// // console.log('DATA: ', data)
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

				// console.log('THESE ARE METHODS', methodArgs)

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
				await subgraphClients[currentChainId].waitForBlock(receipt?.blockNumber)
				await chargeGas(Number(workspace?.id), Number(txFee))

				setNetworkTransactionModalStep(3)

				setTransactionData(receipt)
				setLoading(false)
				setSubmitClicked(false)

				setTimeout(() => {
					setNetworkTransactionModalStep(undefined)
				}, 2000)
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
		}

		try {
			if(!state) {
				return
			}

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
					logger.info('SWITCH NETWORK (use-batch-update-application-state.tsx 1): ', chainId)
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(chainId !== currentChainId) {
				if(switchNetwork && chainId) {
					logger.info('SWITCH NETWORK (use-batch-update-application-state.tsx 2): ', chainId)
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
		error
	]
}
