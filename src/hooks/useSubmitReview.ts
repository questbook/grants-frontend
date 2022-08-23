import { useContext, useEffect, useRef, useState } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { APPLICATION_REVIEW_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import { getKeyForApplication, getSecureChannelFromTxHash, useGetTxHashesOfGrantManagers } from 'src/utils/pii'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useProvider } from 'wagmi'
import ErrorToast from '../components/ui/toasts/errorToast'
import { FeedbackType } from '../components/your_grants/feedbackDrawer'
import {
	useGetInitialReviewedApplicationGrantsQuery,
} from '../generated/graphql'
import { delay } from '../utils/generics'
import useQBContract from './contracts/useQBContract'
import { useBiconomy } from './gasless/useBiconomy'
import { useQuestbookAccount } from './gasless/useQuestbookAccount'
import useChainId from './utils/useChainId'

export default function useSubmitReview(
	data: { items?: Array<FeedbackType> },
	setCurrentStep: (step?: number) => void,
	isPrivate: boolean,
	chainId?: SupportedChainId,
	workspaceId?: string,
	grantAddress?: string,
	applicationId?: string,
) {
	const [error, setError] = useState<string>()
	const [loading, setLoading] = useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = useState(false)
	const [transactionData, setTransactionData] = useState<any>()
	const { data: accountData, nonce } = useQuestbookAccount()
	const { webwallet } = useContext(WebwalletContext)!
	const { data: networkData, switchNetwork } = useNetwork()
	const { validatorApi, workspace, subgraphClients } = useContext(ApiClientsContext)!

	if(!chainId) {
		chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	}

	const { client } = subgraphClients[chainId]
	const provider = useProvider({ chainId })
	const { fetch: fetchTxHashes } = useGetTxHashesOfGrantManagers(grantAddress, chainId)

	const { fetchMore: fetchReviews } = useGetInitialReviewedApplicationGrantsQuery({ client })

	const applicationReviewContract = useQBContract('reviews', chainId)

	const toastRef = useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: chainId?.toString(),
	})

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
			setCurrentStep(0)

			try {

				if(!biconomyWalletClient || typeof biconomyWalletClient === 'string' || !scwAddress) {
					throw new Error('Zero wallet is not ready')
				}

				const jsonReview = JSON.stringify(data)
				const encryptedReview: { [key in string]: string } = {}
				let dataHash: string | undefined
				if(isPrivate) {
					const grantManagerTxMap = await fetchTxHashes()
					const managers = Object.keys(grantManagerTxMap)
					if(!managers.length) {
						throw new Error('No grant managers on the grant. Please contact support')
					}

					console.log(`encrypting review for ${managers.length} admins...`)

					// we go through all wallet addresses
					// and upload the private review for each
					await Promise.all(
						managers.map(
							async walletAddress => {
								const { encrypt } = await getSecureChannelFromTxHash(
									provider,
									webwallet!,
									grantManagerTxMap[walletAddress],
									getKeyForApplication(applicationId!)
								)
								const enc = await encrypt(jsonReview)
								console.log(`encrypted review for ${walletAddress}`)

								const encHash = (await uploadToIPFS(enc)).hash
								console.log(`uploaded encrypted review for ${walletAddress} to ${encHash}`)

								encryptedReview[walletAddress] = encHash
							}
						)
					)

					console.log('generated encrypted reviews')
				} else {
					dataHash = (await uploadToIPFS(jsonReview)).hash
				}

				const {
					data: { ipfsHash },
				} = await validatorApi.validateReviewSet({
					reviewer: accountData?.address!,
					publicReviewDataHash: dataHash,
					encryptedReview,
				})

				setCurrentStep(1)

				const response = await sendGaslessTransaction(
					biconomy,
					applicationReviewContract,
					'submitReview',
					[
						scwAddress,
						workspaceId || Number(workspace?.id).toString(),
						applicationId!,
						grantAddress!,
						ipfsHash
					],
					APPLICATION_REVIEW_REGISTRY_ADDRESS[currentChainId],
					biconomyWalletClient,
					scwAddress,
					webwallet,
					`${currentChainId}`,
					bicoDapps[currentChainId].webHookId,
					nonce,
				)

				setCurrentStep(2)

				if(response) {
					const { receipt, txFee } = await getTransactionDetails(response, currentChainId.toString())
					setTransactionData(receipt)
					await chargeGas(Number(workspaceId || Number(workspace?.id).toString()), Number(txFee))
				}

				setCurrentStep(3)

				const reviewerId = accountData!.address!

				let didIndex = false
				do {
					await delay(2000)
					const result = await fetchReviews({
						variables: {
							reviewerAddress: reviewerId.toLowerCase(),
							reviewerAddressStr: reviewerId,
							applicationsCount: 1,
						},
					})
					const grants = result.data.grantReviewerCounters.map(e => e.grant)
					grants.forEach(grant => {
						if(grant.id === grantAddress) {
							didIndex = true
						}
					})

				} while(!didIndex)

				setLoading(false)
				setCurrentStep(5)
			} catch(e) {
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
			) {
				return
			}

			validate()
		} catch(e) {
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
