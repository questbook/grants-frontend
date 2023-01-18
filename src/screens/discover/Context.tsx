import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { useGetAllGrantsForMemberQuery, useGetAllGrantsQuery, useGetGrantProgramDetailsQuery, useGetWorkspacesAndBuilderGrantsQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { DiscoverContextType, GrantProgramType, GrantType, WorkspaceMemberType } from 'src/screens/discover/_utils/types'
import { Roles } from 'src/types'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

const DiscoverContext = createContext<DiscoverContextType | null>(null)

const PAGE_SIZE = 40

const DiscoverProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const provider = () => {
		return (
			<DiscoverContext.Provider value={{ grantsForYou, grantsForAll, grantProgram }}>
				{children}
			</DiscoverContext.Provider>
		)
	}

	const { scwAddress } = useContext(WebwalletContext)!
	const { inviteInfo } = useContext(ApiClientsContext)!

	const [grantsForYou, setGrantsForYou] = useState<GrantType[]>([])
	const [grantsForAll, setGrantsForAll] = useState<GrantType[]>([])
	const [grantProgram, setGrantProgram] = useState<GrantProgramType>()

	const { fetchMore: fetchMoreWorkspaces } = useMultiChainQuery({
		useQuery: useGetWorkspacesAndBuilderGrantsQuery,
		options: {}
	})

	const { fetchMore: fetchMoreMemberGrants } = useMultiChainQuery({
		useQuery: useGetAllGrantsForMemberQuery,
		options: {}
	})

	const { fetchMore: fetchMoreExploreGrants } = useMultiChainQuery({
		useQuery: useGetAllGrantsQuery,
		options: {}
	})

	const { fetchMore: fetchGrantProgramData } = useMultiChainQuery({
		useQuery: useGetGrantProgramDetailsQuery,
		options: {
			variables: {
				workspaceID: inviteInfo ? `0x${inviteInfo.workspaceId.toString(16)}` : ''
			}
		},
		chains: inviteInfo?.chainId ? [inviteInfo.chainId] : [defaultChainId]
	})

	const getGrantsForYou = async() => {
		if(!scwAddress) {
			return 'no-scw-address'
		}

		const allWorkspaceMembers: {[key: number]: WorkspaceMemberType} = {}
		const builderGrants: GrantType[] = []
		const membersGrants: GrantType[] = []
		let first = 100
		let skip = 0

		let shouldContinue = true
		while(shouldContinue) {
			const results = await fetchMoreWorkspaces({ actorId: scwAddress, first, skip }, true)

			if(results?.length === 0 || results?.every((r) => !r?.workspaceMembers?.length && !r?.grants?.length)) {
				shouldContinue = false
				break
			}

			for(const result of results) {
				if(result?.workspaceMembers?.length) {
					const chainId = getSupportedChainIdFromWorkspace(result?.workspaceMembers[0]?.workspace)
					if(chainId) {
						if(!allWorkspaceMembers[chainId]) {
							allWorkspaceMembers[chainId] = []
						}

						allWorkspaceMembers[chainId].push(...result?.workspaceMembers)
					}
				}

				if(result?.grants?.length) {
					builderGrants.push(...result?.grants?.map(g => ({ ...g, role: 'builder' as Roles })))
				}
			}

			skip += first
		}

		for(const chainId in allWorkspaceMembers) {
			if(allWorkspaceMembers[chainId].length === 0) {
				continue
			}

			first = 100, skip = 0
			const workspaces = allWorkspaceMembers[chainId].map(m => m.workspace)

			shouldContinue = true
			while(shouldContinue) {
				const results = await fetchMoreMemberGrants({ workspaces: workspaces.map(w => w.id), supportedNetwork: workspaces[0].supportedNetworks, actorId: scwAddress, first, skip }, true)
				if(results?.length === 0 || results?.every((r) => !r?.grants?.length)) {
					shouldContinue = false
					break
				}

				const grants = results.find(r => r?.grants?.length)?.grants
				if(grants) {
					membersGrants.push(...grants?.map(g => ({ ...g, role: g.workspace.members.find(s => s.actorId === scwAddress.toLowerCase())?.accessLevel as Roles })))
				}

				skip += first
			}
		}

		logger.info({ allWorkspaces: allWorkspaceMembers }, 'All workspaces (DISCOVER CONTEXT)')
		logger.info({ builderGrants }, 'All builder grants (DISCOVER CONTEXT)')
		logger.info({ membersGrants }, 'All member grants (DISCOVER CONTEXT)')

		membersGrants.sort((a, b) => a.workspace.id === b.workspace.id ? b.workspace.supportedNetworks[0].localeCompare(a.workspace.supportedNetworks[0]) : b.createdAtS - a.createdAtS)
		builderGrants.sort((a, b) => b.createdAtS - a.createdAtS)

		const grantsForYou = [...membersGrants, ...builderGrants]
		setGrantsForYou(grantsForYou)

		return 'grants-for-you-fetched'
	}

	const getGrantsForAll = async() => {
		const results = await fetchMoreExploreGrants({ first: PAGE_SIZE, skip: 0 }, true)

		if(results?.length === 0 || results?.every((r) => !r?.grants?.length)) {
			return 'no-grants'
		}

		const allGrants: GrantType[] = []
		for(const result of results) {
			if(result?.grants?.length) {
				allGrants.push(...result?.grants.map(g => ({ ...g, role: 'community' as Roles })))
			}
		}

		logger.info({ allGrants }, 'All grants (DISCOVER CONTEXT)')
		allGrants.sort((a, b) => a.workspace.id === b.workspace.id ? b.workspace.supportedNetworks[0].localeCompare(a.workspace.supportedNetworks[0]) : b.createdAtS - a.createdAtS)
		setGrantsForAll(allGrants)

		return 'grants-for-all-fetched'
	}

	const fetchDetails = async() => {
		if(!inviteInfo?.workspaceId || !inviteInfo?.chainId) {
			return
		}

		logger.info({ inviteInfo }, 'Invite Info')

		const workspaceID = `0x${inviteInfo.workspaceId.toString(16)}`
		logger.info({ workspaceID }, 'Workspace ID')
		const results = await fetchGrantProgramData({ workspaceID }, true)
		logger.info({ results }, 'Results')

		if(!results?.length) {
			return
		}

		logger.info({ grantProgram: results[0] }, 'Results')
		setGrantProgram(results[0]?.grantProgram?.[0])
	}

	useEffect(() => {
		getGrantsForAll().then(r => logger.info(r, 'Get Grants for all'))
	}, [])

	useEffect(() => {
		getGrantsForYou().then(r => logger.info(r, 'Get Grants for you'))
	}, [scwAddress])

	useEffect(() => {
		if(inviteInfo) {
			fetchDetails()
		}
	}, [inviteInfo])

	return provider()
}

export { DiscoverContext, DiscoverProvider }