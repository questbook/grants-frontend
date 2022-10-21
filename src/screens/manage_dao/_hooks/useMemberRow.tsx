import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ToastId, useToast } from '@chakra-ui/react'
import { WorkspaceMemberUpdate } from '@questbook/service-validator-client'
import { ethers } from 'ethers'
import router from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { WorkspaceMember } from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import logger from 'src/libraries/logger'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import ErrorToast from 'src/v2/components/Toasts/errorToast'

function useMemberRow(member: Partial<WorkspaceMember>) {
	const { webwallet } = useContext(WebwalletContext)!
	const { validatorApi, subgraphClients, workspace } = useContext(ApiClientsContext)!
	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
	}, [workspace])

	const { nonce } = useQuestbookAccount()
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()!
		// targetContractABI: GrantFactoryAbi,
	})

	const [isHovering, setIsHovering] = useState(false)
	const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState<boolean>(false)
	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState<boolean>(false)
	const [transactionHash, setTransactionHash] = useState<string>('')
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [type, setType] = useState<'edit' | 'pub-key'>('edit')

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])

	const workspaceRegistryContract = useQBContract('workspace', chainId)

	const onSaveClick = async(name?: string) => {
		logger.info({ name, chainId: getSupportedChainIdFromWorkspace(workspace) }, 'WorkspaceMember name')

		try {
			setNetworkTransactionModalStep(0)
			if(!webwallet) {
				throw new Error('webwallet not connected')
			}

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				throw new Error('Biconomy Wallet not initialised properly')
			}

			if(!workspace?.id) {
				throw new Error('Unable to find workspace id')
			}

			const {
				data: { ipfsHash }
			} = await validatorApi.validateWorkspaceMemberUpdate({
				fullName: name,
				// profilePictureIpfsHash: member?.profilePictureIpfsHash,
				publicKey: webwallet.publicKey
			} as WorkspaceMemberUpdate)

			if(!ipfsHash) {
				throw new Error('Failed to upload data to IPFS')
			}

			setNetworkTransactionModalStep(1)

			const methodArgs = [
				workspace.id,
				[member.actorId],
				[member.accessLevel === 'reviewer' ? 1 : 0],
				[true],
				[ipfsHash]
			]

			const response = await sendGaslessTransaction(
				biconomy,
				workspaceRegistryContract,
				'updateWorkspaceMembers',
				methodArgs,
				workspaceRegistryContract.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				`${chainId}`,
				bicoDapps[chainId].webHookId,
				nonce
			)

			if(!response) {
				throw new Error('Some error occured on Biconomy side')
			}

			setNetworkTransactionModalStep(2)

			const { txFee, receipt } = await getTransactionDetails(response, chainId.toString())
			setTransactionHash(receipt.transactionHash)
			await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

			setNetworkTransactionModalStep(3)

			await chargeGas(Number(workspace.id), Number(txFee))
			setNetworkTransactionModalStep(4)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setNetworkTransactionModalStep(undefined)
			const message = getErrorMessage(e)
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

	const canAccessEncryptedData = () => {
		try {
			logger.info({ actorId: member?.actorId, pubKey: member?.publicKey }, 'WorkspaceMember')
			if(!member?.publicKey) {
				return false
			}

			ethers.utils.computeAddress(member.publicKey)
			return true
		} catch(e) {
			return false
		}
	}

	const getEncryptedTooltipLabel = () => {
		if(canAccessEncryptedData()) {
			return 'Can access encrypted data fields in applications and private reviews'
		} else {
			if(member?.actorId === scwAddress?.toLowerCase()) {
				return 'Cannot access any encrypted data. This might cause reviewers to be unable to submit private reviews. Click on this to fix it.'
			} else {
				return 'Cannot access any encrypted data. This might cause reviewers to be unable to submit private reviews.'
			}
		}
	}

	const onNetworkModalClose = () => {
		setNetworkTransactionModalStep(undefined)
		setIsEditMemberModalOpen(false)
		router.reload()
	}

	return {
		isHovering,
		setIsHovering,
		isEditMemberModalOpen,
		setIsEditMemberModalOpen,
		type,
		setType,
		chainId,
		transactionHash,
		scwAddress,
		isBiconomyInitialised,
		networkTransactionModalStep,
		onSaveClick,
		canAccessEncryptedData,
		getEncryptedTooltipLabel,
		onNetworkModalClose
	}
}

export default useMemberRow