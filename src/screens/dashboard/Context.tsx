import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { GetGrantsForAdminQuery, GetGrantsForReviewerQuery, useGetGrantsForAdminQuery, useGetGrantsForReviewerQuery, useGetProposalsForAdminQuery, useGetProposalsForReviewerQuery } from 'src/generated/graphql'
import logger from 'src/libraries/logger'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { GRANT_CACHE_KEY } from 'src/screens/dashboard/_utils/constants'
import { DashboardContextType, FundBuilderContextType, Proposals, ReviewInfo, SignerVerifiedState, TokenInfo } from 'src/screens/dashboard/_utils/types'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)
const FundBuilderContext = createContext<FundBuilderContextType | undefined>(undefined)

const DashboardProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const { workspace, chainId, role } = useContext(ApiClientsContext)!
	const { scwAddress } = useContext(WebwalletContext)!

	const { fetchMore: fetchMoreAdminGrants } = useMultiChainQuery({
		useQuery: useGetGrantsForAdminQuery,
		options: {},
		chains: [chainId],
	})

	const { fetchMore: fetchMoreReviewerGrants } = useMultiChainQuery({
		useQuery: useGetGrantsForReviewerQuery,
		options: {},
		chains: [chainId],
	})

	const { fetchMore: fetchMoreAdminProposals } = useMultiChainQuery({
		useQuery: useGetProposalsForAdminQuery,
		options: {},
		chains: [chainId],
	})

	const { fetchMore: fetchMoreReviewerProposals } = useMultiChainQuery({
		useQuery: useGetProposalsForReviewerQuery,
		options: {},
		chains: [chainId],
	})

	const [adminGrants, setAdminGrants] = useState<GetGrantsForAdminQuery['grants']>([])
	const [reviewerGrants, setReviewerGrants] = useState<GetGrantsForReviewerQuery['grantReviewerCounters']>([])
	const [selectedGrantIndex, setSelectedGrantIndex] = useState<number>()
	const [proposals, setProposals] = useState<Proposals>([])
	const [selectedProposals, setSelectedProposals] = useState<boolean[]>([])
	const [review, setReview] = useState<ReviewInfo>()

	const fetchSelectedGrant = useCallback(async() => {
		if(!workspace) {
			return 'domain-loading'
		}

		const KEY = `${GRANT_CACHE_KEY}-${chainId}-${workspace.id}`
		const grantID = localStorage.getItem(KEY)

		if(role === 'admin') {
			const results = await fetchMoreAdminGrants({ domainID: workspace.id }, true)
			if(results?.length === 0 || !results[0]) {
				return 'some-error-admin'
			}

			logger.info({ results }, 'Fetched grants (Admin)')
			setAdminGrants(results[0].grants)

			if(!grantID) {
				setSelectedGrantIndex(0)
				return 'grants-fetched-using-query-admin'
			} else {
				const index = results[0].grants.findIndex((g) => g.id === grantID)
				logger.info({ index }, 'Grant index (Admin)')
				if(index >= 0) {
					setSelectedGrantIndex(index)
				} else {
					setSelectedGrantIndex(0)
				}

				return 'grants-fetched-from-cache-admin'
			}
		} else if(role === 'reviewer') {
			const results = await fetchMoreReviewerGrants({ reviewerAddress: scwAddress, workspaceId: workspace.id }, true)
			if(results?.length === 0 || !results[0]) {
				return 'some-error-reviewer'
			}

			logger.info({ results }, 'Fetched grants (Reviewer)')
			setReviewerGrants(results[0].grantReviewerCounters)

			if(!grantID) {
				setSelectedGrantIndex(0)
				return 'grants-fetched-using-query-reviewer'
			} else {
				const index = results[0].grantReviewerCounters.findIndex((g) => g.grant.id === grantID)
				logger.info({ index }, 'Grant index (Reviewer)')
				if(index >= 0) {
					setSelectedGrantIndex(index)
				} else {
					setSelectedGrantIndex(0)
				}

				return 'grants-fetched-from-cache-reviewer'
			}
		}
	}, [workspace, role])

	const getProposals = useCallback(async() => {
		logger.info({ selectedGrantIndex }, 'Fetching proposals')
		if(selectedGrantIndex === undefined) {
			return 'no-selected-grant-index'
		} else if((role === 'admin' && adminGrants.length === 0) || (role === 'reviewer' && reviewerGrants.length === 0)) {
			setProposals([])
			return 'no-grants-no-proposal'
		} else if((role === 'admin' && !adminGrants[selectedGrantIndex]?.id) || (role === 'reviewer' && !reviewerGrants[selectedGrantIndex]?.grant?.id)) {
			return 'no-grant-id'
		}

		const first = 100
		let skip = 0

		const proposals: Proposals = []

		if(role === 'admin') {
			let shouldContinue = true
			do {
				const results = await fetchMoreAdminProposals({ first, skip, grantID: adminGrants[selectedGrantIndex].id }, true)
				if(results?.length === 0 || !results[0] || !results[0]?.grantApplications?.length) {
					shouldContinue = false
					break
				}

				proposals.push(...results[0]?.grantApplications)
				skip += first
			} while(shouldContinue)
		} else if(role === 'reviewer') {
			const proposalIds = [...reviewerGrants[selectedGrantIndex].grant.pendingApplications.map((app) => app.id), ...reviewerGrants[selectedGrantIndex].grant.doneApplications.map((app) => app.id)]
			const results = await fetchMoreReviewerProposals({ proposalIds }, true)

			if(results?.length === 0 || !results[0] || !results[0]?.grantApplications?.length) {
				return 'no-proposals-reviewer'
			}

			proposals.push(...results[0]?.grantApplications)
		}

		setProposals(proposals)
		return 'grant-details-fetched'
	}, [role, adminGrants, reviewerGrants, selectedGrantIndex])

	const selectedGrant = useMemo(() => {
		if(selectedGrantIndex === undefined || (role === 'admin' && (!adminGrants || selectedGrantIndex >= adminGrants?.length)) || (role === 'reviewer' && (!reviewerGrants || selectedGrantIndex >= reviewerGrants?.length))) {
			return
		}

		const temp = role === 'admin' ? adminGrants[selectedGrantIndex] : reviewerGrants[selectedGrantIndex]
		if(temp.__typename === 'Grant') {
			return temp
		} else if(temp.__typename === 'GrantReviewerCounter') {
			return temp.grant
		}
	}, [selectedGrantIndex, adminGrants, reviewerGrants])

	useEffect(() => {
		logger.info({ workspace }, 'Workspace changed')
		fetchSelectedGrant().then((ret) => {
			logger.info({ message: 'setSelectedGrant', ret }, 'Set selected grant')
		})
	}, [workspace])

	useEffect(() => {
		logger.info({ selectedGrantIndex }, 'Selected grant index changed')
		if(selectedGrantIndex !== undefined && selectedGrantIndex < adminGrants?.length && adminGrants[selectedGrantIndex]) {
			const KEY = `${GRANT_CACHE_KEY}-${chainId}-${workspace?.id}`
			localStorage.setItem(KEY, adminGrants[selectedGrantIndex].id)
		}

		getProposals().then((ret) => {
			logger.info({ message: 'getProposals', ret }, 'Get proposals')
		})
	}, [role, adminGrants, reviewerGrants, selectedGrantIndex])

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
				role === 'admin' ? {
					role: 'admin',
					grants: adminGrants,
					proposals,
					selectedGrantIndex,
					setSelectedGrantIndex,
					selectedProposals,
					setSelectedProposals,
					selectedGrant,
					review,
					setReview
				} : {
					role: 'reviewer',
					grants: reviewerGrants,
					proposals,
					selectedGrantIndex,
					setSelectedGrantIndex,
					selectedProposals,
					setSelectedProposals,
					selectedGrant,
					review,
					setReview
				}
			}>
			{children}
		</DashboardContext.Provider>
	)
}

const FundBuilderProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
	const [amounts, setAmounts] = useState<number[]>([])
	const [tos, setTos] = useState<string[]>([])
	const [milestoneIndices, setMilestoneIndices] = useState<number[]>([])

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
	const [signerVerifiedState, setSignerVerifiedState] = useState<SignerVerifiedState>('unverified')

	return (
		<FundBuilderContext.Provider value={{ tokenInfo, setTokenInfo, amounts, setAmounts, tos, setTos, milestoneIndices, setMilestoneIndices, isModalOpen, setIsModalOpen, isDrawerOpen, setIsDrawerOpen, signerVerifiedState, setSignerVerifiedState }}>
			{children}
		</FundBuilderContext.Provider>
	)
}

export { DashboardContext, DashboardProvider, FundBuilderContext, FundBuilderProvider }