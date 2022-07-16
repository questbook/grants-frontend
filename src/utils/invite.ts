import { useCallback, useContext } from 'react'
import { generateKeyPairAndAddress } from '@questbook/anon-authoriser'
import { base58 } from 'ethers/lib/utils'
import { ApiClientsContext } from 'pages/_app'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { getSupportedChainIdFromWorkspace } from './validationUtils'

export type InviteInfo = {
	workspaceId: number
	role: number
	privateKey: Uint8Array
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

	if(
		typeof workspaceIdStr === 'string'
		&& typeof roleStr === 'string'
		&& typeof privateKeyStr === 'string'
	) {
		const workspaceId = +workspaceIdStr
		if(Number.isNaN(workspaceId)) {
			throw new Error('Invalid workspace ID in invite')
		}

		const role = +roleStr
		if(Number.isNaN(role)) {
			throw new Error('Invalid role in invite')
		}

		const privateKey = base58.decode(privateKeyStr)
		if(privateKey.length !== 32) {
			throw new Error('Invalid private key in invite')
		}

		return {
			workspaceId,
			role,
			privateKey
		}
	}
}

/**
 * Serialises the invite into a URL that can be shared
 * @param info the invite info
 * @returns URL that can be shared
 */
export const serialiseInviteInfoIntoUrl = (info: InviteInfo) => {
	const { workspaceId, role, privateKey } = info
	const url = new URL(window.location.href)
	url.pathname = ''
	url.searchParams.set('w', workspaceId.toString())
	url.searchParams.set('r', role.toString())
	url.searchParams.set('k', base58.encode(privateKey))
	return url.toString()
}

export const useMakeInvite = (role: number) => {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace)
	const workspaceRegistry = useQBContract('workspace', chainId)

	const makeInvite = useCallback(
		async(): Promise<InviteInfo> => {
			const { privateKey, address } = generateKeyPairAndAddress()
			// convert "0x" encoded hex to a number
			const workspaceId = parseInt(workspace!.id.replace('0x', ''), 16)

			console.log(workspaceRegistry.address)
			const addr = await workspaceRegistry.anonAuthoriserAddress()

			const tx = await workspaceRegistry.createInviteLink(
				workspaceId,
				role,
				address,
			)
			await tx.wait()

			return {
				workspaceId,
				role,
				privateKey: Buffer.from(privateKey)
			}
		},
		[role, workspace?.id, workspaceRegistry]
	)

	return { makeInvite }
}