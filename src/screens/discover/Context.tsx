/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { DiscoverContextType, GrantProgramType, GrantType, RecentProposals, SectionGrants, WorkspaceMemberType } from 'src/screens/discover/_utils/types'
import { getAllGrants } from 'src/screens/discover/data/getAllGrants'
import { getAllGrantsForMembers } from 'src/screens/discover/data/getAllGrantsForMembers'
import { getFundsAllocated } from 'src/screens/discover/data/getFundsAllocated'
import { getGranteeList } from 'src/screens/discover/data/getGranteeList'
import { GetGrantProgramDetails } from 'src/screens/discover/data/getGrantProgramDetails'
import { getSectionGrantsQuery } from 'src/screens/discover/data/getSectionGrants'
import { getSectionSubGrantsQuery } from 'src/screens/discover/data/getSectionSubGrants'
import { GetWorkspacesAndBuilderGrants } from 'src/screens/discover/data/getWorkspaceAndBuilderGrants'
import { Roles } from 'src/types'

const DiscoverContext = createContext<DiscoverContextType | null>(null)

const PAGE_SIZE = 40

const DiscoverProvider = ({ children }: {children: ReactNode}) => {
	const provider = () => {
		return (
			<DiscoverContext.Provider value={{ grantsForYou, grantsForAll, grantProgram, search, setSearch, sectionGrants, recentProposals, isLoading, safeBalances, grantsAllocated, sectionSubGrants }}>
				{children}
			</DiscoverContext.Provider>
		)
	}

	const { scwAddress } = useContext(WebwalletContext)!
	const { inviteInfo } = useContext(ApiClientsContext)!

	const [grantsForYou, setGrantsForYou] = useState<GrantType[]>([])
	const [grantsForAll, setGrantsForAll] = useState<GrantType[]>([])
	const [grantProgram, setGrantProgram] = useState<GrantProgramType>()
	const [sectionGrants, setSectionGrants] = useState<SectionGrants>()
	const [recentProposals, setRecentProposals] = useState<RecentProposals>()
	const [grantsAllocated, setGrantsAllocated] = useState<{
		total: number
		arbitrum1: number
		arbitrum2: number
		individualGrants: {id: string, amount: number}[]
	}>({
		total: 0,
		arbitrum1: 0,
		arbitrum2: 0,
		individualGrants: []
	})
	const [sectionSubGrants, setSectionSubGrants] = useState<GrantType[]>([])

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [search, setSearch] = useState<string>('')
	const [safeBalances, setSafeBalances] = useState<{[key: string]: number}>({})


	const { fetchMore: fetchMoreMemberGrants } = useQuery({
		query: getAllGrantsForMembers,
	})

	const { fetchMore: fetchMoreWorkspaces } = useQuery({
		query: GetWorkspacesAndBuilderGrants
	})


	const { fetchMore: fetchMoreExploreGrants } = useQuery({ query: getAllGrants, })

	const { fetchMore: fetchGrantProgramData } = useQuery({
		query: GetGrantProgramDetails,
	})

	const { fetchMore: fetchMoreSectionGrants } = useQuery({
		query: getSectionGrantsQuery,
	})

	const { fetchMore: getFunds } = useQuery({
		query: getFundsAllocated
	})

	const { fetchMore: getSubGrants } = useQuery({
		query: getSectionSubGrantsQuery
	})

	const { fetchMore: getGrantees } = useQuery({
		query: getGranteeList
	})

	const fetchSafeBalances = async(grants: GrantType[]) => {
		const safes: GrantType['workspace']['safe'][] = []
		const safeSet = new Set<string>()
		logger.info(grants, 'Grants Test (DISCOVER CONTEXT)')
		for(const safe of grants.map((g) => g.workspace.safe)) {
			if(!safe?.address || !safe?.chainId) {
				continue
			}

			const safeId = `${safe.chainId}-${safe.address}`
			if(safeSet.has(safeId)) {
				continue
			}

			safeSet.add(safeId)
			safes.push(safe)
		}

		logger.info({ safes }, 'Safes (DISCOVER CONTEXT)')

		const balances = await Promise.all(safes.map(async(safeObj) => {
			if(!safeObj?.address || !safeObj?.chainId) {
				logger.info({ safeObj }, 'No safe address or chainId (DISCOVER CONTEXT)')
				return 0
			}


			const safe = new SupportedPayouts().getSafe(parseInt(safeObj.chainId), safeObj.address)
			try {
				logger.info({ safe }, 'Safe (DISCOVER CONTEXT)')
				const balances = await safe.getTokenAndbalance()
				logger.info({ balances }, 'Balances (DISCOVER CONTEXT)')

				if(balances?.value) {
					const total = balances?.value?.reduce((acc: number, cur: {usdValueAmount: number}) => acc + cur.usdValueAmount, 0)
					localStorage.setItem(`safe-${safeObj.chainId}-${safeObj.address}`, total.toString())
					logger.info({ balances, safe }, 'Total (DISCOVER CONTEXT)')
					return total
				} else {
					return 0
				}
			} catch(e) {
				if(localStorage.getItem(`safe-${safeObj.chainId}-${safeObj.address}`)) {
					return parseInt(localStorage.getItem(`safe-${safeObj.chainId}-${safeObj.address}`) ?? '0')
				}

				logger.info({ safe }, 'Error (DISCOVER CONTEXT)')
				return 0
			}
		}))
		logger.info({ balances }, 'Balances (DISCOVER CONTEXT)')

		const safeBalances: {[key: string]: number} = {}
		for(let i = 0 ; i < safes.length ; i++) {
			const safeObj = safes[i]
			if(!safeObj?.address || !safeObj?.chainId) {
				continue
			}

			const safeId = `${safeObj.chainId}-${safeObj.address}`
			safeBalances[safeId] = balances[i]
		}

		logger.info({ safeBalances }, 'Safe balances (DISCOVER CONTEXT)')

		setSafeBalances(safeBalances)
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const results: any = await fetchMoreWorkspaces({ actorId: `/${scwAddress}/i`, first, skip }, true)
			logger.info({ results }, 'Results one')
			if(results?.length === 0 || (results?.workspaceMembers?.length === 0 && results?.grants?.length === 0)) {
				shouldContinue = false
				logger.info('No more results')
				setIsLoading(false)
				break
			}


			if(results?.workspaceMembers?.length) {
				const chainId = getSupportedChainIdFromWorkspace(results?.workspaceMembers[0]?.workspace)
				if(chainId) {
					if(!allWorkspaceMembers[chainId]) {
						allWorkspaceMembers[chainId] = []
					}

					allWorkspaceMembers[chainId].push(...results?.workspaceMembers)
				}
			}

			if(results?.grants?.length) {
				builderGrants.push(...results?.grants?.map((g: any) => ({ ...g, role: 'builder' as Roles })))
				setIsLoading(false)
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
				const results: any = await fetchMoreMemberGrants({ workspaces: workspaces.map(w => w.id), actorId: `/${scwAddress}/i`, first, skip }, true)
				logger.info(results, 'Results two')
				if(results?.grants?.length === 0) {
					shouldContinue = false
					break
				}

				const grants = results?.grants
				if(grants) {
					membersGrants.push(...grants?.map((g: any) => ({ ...g, role: g.workspace.members.find((s: any) => s.actorId === scwAddress.toLowerCase())?.accessLevel as Roles })))
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
		logger.info({ grantsForYou }, 'All grants for you (DISCOVER CONTEXT)')
		setGrantsForYou(grantsForYou)

		return 'grants-for-you-fetched'
	}

	const getGrantsAllocated = async() => {
		function sumAmounts(data: any): number {
			let total = 0

			for(const grant of data.grants) {
				for(const app of grant.applications) {
					for(const milestone of app.milestones) {
						total += milestone.amount
					}
				}
			}

			return total
		}

		function sumArbitrum(data: any, type: string): number {
			let total = 0

			for(const grant of data.grants) {
				if(grant.title.includes('Arbitrum') &&
				type === '1.0' ? !grant.title.includes('2.0') : grant.title.includes('2.0')) {
					for(const app of grant.applications) {
						for(const milestone of app.milestones) {
							total += milestone.amount
						}
					}
				}
			}

			return total
		}

		function sumAllocationForIndividualGrants(data: any): {id: string, amount: number}[] {
			const grants = []
			for(const grant of data.grants) {
				let total = 0
				for(const app of grant.applications) {
					for(const milestone of app.milestones) {
						total += milestone.amount
					}
				}

				grants.push({
					id: grant.id,
					amount: total
				})
			}

			return grants
		}


		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const funds: any = await getFunds()
		logger.info({ funds }, 'funds')
		const total = sumAmounts(funds.sections[0])
		const arbitrum1 = sumArbitrum(funds.sections[0], '1.0')
		const arbitrum2 = sumArbitrum(funds.sections[0], '2.0')
		const individualGrants = sumAllocationForIndividualGrants(funds.sections[0])
		setGrantsAllocated({
			total,
			arbitrum1,
			arbitrum2,
			individualGrants
		})
		return total
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const getGrantsForAll = async() => {

		 const results: any = await fetchMoreExploreGrants({ first: PAGE_SIZE, skip: 0, searchString: search }, true)
		logger.info({ results }, 'Results')
		if(results?.length === 0) {
			return 'no-grants'
		}

		const allGrants: GrantType[] = []

		if(results?.grants?.length) {
			const grantsCheck = results?.grants.map((g: any) => ({ ...g, role: 'community' as Roles }))
			allGrants.push(...grantsCheck)
		}

		logger.info({ allGrants }, 'All grants (DISCOVER CONTEXT)')
		allGrants.sort((a, b) => {
			const aWorkspaceId = a?.workspace?.id ?? ''
			const bWorkspaceId = b?.workspace?.id ?? ''

			const aSupportedNetwork =
				a?.workspace?.supportedNetworks?.[0]?.localeCompare('') ?? 0
			const bSupportedNetwork =
				b?.workspace?.supportedNetworks?.[0]?.localeCompare('') ?? 0

			if(aWorkspaceId === bWorkspaceId) {
				return bSupportedNetwork - aSupportedNetwork
			} else {
				return b.createdAtS - a.createdAtS
			}
		})

		setGrantsForAll(allGrants)

		return 'grants-for-all-fetched'
	}

	const fetchDetails = async() => {
		if(!inviteInfo?.workspaceId || !inviteInfo?.chainId) {
			return
		}

		logger.info({ inviteInfo }, 'Invite Info')

		const workspaceID = `${inviteInfo.workspaceId}`
		logger.info({ workspaceID }, 'Workspace ID')
		const results: any = await fetchGrantProgramData({ workspaceID }, true)
		logger.info({ results }, 'Results grant program')

		if(!results?.grantProgram?.length) {
			return
		}

		logger.info({ grantProgram: results?.grantProgram[0] }, 'Results')
		setGrantProgram(results?.grantProgram[0])
	}

	const getSectionGrants = async() => {
		const results: any = await fetchMoreSectionGrants()
		const subgrantsResults: any = await getSubGrants()
		const granteesResults: any = await getGrantees()
		logger.info({ results }, 'Section Grants')

		if(results?.sections?.length === 0) {
			return 'no-grants'
		}

		const allSectionGrants: SectionGrants = []
		let recentProposals: RecentProposals = []

		if(results?.sections?.length) {
			allSectionGrants.push(...results?.sections.map((g: any) => ({ [g.sectionName]: { ...g } })))
			recentProposals = granteesResults.sections.map((s: any) => s.grants.
				filter((g: any) => g.applications.length > 0).map((g: any) => {
					return g.applications.map((a: any) => {
						return {
							...a,
							sectionName: s.sectionName,
							grant: {
								title: g.title,
								id: g.id,
								workspace: g.workspace
							}
						}
					})
				}).flat()).flat()
		}

		if(subgrantsResults?.grants?.length) {
			setSectionSubGrants(subgrantsResults?.grants)
		}

		logger.info({ allSectionGrants, recentProposals }, 'All section grants (DISCOVER CONTEXT)')

		// move selected grants to top of the list
		for(let i = 0; i < allSectionGrants.length; i++) {
			const key = Object.keys(allSectionGrants[i])[0]
			const topGrants = ['Arbitrum', 'Compound', 'TON Foundation', 'iExec']
			if(topGrants.includes(key)) {
				const temp = allSectionGrants[topGrants.indexOf(key)]
				allSectionGrants[topGrants.indexOf(key)] = allSectionGrants[i]
				allSectionGrants[i] = temp
			}
		}


		recentProposals.sort((a, b) => b.updatedAtS - a.updatedAtS)
		logger.info({ recentProposals }, 'All recent grants (DISCOVER CONTEXT)')
		setSectionGrants(allSectionGrants)
		setRecentProposals(recentProposals)
	}

	// useEffect(() => {
	// 	getGrantsForAll().then(r => logger.info(r, 'Get Grants for all'))
	// }, [search])

	// useEffect(() => {
	// 	getGrantsForYou().then(r => logger.info(r, 'Get Grants for you'))
	// }, [scwAddress])
	useEffect(() => {
		getGrantsAllocated().then(r => logger.info(r, 'Get Grants Allocated'))
	}, [])

	useEffect(() => {
		getSectionGrants().then(r => logger.info(r, 'Get Section Grants'))
	}, [scwAddress])

	useEffect(() => {
		if(inviteInfo) {
			fetchDetails()
		}
	}, [inviteInfo])


	useEffect(() => {
		// console.log('hi from',grantsForAll?.length, grantsForYou?.length, sectionGrants?.length)
		if(!sectionGrants?.length) {
			return
		}

		const sGrants: GrantType[] = []
		for(const section of sectionGrants) {
			for(const key in section) {
				sGrants.push(...section[key].grants.map(g => ({ ...g, role: 'community' as Roles })))
			}
		}

		const allGrants = [...grantsForAll, ...grantsForYou, ...sGrants, ...sectionSubGrants]
		fetchSafeBalances(allGrants)


	}, [grantsForAll, grantsForYou, sectionGrants])

	return provider()
}

export { DiscoverContext, DiscoverProvider }