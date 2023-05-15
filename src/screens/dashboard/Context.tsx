import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { TokenDetailsInterface } from '@questbook/supported-safes/lib/types/Safe'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import { ApplicationState, useGetApplicationActionsQuery, useGetCommentsQuery, useGetGrantQuery, useGetProposalsQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/libraries/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { getFromIPFS } from 'src/libraries/utils/ipfs'
import { getKeyForApplication, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { CommentMap, CommentType, DashboardContextType, FundBuilderContextType, ModalContextType, Proposals, ReviewInfo, SignerVerifiedState } from 'src/screens/dashboard/_utils/types'
import { Roles } from 'src/types'

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)
const FundBuilderContext = createContext<FundBuilderContextType | undefined>(undefined)
const ModalContext = createContext<ModalContextType | undefined>(undefined)

const DashboardProvider = ({ children }: { children: ReactNode }) => {
	const router = useRouter()
	const { setSafeObj } = useSafeContext()!
	const { grantId, chainId: _chainId, role: _role, proposalId, isRenderingProposalBody } = router.query
	useEffect(() => {
		logger.info({ grantId, _chainId, _role, proposalId, isRenderingProposalBody }, 'ROUTER PARAMS DASHBOARD CONTEXT')
	}, [grantId, _chainId, _role, proposalId, isRenderingProposalBody])
	const { setWorkspace } = useContext(ApiClientsContext)!
	const { scwAddress, webwallet, setDashboardStep } = useContext(WebwalletContext)!
	const { grant, setGrant, role, setRole, setIsLoading } = useContext(GrantsProgramContext)!

	const chainId = useMemo(() => {
		try {
			logger.info({ _chainId }, 'Getting chainId from router query')
			return typeof _chainId === 'string' ? parseInt(_chainId) : -1
		} catch (e) {
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
	const [areCommentsLoading, setAreCommentsLoading] = useState<boolean>(false)
	const [filterState, setFilterState] = useState<ApplicationState>()

	const getGrant = useCallback(async () => {
		if (!grantId || chainId === -1 || typeof grantId !== 'string') {
			return 'params-missing'
		}

		logger.info({ grantId, scwAddress }, 'Getting grant (GET GRANT)')
		const details = await fetchGrantDetails({ grantId, actorId: scwAddress ? scwAddress.toLowerCase() : '0x0000000000000000000000000000000000000000' }, true)
		logger.info({ details }, 'Grant details (GET GRANT)')
		if (!details?.[0]?.grant) {
			return 'no-grant-in-query'
		}

		const _grant = details[0].grant
		logger.info({ _grant }, 'Setting grant (GET GRANT)')
		setGrant(_grant)
		setWorkspace(_grant.workspace)

		if (_grant?.workspace?.safe) {
			const currentSafe = new SupportedPayouts().getSafe(_grant.workspace?.safe?.chainId ? parseInt(_grant.workspace?.safe?.chainId) : defaultChainId, _grant.workspace?.safe?.address ?? '')
			setSafeObj(currentSafe)
		}

		logger.info({ _grant, scwAddress }, 'Setting role (GET GRANT)')

		const possibleRoles: Roles[] = ['community']

		if (_grant?.myApplications?.length > 0) {
			possibleRoles.push('builder')
		}

		if (scwAddress) {
			for (const member of _grant?.workspace?.members ?? []) {
				if (member.actorId === scwAddress.toLowerCase()) {
					logger.info({ member }, 'Member (ROLE)')
					possibleRoles.push(member.accessLevel === 'reviewer' ? 'reviewer' : 'admin')
					break
				}
			}
		}

		logger.info({ possibleRoles }, 'Possible roles (GET GRANT)')
		if (_role) {
			logger.info({ role: _role, check: possibleRoles.includes(_role as Roles) }, 'Role from params (GET GRANT)')
			// Check if the role the user is trying to access is valid
			if (possibleRoles.includes(_role as Roles)) {
				setRole(_role as Roles)
			} else {
				// Assign a role to the user based on the grant
				setRole(possibleRoles[possibleRoles.length - 1])
			}
		} else {
			// Assign a role to the user based on the grant
			setRole(possibleRoles[possibleRoles.length - 1])
		}

		return 'grant-details-fetched'
	}, [grantId, chainId, scwAddress])

	const handleComments = async (allComments: CommentType[]) => {
		const commentMap: CommentMap = {}
		for (const comment of allComments) {
			if (comment.isPrivate) {
				logger.info({ comment }, 'PRIVATE COMMENT before decrypt (COMMENT DECRYPT)')

				// if(comment.commentsEncryptedData?. .indexOf(scwAddress.toLowerCase()) === -1) {
				// 	logger.info({ comment }, 'public key not found (COMMENT DECRYPT)')
				// 	continue
				// }

				const sender = comment.id.split('.')[1]
				let channel: {
					encrypt(plaintext: string): Promise<string>
					decrypt(ciphertext: string): Promise<string>
				} | undefined = undefined
				logger.info({ sender, scwAddress: scwAddress?.toLowerCase() }, 'SENDER (COMMENT DECRYPT)')
				if (webwallet && sender === scwAddress?.toLowerCase()) {
					channel = await getSecureChannelFromPublicKey(webwallet, webwallet.publicKey, getKeyForApplication(comment.application.id))
					logger.info({ privateKey: webwallet.privateKey, publicKey: webwallet.publicKey, role }, 'CHANNEL CONFIG (COMMENT DECRYPT)')
				} else if (webwallet) {
					const publicKey = comment.application.applicantId === sender ? comment.application.applicantPublicKey : comment.workspace.members.find(m => m.actorId === sender)?.publicKey
					if (!publicKey) {
						logger.info({ comment }, 'public key not found (COMMENT DECRYPT)')
						continue
					}

					logger.info({ publicKey }, 'PUBLIC KEY (COMMENT DECRYPT)')
					channel = await getSecureChannelFromPublicKey(webwallet, publicKey, getKeyForApplication(comment.application.id))
					logger.info({ privateKey: webwallet.privateKey, publicKey, role }, 'CHANNEL CONFIG (COMMENT DECRYPT)')
				}

				const encryptedComments = scwAddress !== undefined ? (comment.commentsEncryptedData?.filter(c => c.id.indexOf(scwAddress.toLowerCase()) !== -1) ?? []) : []
				const key = `${comment.application.id}.${getSupportedChainIdFromWorkspace(comment.workspace) ?? defaultChainId}`
				logger.info({ encryptedComments }, 'ENCRYPTED COMMENTS (COMMENT DECRYPT)')
				if (encryptedComments.length === 0) {
					const workspaceMember = comment.workspace.members.find(m => m.actorId === sender)?.accessLevel
					const role = comment.application.applicantId === sender ? 'builder' : workspaceMember === 'owner' ? 'admin' : workspaceMember
					if (!commentMap[key]) {
						commentMap[key] = []
					}

					commentMap[key].push({ ...comment, sender, role: role ?? 'community', message: '*** This is an encrypted comment ***', timestamp: comment.createdAt })
					continue
				} else if (channel) {
					const encrypted = encryptedComments[0]
					logger.info({ encrypted }, 'DECRYPTING NOW (COMMENT DECRYPT)')
					try {
						const decryptedData = JSON.parse(await channel.decrypt(encrypted.data))
						logger.info({ decryptedData }, 'comment decrypted (COMMENT DECRYPT)')

						if (decryptedData?.message) {
							const message = await getFromIPFS(decryptedData.message)

							if (!commentMap[key]) {
								commentMap[key] = []
							}

							commentMap[key].push({ ...comment, ...decryptedData, message })
						} else {
							logger.info({ comment }, 'NO MESSAGE (COMMENT DECRYPT)')
						}
					} catch (e) {
						logger.error({ comment, e }, 'Error decrypting comment (COMMENT DECRYPT)')
					}
				}
			} else {
				logger.info({ comment }, 'PUBLIC COMMENT (ELSE)')
				// Cases
				// 1. It is an IPFS hash
				// 2. It is an empty string
				// 3. It has some comment in string format
				const key = `${comment.application.id}.${getSupportedChainIdFromWorkspace(comment.workspace) ?? defaultChainId}`
				if (comment?.commentsPublicHash !== undefined) {
					if (comment?.commentsPublicHash?.startsWith('Qm')) {
						const commentData = JSON.parse(await getFromIPFS(comment.commentsPublicHash))
						if (commentData?.message) {
							const message = await getFromIPFS(commentData.message)
							if (!commentMap[key]) {
								commentMap[key] = []
							}

							commentMap[key].push({ ...comment, ...commentData, message })
						}
					}
				} else if (comment?.message !== undefined) {
					if (!commentMap[key]) {
						commentMap[key] = []
					}

					let message = comment?.message
					if (message?.trim() === '') {
						if (comment.role === 'builder' && comment.tag === 'submitted') {
							message = 'This proposal was resubmitted'
						} else if (comment.tag === 'approved') {
							message = 'Your proposal is accepted'
						} else if (comment.tag === 'rejected') {
							message = 'Sorry! we won\'t be able to proceed with your proposal'
						} else if (comment.tag === 'resubmit') {
							message = 'Please resubmit your proposal'
						}
					}

					commentMap[key].push({ ...comment, message })
				}
			}
		}

		const tempCommentMap = { ...commentMap }
		for (const application in tempCommentMap) {
			const comments = commentMap[application]
			for (const comment of comments) {
				if (comment.role === 'community') {
					const workspaceMember = comment.workspace.members.find(m => m.actorId === comment.sender?.toLowerCase())?.accessLevel
					const role = comment.application.applicantId === comment.sender?.toLowerCase() ? 'builder' : workspaceMember === 'owner' ? 'admin' : workspaceMember
					comment.role = role ?? 'community'
				}
			}
		}

		logger.info(tempCommentMap, 'commentMap (COMMENT DECRYPT)')
		return tempCommentMap
	}

	const getProposals = useCallback(async () => {
		logger.info({ role, grantId, scwAddress }, 'Fetching proposals (GET PROPOSALS)')
		// if(!webwallet) {
		// 	return 'no-webwallet'
		// }
		if (!grantId || typeof grantId !== 'string') {
			return 'no-grant-id'
		}

		const proposals: Proposals = []

		const first = 100
		let skip = 0
		let shouldContinue = true
		do {
			const results = await fetchMoreProposals({ first, skip, grantID: grantId }, true)
			logger.info({ results }, 'Results (Proposals)')
			if (results?.length === 0 || !results[0] || !results[0]?.grantApplications?.length) {
				shouldContinue = false
				break
			}

			proposals.push(...results[0]?.grantApplications)
			skip += first
		} while (shouldContinue)

		setProposals(proposals)
		setAreCommentsLoading(true)
		await getComments()

		return 'proposals-fetched'
	}, [role, grantId, scwAddress, webwallet])

	const getComments = useCallback(async () => {
		logger.info({ role, grantId, scwAddress }, 'Fetching comments (GET COMMENTS)')
		// if(!webwallet) {
		// 	return 'no-webwallet'
		// }
		if (!grantId || typeof grantId !== 'string') {
			return 'no-grant-id'
		}

		const allComments: CommentType[] = []
		const first = 100
		let skip = 0
		let shouldContinue = true
		do {
			const results = await fetchMoreComments({ first, skip, grantId }, true)
			logger.info({ results }, 'Results (Comments)')
			if (results?.length === 0 || results?.every((r) => !r?.comments?.length)) {
				shouldContinue = false
				break
			}

			for (const result of results) {
				if (!result?.comments?.length) {
					continue
				}

				allComments.push(...result?.comments)
			}

			skip += first
		} while (shouldContinue)

		logger.info({ allComments }, 'Fetched comments before actions')

		const results = await fetchMoreApplicationActions({ grantId }, true)
		logger.info({ results }, 'Results (Application Actions)')
		if (results?.length > 0) {
			const result = results[0]
			for (const proposal of result?.grantApplications ?? []) {
				for (const action of proposal?.actions ?? []) {
					const comment: CommentType = {
						id: action.id,
						isPrivate: false,
						commentsPublicHash: action.feedback?.trim()?.startsWith('Qm') ? action.feedback : undefined,
						application: {
							id: proposal.id,
							applicantPublicKey: proposal.applicantPublicKey,
							applicantId: proposal.applicantId
						},
						workspace: proposal.grant.workspace,
						tag: action.state,
						timestamp: action.updatedAtS,
						sender: action.updatedBy,
						createdAt: action.updatedAtS,
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
		for (const key in commentMap) {
			const comments = commentMap[key]
			const sortedComments = comments.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
			commentMap[key] = sortedComments
		}

		setCommentMap(commentMap)
		setAreCommentsLoading(false)
	}, [role, grantId, scwAddress, webwallet])

	useEffect(() => {
		getGrant().then((r) => logger.info({ r }, 'Get grant result'))
	}, [grantId, chainId, scwAddress])
	useEffect(() => {
		getProposals().then((r) => logger.info({ r }, 'Get proposals result'))
	}, [grantId, chainId, scwAddress, webwallet])

	useEffect(() => {
		if (!grant || !role) {
			setIsLoading(true)
		} else {
			setIsLoading(false)
		}
	}, [grant, chainId])

	useEffect(() => {
		if (proposals.length === 0) {
			setSelectedProposals(new Set<string>())
			if (grant) {
				setIsLoading(false)
			}

			return
		}

		if (isRenderingProposalBody === 'true') {
			setDashboardStep(true)
		}

		if (proposalId && typeof proposalId === 'string') {
			// Scroll to the proposal
			const proposalIndex = proposals.findIndex((_) => _.id === proposalId)
			if (proposalIndex !== -1) {
				setSelectedProposals(new Set<string>([proposalId]))
				if (role === 'builder' || role === 'community') {
					setRole(proposals[proposalIndex].applicantId === scwAddress?.toLowerCase() ? 'builder' : 'community')
				}

				let params = { ...router.query }
				if (proposalId) {
					params = { ...params, proposalId }
				}

				if (isRenderingProposalBody) {
					params = { ...params, isRenderingProposalBody }
				}

				if (params.isRenderingProposal || params.proposalId) {
					router.replace({
						pathname: '/dashboard',
						query: params
					}, undefined, { shallow: true })
				}
			}
		} else {
			const initialSelectionSet = new Set<string>()
			initialSelectionSet.add(proposals[0].id)
			if (role === 'builder' || role === 'community') {
				setRole(proposals[0].applicantId === scwAddress?.toLowerCase() ? 'builder' : 'community')
			}

			let params = { ...router.query }
			if (isRenderingProposalBody) {
				params = { ...params, isRenderingProposalBody }
			}

			if (proposals[0].id) {
				params = { ...params, proposalId: proposals[0].id }
			}

			if (params.isRenderingProposal || params.proposalId) {
				router.replace({
					pathname: '/dashboard',
					query: params
				}, undefined, { shallow: true })
			}

			logger.info({ initialSelectionSet }, 'selectedProposals')
			setSelectedProposals(initialSelectionSet)
		}

		logger.info({ grant, scwAddress, proposals }, 'Loading state set to false')
		setIsLoading(false)
	}, [proposals, scwAddress, grant])

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
					areCommentsLoading,
					commentMap,
					setCommentMap,
					refreshComments: (refresh: boolean) => {
						if (refresh) {
							getComments()
						}
					},
					filterState,
					setFilterState
				}
			}>
			{children}
		</DashboardContext.Provider>
	)
}

const FundBuilderProvider = ({ children }: { children: ReactNode }) => {
	const [tokenList, setTokenList] = useState<TokenDetailsInterface[]>()
	const [selectedTokenInfo, setSelectedTokenInfo] = useState<TokenDetailsInterface>()
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

const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [isSendAnUpdateModalOpen, setIsSendAnUpdateModalOpen] = useState<boolean>(false)
	const [isLinkYourMultisigModalOpen, setIsLinkYourMultisigModalOpen] = useState<boolean>(false)

	return (
		<ModalContext.Provider value={{ isSendAnUpdateModalOpen, setIsSendAnUpdateModalOpen, isLinkYourMultisigModalOpen, setIsLinkYourMultisigModalOpen }}>
			{children}
		</ModalContext.Provider>
	)
}

export { DashboardContext, DashboardProvider, FundBuilderContext, FundBuilderProvider, ModalContext, ModalProvider }