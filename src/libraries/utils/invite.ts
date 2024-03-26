import { useCallback, useContext, useMemo } from 'react'
import { generateInputForAuthorisation, generateKeyPairAndAddress } from '@questbook/anon-authoriser'
import { WorkspaceMemberUpdate } from '@questbook/service-validator-client'
import { base58 } from 'ethers/lib/utils'
import { createInviteLinkMutation, joinViaInviteLinkMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import { getWorkspaceMemberExistsQuery } from 'src/libraries/data/getWorkspaceMemberExistsQuery'
import { useBiconomy } from 'src/libraries/hooks/gasless/useBiconomy'
import { useNetwork } from 'src/libraries/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/libraries/hooks/gasless/useQuestbookAccount'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useQBContract from 'src/libraries/hooks/useQBContract'
import { useQuery } from 'src/libraries/hooks/useQuery'
import useChainId from 'src/libraries/hooks/utils/useChainId'
import { delay } from 'src/libraries/utils'
import logger from 'src/libraries/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'

export type InviteInfo = {
	workspaceId: number | string
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
		const workspaceId = workspaceIdStr

		const role = +roleStr
		if(Number.isNaN(role)) {
			throw new Error('Invalid role in invite')
		}

		const chainId = +chainIdStr
		if(Number.isNaN(chainId)) {
			throw new Error('Invalid chain ID in invite')
		}

		const privateKey = base58.decode(privateKeyStr)

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


export const useMakeInvite = () => {
	const { grant } = useContext(GrantsProgramContext)!
	const chainId = getSupportedChainIdFromWorkspace(grant?.workspace)

	const { switchNetwork } = useNetwork()

	const { webwallet, scwAddress } = useContext(WebwalletContext)!
	const { nonce } = useQuestbookAccount()
	const customToast = useCustomToast()
	// const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress, loading: biconomyLoading } = useBiconomy({
	// 	chainId: chainId?.toString()
	// })

	// const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	// useEffect(() => {
	// 	if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && chainId && biconomy.networkId &&
	// 		biconomy.networkId.toString() === chainId.toString()) {
	// 		setIsBiconomyInitialised(true)
	// 	}
	// }, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, chainId])

	const workspaceRegistry = useQBContract('workspace', chainId)

	const makeInvite = useCallback(
		async(role: number, didSign?: () => void, setTransactionHash?: (hash: string) => void): Promise<InviteInfo> => {
			switchNetwork?.(chainId!)
			const { privateKey, address } = generateKeyPairAndAddress()
			// convert "0x" encoded hex to a number
			const workspaceId = grant!.workspace!.id

			logger.info({ workspaceId, role, address }, 'creating invite ')
			// didSign?.()

			const response = await executeMutation(createInviteLinkMutation, {
				w: grant!.workspace!.id,
				r: role?.toString(),
				k: base58.encode(privateKey),
				createdBy: scwAddress?.toLowerCase() ?? webwallet?.address?.toLowerCase()
			})

			if(response) {
				setTransactionHash?.(response?.createInviteLink?.recordId)
			} else {
				customToast({
					position: 'top',
					title: 'Error creating invite',
					status: 'error',
				})
				throw new Error('Error creating invite')
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
		[grant?.workspace?.id, workspaceRegistry, chainId, scwAddress, nonce, webwallet]
	)

	const getMakeInviteGasEstimate = useCallback(
		async(role: number) => {
			if(!grant?.workspace) {
				return undefined
			}

			logger.info({ role, workspaceId: grant.workspace.id }, 'estimating gas for make invite')

			return false
		},
		[workspaceRegistry, grant?.workspace?.id]
	)

	return { makeInvite, getMakeInviteGasEstimate }
}

type JoinInviteStep = 'ipfs-uploaded' | 'tx-signed' | 'tx-confirmed'

export const useJoinInvite = (inviteInfo: InviteInfo, profileInfo: WorkspaceMemberUpdate) => {
	const connectedChainId = useChainId()
	const { switchNetwork } = useNetwork()

	const { webwallet } = useContext(WebwalletContext)!

	const { biconomyDaoObj: biconomy, biconomyWalletClient, scwAddress } = useBiconomy({
		chainId: inviteInfo?.chainId.toString()
	})


	// const [isBiconomyInitialised, setIsBiconomyInitialised] = useState(false)

	// useEffect(() => {
	// 	// const isBiconomyLoading = localStorage.getItem('isBiconomyLoading') === 'true'
	// 	// console.log('rree', scwAddress, biconomyLoading, inviteInfo)
	// 	// console.log("invite", biconomy, biconomyWalletClient)

	// 	if(biconomy && biconomyWalletClient && scwAddress && !biconomyLoading && inviteInfo?.chainId && biconomy?.networkId &&
	// 		biconomy.networkId.toString() === inviteInfo?.chainId?.toString()) {
	// 		// console.log("zonb");
	// 		setIsBiconomyInitialised(true)
	// 	}
	// }, [biconomy, biconomyWalletClient, scwAddress, biconomyLoading, isBiconomyInitialised, inviteInfo])


	const { data: account, nonce } = useQuestbookAccount()
	const { validatorApi } = useContext(ApiClientsContext)!
	const workspaceRegistry = useQBContract('workspace', inviteInfo?.chainId)


	const { fetchMore: fetchMembers } = useQuery({
		query: getWorkspaceMemberExistsQuery,
	})
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

			const data = {
				fullName: profileInfo?.fullName,
				profilePictureIpfsHash: profileInfo?.profilePictureIpfsHash,
				publicKey: webwallet.publicKey
			} as WorkspaceMemberUpdate


			const variables = {
				id: `${inviteInfo.workspaceId}`,
				members: [webwallet.address],
				roles: [inviteInfo.role],
				enabled: [true],
				metadataHashes: [data],
				w: inviteInfo.workspaceId.toString(),
				r: inviteInfo.role.toString(),
				k: base58.encode(inviteInfo.privateKey),
			}

			const response = await executeMutation(joinViaInviteLinkMutation, variables)

			if(response) {
				setTransactionHash?.(response?.joinViaInviteLink?.recordId)
			}

			didReachStep?.('tx-confirmed')

			const memberId = `${(inviteInfo.workspaceId)}.${account!.address!.toLowerCase()}`

			let didIndex = false
			do {
				logger.info({ memberId }, 'polling for member in workspace')
				await delay(2000)
				const result = await fetchMembers({
					variables: { id: memberId },
				}) as { data: { workspaceMember: { id: string } } }

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

		return false
	}, [workspaceRegistry, inviteInfo, signature])

	return { joinInvite, getJoinInviteGasEstimate }
}

