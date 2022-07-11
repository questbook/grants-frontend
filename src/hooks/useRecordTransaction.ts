import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useAccount, useNetwork } from 'wagmi'
import ErrorToast from '../components/ui/toasts/errorToast'
import useGrantContract from './contracts/useGrantContract'
import useChainId from './utils/useChainId'

export default function useRecordTransaction(
	grantId: string | undefined,
	applicationId: string | undefined,
	milestoneIndex: number | undefined,
	transactionHash: string | undefined,
	amount: BigNumber,
	submitClicked: boolean,
	setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData } = useAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const grantContract = useGrantContract(grantId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	useEffect(() => {
		if(transactionHash) {
			setError(undefined)
			setLoading(false)
			setIncorrectNetwork(false)
		}
	}, [transactionHash])

	useEffect(() => {
		if(submitClicked) {
			setIncorrectNetwork(false)
			setSubmitClicked(false)
		}
	}, [setSubmitClicked, submitClicked])

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

		async function validate() {
			setLoading(true)
			try {
				console.log('params', applicationId,
					milestoneIndex,
					transactionHash,
					amount,)
				console.log('calling contract method')
				const updateTxn = await grantContract.recordTransaction(
					1,
					0,
				 	transactionHash,
					20,
				)
				console.log('updateTxn', updateTxn)
				const updateTxnData = await updateTxn.wait()

				setTransactionData(updateTxnData)
				setLoading(false)
			} catch(e: any) {
				console.log('contract error', e)
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
			// console.log(data);
			// console.log(milestoneIndex);
			// console.log(applicationId);
			// console.log(Number.isNaN(milestoneIndex));
			if(Number.isNaN(milestoneIndex)) {
				return
			}

			if(!applicationId) {
				return
			}

			if(transactionData) {
				return
			}

			if(!transactionHash) {
				return
			}

			// console.log(66);
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
			console.log('error', e)
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
		applicationId,
		milestoneIndex,
		transactionHash,
		chainId,
		incorrectNetwork,
	])

	return [
		transactionData,
		getExplorerUrlForTxHash(currentChainId, transactionData?.transactionHash),
		loading,
		error,
	]
}
