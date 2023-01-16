import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { useGetApplicationActionsQuery, useGetCommentsQuery, useGetGrantQuery, useGetProposalsQuery } from 'src/generated/graphql'
import logger from 'src/libraries/logger'
import { getKeyForApplication, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { CommentMap, CommentType, DashboardContextType, FundBuilderContextType, Proposals, ReviewInfo, SendAnUpdateContextType, SignerVerifiedState, TokenInfo } from 'src/screens/dashboard/_utils/types'
import { useMultiChainQuery } from 'src/screens/proposal/_hooks/useMultiChainQuery'
import { Roles } from 'src/types'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)
const FundBuilderContext = createContext<FundBuilderContextType | undefined>(undefined)
const SendAnUpdateContext = createContext<SendAnUpdateContextType | undefined>(undefined)

const DashboardProvider = ({ children }: PropsWithChildren<ReactNode>) => {
	const router = useRouter()
	const { grantId, chainId: _chainId, role: _role } = router.query
	const { setWorkspace } = useContext(ApiClientsContext)!
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { grant, setGrant, role, setRole, setIsLoading } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		try {
			logger.info({ _chainId }, 'Getting chainId from router query')
			return typeof _chainId === 'string' ? parseInt(_chainId) : -1
		} catch(e) {
			return -1
		}
	}, [_chainId])

	const { fetchMore: fetchGrantDetails } = useMultiChainQuery({
		useQuery: useGetGrantQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const { fetchMore: fetchMoreProposals } = useMultiChainQuery({
		useQuery: useGetProposalsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const { fetchMore: fetchMoreComments } = useMultiChainQuery({
		useQuery: useGetCommentsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const { fetchMore: fetchMoreApplicationActions } = useMultiChainQuery({
		useQuery: useGetApplicationActionsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const [proposals, setProposals] = useState<Proposals>([])
	const [commentMap, setCommentMap] = useState<CommentMap>({})
	const [selectedProposals, setSelectedProposals] = useState<Set<string>>(new Set<string>())
	const [review, setReview] = useState<ReviewInfo>()
	const [showSubmitReviewPanel, setShowSubmitReviewPanel] = useState<boolean>(false)

	const getGrant = useCallback(async() => {
		if(!grantId || chainId === -1 || typeof grantId !== 'string' || !scwAddress) {
			return
		}

		logger.info({ grantId, scwAddress }, 'Getting grant (ROLE)')
		const details = await fetchGrantDetails({ grantId, actorId: scwAddress.toLowerCase() }, true)
		logger.info({ details }, 'Grant details (ROLE)')
		if(!details?.[0]?.grant) {
			return
		}

		const _grant = details[0].grant
		setGrant(_grant)
		setWorkspace(_grant.workspace)

		const possibleRoles: Roles[] = ['community']

		if(_grant?.myApplications?.length > 0) {
			possibleRoles.push('builder')
		}

		for(const member of _grant?.workspace?.members ?? []) {
			if(member.actorId === scwAddress.toLowerCase()) {
				logger.info({ member }, 'Member (ROLE)')
				possibleRoles.push(member.accessLevel === 'reviewer' ? 'reviewer' : 'admin')
				break
			}
		}

		logger.info({ possibleRoles }, 'Possible roles (ROLE)')
		if(_role) {
			logger.info({ role: _role, check: possibleRoles.includes(_role as Roles) }, 'From params (ROLE)')
			// Check if the role the user is trying to access is valid
			if(possibleRoles.includes(_role as Roles)) {
				setRole(_role as Roles)
			} else {
				// Assign a role to the user based on the grant
				setRole(possibleRoles[possibleRoles.length - 1])
			}
		} else {
			// Assign a role to the user based on the grant
			setRole(possibleRoles[possibleRoles.length - 1])
		}
	}, [grantId, chainId, scwAddress])

	useEffect(() => {
		logger.info(role, 'Role changed (ROLE)')
	}, [role])

	const handleComments = async(allComments: CommentType[]) => {
		if(!webwallet || !scwAddress) {
			return {}
		}

		const commentMap: CommentMap = {}
		for(const comment of allComments) {
			logger.info({ comment }, 'comment before decrypt (COMMENT DECRYPT)')
			if(comment.isPrivate) {
				if(comment.id.indexOf(scwAddress.toLowerCase()) === -1) {
					logger.info({ comment }, 'public key not found (COMMENT DECRYPT)')
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

				for(const encrypted of comment.commentsEncryptedData?.filter(c => c.id.indexOf(scwAddress.toLowerCase()) !== -1) ?? []) {
					try {
						const decryptedData = JSON.parse(await channel.decrypt(encrypted.data))
						logger.info({ decryptedData }, 'comment decrypted (COMMENT DECRYPT)')

						if(decryptedData?.message) {
							const message = await getFromIPFS(decryptedData.message)
							const key = `${comment.application.id}.${getSupportedChainIdFromWorkspace(comment.workspace) ?? defaultChainId}`
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
				logger.info({ comment, condition1: comment?.commentsPublicHash !== undefined, condition2: comment?.message !== undefined }, 'PUBLIC COMMENT (ELSE)')
				// Cases
				// 1. It is an IPFS hash
				// 2. It is an empty string
				// 3. It has some comment in string format
				const key = `${comment.application.id}.${getSupportedChainIdFromWorkspace(comment.workspace) ?? defaultChainId}`
				if(comment?.commentsPublicHash !== undefined) {
					if(comment?.commentsPublicHash?.startsWith('Qm')) {
						const commentData = JSON.parse(await getFromIPFS(comment.commentsPublicHash))
						if(commentData?.message) {
							const message = await getFromIPFS(commentData.message)
							if(!commentMap[key]) {
								commentMap[key] = []
							}

							commentMap[key].push({ ...comment, ...commentData, message })
						}
					}
				} else if(comment?.message !== undefined) {
					if(!commentMap[key]) {
						commentMap[key] = []
					}

					let message = comment?.message
					if(message?.trim() === '') {
						message = `This proposal was ${comment.tag === 'approved' ? 'approved' : comment.tag === 'rejected' ? 'rejected' : 'asked to be resubmitted'}`
					}

					commentMap[key].push({ ...comment, message })
				}
			}
		}

		logger.info(commentMap, 'commentMap (COMMENT DECRYPT)')
		return commentMap
	}

	const getProposals = useCallback(async() => {
		logger.info({ role, grant, scwAddress }, 'Fetching proposals')
		if(!webwallet) {
			return 'no-webwallet'
		} else if(!scwAddress) {
			return 'no-scw-address'
		} else if(!grant) {
			return 'no-grant'
		}

		const proposals: Proposals = []

		let first = 100
		let skip = 0
		let shouldContinue = true
		do {
			const results = await fetchMoreProposals({ first, skip, grantID: grant.id }, true)
			logger.info({ results }, 'Results (Proposals)')
			if(results?.length === 0 || !results[0] || !results[0]?.grantApplications?.length) {
				shouldContinue = false
				break
			}

			proposals.push(...results[0]?.grantApplications)
			skip += first
		} while(shouldContinue)

		const allComments: CommentType[] = []
		first = 100
		skip = 0
		shouldContinue = true
		do {
			const results = await fetchMoreComments({ first, skip, grantId: grant.id }, true)
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

		logger.info({ allComments }, 'Fetched comments before actions')

		const results = await fetchMoreApplicationActions({ grantId: grant.id }, true)
		logger.info({ results }, 'Results (Application Actions)')
		if(results?.length > 0) {
			const result = results[0]
			for(const proposal of result?.grantApplications ?? []) {
				for(const action of proposal?.actions ?? []) {
					const comment: CommentType = {
						id: action.id,
						isPrivate: false,
						commentsPublicHash: action.feedback?.trim()?.startsWith('Qm') ? action.feedback : undefined,
						application: {
							id: proposal.id,
							applicantPublicKey: proposal.applicantPublicKey,
						},
						workspace: proposal.grant.workspace,
						tag: action.state,
						timestamp: action.updatedAtS,
						sender: action.updatedBy,
						role: proposal.grant.workspace.members.map(m => m.actorId).includes(action.updatedBy.toLowerCase()) ? 'admin' : 'builder',
						message: action.feedback?.trim()?.startsWith('Qm') ? undefined : action.feedback === null ? '' : action.feedback,
					}
					logger.info(comment, 'Dummy Comment')

					allComments.push(comment)
				}
			}
		}

		logger.info({ allComments }, 'Fetched comments after actions')
		const commentMap = await handleComments(allComments)
		logger.info(commentMap, 'Comment map')

		for(const key in commentMap) {
			const comments = commentMap[key]
			const sortedComments = comments.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
			commentMap[key] = sortedComments
		}

		setCommentMap(commentMap)

		setProposals(proposals)
		return 'grant-details-fetched'
	}, [role, grant, scwAddress])

	useEffect(() => {
		getGrant()
	}, [grantId, chainId, scwAddress])

	useEffect(() => {
		getProposals().then((r) => logger.info({ r }, 'Get proposals result'))
	}, [grant, chainId, scwAddress])

	useEffect(() => {
		if(!grant || !scwAddress || !role) {
			logger.info({ grant, scwAddress, role }, 'Loading state set to true')
			setIsLoading(true)
			return
		}
	}, [grant, chainId, scwAddress])

	useEffect(() => {
		if(proposals.length === 0) {
			setSelectedProposals(new Set<string>())
			if(scwAddress && grant) {
				setIsLoading(false)
			}

			return
		}

		const initialSelectionSet = new Set<string>()
		initialSelectionSet.add(proposals[0].id)
		logger.info({ initialSelectionSet }, 'selectedProposals')
		setSelectedProposals(initialSelectionSet)

		logger.info({ grant, scwAddress, role, proposals }, 'Loading state set to false')
		setIsLoading(false)
	}, [proposals])

	return (
		<DashboardContext.Provider
			value={
				{
					proposals,
					selectedProposals,
					setSelectedProposals,
					review,
					setReview,
					showSubmitReviewPanel,
					setShowSubmitReviewPanel,
					commentMap,
					setCommentMap
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