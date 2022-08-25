import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash, parseAmount } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useQBContract from './contracts/useQBContract'
import useChainId from './utils/useChainId'

export default function useEditGrant(
	data: any,
	grantId?: string,
) {
	console.log(grantId)
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
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	const applicationReviewContract = useQBContract('reviews', chainId)
	const grantFactoryContract = useQBContract('grantFactory', chainId)
	const workspaceRegistryContract = useQBContract('workspace', chainId)

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()!
		// targetContractABI: ApplicationReviewRegistryAbi,
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
		console.count("I'm inside")
	}, [])

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

	}, [grantFactoryContract])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [applicationReviewContract])

	useEffect(() => {
		console.log('RErERERERE', incorrectNetwork, error, loading)
		if(incorrectNetwork) {
			return
		}

		if(error) {
			return
		}

		if(loading) {
			return
		}
		// console.log('calling editGrant');

		async function validate() {
			setLoading(true)
			console.log('calling validate', data)
			try {
				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				const detailsHash = (await uploadToIPFS(data.details)).hash
				let reward
				if(data.rewardToken.address === '') {
					reward = {
						committed: parseAmount(data.reward, data.rewardCurrencyAddress),
						asset: data.rewardCurrencyAddress,
					}
				} else {
					reward = {
						committed: parseAmount(data.reward, data.rewardToken.decimal),
						asset: data.rewardCurrencyAddress,
						token: data.rewardToken,
					}
				}

				const {
					data: { ipfsHash },
				} = await validatorApi.validateGrantUpdate({
					title: data.title,
					summary: data.summary,
					details: detailsHash,
					deadline: data.date,
					reward,
					fields: data.fields,
				})
				if(!ipfsHash) {
					throw new Error('Error validating grant data')
				}

				let rubricHash = ''
				if(data.rubric) {
					const {
						data: { ipfsHash: auxRubricHash },
					} = await validatorApi.validateRubricSet({
						rubric: data.rubric,
					})

					if(!auxRubricHash) {
						throw new Error('Error validating rubric data')
					}

					rubricHash = auxRubricHash
				}

				// console.log('rubricHash', rubricHash);

				// const rubricTxn = await applicationReviewContract.setRubrics(
				// 	workspace!.id,
				// 	grantId!,
				// 	rubricHash,
				// )

				// const createGrantTransaction = await grantContract.updateGrant(
				// 	ipfsHash,
				// )
				// await rubricTxn.wait()
				// const createGrantTransactionData = await createGrantTransaction.wait()
				console.log('rubric hash', grantId, grantFactoryContract.address)
				const rubricTxn = await sendGaslessTransaction(
					biconomy,
					applicationReviewContract,
					'setRubrics',
					[workspace!.id,
						grantId!,
						rubricHash, ],
					applicationReviewContract.address,
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${currentChainId}`,
					bicoDapps[currentChainId].webHookId,
					nonce
				)

				if(rubricTxn) {
					const { txFee } = await getTransactionDetails(rubricTxn, currentChainId.toString())
					await chargeGas(Number(workspace?.id), Number(txFee))
				} else {
					throw new Error("Transaction didn't go through")
				}

				console.log('YYTTE', ipfsHash)

				const createGrantTransaction = await sendGaslessTransaction(
					biconomy,
					grantFactoryContract,
					'updateGrant',
					[grantId, workspace?.id, workspaceRegistryContract.address, ipfsHash, ],
					grantFactoryContract.address,
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${currentChainId}`,
					bicoDapps[currentChainId].webHookId,
					nonce
				)

				if(createGrantTransaction) {
					const { receipt, txFee } = await getTransactionDetails(createGrantTransaction, currentChainId.toString())
					setTransactionData(receipt)
					await chargeGas(Number(workspace?.id), Number(txFee))
				}

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
			console.log('ttttt', data, transactionData, accountData, workspace, currentChainId, chainId)
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
				!grantFactoryContract
        || grantFactoryContract.address
          === '0x0000000000000000000000000000000000000000'
			) {
				return
			}

			if(
				!applicationReviewContract
        || applicationReviewContract.address
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
		data,
		chainId,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
		isBiconomyInitialised,
		error,
	]
}
