import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { GetCommentsForBuilderQuery, GetGrantsForAdminQuery, GetGrantsForReviewerQuery, useGetCommentsForBuilderQuery, useGetCommentsForGpMemberQuery, useGetGrantsForAdminQuery, useGetGrantsForReviewerQuery, useGetProposalsForAdminQuery, useGetProposalsForBuilderQuery, useGetProposalsForReviewerQuery } from 'src/generated/graphql'
import logger from 'src/libraries/logger'
import { getKeyForApplication, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { GRANT_CACHE_KEY } from 'src/screens/dashboard/_utils/constants'
import { CommentMap, DashboardContextType, FundBuilderContextType, Proposals, ReviewInfo, SendAnUpdateContextType, SignerVerifiedState, TokenInfo } from 'src/screens/dashboard/_utils/types'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { getFromIPFS } from 'src/utils/ipfsUtils'

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)
const FundBuilderContext = createContext<FundBuilderContextType | undefined>(undefined)
const SendAnUpdateContext = createContext<SendAnUpdateContextType | undefined>(undefined)

const DashboardProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const { workspace, chainId, role } = useContext(ApiClientsContext)!
	useEffect(() => {
		logger.info({ role }, 'Tracking role')
	}, [role])
	const { scwAddress, webwallet } = useContext(WebwalletContext)!

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

	const { fetchMore: fetchMoreBuilderProposals } = useMultiChainQuery({
		useQuery: useGetProposalsForBuilderQuery,
		options: {},
	})

	const { fetchMore: fetchMoreGpMemberComments } = useMultiChainQuery({
		useQuery: useGetCommentsForGpMemberQuery,
		options: {},
		chains: [chainId]
	})

	const { fetchMore: fetchMoreBuilderComments } = useMultiChainQuery({
		useQuery: useGetCommentsForBuilderQuery,
		options: {},
	})

	const [adminGrants, setAdminGrants] = useState<GetGrantsForAdminQuery['grants']>([])
	const [reviewerGrants, setReviewerGrants] = useState<GetGrantsForReviewerQuery['grantReviewerCounters']>([])
	const [selectedGrantIndex, setSelectedGrantIndex] = useState<number>()
	const [proposals, setProposals] = useState<Proposals>([])
	const [selectedProposals, setSelectedProposals] = useState<boolean[]>([])
	const [review, setReview] = useState<ReviewInfo>()
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [showSubmitReviewPanel, setShowSubmitReviewPanel] = useState<boolean>(false)
	const [commentMap, setCommentMap] = useState<CommentMap>({})

	useEffect(() => {
		logger.info({ isLoading }, 'Loading')
	}, [isLoading])

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

			logger.info({ reviewerGrants: results[0].grantReviewerCounters }, 'Fetched grants (Reviewer)')
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
		} else if(role === 'builder') {
			setSelectedGrantIndex(undefined)
		}
	}, [workspace, role])

	const handleComments = async(allComments: Exclude<GetCommentsForBuilderQuery['comments'], null | undefined>) => {
		if(!webwallet || !scwAddress) {
			return {}
		}

		const commentMap: CommentMap = {}
		for(const comment of allComments) {
			if(comment.id.indexOf(scwAddress.toLowerCase()) === -1) {
				continue
			}

			const sender = comment.id.split('.')[1]
			let channel: {
				encrypt(plaintext: string): Promise<string>
				decrypt(ciphertext: string): Promise<string>
			}
			if(sender === scwAddress.toLowerCase()) {
				channel = await getSecureChannelFromPublicKey(webwallet, webwallet.publicKey, getKeyForApplication(comment.application.id))
				logger.info({ privateKey: webwallet.privateKey, publicKey: webwallet.publicKey, role }, 'CHANNEL CONFIG (COMMENT DECRYPT)')
			} else {
				const publicKey = comment.application.applicantPublicKey
				if(!publicKey) {
					continue
				}

				logger.info({ publicKey }, 'PUBLIC KEY (COMMENT DECRYPT)')
				channel = await getSecureChannelFromPublicKey(webwallet, publicKey, getKeyForApplication(comment.application.id))
				logger.info({ privateKey: webwallet.privateKey, publicKey, role }, 'CHANNEL CONFIG (COMMENT DECRYPT)')
			}

			logger.info({ comment }, 'comment before decrypt (COMMENT DECRYPT)')
			if(comment.isPrivate) {
				for(const encrypted of comment.commentsEncryptedData?.filter(c => c.id.indexOf(scwAddress.toLowerCase()) !== -1) ?? []) {
					try {
						const decryptedData = JSON.parse(await channel.decrypt(encrypted.data))
						logger.info({ decryptedData }, 'comment decrypted (COMMENT DECRYPT)')

						if(decryptedData?.message) {
							const message = await getFromIPFS(decryptedData.message)
							const key = `${comment.application.id}.${chainId}`
							if(!commentMap[key]) {
								commentMap[key] = []
							}

							commentMap[key].push({ ...comment, ...decryptedData, message })
						}
					} catch(e) {
						logger.error({ comment, e }, 'Error decrypting comment (COMMENT DECRYPT)')
					}
				}
			} else {
				if(comment?.commentsPublicHash) {
					const message = await getFromIPFS(comment.commentsPublicHash)
					const key = `${comment.application.id}.${chainId}`
					if(!commentMap[key]) {
						commentMap[key] = []
					}

					commentMap[key].push({ ...comment, message })
				}
			}
		}

		return commentMap
	}

	const getProposals = useCallback(async() => {
		logger.info({ role, adminGrants, reviewerGrants, selectedGrantIndex, scwAddress }, 'Fetching proposals')
		if(!webwallet) {
			return 'no-webwallet'
		} else if(!scwAddress) {
			return 'no-scw-address'
		}

		if((role === 'admin' || role === 'reviewer') && selectedGrantIndex === undefined) {
			return 'no-selected-grant-index'
		} else if((role === 'admin' && adminGrants.length === 0) || (role === 'reviewer' && reviewerGrants.length === 0)) {
			setProposals([])
			return 'no-grants-no-proposal'
		} else if(selectedGrantIndex !== undefined && ((role === 'admin' && !adminGrants[selectedGrantIndex]?.id) || (role === 'reviewer' && !reviewerGrants[selectedGrantIndex]?.grant?.id))) {
			return 'no-grant-id'
		}

		const proposals: Proposals = []

		if(role === 'admin' && selectedGrantIndex !== undefined) {
			logger.info({}, 'As admin')
			const first = 100
			let skip = 0
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
		} else if(role === 'reviewer' && selectedGrantIndex !== undefined) {
			logger.info({ reviewerGrants }, 'As reviewer 1')
			const proposalIds = [...reviewerGrants[selectedGrantIndex].grant.pendingApplications.map((app) => app.id), ...reviewerGrants[selectedGrantIndex].grant.doneApplications.map((app) => app.id)]
			logger.info(proposalIds, 'As reviewer 2')
			const results = await fetchMoreReviewerProposals({ proposalIds }, true)
			logger.info(results, 'As reviewer 3')

			if(results?.length === 0 || !results[0] || !results[0]?.grantApplications?.length) {
				return 'no-proposals-reviewer'
			}

			logger.info({ reviewerProposals: results[0]?.grantApplications }, 'Fetched proposals (Reviewer)')
			proposals.push(...results[0]?.grantApplications)
		} else if(role === 'builder') {
			logger.info({}, 'As builder')
			const first = 100
			let skip = 0
			let shouldContinue = true
			do {
				const results = await fetchMoreBuilderProposals({ first, skip, builderId: scwAddress }, true)
				logger.info({ results }, 'Results (Builder)')
				if(results?.length === 0 || results?.every((r) => !r?.grantApplications?.length)) {
					shouldContinue = false
					break
				}

				for(const result of results) {
					if(!result?.grantApplications?.length) {
						continue
					}

					proposals.push(...result?.grantApplications)
				}

				skip += first
			} while(shouldContinue)

			logger.info({ proposals }, 'Fetched proposals (Builder)')
		}

		const adminCondition = ((role === 'admin' || role === 'reviewer') && selectedGrantIndex !== undefined)
		const builderCondition = role === 'builder'
		if(adminCondition || builderCondition) {
			const allComments = []
			const first = 100
			let skip = 0
			let shouldContinue = true
			do {
				const results = adminCondition ? await fetchMoreGpMemberComments({ first, skip, grantId: adminGrants[selectedGrantIndex].id }, true) : await fetchMoreBuilderComments({ first, skip, actorId: scwAddress }, true)
				logger.info({ results }, 'Results (Comments)')
				if(results?.length === 0 || results?.every((r) => !r?.comments?.length)) {
					shouldContinue = false
					break
				}

				for(const result of results) {
					if(!result?.comments?.length) {
						continue
					}

					allComments.push(...result?.comments)
				}

				skip += first
			} while(shouldContinue)

			logger.info({ allComments }, 'Fetched comments')
			const commentMap = await handleComments(allComments)
			logger.info(commentMap, 'Comment map')
			setCommentMap(commentMap)
		} else if(role === 'community') {
			setCommentMap({})
		}


		setProposals(proposals)
		return 'grant-details-fetched'
	}, [role, adminGrants, reviewerGrants, selectedGrantIndex, scwAddress])

	const selectedGrant = useMemo(() => {
		if(selectedGrantIndex === undefined || (role === 'admin' && (!adminGrants || selectedGrantIndex >= adminGrants?.length)) || (role === 'reviewer' && (!reviewerGrants || selectedGrantIndex >= reviewerGrants?.length))) {
			return
		} else if(role === 'builder' || role === 'community') {
			return undefined
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
	}, [workspace, role])

	useEffect(() => {
		logger.info({ role, adminGrants, reviewerGrants, selectedGrantIndex, scwAddress }, 'Selected grant index changed')
		if(selectedGrantIndex !== undefined && selectedGrantIndex < adminGrants?.length && adminGrants[selectedGrantIndex]) {
			const KEY = `${GRANT_CACHE_KEY}-${chainId}-${workspace?.id}`
			localStorage.setItem(KEY, adminGrants[selectedGrantIndex].id)
		}

		getProposals().then((ret) => {
			logger.info({ message: 'getProposals', ret }, 'Get proposals')
			if(scwAddress && ret === 'grant-details-fetched') {
				setIsLoading(false)
			}
		})
	}, [role, adminGrants, reviewerGrants, selectedGrantIndex, scwAddress])

	useEffect(() => {
		if(proposals.length === 0) {
			setSelectedProposals([])
			return
		}

		const arr = Array(proposals.length).fill(false)
		arr[0] = true
		setSelectedProposals(arr)
	}, [proposals])

	useEffect(() => {
		if(scwAddress) {
			setIsLoading(true)
		}
	}, [scwAddress])

	const baseValue = useMemo(() => {
		return {
			proposals,
			selectedGrantIndex,
			setSelectedGrantIndex,
			selectedProposals,
			setSelectedProposals,
			selectedGrant,
			review,
			setReview,
			isLoading,
			showSubmitReviewPanel,
			setShowSubmitReviewPanel,
			commentMap,
			setCommentMap
		}
	}, [proposals,
		selectedGrantIndex,
		setSelectedGrantIndex,
		selectedProposals,
		setSelectedProposals,
		selectedGrant,
		review,
		setReview,
		isLoading,
		showSubmitReviewPanel,
		setShowSubmitReviewPanel,
		commentMap,
		setCommentMap])

	return (
		<DashboardContext.Provider
			value={
				role === 'admin' ? {
					role: 'admin',
					grants: adminGrants,
					...baseValue
				} : role === 'reviewer' ? {
					role: 'reviewer',
					grants: reviewerGrants,
					...baseValue
				} : {
					role: 'builder',
					grants: [],
					...baseValue
				}
			}>
			{children}
		</DashboardContext.Provider>
	)
}

const FundBuilderProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const [tokenList, setTokenList] = useState<TokenInfo[]>()
	const [selectedTokenInfo, setSelectedTokenInfo] = useState<TokenInfo>()
	const [amounts, setAmounts] = useState<number[]>([])
	const [tos, setTos] = useState<string[]>([])
	const [milestoneIndices, setMilestoneIndices] = useState<number[]>([])

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
	const [signerVerifiedState, setSignerVerifiedState] = useState<SignerVerifiedState>('unverified')

	return (
		<FundBuilderContext.Provider
			value={
				{

					tokenList,
					setTokenList,
					selectedTokenInfo,
					setSelectedTokenInfo,
					amounts,
					setAmounts,
					tos,
					setTos,
					milestoneIndices,
					setMilestoneIndices,
					isModalOpen,
					setIsModalOpen,
					isDrawerOpen,
					setIsDrawerOpen,
					signerVerifiedState,
					setSignerVerifiedState,
				}
			}>
			{children}
		</FundBuilderContext.Provider>
	)
}

const SendAnUpdateProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

	return (
		<SendAnUpdateContext.Provider value={{ isModalOpen, setIsModalOpen }}>
			{children}
		</SendAnUpdateContext.Provider>
	)
}

export { DashboardContext, DashboardProvider, FundBuilderContext, FundBuilderProvider, SendAnUpdateContext, SendAnUpdateProvider }