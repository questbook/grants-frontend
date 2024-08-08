/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { getBuilderProfileQuery } from 'src/libraries/data/getBuilderProfileQuery'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { AmplitudeContext } from 'src/libraries/utils/amplitude'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { extractBuilderInfo } from 'src/screens/discover/_utils'
import { DiscoverContextType, GrantProgramType, GrantType, RecentProposals, SectionGrants, StatsType, WorkspaceMemberType } from 'src/screens/discover/_utils/types'
import { getAllGrants } from 'src/screens/discover/data/getAllGrants'
import { getAllGrantsForMembers } from 'src/screens/discover/data/getAllGrantsForMembers'
import { GetGrantProgramDetails } from 'src/screens/discover/data/getGrantProgramDetails'
import { getProposalNameAndAuthorsQuery } from 'src/screens/discover/data/getProposalNameAndAuthors'
import { getSectionGrantsQuery } from 'src/screens/discover/data/getSectionGrants'
import { getSectionSubGrantsQuery } from 'src/screens/discover/data/getSectionSubGrants'
import { GetWorkspacesAndBuilderGrants } from 'src/screens/discover/data/getWorkspaceAndBuilderGrants'
import { Roles } from 'src/types'

const DiscoverContext = createContext<DiscoverContextType | null>(null)

const PAGE_SIZE = 25

