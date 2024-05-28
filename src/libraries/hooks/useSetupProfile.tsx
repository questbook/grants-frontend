import { useContext } from 'react'
import { useRouter } from 'next/router'
import { joinViaInviteLinkMutation, updateWorkspaceMemberMutation } from 'src/generated/mutation'
import SupportedChainId from 'src/generated/SupportedChainId'
import { executeMutation } from 'src/graphql/apollo'
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
	workspaceId: string | number | undefined
	memberId: string | undefined
	chainId: SupportedChainId
	type: 'join-using-link' | 'join-reviewer-guard' | 'update'
}

function useSetupProfile({ workspaceId, memberId, setNetworkTransactionModalStep, setTransactionHash, chainId, type }: Props) {
	const { webwallet, scwAddress } = useContext(WebwalletContext)!
	const router = useRouter()
	const toast = useCustomToast()

	const { encrypt } = usePiiForWorkspaceMember(workspaceId as string, memberId, webwallet?.publicKey, chainId)

	const { isBiconomyInitialised } = useFunctionCall({ chainId, contractName: 'workspace', setTransactionHash, setTransactionStep: setNetworkTransactionModalStep })

	const setupProfile = async({ name, email, imageFile, role, signature, signedMessage, walletAddress, inviteInfo }: {
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
		inviteInfo?: {
			role: number
			privateKey: string
			workspaceId: string
			chainId: SupportedChainId
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

			logger.info({ profilePictureIpfsHash, data }, 'Uploaded data to IPFS')

			// Step - 4: Call the contract method
			// const methodArgs = type === 'update' ? [
			// 	workspaceId,
			// 	[scwAddress],
			// 	[role],
			// 	[true],
			// 	[hash]
			// ] : type === 'join-using-link' ? [
			// 	workspaceId,
			// 	hash,
			// 	role,
			// 	signature?.v,
			// 	signature?.r,
			// 	signature?.s
			// ] : [
			// 	workspaceId,
			// 	hash,
			// 	walletAddress,
			// 	role,
			// 	signedMessage
			// ]
			logger.info({ type, chainId }, 'Method args')

			const variables = type === 'update' ? {
				id: workspaceId,
				members: [scwAddress?.toLowerCase()],
				roles: [role],
				enabled: [true],
				metadataHashes: [data]
			} : {
				id: workspaceId,
				members: [scwAddress?.toLowerCase()],
				roles: [role],
				enabled: [true],
				metadataHashes: [data],
				w: inviteInfo?.workspaceId,
				r: inviteInfo?.role?.toString(),
				k: inviteInfo?.privateKey
			}
			logger.info({ inviteInfo }, 'Variables')
			// const receipt = await call({ method: type === 'join-using-link' ? 'joinViaInviteLink' : type === 'join-reviewer-guard' ? 'proveMembership' : 'updateWorkspaceMembers', args: methodArgs })
			const receipt = await executeMutation(type === 'update' ? updateWorkspaceMemberMutation : joinViaInviteLinkMutation, variables)
			if(!receipt) {
				throw new Error('Oops! It seems this invite link has already been used. Contact the workspace admin for a new invite link.')
			}

			//await createMapping({ email })
			if(type === 'update') {
				window.location.reload()
			} else {
				const ret = await router.push({
					pathname: '/dashboard',
					query: { ...router.query, chainId: inviteInfo?.chainId }
				})
				if(ret) {
					window.location.reload()
				}
			}

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