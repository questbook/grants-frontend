import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { generateInputForAuthorisation, generateKeyPairAndAddress } from '@questbook/anon-authoriser'
import { WorkspaceMemberUpdate } from '@questbook/service-validator-client'
import { base58 } from 'ethers/lib/utils'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceMemberExistsQuery } from 'src/generated/graphql'
import useQBContract from 'src/hooks/contracts/useQBContract'
import { useBiconomy } from 'src/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import useChainId from 'src/hooks/utils/useChainId'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { bicoDapps, chargeGas, getTransactionDetails, sendGaslessTransaction } from 'src/utils/gaslessUtils'
import { delay } from 'src/utils/generics'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

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

	const { network, switchNetwork } = useNetwork()

	const { webwallet } = useContext(WebwalletContext)!
	const { nonce } = useQuestbookAccount()
	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: chainId?.toString()
	})

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	useEffect(() => {
		// const isBiconomyLoading = localStorage.getItem('isBiconomyLoading') === 'true'
		// console.log('rree', biconomyLoading, chainId, biconomy)
		// console.log("invite", scwAddress)
		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
			biconomy.networkId.toString() === chainId.toString()) {
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])

	const targetContractObject = useQBContract('workspace', network)
	const workspaceRegistry = useQBContract('workspace', chainId)

	const makeInvite = useCallback(
		async(didSign?: () => void, setTransactionHash?: (hash: string) => void): Promise<InviteInfo> => {
			switchNetwork?.(chainId!)
			const { privateKey, address } = generateKeyPairAndAddress()
			// convert "0x" encoded hex to a number
			const workspaceId = parseInt(workspace!.id.replace('0x', ''), 16)

			logger.info({ workspaceId, role, address }, 'creating invite ')
			// console.log("inviteee", biconomyWalletClient, scwAddress, chainId);

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress || !chainId) {
				return undefined!
			}

			const response = await sendGaslessTransaction(
				biconomy,
				targetContractObject,
				'createInviteLink',
				[workspace!.id, role, address],
				workspaceRegistry.address,
				biconomyWalletClient,
				scwAddress,
				webwallet,
				chainId.toString(),
				bicoDapps[chainId.toString()].webHookId,
				nonce
			)

			didSign?.()

			if(response) {
				const { txFee, receipt } = await getTransactionDetails(response, chainId.toString())
				setTransactionHash?.(receipt?.transactionHash)
				await chargeGas(workspaceId, Number(txFee))
			}

			const inviteInfo: InviteInfo = {
				workspaceId,
				role,
				privateKey: Buffer.from(privateKey),
				chainId: chainId!,
			}
			logger.info({ inviteInfo }, 'created invite')

			return inviteInfo
		},
		[role, workspace?.id, workspaceRegistry, biconomyWalletClient, chainId, scwAddress, biconomy, nonce, webwallet]
	)

	const getMakeInviteGasEstimate = useCallback(
		async() => {
			if(!workspace) {
				return undefined
			}

			const fakeAddress = '0x' + [...Array(40)].map(() => 1).join('')

			return await workspaceRegistry
				.estimateGas
				.createInviteLink(
					workspace?.id,
					role,
					// testing address
					fakeAddress,
				)
		},
		[workspaceRegistry, role, workspace?.id]
	)

	return { makeInvite, getMakeInviteGasEstimate, isBiconomyInitialised }
}

type JoinInviteStep = 'ipfs-uploaded' | 'tx-signed' | 'tx-confirmed'

export const useJoinInvite = (inviteInfo: InviteInfo, profileInfo: WorkspaceMemberUpdate, shouldRefreshNonce: boolean) => {

	const connectedChainId = useChainId()
	const { network, switchNetwork } = useNetwork()

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
		chainId: inviteInfo?.chainId.toString(),
		shouldRefreshNonce: shouldRefreshNonce
	})
	const targetContractObject = useQBContract('workspace', network)

	const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	useEffect(() => {
		// const isBiconomyLoading = localStorage.getItem('isBiconomyLoading') === 'true'
		// console.log('rree', scwAddress, biconomyLoading, inviteInfo)
		// console.log("invite", biconomy, biconomyWalletClient)

		if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && inviteInfo?.chainId && biconomy?.networkId &&
			biconomy.networkId.toString() === inviteInfo?.chainId?.toString()) {
			// console.log("zonb");
			setIsBiconomyInitialised(true)
		}
	}, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, inviteInfo])


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
		async(didReachStep?: (step: JoinInviteStep) => void, setTransactionHash?: (hash: string) => void) => {
			if(!signature) {
				throw new Error('account not connected')
			}

			if(!webwallet) {
				throw new Error('webwallet not connected')
			}

			const {
				data: { ipfsHash }
			} = await validatorApi.validateWorkspaceMemberUpdate({
				fullName: profileInfo?.fullName,
				profilePictureIpfsHash: profileInfo?.profilePictureIpfsHash,
				publicKey: webwallet.publicKey
			} as WorkspaceMemberUpdate)

			didReachStep?.('ipfs-uploaded')

			// console.log("inviiii", biconomyWalletClient, scwAddress)

			if(typeof biconomyWalletClient === 'string' || !biconomyWalletClient || !scwAddress) {
				return undefined!
			}

			// console.log('invite33', inviteInfo)
			const response = await sendGaslessTransaction(
				biconomy,
				targetContractObject,
				'joinViaInviteLink',
				[
					inviteInfo.workspaceId,
					ipfsHash,
					inviteInfo.role,
					signature.v,
					signature.r,
					signature.s
				],
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
				const { txFee, receipt } = await getTransactionDetails(response, inviteInfo?.chainId.toString())
				setTransactionHash?.(receipt?.transactionHash)
				await chargeGas(inviteInfo.workspaceId, Number(txFee))
			}

			didReachStep?.('tx-confirmed')

			const memberId = `${numberToHex(inviteInfo.workspaceId)}.${account!.address!.toLowerCase()}`

			let didIndex = false
			do {
				logger.info({ memberId }, 'polling for member in workspace')
				await delay(2000)
				const result = await fetchMembers({
					variables: { id: memberId },
				})

				didIndex = !!result.data?.workspaceMember
				logger.info(`poll result: ${didIndex}`)
			} while(!didIndex)
		},
		[profileInfo, workspaceRegistry, validatorApi, inviteInfo, signature, fetchMembers, switchNetwork, connectedChainId, scwAddress, biconomyWalletClient,
			biconomy, webwallet, nonce])

	const getJoinInviteGasEstimate = useCallback(async() => {
		if(!signature) {
			// Requirements to calculate GAS not met
			return undefined
		}

		// switch during gas estimation so that we use the correct chain
		if(connectedChainId !== inviteInfo.chainId) {
			logger.info('SWITCH NETWORK (join-invite-link.tsx 1): ', inviteInfo.chainId)
			switchNetwork(inviteInfo.chainId)
		}

		return await workspaceRegistry
			.estimateGas
			.joinViaInviteLink(
				inviteInfo.workspaceId,
				'123', // placeholder for metadata hash
				inviteInfo.role,
				signature.v,
				signature.r,
				signature.s
			)
	}, [workspaceRegistry, inviteInfo, signature])

	return { joinInvite, getJoinInviteGasEstimate, isBiconomyInitialised }
}

const numberToHex = (num: number) => `0x${num.toString(16)}`
