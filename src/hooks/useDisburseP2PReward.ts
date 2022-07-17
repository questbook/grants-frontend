import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import SuccessToast from 'src/components/ui/toasts/successToast'
import useQBContract from 'src/hooks/contracts/useQBContract'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useAccount, useNetwork, useProvider } from 'wagmi'
import CustomToast from '../components/ui/toasts/customToast'
import ErrorToast from '../components/ui/toasts/errorToast'
import useERC20Contract from './contracts/useERC20Contract'
import useGrantContract from './contracts/useGrantContract'
import useChainId from './utils/useChainId'

export default function useDisburseReward(
	data: any,
	grantId: string | undefined,
	applicationId: string | undefined,
	applicantWalletAddress: string | undefined,
	milestoneIndex: number | undefined,
	rewardAssetAddress: string | undefined,
	submitClicked: boolean,
	setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData } = useAccount()
	const { data: networkData, switchNetwork } = useNetwork()
	const provider = useProvider()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	/** START: HEY YOU, WATCH OUT */
	/** DO NOT CHANGE THE FUCKING ORDER OF THESE TWO CONTRACT INSTANCES... */
	/** ...UNLESS YOU WANNA BREAK ALL HELL LOOSE */
	const rewardContract = useERC20Contract(rewardAssetAddress)
	const grantContract = useGrantContract(grantId)
	/** END */
	const workspaceRegistryContract = useQBContract('workspace', chainId)
	const toastRef = React.useRef<ToastId>()
	const toast = useToast()

	useEffect(() => {
		if(data) {
			setError(undefined)
			setLoading(false)
			setIncorrectNetwork(false)
		}
	}, [data])

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

	async function approvalEvent() {
		await rewardContract.once('Approval', (from, to, amount, eventDetail) => {
			if(from === accountData?.address && to === utils.getAddress(grantContract.address!)) {
				toastRef.current = toast({
					position: 'top',
					render: () => CustomToast({
						content: 'Waiting for the signature - please sign the transaction',
						close: () => {
							if(toastRef.current) {
								toast.close(toastRef.current)
							}
						},
					}),
				})
				workspaceRegistryContract.disburseRewardP2P(
					applicationId!,
					applicantWalletAddress!,
					milestoneIndex!,
					rewardAssetAddress!,
					data,
					workspace?.id!
				)
			}

			return eventDetail
		})
	}

	async function disburseRewardP2PEvent() {
		await grantContract.once('DisburseReward', (applicationIdEvent, milestoneId, asset, sender, amount, isP2P, eventDetail) => {
			// console.log('DisburseReward', accountData?.address, sender, BigNumber.from(applicationId).toNumber(), applicationIdEvent.toNumber())
			if(utils.getAddress(sender) === accountData?.address && BigNumber.from(applicationId).toNumber() === applicationIdEvent.toNumber()) {
				setTransactionData(eventDetail)
				setLoading(false)
				toastRef.current = toast({
					position: 'top',
					render: () => SuccessToast({
						heading: 'Success!',
						body: 'Reward has been disbursed',
						close: () => {
							if(toastRef.current) {
								toast.close(toastRef.current)
							}
						},
					}),
				})
			}

			return eventDetail
		})
	}

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
			// console.log('calling validate')
			try {

				let txn
				let updateTxn
				const account = await provider.getCode(accountData?.address!)
				if(account !== '0x') {

					// const getAllowance = utils.formatUnits(await rewardContract.allowance(accountData?.address!, grantContract.address), 'gwei')
					const getAllowance = await rewardContract.allowance(accountData?.address!, grantContract.address)
					if(parseInt(getAllowance.toString()) === 0) {
						// console.log('getAllowance 1', getAllowance, data)
						rewardContract.approve(grantContract.address, data)
						toastRef.current = toast({
							position: 'top',
							render: () => CustomToast({
								content: 'Waiting for approval to complete - please sign off',
								close: () => {
									if(toastRef.current) {
										toast.close(toastRef.current)
									}
								},
							}),
						})
						await Promise.all([approvalEvent(), disburseRewardP2PEvent()])
					} else if(parseInt(getAllowance.toString()) > parseInt(data)) {
						// console.log('Disburse', typeof(data), parseInt(getAllowance.toString()))
						toastRef.current = toast({
							position: 'top',
							render: () => CustomToast({
								content: 'Waiting for the signature - please sign the transaction',
								close: () => {
									if(toastRef.current) {
										toast.close(toastRef.current)
									}
								},
							}),
						})
						await Promise.all([workspaceRegistryContract.disburseRewardP2P(
							applicationId!,
							applicantWalletAddress!,
							milestoneIndex!,
							rewardAssetAddress!,
							data,
							workspace?.id!
						), disburseRewardP2PEvent()])

					} else {
						// console.log('getAllowance 2', typeof(data), (parseInt(getAllowance.toString()) + parseInt(data)).toString())
						await rewardContract.approve(grantContract.address, (parseInt(getAllowance.toString()) + parseInt(data)).toString())
						toastRef.current = toast({
							position: 'top',
							render: () => CustomToast({
								content: 'Waiting for approval to complete - please sign off',
								close: () => {
									if(toastRef.current) {
										toast.close(toastRef.current)
									}
								},
							}),
						})
						await Promise.all([approvalEvent(), disburseRewardP2PEvent()])
					}

				} else {
					console.log('EOA account', data)
					await Promise.all([rewardContract.approve(grantContract.address, data),
						workspaceRegistryContract.disburseRewardP2P(
							applicationId!,
							applicantWalletAddress!,
							milestoneIndex!,
							rewardAssetAddress!,
							data,
							workspace?.id!
						),
						disburseRewardP2PEvent()])
				}

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
			// console.log(data);
			// console.log(milestoneIndex);
			// console.log(applicationId);
			// console.log(Number.isNaN(milestoneIndex));
			if(Number.isNaN(milestoneIndex)) {
				return
			}

			if(!data) {
				return
			}

			if(!applicationId) {
				return
			}

			if(transactionData) {
				return
			}

			if(!rewardAssetAddress) {
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

			// console.log(5);
			if(
				!grantContract
        || grantContract.address
          === '0x0000000000000000000000000000000000000000'
        || !grantContract.signer
        || !grantContract.provider
			) {
				return
			}

			if(
				!rewardContract
        || rewardContract.address
          === '0x0000000000000000000000000000000000000000'
        || !rewardContract.signer
        || !rewardContract.provider
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
		rewardContract,
		grantContract,
		validatorApi,
		workspace,
		accountData,
		networkData,
		currentChainId,
		applicationId,
		milestoneIndex,
		rewardAssetAddress,
		data,
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
