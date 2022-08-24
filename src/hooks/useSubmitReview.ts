import { useContext, useEffect, useRef, useState } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { APPLICATION_REVIEW_REGISTRY_ADDRESS } from 'src/constants/addresses'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { useGenerateReviewData } from 'src/utils/reviews'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
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
	const { data: networkData, switchNetwork } = useNetwork()

	const { validatorApi, workspace, subgraphClients } = useContext(ApiClientsContext)!

	if(!chainId) {
		// eslint-disable-next-line no-param-reassign
		chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId
	}

	const { client } = subgraphClients[chainId!]

	const { generateReviewData } = useGenerateReviewData({
		grantId: grantAddress!,
		applicationId: applicationId!,
		isPrivate,
		chainId,
	})

	const { fetchMore: fetchReviews } = useGetInitialReviewedApplicationGrantsQuery({ client })

	const applicationReviewContract = useQBContract('reviews', chainId)

	const toastRef = useRef<ToastId>()
	const toast = useToast()
	const currentChainId = useChainId()

	const { webwallet } = useContext(WebwalletContext)!

	if(!chainId) {
		chainId = getSupportedChainIdFromWorkspace(workspace)
	}

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString(),
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	useEffect(() => {
		const isBiconomyLoading = localStorage.getItem('isBiconomyLoading') === 'true'
		console.log('rree', isBiconomyLoading, biconomyLoading)
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised])


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

				const { ipfsHash } = await generateReviewData({
					items: data.items!
				})

				if(!ipfsHash) {
					throw new Error('Error validating review data')
				}

				// const createGrantTransaction = await applicationReviewContract.submitReview(
				// 	workspaceId || Number(workspace?.id).toString(),
				// 	applicationId!,
				// 	grantAddress!,
				// 	ipfsHash,
				// )
				// const createGrantTransactionData = await createGrantTransaction.wait()

				setCurrentStep(1)

				const response = await sendGaslessTransaction(
					biconomy,
					applicationReviewContract,
					'submitReview',
					[	scwAddress,
						workspaceId || Number(workspace?.id).toString(),
						applicationId!,
						grantAddress!,
						ipfsHash],
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
		isBiconomyInitialised,
		error,
	]
}
