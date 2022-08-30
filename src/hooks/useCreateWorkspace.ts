import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import { WebwalletContext } from 'pages/_app'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses'
import WorkspaceRegistryAbi from 'src/contracts/abi/WorkspaceRegistryAbi.json'
import { SupportedNetwork } from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { addAuthorizedOwner, bicoDapps, chargeGas, getEventData, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedValidatorNetworkFromChainId } from 'src/utils/validationUtils'

export default function useCreateWorkspace(
	data: any
) {

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!


	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const [imageHash, setImageHash] = React.useState<string>()
	const { data: accountData, nonce } = useQuestbookAccount()

	const chainId = useChainId()
	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi } = apiClients
	const workspaceRegistryContract = useQBContract('workspace', data?.network)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	const networkChainId = getSupportedChainIdFromSupportedNetwork(`chain_${data?.network}` as SupportedNetwork)

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: networkChainId.toString()
		// targetContractABI: WorkspaceRegistryAbi,
	})
	useEffect(() => {
		if(data) {
			setError(undefined)
		}
	}, [data])

	useEffect(() => {
		// console.log(data?.network)
	}, [data])

	useEffect(() => {
		// console.log('THIS IS ERROR', error)
		// console.log('THIS IS LOADING', loading)
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

			const uploadedImageHash = (await uploadToIPFS(data.image)).hash
			// // console.log('Network: ', data.network);
			// // console.log('Network Return: ', getSupportedValidatorNetworkFromChainId(data.network));
			// console.log('THIS IS ADDRESS', accountData?.address)
			const {
				data: { ipfsHash },
			} = await validatorApi.validateWorkspaceCreate({
				title: data.name,
				bio: data.bio,
				about: data.about,
				logoIpfsHash: uploadedImageHash,
				creatorId: accountData?.address!,
				creatorPublicKey: webwallet?.publicKey,
				socials: [],
				partners: [],
				supportedNetworks: [getSupportedValidatorNetworkFromChainId(data.network)],
			})
			if(!ipfsHash) {
				throw new Error('Error validating grant data')
			}

			try {

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				// eslint-disable-next-line max-len
				// console.log('Workspace registry address', WORKSPACE_REGISTRY_ADDRESS[networkChainId])
				// let transactionHash: string | undefined | boolean

				const targetContractObject = new ethers.Contract(
					WORKSPACE_REGISTRY_ADDRESS[networkChainId],
					WorkspaceRegistryAbi,
					webwallet
				)
				// console.log('ENTERING')
				// console.log(networkChainId, scwAddress, webwallet, nonce, webHookId)
				const response = await sendGaslessTransaction(biconomy, targetContractObject, 'createWorkspace', [ipfsHash, new Uint8Array(32), 0],
					WORKSPACE_REGISTRY_ADDRESS[networkChainId], biconomyWalletClient,
					scwAddress, webwallet, `${networkChainId}`, bicoDapps[networkChainId.toString()].webHookId, nonce)

				if(!response) {
					return
				}

				const { txFee, receipt } = await getTransactionDetails(response, networkChainId.toString())

				const createWorkspaceTransactionData = await getEventData(receipt, 'WorkspaceCreated', WorkspaceRegistryAbi)

				if(createWorkspaceTransactionData) {

					const workspace_id = Number(createWorkspaceTransactionData.args[0].toBigInt())
					// console.log('workspace_id', workspace_id)

					await addAuthorizedOwner(workspace_id, webwallet?.address!, scwAddress, networkChainId.toString(),
						'this is the safe addres - to be updated in the new flow')
					// console.log('fdsao')

					await chargeGas(Number(workspace_id), Number(txFee))

				}

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
			// console.log(data)
			if(!data) {
				return
			}

			// console.log(transactionData)
			if(transactionData) {
				return
			}

			// console.log(accountData, accountData?.address)

			if(!accountData || !accountData.address) {
				throw new Error('not connected to wallet')
			}

			// console.log(chainId)
			if(!chainId) {
				throw new Error('not connected to valid network')
			}

			// console.log(validatorApi)
			if(!validatorApi) {
				throw new Error('validatorApi or workspaceId is not defined')
			}

			// console.log(workspaceRegistryContract)
			if(
				!workspaceRegistryContract
				|| workspaceRegistryContract.address
				=== '0x0000000000000000000000000000000000000000'
			) {
				// console.log('ERROR HERE')
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
