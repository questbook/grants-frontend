import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { SupportedNetwork } from 'src/generated/graphql'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromSupportedNetwork, getSupportedValidatorNetworkFromChainId } from 'src/utils/validationUtils'
import { useAccount } from 'wagmi'
import ErrorToast from '../components/ui/toasts/errorToast'
import useWorkspaceRegistryContract from './contracts/useWorkspaceRegistryContract'
import useChainId from './utils/useChainId'

export default function useCreateWorkspace(
	data: any,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const [imageHash, setImageHash] = React.useState<string>()
	const { data: accountData } = useAccount()

	const chainId = useChainId()
	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi } = apiClients
	const workspaceRegistryContract = useWorkspaceRegistryContract(
		data?.network,
	)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	useEffect(() => {
		if(data) {
			setError(undefined)
		}
	}, [data])

	useEffect(() => {
		console.log(data?.network)
	}, [data])

	useEffect(() => {
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
			console.log('data.network', data.network)
			const {
				data: { ipfsHash },
			} = await validatorApi.validateWorkspaceCreate({
				title: data.name,
				bio: data.bio,
				about: data.about,
				logoIpfsHash: uploadedImageHash,
				creatorId: accountData?.address!,
				socials: [],
				partners: [],
				supportedNetworks: [getSupportedValidatorNetworkFromChainId(data.network)],
			})
			if(!ipfsHash) {
				throw new Error('Error validating grant data')
			}

			try {
				// eslint-disable-next-line max-len
				const createWorkspaceTransaction = await workspaceRegistryContract.createWorkspace(ipfsHash)
				const createWorkspaceTransactionData = await createWorkspaceTransaction.wait()

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
			if(!data) {
				return
			}

			if(transactionData) {
				return
			}

			if(!accountData || !accountData.address) {
				throw new Error('not connected to wallet')
			}

			if(!chainId) {
				throw new Error('not connected to valid network')
			}

			if(!validatorApi) {
				throw new Error('validatorApi or workspaceId is not defined')
			}

			if(
				!workspaceRegistryContract
        || workspaceRegistryContract.address
          === '0x0000000000000000000000000000000000000000'
        || !workspaceRegistryContract.signer
        || !workspaceRegistryContract.provider
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
		workspaceRegistryContract,
		validatorApi,
		chainId,
		accountData,
		data,
	])

	const networkChainId = getSupportedChainIdFromSupportedNetwork(`chain_${data?.network}` as SupportedNetwork)

	return [
		transactionData,
		getExplorerUrlForTxHash(networkChainId, transactionData?.transactionHash),
		imageHash,
		loading,
		error,
	]
}
