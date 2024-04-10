/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { WebwalletContext } from 'src/pages/_app'
import { GranteeContextType, RecentProposals, SectionGrants } from 'src/screens/grantees/_utils/types'
import { getSectionGrantsQuery } from 'src/screens/grantees/data/getSectionGrants'


const GranteeContext = createContext<GranteeContextType | null>(null)


const GranteeProvider = ({ children }: {children: ReactNode}) => {
	const provider = () => {
		return (
			<GranteeContext.Provider value={{ search, setSearch, sectionGrants, recentProposals, isLoading, buildersModal, setBuildersModal }}>
				{children}
			</GranteeContext.Provider>
		)
	}

	const { scwAddress } = useContext(WebwalletContext)!

	const [sectionGrants, setSectionGrants] = useState<SectionGrants>()
	const [recentProposals, setRecentProposals] = useState<RecentProposals>()

	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [buildersModal, setBuildersModal] = useState<boolean>(false)
	const [search, setSearch] = useState<string>('')

	const { fetchMore: fetchMoreSectionGrants } = useQuery({
		query: getSectionGrantsQuery,
	})


	const getSectionGrants = async() => {
		const results: any = await fetchMoreSectionGrants()
		logger.info({ results }, 'Section Grants')
		if(results?.sections?.length === 0) {
			setIsLoading(false)
			return 'no-grants'
		}

		const allSectionGrants: SectionGrants = []
		let recentProposals: RecentProposals = []

		if(results?.sections?.length) {
			allSectionGrants.push(...results?.sections.map((g: any) => ({ [g.sectionName]: { ...g } })))
			recentProposals = results.sections.map((s: any) => s.grants.
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


		logger.info({ allSectionGrants, recentProposals }, 'All section grants (Grantee CONTEXT)')

		// move selected grants to top of the list
		for(let i = 0; i < allSectionGrants.length; i++) {
			const key = Object.keys(allSectionGrants[i])[0]
			const topGrants = ['Arbitrum', 'Compound', 'TON Foundation', 'Alchemix', 'iExec']
			const hideGrants = ['Golden gate protocol', 'Aleph Zero', 'Solana Ecosystem', 'Polygon', 'Starknet']
			if(topGrants.includes(key)) {
				const temp = allSectionGrants[topGrants.indexOf(key)]
				allSectionGrants[topGrants.indexOf(key)] = allSectionGrants[i]
				allSectionGrants[i] = temp
			}

			if(hideGrants.includes(key)) {
				allSectionGrants.splice(i, 1)
				i--
			}
		}


		setSectionGrants(allSectionGrants)

		recentProposals.sort((a, b) => b.updatedAtS - a.updatedAtS)
		logger.info({ recentProposals }, 'All recent grants (Grantee CONTEXT)')
		setRecentProposals(recentProposals)
		setIsLoading(false)
	}


	useEffect(() => {
		getSectionGrants().then(r => logger.info(r, 'Get Section Grants'))
	}, [scwAddress])


	return provider()
}

export { GranteeContext, GranteeProvider }