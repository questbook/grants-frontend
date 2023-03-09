import { useContext } from 'react'
import SupportedChainId from 'src/generated/SupportedChainId'
import useCreateMapping from 'src/libraries/hooks/useCreateMapping'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useFunctionCall from 'src/libraries/hooks/useFunctionCall'
import logger from 'src/libraries/logger'
import getErrorMessage from 'src/libraries/utils/error'
import { uploadToIPFS } from 'src/libraries/utils/ipfs'
import { usePiiForWorkspaceMember } from 'src/libraries/utils/pii'
import { WebwalletContext } from 'src/pages/_app'

interface Props {
	setNetworkTransactionModalStep: (step: number | undefined) => void
	setTransactionHash: (hash: string) => void
	workspaceId: string | undefined
	memberId: string | undefined
	chainId: SupportedChainId
	type: 'join-using-link' | 'join-reviewer-guard' | 'update'
}

function useSetupProfile({ workspaceId, memberId, setNetworkTransactionModalStep, setTransactionHash, chainId, type }: Props) {
	const { webwallet, scwAddress } = useContext(WebwalletContext)!

	const toast = useCustomToast()

	const { encrypt } = usePiiForWorkspaceMember(workspaceId, memberId, webwallet?.publicKey, chainId)
	const createMapping = useCreateMapping({ chainId })

	const { call, isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'workspace', setTransactionHash, setTransactionStep: setNetworkTransactionModalStep })

	const setupProfile = async({ name, email, imageFile, role, signature, signedMessage, walletAddress }: {
		name: string
		email: string
		imageFile: File | null
		role: number
		signature?: {
			v: number
			r: number[]
			s: number[]
		}
		signedMessage?: string
		walletAddress?: string
	}) => {
		logger.info({ name, email, scwAddress, webwallet }, 'useSetupProfile')

		try {
			if(!webwallet) {
				throw new Error('webwallet not connected')
			}

			if(!chainId) {
				throw new Error('Chain ID not found')
			}

			if(!isBiconomyInitialised) {
				throw new Error('Biconomy Wallet not initialised properly')
			}

			if(!workspaceId) {
				throw new Error('Unable to find workspace id')
			}

			if(type === 'join-using-link' && !signature) {
				throw new Error('Signature not found')
			}

			if(type === 'join-reviewer-guard' && !signedMessage) {
				throw new Error('Signed message not found')
			}

			if(type === 'join-reviewer-guard' && !walletAddress) {
				throw new Error('Wallet address not found')
			}

			// TODO: Step - 0: Validate Workspace Member Update

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
			] : type === 'join-using-link' ? [
				workspaceId,
				hash,
				role,
				signature?.v,
				signature?.r,
				signature?.s
			] : [
				workspaceId,
				hash,
				walletAddress,
				role,
				signedMessage
			]
			logger.info({ type, chainId, methodArgs }, 'Method args')

			const receipt = await call({ method: type === 'join-using-link' ? 'joinViaInviteLink' : type === 'join-reviewer-guard' ? 'proveMembership' : 'updateWorkspaceMembers', args: methodArgs })

			if(!receipt) {
				throw new Error('Some error occured on Biconomy side')
			}

			await createMapping({ email })
			return true
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			setNetworkTransactionModalStep(undefined)
			const message = getErrorMessage(e)
			toast({
				position: 'top',
				title: message,
				status: 'error'
			})
			return false
		}
	}

	return {
		setupProfile, isBiconomyInitialised
	}
}

export default useSetupProfile