import { useCallback, useContext, useMemo } from 'react'
import { generateInputForAuthorisation, generateKeyPairAndAddress } from '@questbook/anon-authoriser'
import { WorkspaceMemberUpdate } from '@questbook/service-validator-client'
import { base58 } from 'ethers/lib/utils'
import { ApiClientsContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceMemberExistsLazyQuery } from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useAccount } from 'wagmi'
import { delay } from './generics'
import { getSupportedChainIdFromWorkspace } from './validationUtils'

export type InviteInfo = {
	workspaceId: number
	role: number
	privateKey: Uint8Array
	chainId: number
}

/**
 * Extracts invite link params from the URL if it is an invite link
 * @param url URL to extract invite link params from, uses window.location if not specified
 */
export const extractInviteInfo = (url?: string): InviteInfo | undefined => {
	let params: URLSearchParams
	if(url) {
		params = new URL(url).searchParams
	} else {
		params = new URLSearchParams(window.location.search)
	}

	const workspaceIdStr = params.get('w')
	const roleStr = params.get('r')
	const privateKeyStr = params.get('k')
	const chainIdStr = params.get('c')

	if(
		typeof workspaceIdStr === 'string'
		&& typeof roleStr === 'string'
		&& typeof privateKeyStr === 'string'
		&& typeof chainIdStr === 'string'
	) {
		const workspaceId = +workspaceIdStr
		if(Number.isNaN(workspaceId)) {
			throw new Error('Invalid workspace ID in invite')
		}

		const role = +roleStr
		if(Number.isNaN(role)) {
			throw new Error('Invalid role in invite')
		}

		const chainId = +chainIdStr
		if(Number.isNaN(chainId)) {
			throw new Error('Invalid chain ID in invite')
		}

		const privateKey = base58.decode(privateKeyStr)
		if(privateKey.length !== 32) {
			throw new Error('Invalid private key in invite')
		}

		return {
			workspaceId,
			role,
			privateKey,
			chainId
		}
	}
}

/**
 * Serialises the invite into a URL that can be shared
 * @param info the invite info
 * @returns URL that can be shared
 */
export const serialiseInviteInfoIntoUrl = (info: InviteInfo) => {
	const { workspaceId, role, privateKey, chainId } = info
	const url = new URL(window.location.href)
	url.pathname = ''
	url.searchParams.set('w', workspaceId.toString())
	url.searchParams.set('r', role.toString())
	url.searchParams.set('k', base58.encode(privateKey))
	url.searchParams.set('c', chainId.toString())
	return url.toString()
}

export const useMakeInvite = (role: number) => {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const workspaceRegistry = useQBContract('workspace', chainId)

	const makeInvite = useCallback(
		async(didSign?: () => void): Promise<InviteInfo> => {
			const { privateKey, address } = generateKeyPairAndAddress()
			// convert "0x" encoded hex to a number
			const workspaceId = parseInt(workspace!.id.replace('0x', ''), 16)

			console.log('creating invite ', { workspaceId, role, address })

			const tx = await workspaceRegistry.createInviteLink(
				workspace!.id,
				role,
				address,
			)
			didSign?.()
			await tx.wait()

			const inviteInfo: InviteInfo = {
				workspaceId,
				role,
				privateKey: Buffer.from(privateKey),
				chainId: chainId!,
			}
			console.log('created invite ', inviteInfo)

			return inviteInfo
		},
		[role, workspace?.id, workspaceRegistry]
	)

	return { makeInvite }
}

type JoinInviteStep = 'ipfs-uploaded' | 'tx-signed' | 'tx-confirmed'

export const useJoinInvite = (inviteInfo: InviteInfo, profileInfo: WorkspaceMemberUpdate) => {
	const { data: account } = useAccount()
	const { validatorApi, subgraphClients } = useContext(ApiClientsContext)!
	const workspaceRegistry = useQBContract('workspace', inviteInfo?.chainId)

	const { client } = subgraphClients[inviteInfo?.chainId] || subgraphClients[defaultChainId]

	const [fetchMembers] = useGetWorkspaceMemberExistsLazyQuery({ client })

	const signature = useMemo(() => (
		(account?.address && inviteInfo?.privateKey)
			? generateInputForAuthorisation(
				account.address!,
				workspaceRegistry.address,
				inviteInfo.privateKey,
			)
			: undefined
	), [account?.address, workspaceRegistry.address, inviteInfo?.privateKey])

	const joinInvite = useCallback(
		async(didReachStep?: (step: JoinInviteStep) => void) => {
			if(!signature) {
				throw new Error('account not connected')
			}

			const {
				data: { ipfsHash }
			} = await validatorApi.validateWorkspaceMemberUpdate(profileInfo)

			didReachStep?.('ipfs-uploaded')

			const tx = await workspaceRegistry.joinViaInviteLink(
				inviteInfo.workspaceId,
				ipfsHash,
				inviteInfo.role,
				signature.v,
				signature.r,
				signature.s,
			)

			didReachStep?.('tx-signed')

			await tx.wait()

			didReachStep?.('tx-confirmed')

			const memberId = `${numberToHex(inviteInfo.workspaceId)}.${account!.address!.toLowerCase()}`

			console.log(`polling for member "${memberId}"`)

			let didIndex = false
			do {
				const result = await fetchMembers({
					variables: { id: memberId },
				})

				console.log('here 2', result)

				didIndex = !!result.data?.workspaceMember
				await delay(2000)
			} while(!didIndex)

			console.log('indexed ')
		},
		[profileInfo, workspaceRegistry, validatorApi, inviteInfo, signature, fetchMembers]
	)

	const getJoinInviteGasEstimate = useCallback(async() => {
		if(!signature) {
			// Requirements to calculate GAS not met
			return undefined
		}

		const result = await workspaceRegistry
			.estimateGas
			.joinViaInviteLink(
				inviteInfo.workspaceId,
				'123', // placeholder for metadata hash
				inviteInfo.role,
				signature.v,
				signature.r,
				signature.s
			)
		return result
	}, [workspaceRegistry, inviteInfo, signature])

	return { joinInvite, getJoinInviteGasEstimate }
}

const numberToHex = (num: number) => `0x${num.toString(16)}`