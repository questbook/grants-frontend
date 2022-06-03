import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import {
	APPLICATION_REGISTRY_ADDRESS,
	WORKSPACE_REGISTRY_ADDRESS,
} from 'src/constants/addresses'
import { CHAIN_INFO } from 'src/constants/chains'
import { SupportedChainId } from 'src/constants/chains'
import getErrorMessage from 'src/utils/errorUtils'
import { parseAmount } from 'src/utils/formattingUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'
import {
	getSupportedChainIdFromWorkspace,
	getSupportedValidatorNetworkFromChainId,
} from 'src/utils/validationUtils'
import { useAccount, useNetwork } from 'wagmi'
import ErrorToast from '../components/ui/toasts/errorToast'
import strings from '../constants/strings.json'
import useGrantFactoryContract from './contracts/useGrantFactoryContract'
import useChainId from './utils/useChainId'

export default function useCreateGrant(
	data: any,
	chainId?: SupportedChainId,
	workspaceId?: string,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData } = useAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients
	const grantContract = useGrantFactoryContract(
		chainId ?? getSupportedChainIdFromWorkspace(workspace),
	)
	if(!chainId) {
		// eslint-disable-next-line no-param-reassign
		chainId = getSupportedChainIdFromWorkspace(workspace)
	}

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

	}, [grantContract])

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

		console.log('YEEES')

		async function validate() {
			setLoading(true)
			console.log('calling validate')
			try {
				const detailsHash = (await uploadToIPFS(data.details)).hash
				let reward
				if(data.rewardToken.address === '') {
					reward = {
						committed: parseAmount(data.reward, data.rewardCurrencyAddress),
						asset: data.rewardCurrencyAddress,
					}
				} else {
					console.log('Reward before parsing', data.reward, data.rewardToken.decimal)
					reward = {
						committed: parseAmount(data.reward, undefined, data.rewardToken.decimal),
						asset: data.rewardCurrencyAddress,
						token: data.rewardToken,
					}
					console.log('Reward after parsing', reward)
				}

				const {
					data: { ipfsHash },
				} = await validatorApi.validateGrantCreate({
					title: data.title,
					summary: data.summary,
					details: detailsHash,
					deadline: data.date,
					reward,
					creatorId: accountData?.address!,
					workspaceId: getSupportedValidatorNetworkFromChainId(
            (chainId ?? getSupportedChainIdFromWorkspace(workspace))!,
					),
					fields: data.fields,
					grantManagers: data.grantManagers.length ? data.grantManagers : [accountData!.address],
				})

				console.log('ipfsHash', ipfsHash)

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

				console.log('rubricHash', rubricHash)

				// console.log(workspaceId ?? Number(workspace?.id).toString());
				// console.log('ipfsHash', ipfsHash);
				// console.log(
				//   WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
				//   APPLICATION_REGISTRY_ADDRESS[currentChainId!],
				// );

				const createGrantTransaction = await grantContract.createGrant(
					workspaceId ?? Number(workspace?.id).toString(),
					ipfsHash,
					rubricHash,
					WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
					APPLICATION_REGISTRY_ADDRESS[currentChainId!],
				)
				const createGrantTransactionData = await createGrantTransaction.wait()

				const CACHE_KEY = strings.cache.create_grant
				const cacheKey = `${chainId ?? getSupportedChainIdFromWorkspace(workspace)}-${CACHE_KEY}-${workspace?.id}`
				console.log('Deleting key: ', cacheKey)
				if(typeof window !== 'undefined') {
					localStorage.removeItem(cacheKey)
				}

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
					console.log(' (CREATE GRANT HOOK) Switch Network (!currentChainId): ', workspace, chainId)
					switchNetwork(chainId)
				}

				setIncorrectNetwork(true)
				setLoading(false)
				return
			}

			if(chainId !== currentChainId) {
				if(switchNetwork && chainId) {
					console.log(' (CREATE GRANT HOOK) Switch Network: (chainId !== currentChainId)', workspace, chainId)
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
				!grantContract
        || grantContract.address
          === '0x0000000000000000000000000000000000000000'
        || !grantContract.signer
        || !grantContract.provider
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
		grantContract,
		validatorApi,
		workspace,
		accountData,
		networkData,
		currentChainId,
		chainId,
		workspaceId,
		data,
		incorrectNetwork,
	])

	return [
		transactionData,
		chainId ?? getSupportedChainIdFromWorkspace(workspace)
			? `${CHAIN_INFO[chainId ?? getSupportedChainIdFromWorkspace(workspace)!]
				.explorer.transactionHash}${transactionData?.transactionHash}`
			: '',
		loading,
		error,
	]
}
