import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { generateInputForAuthorisation, generateKeyPairAndAddress } from '@questbook/anon-authoriser'
import { WorkspaceMemberUpdate } from '@questbook/service-validator-client'
import { base58 } from 'ethers/lib/utils'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceMemberExistsQuery } from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import {
	bicoDapps,
	chargeGas,
	getTransactionDetails,
	sendGaslessTransaction
} from 'src/utils/gaslessUtils'
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
	console.log('make invite', workspace?.id)
	const chainId = getSupportedChainIdFromWorkspace(workspace)

	const { network, switchNetwork } = useNetwork()

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!
	const { data: accountData, nonce } = useQuestbookAccount()
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, } = useBiconomy({
		chainId: chainId?.toString()
	})
	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState('not ready')
	const targetContractObject = useQBContract('workspace', network)
	const workspaceRegistry = useQBContract('workspace', chainId)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress) {
			setIsBiconomyInitialised('ready')
		}
	}, [biconomy, biconomyWalletClient, scwAddress])

	const makeInvite = useCallback(
		async(didSign?: () => void): Promise<InviteInfo> => {
			switchNetwork && switchNetwork?.(chainId!)
			const { privateKey, address } = generateKeyPairAndAddress()
			// convert "0x" encoded hex to a number
			const workspaceId = parseInt(workspace!.id.replace('0x', ''), 16)

			console.log('creating invite ', { workspaceId, role, address })

			// const tx = await workspaceRegistry.createInviteLink(
			// 	workspace!.id,
			// 	role,
			// 	address,
			// )
			// await tx.wait()
			// const tx = await workspaceRegistry.createInviteLink(
			// 	workspace!.id,
			// 	role,
			// 	address,
			// )

			// await tx.wait()

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress || !chainId) {
				return undefined!
			}

			console.log('CHAIN ID', chainId)
			const response = await sendGaslessTransaction(
				biconomy,
				targetContractObject,
				'createInviteLink',
				[workspace!.id,
					role,
					address, ],
				workspaceRegistry.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				chainId.toString(),
				bicoDapps[chainId.toString()].webHookId,
				nonce
			)
			if(response) {
				const { txFee } = await getTransactionDetails(response, chainId.toString())
				await chargeGas(workspaceId, Number(txFee))
			}

			didSign?.()

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

	const getMakeInviteGasEstimate = useCallback(
		async() => {
			if(!workspace) {
				return undefined
			}

			const fakeAddress = '0x' + [...Array(40)].map(() => 1).join('')

			const estimate = await workspaceRegistry
				.estimateGas
				.createInviteLink(
					workspace?.id,
					role,
					// testing address
					fakeAddress,
				)
			return estimate
		},
		[workspaceRegistry, role, workspace?.id]
	)

	return { makeInvite, getMakeInviteGasEstimate }
}

type JoinInviteStep = 'ipfs-uploaded' | 'tx-signed' | 'tx-confirmed'

export const useJoinInvite = (inviteInfo: InviteInfo, profileInfo: WorkspaceMemberUpdate) => {

	const connectedChainId = useChainId()
	const { network, switchNetwork } = useNetwork()

	const { webwallet, setWebwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: inviteInfo?.chainId.toString()
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState('not ready')
	const targetContractObject = useQBContract('workspace', network)

	useEffect(() => {
		if(biconomy && biconomyWalletClient && scwAddress) {
			setIsBiconomyInitialised('ready')
		}
	}, [biconomy, biconomyWalletClient, scwAddress])

	const { data: account, nonce } = useQuestbookAccount()
	const { validatorApi, subgraphClients } = useContext(ApiClientsContext)!
	const workspaceRegistry = useQBContract('workspace', inviteInfo?.chainId)

	const { client } = subgraphClients[inviteInfo?.chainId] || subgraphClients[defaultChainId]

	const { fetchMore: fetchMembers } = useGetWorkspaceMemberExistsQuery({ client, skip: true, fetchPolicy: 'network-only' })

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
			console.log('GTRGTR', biconomyWalletClient, scwAddress, isBiconomyInitialised)
			if(!signature) {
				throw new Error('account not connected')
			}

			const {
				data: { ipfsHash }
			} = await validatorApi.validateWorkspaceMemberUpdate(profileInfo)

			didReachStep?.('ipfs-uploaded')

			// const tx = await workspaceRegistry.joinViaInviteLink(
			// 	inviteInfo.workspaceId,
			// 	ipfsHash,
			// 	inviteInfo.role,
			// 	signature.v,
			// 	signature.r,
			// 	signature.s,
			// )
			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				return undefined!
			}

			console.log('invite33', inviteInfo)
			const response = await sendGaslessTransaction(
				biconomy,
				targetContractObject,
				'joinViaInviteLink',
				[inviteInfo.workspaceId,
					ipfsHash,
					inviteInfo.role,
					signature.v,
					signature.r,
					signature.s, ],
				workspaceRegistry.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				inviteInfo?.chainId.toString(),
				bicoDapps[inviteInfo?.chainId.toString()].webHookId,
				nonce
			)
			didReachStep?.('tx-signed')


			if(response) {
				const { txFee } = await getTransactionDetails(response, inviteInfo?.chainId.toString())
				await chargeGas(inviteInfo.workspaceId, Number(txFee))
			}

			didReachStep?.('tx-confirmed')

			const memberId = `${numberToHex(inviteInfo.workspaceId)}.${account!.address!.toLowerCase()}`

			let didIndex = false
			do {
				console.log(`polling for member "${memberId}"`)
				await delay(2000)
				const result = await fetchMembers({
					variables: { id: memberId },
				})

				didIndex = !!result.data?.workspaceMember
				console.log(`poll success: ${didIndex}`)
			} while(!didIndex)
		},
		[profileInfo, workspaceRegistry, validatorApi, inviteInfo, signature, fetchMembers, switchNetwork, connectedChainId]
	)

	const getJoinInviteGasEstimate = useCallback(async() => {
		if(!signature) {
			// Requirements to calculate GAS not met
			return undefined
		}

		// switch during gas estimation so that we use the correct chain
		if(connectedChainId !== inviteInfo.chainId) {
			switchNetwork(inviteInfo.chainId)
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

	return { joinInvite, getJoinInviteGasEstimate, isBiconomyInitialised: isBiconomyInitialised === 'ready' }
}

const numberToHex = (num: number) => `0x${num.toString(16)}`