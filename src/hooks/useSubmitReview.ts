import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { SupportedChainId } from 'src/constants/chains'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import useEncryption from 'src/hooks/utils/useEncryption'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import ErrorToast from '../components/ui/toasts/errorToast'
import useQBContract from './contracts/useQBContract'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'

export default function useSubmitReview(
	data: any,
	isPrivate: boolean,
	chainId?: SupportedChainId,
	workspaceId?: string,
	grantAddress?: string,
	applicationId?: string,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()
	const { encryptMessage } = useEncryption()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients

	if(!chainId) {
		// eslint-disable-next-line no-param-reassign
		chainId = getSupportedChainIdFromWorkspace(workspace)
	}

	const applicationReviewContract = useQBContract('reviews', chainId)

	const toastRef = React.useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()

	useEffect(() => {
		console.log('data', data)
		if(data) {
			setError(undefined)
			setIncorrectNetwork(false)
		}
	}, [data])

	useEffect(() => {
		if(incorrectNetwork) {
			setIncorrectNetwork(false)
		}

	}, [applicationReviewContract])

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
				// console.log(workspaceId || Number(workspace?.id).toString());
				// console.log('ipfsHash', ipfsHash);
				// console.log(
				//   WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
				//   APPLICATION_REGISTRY_ADDRESS[currentChainId!],
				// );

				const encryptedReview = {} as any
				if(isPrivate) {
					console.log(accountData)
					const yourPublicKey = workspace?.members.find(
						(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
					)?.publicKey
					const encryptedData = encryptMessage(JSON.stringify(data), yourPublicKey!)
					const encryptedHash = (await uploadToIPFS(encryptedData)).hash
					encryptedReview[accountData!.address!] = encryptedHash

					console.log(workspace)
					workspace?.members.filter(
						(m) => (m.accessLevel === 'admin' || m.accessLevel === 'owner') && (m.publicKey && m.publicKey?.length > 0),
					).map((m) => ({ key: m.publicKey, address: m.actorId }))
						.forEach(async({ key, address }) => {
							const encryptedAdminData = encryptMessage(JSON.stringify(data), key!)
							const encryptedAdminHash = (await uploadToIPFS(encryptedAdminData)).hash
							encryptedReview[address] = encryptedAdminHash
						})

					console.log('encryptedReview', encryptedReview)
				}

				const dataHash = (await uploadToIPFS(JSON.stringify(data))).hash

				const {
					data: { ipfsHash },
				} = await validatorApi.validateReviewSet({
					reviewer: accountData?.address!,
					publicReviewDataHash: isPrivate ? '' : dataHash,
					encryptedReview,
				})

				console.log('ipfsHash', ipfsHash)

				if(!ipfsHash) {
					throw new Error('Error validating review data')
				}

				const createGrantTransaction = await applicationReviewContract.submitReview(
					workspaceId || Number(workspace?.id).toString(),
					applicationId!,
					grantAddress!,
					ipfsHash,
				)
				const createGrantTransactionData = await createGrantTransaction.wait()

				setTransactionData(createGrantTransactionData)
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

			if(!grantAddress) {
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
				!applicationReviewContract
        || applicationReviewContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationReviewContract.signer
        || !applicationReviewContract.provider
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
		applicationReviewContract,
		validatorApi,
		workspace,
		accountData,
		networkData,
		currentChainId,
		chainId,
		workspaceId,
		data,
		grantAddress,
		applicationId,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(chainId || getSupportedChainIdFromWorkspace(workspace), transactionData?.transactionHash),
		loading,
		error,
	]
}
