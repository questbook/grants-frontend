import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { GetGrantsQuery, useGetGrantsQuery, useGetProposalsQuery } from 'src/generated/graphql'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { GRANT_CACHE_KEY } from 'src/screens/dashboard/_utils/constants'
import { DashboardContextType, Proposals } from 'src/screens/dashboard/_utils/types'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

const DashboardProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const { workspace } = useContext(ApiClientsContext)!
	const chainID = useMemo(() => {
		return getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
	}, [workspace])

	const { fetchMore: fetchMoreGrants } = useMultiChainQuery({
		useQuery: useGetGrantsQuery,
		options: {},
		chains: [chainID],
	})

	const { fetchMore: fetchMoreProposals } = useMultiChainQuery({
		useQuery: useGetProposalsQuery,
		options: {},
		chains: [chainID],
	})

	const [grants, setGrants] = useState<GetGrantsQuery['grants']>([])
	const [selectedGrantIndex, setSelectedGrantIndex] = useState<number>()
	const [proposals, setProposals] = useState<Proposals>([])
	const [selectedProposals, setSelectedProposals] = useState<boolean[]>([])

	const fetchSelectedGrant = useCallback(async() => {
		if(!workspace) {
			return 'domain-loading'
		}

		const KEY = `${GRANT_CACHE_KEY}-${chainID}-${workspace.id}`
		const grantID = localStorage.getItem(KEY)

		const results = await fetchMoreGrants({ domainID: workspace.id }, true)
		if(results?.length === 0 || !results[0]) {
			return 'some-error'
		}

		logger.info({ results }, 'Fetched grants')
		setGrants(results[0].grants)

		if(!grantID) {
			setSelectedGrantIndex(0)
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

	const getProposals = useCallback(async() => {
		logger.info({ selectedGrantIndex }, 'Fetching proposals')
		if(selectedGrantIndex === undefined) {
			return 'no-selected-grant-index'
		} else if(grants.length === 0) {
			setProposals([])
			return 'no-grants-no-proposal'
		} else if(!grants[selectedGrantIndex]?.id) {
			return 'no-grant-id'
		}

		const first = 100
		let skip = 0

		const proposals: Proposals = []
		let shouldContinue = true
		do {
			const results = await fetchMoreProposals({ first, skip, grantID: grants[selectedGrantIndex].id }, true)
			if(results?.length === 0 || !results[0] || !results[0]?.grantApplications?.length) {
				shouldContinue = false
				break
			}

			proposals.push(...results[0]?.grantApplications)
			skip += first
		} while(shouldContinue)

		setProposals(proposals)
		return 'grant-details-fetched'
	}, [grants, selectedGrantIndex])

	useEffect(() => {
		logger.info({ workspace }, 'Workspace changed')
		fetchSelectedGrant().then((ret) => {
			logger.info({ message: 'setSelectedGrant', ret }, 'Set selected grant')
		})
	}, [workspace])

	useEffect(() => {
		logger.info({ selectedGrantIndex }, 'Selected grant index changed')
		if(selectedGrantIndex !== undefined && selectedGrantIndex < grants?.length) {
			const KEY = `${GRANT_CACHE_KEY}-${chainID}-${workspace?.id}`
			localStorage.setItem(KEY, grants[selectedGrantIndex].id)
		}

		getProposals().then((ret) => {
			logger.info({ message: 'getProposals', ret }, 'Get proposals')
		})
	}, [grants, selectedGrantIndex])

	useEffect(() => {
		if(proposals.length === 0) {
			setSelectedProposals([])
			return
		}

		const arr = Array(proposals.length).fill(false)
		arr[0] = true
		setSelectedProposals(arr)
	}, [proposals])

	return (
		<DashboardContext.Provider
			value={
				{
					grants,
					proposals,
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