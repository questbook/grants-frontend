import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { GrantApplicationUpdate } from '@questbook/service-validator-client'
import axios from 'axios'
import sha256 from 'crypto-js/sha256'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { APPLICATION_REGISTRY_ADDRESS, COMMUNICATION_ADDRESS } from 'src/constants/addresses'
import { SupportedChainId } from 'src/constants/chains'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import logger from 'src/utils/logger'

export default function useResubmitApplication(
	data: GrantApplicationUpdate,
	email: string,
	setCurrentStep: (step: number | undefined) => void,
	chainId?: SupportedChainId,
	applicationId?: string,
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
	const applicationRegistryContract = useQBContract('applications', chainId)
	const communicationContract = useQBContract('communication', chainId)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()
		// targetContractABI: ApplicationReviewRegistryAbi,
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = React.useState(false)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])


	useEffect(() => {
		if(data) {
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
		// // console.log('calling createGrant');

		async function validate() {
			setLoading(true)
			// // console.log('calling validate');
			try {
				setCurrentStep(0)

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				const detailsHash = (
					await uploadToIPFS(data.fields!.projectDetails[0].value)
				).hash
				// eslint-disable-next-line no-param-reassign
				data.fields!.projectDetails[0].value = detailsHash
				// console.log('Details hash: ', detailsHash)
				const {
					data: { ipfsHash },
				} = await validatorApi.validateGrantApplicationUpdate(data)
				if(!ipfsHash) {
					throw new Error('Error validating grant data')
				}

				setCurrentStep(1)

				// const txn = await applicationRegistryContract.updateApplicationMetadata(
				// 	applicationId!,
				// 	ipfsHash,
				// 	data.milestones!.length,
				// )
				// const txnData = await txn.wait()

				const response = await sendGaslessTransaction(
					biconomy,
					applicationRegistryContract,
					'updateApplicationMetadata',
					[applicationId!,
						ipfsHash,
						data.milestones!.length, ],
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
					setTransactionData(receipt)

					setCurrentStep(3)

					await subgraphClients[currentChainId].waitForBlock(receipt?.blockNumber)

					const encryptedEmail = sha256(email)
					const signedMessage = (await webwallet?.signMessage(email))?.toString()

					const commMethodArgs = [currentChainId, encryptedEmail, signedMessage]
					const commTx = await sendGaslessTransaction(
						biconomy,
						communicationContract,
						'createLink',
						commMethodArgs,
						COMMUNICATION_ADDRESS[currentChainId],
						biconomyWalletClient,
						scwAddress,
						webwallet,
						`${currentChainId}`,
						bicoDapps[currentChainId].webHookId,
						nonce
					)

					if(commTx) {
						const { receipt: commReceipt } = await getTransactionDetails(commTx, currentChainId.toString())
						const txHash = commReceipt.transactionHash

						logger.info({ txHash }, 'Communication tx hash')

						const ret = await axios.post(`${process.env.API_ENDPOINT}/mapping/create`, {
							id: scwAddress,
							chainId: currentChainId,
							sender: scwAddress,
							to: email,
							wallet: webwallet?.address,
							transactionHash: txHash,
						})

						if(ret.status === 200) {
							setCurrentStep(5)

							setTransactionData(receipt)
							await chargeGas(Number(workspace?.id), Number(txFee), chainId)
						}
					}

					// setCurrentStep(4)
					// await chargeGas(Number(workspace?.id), Number(txFee), chainId)
				}

				setCurrentStep(6)

				setLoading(false)
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

			if(!chainId) {
				return
			}

			if(!accountData || !accountData.address) {
				throw new Error('not connected to wallet')
			}

			if(!currentChainId) {
				if(switchNetwork && chainId) {
					logger.info('SWITCH NETWORK (use-resubmit-application.tsx 1): ', chainId)
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(chainId !== currentChainId) {
				if(switchNetwork && chainId) {
					logger.info('SWITCH NETWORK (use-resubmit-application.tsx 2): ', chainId)
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
		applicationId,
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
