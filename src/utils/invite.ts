import { useCallback, useContext } from 'react'
import { generateInputForAuthorisation, generateKeyPairAndAddress } from '@questbook/anon-authoriser'
import { WorkspaceMemberUpdate } from '@questbook/service-validator-client'
import { base58 } from 'ethers/lib/utils'
import { ApiClientsContext } from 'pages/_app'
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

			const tx = await workspaceRegistry.createInviteLink(
				workspaceId,
				role,
				address,
			)
			didSign?.()
			await tx.wait()

			return {
				workspaceId,
				role,
				privateKey: Buffer.from(privateKey),
				chainId: chainId!,
			}
		},
		[role, workspace?.id, workspaceRegistry]
	)

	return { makeInvite }
}

type JoinInviteStep = 'ipfs-uploaded' | 'tx-signed' | 'tx-confirmed'

export const useJoinInvite = (inviteInfo: InviteInfo, profileInfo: WorkspaceMemberUpdate) => {
	const { data: account } = useAccount()
	const { validatorApi } = useContext(ApiClientsContext)!
	const workspaceRegistry = useQBContract('workspace', inviteInfo?.chainId)

	const joinInvite = useCallback(
		async(didReachStep?: (step: JoinInviteStep) => void) => {
			if(!account?.address) {
				throw new Error('account not connected')
			}

			const {
				data: { ipfsHash }
			} = await validatorApi.validateWorkspaceMemberUpdate(profileInfo)

			didReachStep?.('ipfs-uploaded')

			const signature = generateInputForAuthorisation(
				account.address!,
				workspaceRegistry.address,
				inviteInfo.privateKey,
			)

			const tx = await workspaceRegistry.joinViaInviteLink(
				inviteInfo.workspaceId,
				'',
				inviteInfo.role,
				signature.v,
				signature.r,
				signature.s
			)

			didReachStep?.('tx-signed')

			await tx.wait()

			didReachStep?.('tx-confirmed')

			await delay(2000)
		},
		[profileInfo, workspaceRegistry, validatorApi, inviteInfo, account]
	)

	const getJoinInviteGasEstimate = useCallback(() => {
		return workspaceRegistry.estimateGas.joinViaInviteLink(
			inviteInfo?.workspaceId || '0x0',
			'',
			inviteInfo?.role,
			0x0,
			new Uint8Array(32),
			new Uint8Array(32)
		)
	}, [workspaceRegistry, inviteInfo?.workspaceId, inviteInfo?.role])

	return { joinInvite, getJoinInviteGasEstimate }
}