const DiscoverProvider = ({ children }: {children: ReactNode}) => {
	const provider = () => {
		return (
			<DiscoverContext.Provider value={{ grantsForYou, grantsForAll, grantProgram, search, setSearch, sectionGrants, recentProposals, isLoading, safeBalances, stats, buildersModal, setBuildersModal, isBuilder }}>
				{children}
			</DiscoverContext.Provider>
		)
	}

	const { scwAddress, setBuilderProfile } = useContext(WebwalletContext)!
	const { trackAmplitudeEvent } = useContext(AmplitudeContext)!
	const { inviteInfo } = useContext(ApiClientsContext)!

	const [grantsForYou, setGrantsForYou] = useState<GrantType[]>([])
	const [grantsForAll, setGrantsForAll] = useState<GrantType[]>([])
	const [grantProgram, setGrantProgram] = useState<GrantProgramType>()
	const [sectionGrants, setSectionGrants] = useState<SectionGrants>()
	const [recentProposals, setRecentProposals] = useState<RecentProposals>()
	const [stats, setStats] = useState<StatsType>({
		builders: 0,
		proposals: 0,
		funds: 0,
	})

	const [isBuilder, setIsBuilder] = useState<boolean>(false)
	const [buildersModal, setBuildersModal] = useState<boolean>(false)
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

	const { fetchMore: fetchMoreProposalAuthorsAndName } = useQuery({
		query: getProposalNameAndAuthorsQuery,
	})

	// const { fetchMore: fetchFundsAllocated } = useQuery({
	// 	query: getFundsAllocated,
	// })

	const { fetchMore: getSubGrants } = useQuery({
		query: getSectionSubGrantsQuery
	})

	const { fetchMore: getBuilderData } = useQuery({
		query: getBuilderProfileQuery
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

	const getGrantsForYou = async() => {
		if(!scwAddress) {
			trackAmplitudeEvent('Not Signed In', { isSignedIn: false })
			return 'no-scw-address'
		}

		if(scwAddress) {
			// track the signed-in event with the scwAddress
			trackAmplitudeEvent('Signed In', { isSignedIn: scwAddress })
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

			first = 50, skip = 0
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
					membersGrants.push(...grants?.map((g: any) => ({ ...g, role: g.workspace.members.find((s: any) => s.actorId?.toLowerCase() === scwAddress.toLowerCase())?.accessLevel as Roles })))
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
		setIsLoading(false)


		const builderProfile = await getBuilderData({ wallet: `${scwAddress}` }, true) as {
			getProfile: {
				_id: string
				telegram: string
				username: string
				imageURL: string
				address: string
			}
		}
		logger.info({ builderProfile }, 'Builder Profile')
		if(builderProfile?.getProfile) {
			if(scwAddress?.toLowerCase() === builderProfile?.getProfile?.address?.toLowerCase()) {
				localStorage.setItem('userAvatar', builderProfile?.getProfile?.imageURL)
			}

			setBuilderProfile({
				_id: builderProfile.getProfile._id ?? '',
				telegram: builderProfile.getProfile.telegram ?? '',
				username: builderProfile.getProfile.username ?? '',
				imageURL: builderProfile.getProfile.imageURL ?? '',
				address: builderProfile?.getProfile?.address ?? '',
			})
		}

		return 'grants-for-you-fetched'
	}

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
		logger.info({ inviteInfo }, 'Invite Info')
		if(!inviteInfo?.workspaceId || !inviteInfo?.chainId) {
			return
		}

		logger.info({ inviteInfo }, 'Invite Info')

		const workspaceID = inviteInfo.workspaceId
		logger.info({ workspaceID }, 'Workspace ID')
		const results: any = await fetchGrantProgramData({ workspaceID }, true)
		logger.info({ results }, 'Results grant program')

		if(!results?.grantProgram?.length) {
			return
		}

		logger.info({ grantProgram: results?.grantProgram[0] }, 'Results')
		setGrantProgram(results?.grantProgram?.[0])
	}

	const getSectionGrants = async() => {
		const results: any = await fetchMoreSectionGrants()
		const subgrantsResults: any = await getSubGrants()
		logger.info({ results }, 'Section Grants')

		if(results?.sections?.length === 0) {
			return 'no-grants'
		}

		const allSectionGrants: SectionGrants = []
		let recentProposals: RecentProposals = []
		if(results?.sections?.length) {
			allSectionGrants.push(...results?.sections.map((g: any) => {
				// Create a new grants array with modified applications
				const modifiedGrants = g.grants.map((grant: any) => {
					const modifiedApplications = grant.applications.map((app: any) => ({
						...app,
						grant: {
							id: grant.id,
							title: grant.title,
							workspace: {
								logoIpfsHash: grant.workspace.logoIpfsHash,
								supportedNetworks: grant.workspace.supportedNetworks
							},
							reward: grant.reward
						}
					}))
					return { ...grant, applications: modifiedApplications }
				})
				recentProposals = [...recentProposals, ...modifiedGrants.flatMap((g: any) => g.applications)]
				return { [g.sectionName]: { ...g, grants: modifiedGrants } }
			}))
			// recentProposals = [...recentProposals, ...results.sections.map((s: any) => s.grants.map((g: any) => g.applications).flat()).flat()]

		}

		if(subgrantsResults?.grants?.length) {
			const arbitrum = allSectionGrants.find((s: any) => Object.keys(s)[0] === 'Arbitrum')
			if(arbitrum) {
				const modifiedSubgrants = subgrantsResults.grants.map((grant: any) => {
					const modifiedApplications = grant.applications?.map((app: any) => ({
						...app,
						grant: {
							id: grant.id,
							title: grant.title,
							workspace: {
								logoIpfsHash: grant.workspace?.logoIpfsHash,
								supportedNetworks: grant.workspace?.supportedNetworks
							},
							reward: grant.reward
						}
					})) || []

					// Add modified applications to recentProposals
					recentProposals = [...recentProposals, ...modifiedApplications]

					return { ...grant, applications: modifiedApplications }
				})

				allSectionGrants[allSectionGrants.indexOf(arbitrum)] = {
					Arbitrum: {
						...arbitrum.Arbitrum,
						grants: [
							...(arbitrum.Arbitrum.grants?.filter((g: any) => g.title?.includes('2.0')) || []),
							...modifiedSubgrants
						]
					}
				}
			}
		}


		logger.info({ allSectionGrants, recentProposals }, 'All section grants (DISCOVER CONTEXT)')

		// move selected grants to top of the list
		for(let i = 0; i < allSectionGrants.length; i++) {
			const topGrants = ['Arbitrum', 'Compound', 'TON Foundation', 'ENS', 'Alchemix', 'Axelar', 'Shido', 'Elastos', 'Haberdashery', 'iExec', 'Reclaim Protocol', 'Solana Ecosystem']

			// sort based on topGrants order
			allSectionGrants.sort((a, b) => {
				const aKey = Object.keys(a)[0]
				const bKey = Object.keys(b)[0]
				return topGrants.indexOf(aKey) - topGrants.indexOf(bKey)
			})


		}


		const recentProposalIds = recentProposals.map((p: any) => p.id)
		const fetchNameAndAuthors: any = await fetchMoreProposalAuthorsAndName({ ids: recentProposalIds }, true)
		logger.info({ fetchNameAndAuthors }, 'Fetch name and authors')
		setSectionGrants(allSectionGrants)
		recentProposals = await recentProposals.map((p: any) => {
		  const proposal = fetchNameAndAuthors?.grantApplications.find((g: any) => g._id === p.id)
		  return {
				...p,
				name: proposal?.name || p.name,
				author: proposal?.author || p.author,
		  }
		})

		recentProposals.sort((a, b) => b.updatedAtS - a.updatedAtS)
		logger.info({ recentProposals }, 'All recent grants (DISCOVER CONTEXT)')
		setRecentProposals(recentProposals)
	}

	const getStats = async() => {

		// const funds: any = await fetchFundsAllocated()
		// logger.info({ funds }, 'Funds')
		// function sumAmounts(data: any): number {
		// 	let total = 0

		// 	for(const grant of data.grants) {
		// 		for(const app of grant.applications) {
		// 			for(const milestone of app.milestones) {
		// 				total += milestone.amount
		// 			}
		// 		}
		// 	}

		// 	return total
		// }

		// iterate over all sections and sum the amounts
		// const total = funds.sections.reduce((acc: number, cur: any) => acc + sumAmounts(cur), 0)
		const total = 6200000
		setStats({ builders: 52000, proposals: 4000, funds: total + 786298 })

		return 'stats-fetched'
	}

	useEffect(() => {
		getGrantsForAll().then(r => logger.info(r, 'Get Grants for all'))
	}, [search])

	useEffect(() => {
		getSectionGrants().then(r => logger.info(r, 'Get Section Grants'))
	}, [scwAddress])

	useEffect(() => {
		getGrantsForYou().then(r => logger.info(r, 'Get Grants for you'))
	}, [scwAddress])

	useEffect(() => {
		if(inviteInfo) {
			fetchDetails()
		}
	}, [inviteInfo])

	useEffect(() => {
		const data = extractBuilderInfo()
		setIsBuilder(data)
	}, [])


	useEffect(() => {
		// if the window contains builderModal = true, then we will open the modal
		if(window.location.href.includes('builder_modal=true')) {
			setBuildersModal(true)
		}
	}, [])

	useEffect(() => {
		if(window.location.href.includes('grantId=') && sectionGrants?.length) {
			const grantId = window.location.href.split('grantId=')[1]
			window.history.pushState({}, '', window.location.href.split('?')[0])
			const element = grantId.includes('%20') ? document.getElementById(grantId.split('%20').join(' ')) : document.getElementById(grantId)
			if(element) {
				element.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}, [sectionGrants])


	useEffect(() => {
		// console.log('hi from',grantsForAll?.length, grantsForYou?.length, sectionGrants?.length)
		if(!grantsForAll?.length || !sectionGrants?.length) {
			return
		}

		const sGrants: GrantType[] = []
		for(const section of sectionGrants) {
			for(const key in section) {
				sGrants.push(...section[key].grants.map(g => ({ ...g, role: 'community' as Roles })))
			}
		}

		const allGrants = [...grantsForAll, ...grantsForYou, ...sGrants]
		fetchSafeBalances(allGrants)


	}, [grantsForAll, grantsForYou, sectionGrants])

	useEffect(() => {
		getStats().then(r => logger.info(r, 'Get Stats'))
	}, [sectionGrants?.length])

	return provider()
}

export { DiscoverContext, DiscoverProvider }