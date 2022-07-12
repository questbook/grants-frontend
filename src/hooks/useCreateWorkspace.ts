import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import { GitHubTokenContext, WebwalletContext } from 'pages/_app'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import { SupportedNetwork } from 'src/generated/graphql'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { apiKey, getEventData, getTransactionReceipt, sendGaslessTransaction, webHookId } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedValidatorNetworkFromChainId } from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useWorkspaceRegistryContract from './contracts/useWorkspaceRegistryContract'
import useChainId from './utils/useChainId'

export default function useCreateWorkspace(
	data: any
) {

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!
	const { isLoggedIn, setIsLoggedIn } = useContext(GitHubTokenContext)!

	const [
		biconomy,
		biconomyWalletClient,
		scwAddress
	] = useBiconomy({
		apiKey: apiKey,
		targetContractABI: WorkspaceRegistryAbi
	})

	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const [imageHash, setImageHash] = React.useState<string>()
	const { data: accountData, nonce } = useQuestbookAccount()

	const chainId = useChainId()
	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi } = apiClients
	const workspaceRegistryContract = useWorkspaceRegistryContract(
		data?.network,
	)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	const networkChainId = getSupportedChainIdFromSupportedNetwork(`chain_${data?.network}` as SupportedNetwork)

	useEffect(() => {
		if(data) {
			setError(undefined)
		}
	}, [data])

	useEffect(() => {
		console.log(data?.network)
	}, [data])

	useEffect(() => {
		console.log('THIS IS ERROR', error)
		console.log('THIS IS LOADING', loading)
		if(error) {
			return
		}

		if(loading) {
			return
		}
		// console.log('calling createGrant');

		async function validate() {
			setLoading(true)
			// console.log('calling validate');

			const uploadedImageHash = (await uploadToIPFS(data.image)).hash
			// console.log('Network: ', data.network);
			// console.log('Network Return: ', getSupportedValidatorNetworkFromChainId(data.network));
			console.log('THIS IS ADDRESS', accountData.address)
			const {
				data: { ipfsHash },
			} = await validatorApi.validateWorkspaceCreate({
				title: data.name,
				about: data.description,
				logoIpfsHash: uploadedImageHash,
				creatorId: accountData?.address!,
				socials: [],
				supportedNetworks: [getSupportedValidatorNetworkFromChainId(data.network)],
			})
			if(!ipfsHash) {
				throw new Error('Error validating grant data')
			}

			try {
				// eslint-disable-next-line max-len
				console.log('Workspace registry address', WORKSPACE_REGISTRY_ADDRESS[networkChainId])
				// let transactionHash: string | undefined | boolean

				const targetContractObject = new ethers.Contract(
					WORKSPACE_REGISTRY_ADDRESS[networkChainId],
					WorkspaceRegistryAbi,
					webwallet
				)
				console.log('ENTERING')
				console.log(networkChainId, scwAddress, webwallet, nonce, webHookId);
				const transactionHash = await sendGaslessTransaction(biconomy, targetContractObject, 'createWorkspace', [ipfsHash, new Uint8Array(32), 0],
					WORKSPACE_REGISTRY_ADDRESS[networkChainId], biconomyWalletClient,
					scwAddress, webwallet, `${networkChainId}`, webHookId, nonce)

				console.log(transactionHash)
				const receipt = await getTransactionReceipt(transactionHash)
 
				console.log('THIS IS RECEIPT', receipt)

				const createWorkspaceTransactionData = await getEventData(receipt, 'WorkspaceCreated', WorkspaceRegistryAbi)

				if(createWorkspaceTransactionData) {
					console.log('THIS IS EVENT', createWorkspaceTransactionData.args)
				}

				// const createWorkspaceTransaction = await workspaceRegistryContract.createWorkspace(ipfsHash)
				// const createWorkspaceTransactionData = await createWorkspaceTransaction.wait()

				setTransactionData(createWorkspaceTransactionData)
				setImageHash(uploadedImageHash)
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
			console.log(data)
			if(!data) {
				return
			}

			console.log(transactionData)
			if(transactionData) {
				return
			}

			console.log(accountData, accountData.address)

			if(!accountData || !accountData.address) {
				throw new Error('not connected to wallet')
			}

			console.log(chainId)
			if(!chainId) {
				throw new Error('not connected to valid network')
			}

			console.log(validatorApi)
			if(!validatorApi) {
				throw new Error('validatorApi or workspaceId is not defined')
			}

			console.log(workspaceRegistryContract)
			if(
				!workspaceRegistryContract
        || workspaceRegistryContract.address
          === '0x0000000000000000000000000000000000000000'
			// || !workspaceRegistryContract.signer
			// || !workspaceRegistryContract.provider
			) {
				console.log('ERROR HERE')
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
		workspaceRegistryContract,
		validatorApi,
		chainId,
		accountData,
		data,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(networkChainId, transactionData?.transactionHash),
		imageHash,
		loading,
		error,
	]
}
