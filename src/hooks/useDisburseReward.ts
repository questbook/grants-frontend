import React, { useContext, useEffect } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { BigNumber, utils } from 'ethers'
import { ApiClientsContext } from 'pages/_app'
import CustomToast from 'src/components/ui/toasts/customToast'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import SuccessToast from 'src/components/ui/toasts/successToast'
import useGrantContract from 'src/hooks/contracts/useGrantContract'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import getErrorMessage from 'src/utils/errorUtils'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'

export default function useDisburseReward(
	data: any,
	grantId: string | undefined,
	applicationId: string | undefined,
	milestoneIndex: number | undefined,
	rewardAssetAddress: string | undefined,
	submitClicked: boolean,
	setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
	const [error, setError] = React.useState<string>()
	const [loading, setLoading] = React.useState(false)
	const [incorrectNetwork, setIncorrectNetwork] = React.useState(false)
	const [transactionData, setTransactionData] = React.useState<any>()
	const { data: accountData } = useQuestbookAccount()
	const { data: networkData, switchNetwork } = useNetwork()

	const apiClients = useContext(ApiClientsContext)!
	const { validatorApi, workspace } = apiClients
	const currentChainId = useChainId()
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const grantContract = useGrantContract(grantId)
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

	async function disburseRewardEvent() {
		// // console.log('Got to disburse event')
		grantContract.once('DisburseReward', (applicationIdEvent, milestoneId, asset, sender, amount, isP2P, eventDetail) => {
			// console.log('DisburseReward', eventDetail)
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
			try {
				// // console.log('Got to validate')
				grantContract.disburseReward(
					applicationId!,
					milestoneIndex!,
					rewardAssetAddress!,
					data,
				)
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

				disburseRewardEvent()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

			// // console.log(66);
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
