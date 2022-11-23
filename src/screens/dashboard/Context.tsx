import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { GetGrantQuery, GetGrantsQuery, useGetGrantQuery, useGetGrantsQuery, useGetWorkspaceMembersQuery } from 'src/generated/graphql'
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

	const [grants, setGrants] = useState<GetGrantsQuery['grants']>([])
	const [selectedGrantIndex, setSelectedGrantIndex] = useState<number>()
	const [selectedGrant, setSelectedGrant] = useState<GetGrantQuery['grant']>()
	const [selectedProposals, setSelectedProposals] = useState<boolean[]>([])

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

	const fetchSelectedGrant = useCallback(async() => {
		if(!workspace) {
			return 'domain-loading'
		}

		const KEY = `${GRANT_CACHE_KEY}-${chainID}-${workspace.id}`
		const grantID = localStorage.getItem(KEY)

		const results = await fetchMoreGrants({ domainID: workspace.id }, true)
		if(results?.length === 0 || !results[0] || results?.[0]?.grants?.length === 0) {
			return 'no-grants'
		}

		logger.info({ results }, 'Fetched grants')
		setGrants(results[0].grants)

		if(!grantID) {
			setSelectedGrantIndex(0)
			localStorage.setItem(KEY, results[0].grants[0].id)
			return 'grants-fetched-using-query'
		} else {
			const index = results[0].grants.findIndex((g) => g.id === grantID)
			logger.info({ index }, 'Grant index')
			if(index >= 0) {
				setSelectedGrantIndex(index)
			} else {
				setSelectedGrantIndex(0)
			}

			return 'grants-fetched-from-cache'
		}
	}, [workspace])

	const getGrantDetails = useCallback(async() => {
		logger.info({ selectedGrantIndex }, 'Fetching grant details')
		if(selectedGrantIndex === undefined) {
			return 'no-selected-grant-index'
		} else if(!grants[selectedGrantIndex]?.id) {
			return 'no-grant-id'
		}

		const first = 100
		let skip = 0
		const results = await fetchMoreGrantDetails({ first, skip, grantID: grants[selectedGrantIndex].id }, true)
		const tempGrant = results[0]?.grant
		if(results?.length === 0 || !results[0] || !tempGrant) {
			return 'no-grant-with-id'
		}

		let shouldContinue = true
		do {
			skip += first
			const moreResults = await fetchMoreGrantDetails({ first, skip, grantID: grants[selectedGrantIndex].id }, true)
			if(moreResults?.length === 0 || !moreResults[0] || !moreResults[0]?.grant?.applications) {
				shouldContinue = false
				break
			}

			tempGrant.applications = [...tempGrant?.applications, ...moreResults[0].grant.applications]
		} while(shouldContinue)

		setSelectedGrant(tempGrant)
		return 'grant-details-fetched'
	}, [selectedGrantIndex])

	const proposals = useMemo(() => {
		if(!selectedGrant) {
			return []
		}

		return selectedGrant.applications
	}, [selectedGrant])

	useEffect(() => {
		const arr = Array(proposals.length).fill(false)
		arr[0] = true
		setSelectedProposals(arr)
	}, [proposals])

	useEffect(() => {
		logger.info({ address: accountData?.address }, 'Account data changed')
		setSelectedWorkspace().then((ret) => {
			logger.info({ message: 'setSelectedWorkspace', ret }, 'Set selected workspace')
		})
	}, [accountData?.address])

	useEffect(() => {
		logger.info({ workspace }, 'Workspace changed')
		fetchSelectedGrant().then((ret) => {
			logger.info({ message: 'setSelectedGrant', ret }, 'Set selected grant')
		})
	}, [workspace])

	useEffect(() => {
		logger.info({ selectedGrantIndex }, 'Selected grant index changed')
		getGrantDetails().then((ret) => {
			logger.info({ message: 'getGrantDetails', ret }, 'Get grant details')
		})
	}, [selectedGrantIndex])

	return (
		<DashboardContext.Provider
			value={
				{
					grants,
					proposals,
					selectedGrant,
					setSelectedGrant,
					selectedGrantIndex,
					setSelectedGrantIndex,
					selectedProposals,
					setSelectedProposals
				}
			}>
			{children}
		</DashboardContext.Provider>
	)
}

export { DashboardContext, DashboardProvider }