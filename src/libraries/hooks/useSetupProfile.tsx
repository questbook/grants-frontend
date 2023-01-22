import { useContext, useMemo } from 'react'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext'
import { WebwalletContext } from 'src/contexts/WebwalletContext'
import SupportedChainId from 'src/generated/SupportedChainId'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useCreateMapping from 'src/libraries/hooks/useCreateMapping'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import { usePiiForWorkspaceMember } from 'src/libraries/utils/pii'
import getErrorMessage from 'src/utils/errorUtils'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { uploadToIPFS } from 'src/utils/ipfsUtils'

interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
	workspaceId: string | undefined
	memberId: string | undefined
	chainId: SupportedChainId
	type: 'join' | 'update'
}

function useSetupProfile({ workspaceId, memberId, setNetworkTransactionModalStep, setTransactionHash, chainId, type }: Props) {
	const { subgraphClients } = useContext(ApiClientsContext)!
	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({ chainId: chainId?.toString()! })
	const { nonce } = useQuestbookAccount()
	const workspaceRegistryContract = useQBContract('workspace', chainId)

	const isBiconomyInitialised = useMemo(() => {
		return biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId && biconomy.networkId.toString() === chainId.toString()
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, chainId])

	const toast = useCustomToast()

	const { encrypt } = usePiiForWorkspaceMember(workspaceId, memberId, webwallet?.publicKey, chainId)
	const createMapping = useCreateMapping({ chainId })

	const setupProfile = async({ name, email, imageFile, role, signature }: {
		name: string
		email: string
		imageFile: File | null
		role: number
		signature?: {
			v: number
			r: number[]
			s: number[]
		}
	}) => {
		logger.info({ name, email, scwAddress, webwallet }, 'useSetupProfile')

		try {
			if(!webwallet) {
				throw new Error('webwallet not connected')
			}

			if(!chainId) {
				throw new Error('Chain ID not found')
			}

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				throw new Error('Biconomy Wallet not initialised properly')
			}

			if(!workspaceId) {
				throw new Error('Unable to find workspace id')
			}

			if(type === 'join' && !signature) {
				throw new Error('Signature not found')
			}

			// TODO: Step - 0: Validate Workspace Member Update

			setNetworkTransactionModalStep(0)

			// Step - 1: Encrypt the data
			const dataToEncrypt = { email }
			await encrypt(dataToEncrypt)
			logger.info({ dataToEncrypt }, 'Encrypted data')

			// Step - 2: Upload image to IPFS
			const profilePictureIpfsHash = imageFile !== null ? (await uploadToIPFS(imageFile)).hash : undefined

			// Step - 3: Upload the data to IPFS
			const data = {
				fullName: name,
				profilePictureIpfsHash,
				publicKey: webwallet.publicKey,
				...dataToEncrypt
			}
			const hash = (await uploadToIPFS(JSON.stringify(data))).hash
			if(!hash) {
				throw new Error('Failed to upload data to IPFS')
			}

			logger.info({ profilePictureIpfsHash, hash }, 'Uploaded data to IPFS')

			// Step - 4: Call the contract method
			const methodArgs = type === 'update' ? [
				workspaceId,
				[scwAddress],
				[role],
				[true],
				[hash]
			] : [
				workspaceId,
				hash,
				role,
				signature?.v,
				signature?.r,
				signature?.s
			]
			logger.info({ chainId, methodArgs, workspaceRegistryContract }, 'Method args')

			const response = await sendGaslessTransaction(
				biconomy,
				workspaceRegistryContract,
				type === 'join' ? 'joinViaInviteLink' : 'updateWorkspaceMembers',
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

			setNetworkTransactionModalStep(1)

			// Step - 5: If call successful, create the mapping from email address to scw address
			const { txFee, receipt } = await getTransactionDetails(response, chainId.toString())
			setTransactionHash(receipt.transactionHash)
			await subgraphClients[chainId].waitForBlock(receipt?.blockNumber)

			setNetworkTransactionModalStep(2)

			await createMapping({ email })
			await chargeGas(Number(workspaceId), Number(txFee), chainId)
			setNetworkTransactionModalStep(undefined)

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setNetworkTransactionModalStep(undefined)
			const message = getErrorMessage(e)
			toast({
				position: 'top',
				title: message,
				status: 'error'
			})
		}
	}

	return {
		setupProfile: useMemo(() => setupProfile, [biconomy, biconomyWalletClient, scwAddress, webwallet, chainId, nonce, workspaceId]), isBiconomyInitialised
	}
}

export default useSetupProfile