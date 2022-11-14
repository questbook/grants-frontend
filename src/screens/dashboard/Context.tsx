import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { GetGrantQuery, useGetGrantQuery, useGetGrantsQuery, useGetWorkspaceMembersQuery } from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { DOMAIN_CACHE_KEY, GRANT_CACHE_KEY } from 'src/screens/dashboard/_utils/constants'
import { DashboardContextType } from 'src/screens/dashboard/_utils/types'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { MinimalWorkspace } from 'src/types'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const DashboardProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const { data: accountData } = useQuestbookAccount()
	const { workspace, setWorkspace } = useContext(ApiClientsContext)!
	const chainID = useMemo(() => {
		return getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
	}, [workspace])

	const { fetchMore: fetchWorkspaces } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersQuery,
		options: {}
	})

	const { fetchMore: fetchMoreGrants } = useMultiChainQuery({
		useQuery: useGetGrantsQuery,
		options: {},
		chains: [chainID],
	})

	const { fetchMore: fetchMoreGrantDetails } = useMultiChainQuery({
		useQuery: useGetGrantQuery,
		options: {},
		chains: [chainID],
	})

	const [grantID, setGrantID] = useState<string>()
	const [grant, setGrant] = useState<GetGrantQuery['grant']>()

	const setSelectedWorkspace = useCallback(async() => {
		if(!accountData?.address) {
			return 'no-account'
		}

		const results = await fetchWorkspaces({ actorId: accountData.address })
		if(!results?.length || !results?.[0]?.workspaceMembers?.length) {
			return 'no-workspace'
		}

		const workspaces: MinimalWorkspace[] = []
		for(const result of results) {
			if(result?.workspaceMembers?.length) {
				for(const mem of result.workspaceMembers) {
					if(mem?.workspace) {
						workspaces.push(mem.workspace)
					}
				}
			}
		}

		const savedWorkspaceData = localStorage.getItem(DOMAIN_CACHE_KEY)
		if(!savedWorkspaceData || savedWorkspaceData === 'undefined') {
			setWorkspace(workspaces[0])
			return 'workspaces-fetched-using-query'
		} else {
			const savedWorkspaceDataChain = savedWorkspaceData.split('-')[0]
			const savedWorkspaceDataId = savedWorkspaceData.split('-')[1]
			const i = workspaces.findIndex(
				(w) => w.id === savedWorkspaceDataId &&
	           		 w.supportedNetworks[0] === savedWorkspaceDataChain
			)
			setWorkspace(workspaces[i])
			return 'workspaces-fetched-from-cache'
		}
	}, [accountData?.address])

	const setSelectedGrant = useCallback(async() => {
		if(!workspace) {
			return 'domain-loading'
		}

		const KEY = `${GRANT_CACHE_KEY}-${chainID}-${workspace.id}`
		const grantID = localStorage.getItem(KEY)
		if(!grantID) {
			const results = await fetchMoreGrants({ domainID: workspace.id }, true)
			if(results?.length === 0 || !results[0] || results?.[0]?.grants?.length === 0) {
				return 'no-grants'
			}

			localStorage.setItem(KEY, results[0].grants[0].id)
			setGrantID(results[0].grants[0].id)
			return 'grants-fetched-using-query'
		} else {
			setGrantID(grantID)
			return 'grants-fetched-from-cache'
		}
	}, [workspace])

	const getGrantDetails = useCallback(async() => {
		if(!grantID) {
			return 'no-grant-ID'
		}

		const results = await fetchMoreGrantDetails({ grantID }, true)
		if(results?.length === 0 || !results[0]) {
			return 'no-grant-with-id'
		}

		setGrant(results[0].grant)
		return 'grant-details-fetched'
	}, [grantID])

	useEffect(() => {
		setSelectedWorkspace().then((ret) => {
			logger.info({ message: 'setSelectedWorkspace', ret }, 'Set selected workspace')
		})
	}, [accountData?.address])

	useEffect(() => {
		setSelectedGrant().then((ret) => {
			logger.info({ message: 'setSelectedGrant', ret }, 'Set selected grant')
		})
	}, [workspace])

	useEffect(() => {
		getGrantDetails().then((ret) => {
			logger.info({ message: 'getGrantDetails', ret }, 'Get grant details')
		})
	}, [grantID])

	return (
		<DashboardContext.Provider value={{ grant, setGrant }}>
			{children}
		</DashboardContext.Provider>
	)
}

export { DashboardContext, DashboardProvider }