import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import CustomToast from 'src/components/ui/toasts/customToast'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import SuccessToast from 'src/components/ui/toasts/successToast'
import useERC20Contract from 'src/hooks/contracts/useERC20Contract'
import useGrantContract from 'src/hooks/contracts/useGrantContract'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import { useNetwork, useProvider } from 'wagmi'

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
	const { data: accountData, nonce } = useQuestbookAccount()
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
		const filter = rewardContract.filters.Approval(accountData?.address, utils.getAddress(workspaceRegistryContract.address!))
		rewardContract.on(filter, (from, to, amount, eventDetail) => {
			if(from === accountData?.address && to === utils.getAddress(workspaceRegistryContract.address!)) {
				toastRef.current = toast({
					position: 'top',
					render: () => CustomToast({
						content: 'Transaction for sending funds has been initiated on Gnosis. Please open Wallet Connect app on Gnosis ',
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
		// console.log('Got to disburse event')
		const filter = workspaceRegistryContract.filters.DisburseReward(BigNumber.from(applicationId).toNumber())
		workspaceRegistryContract.on(filter, (applicationIdEvent, milestoneId, asset, sender, amount, isP2P, eventDetail) => {
			// console.log('DisburseReward', eventDetail)
			if(utils.getAddress(sender) === accountData?.address && BigNumber.from(applicationId).toNumber() === applicationIdEvent.toNumber()) {
				setTransactionData(eventDetail)
				setLoading(false)
				toastRef.current = toast({
					position: 'top',
					render: () => SuccessToast({
						heading: 'Success!',
						body: 'Yay! The grant reward has been disbursed to the applicant',
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
			// // console.log('calling validate')
			try {

				const account = await provider.getCode(accountData?.address!)
				if(account !== '0x') {

					// console.log('account is not 0x')
					const getAllowance = await rewardContract.allowance(accountData?.address!, workspaceRegistryContract.address)
					if(parseInt(getAllowance.toString()) === 0) {
						// console.log('getAllowance 1', getAllowance, data)
						rewardContract.approve(workspaceRegistryContract.address, data)
						toastRef.current = toast({
							position: 'top',
							render: () => CustomToast({
								content: 'Approve transaction has been initiated on Gnosis. Please open Wallet Connect app on Gnosis ',
								close: () => {
									if(toastRef.current) {
										toast.close(toastRef.current)
									}
								},
							}),
						})
						Promise.all([approvalEvent(), disburseRewardP2PEvent()])
					} else if(parseInt(getAllowance.toString()) > parseInt(data)) {
						// console.log('Disburse', typeof (data), parseInt(getAllowance.toString()))
						toastRef.current = toast({
							position: 'top',
							render: () => CustomToast({
								content: 'Transaction for sending funds has been initiated on Gnosis. Please open Wallet Connect app on Gnosis ',
								close: () => {
									if(toastRef.current) {
										toast.close(toastRef.current)
									}
								},
							}),
						})
						Promise.all([workspaceRegistryContract.disburseRewardP2P(
							applicationId!,
							applicantWalletAddress!,
							milestoneIndex!,
							rewardAssetAddress!,
							data,
							workspace?.id!
						), disburseRewardP2PEvent()])

					} else {
						// console.log('getAllowance 2', typeof (data), (parseInt(getAllowance.toString()) + parseInt(data)).toString())
						rewardContract.approve(workspaceRegistryContract.address, (parseInt(getAllowance.toString()) + parseInt(data)).toString())
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
						Promise.all([approvalEvent(), disburseRewardP2PEvent()])
					}

				} else {
					// console.log('EOA account', data)
					const tx = await rewardContract.approve(workspaceRegistryContract.address, data)
					await tx.wait()
					const transDetail = await workspaceRegistryContract.disburseRewardP2P(
						applicationId!,
						applicantWalletAddress!,
						milestoneIndex!,
						rewardAssetAddress!,
						data,
						workspace?.id!
					)
					// disburseRewardP2PEvent()
					const transDetailMined = transDetail.wait()
					setTransactionData(transDetailMined)
					setLoading(false)
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
			// // console.log(data);
			// // console.log(milestoneIndex);
			// // console.log(applicationId);
			// // console.log(Number.isNaN(milestoneIndex));
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

			// // console.log(5);
			if(
				!grantContract
				|| workspaceRegistryContract.address
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
