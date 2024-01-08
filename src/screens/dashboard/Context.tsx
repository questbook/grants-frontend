import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { TokenDetailsInterface } from '@questbook/supported-safes/lib/types/Safe'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import { useSafeContext } from 'src/contexts/safeContext'
import { ApplicationState } from 'src/generated/graphql'
import { useQuery } from 'src/libraries/hooks/useQuery'
import logger from 'src/libraries/logger'
import { getFromIPFS } from 'src/libraries/utils/ipfs'
import { getKeyForApplication, getSecureChannelFromPublicKey } from 'src/libraries/utils/pii'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { ApiClientsContext, GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { getFundsAllocatedQuery } from 'src/screens/dashboard/_data/getFundsAllocatedQuery'
import { getGrantsQuery } from 'src/screens/dashboard/_data/getGrantsQuery'
import { getProposalsQuery } from 'src/screens/dashboard/_data/getProposalsQuery'
import { getSpecificApplicationActionQuery } from 'src/screens/dashboard/_data/getSpecificApplicationActionQuery'
import { getSpecificProposalCommentsQuery } from 'src/screens/dashboard/_data/getSpecificProposalCommentsQuery'
import { getSpecificProposalQuery } from 'src/screens/dashboard/_data/getSpecificProposalQuery'
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
		} catch(e) {
			return -1
		}
	}, [_chainId])

	const { fetchMore: fetchGrantDetails } = useQuery({
		query: getGrantsQuery,
	})

	const { fetchMore: fetchMoreProposals } = useQuery({
		query: getProposalsQuery,
	})

	// const { fetchMore: fetchMoreComments } = useQuery({
	// 	query: getCommentsQuery,
	// })

	// const { fetchMore: fetchMoreApplicationActions } = useQuery({
	// 	query: getApplicationActionsQuery,
	// })

	const { fetchMore: fetchSpecificProposal } = useQuery({
		query: getSpecificProposalQuery,
	})

	const { fetchMore: fetchSpecificProposalComments } = useQuery({
		query: getSpecificProposalCommentsQuery,
	})

	const { fetchMore: fetchSpecificApplicationActions } = useQuery({
		query: getSpecificApplicationActionQuery,
	})

	const { fetchMore: fetchFundsAllocated } = useQuery({
		query: getFundsAllocatedQuery
	})

	const [proposals, setProposals] = useState<Proposals>([])
	const [commentMap, setCommentMap] = useState<CommentMap>({})
	const [selectedProposals, setSelectedProposals] = useState<Set<string>>(new Set<string>())
	const [review, setReview] = useState<ReviewInfo>()
	const [showSubmitReviewPanel, setShowSubmitReviewPanel] = useState<boolean>(false)
	const [areCommentsLoading, setAreCommentsLoading] = useState<boolean>(false)
	const [filterState, setFilterState] = useState<ApplicationState>()
	const [fundsAllocated, setFundsAllocated] = useState<{
		allocated: number
		disbursed: number
	}>({
		allocated: 0,
		disbursed: 0,
	})

	const getGrant = useCallback(async() => {
		if(!grantId || chainId === -1 || typeof grantId !== 'string') {
			return 'params-missing'
		}

		logger.info({ grantId, scwAddress }, 'Getting grant (GET GRANT)')
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const details: any = await fetchGrantDetails({ grantId, actorId: scwAddress ? scwAddress.toLowerCase() : '0x0000000000000000000000000000000000000000' }, true)
		logger.info({ details }, 'Grant details (GET GRANT)')
		if(!details?.grant) {
			return 'no-grant-in-query'
		}

		const _grant = details.grant
		logger.info({ _grant }, 'Setting grant (GET GRANT)')

		// set the grant in local storage to be used as a default
		localStorage.setItem('cur-grant', JSON.stringify(_grant))

		setGrant(_grant)
		setWorkspace(_grant.workspace)

		if(_grant?.workspace?.safe) {
			const currentSafe = new SupportedPayouts().getSafe(_grant.workspace?.safe?.chainId ? parseInt(_grant.workspace?.safe?.chainId) : defaultChainId, _grant.workspace?.safe?.address ?? '')
			setSafeObj(currentSafe)
		}

		logger.info({ _grant, scwAddress }, 'Setting role (GET GRANT)')

		const possibleRoles: Roles[] = ['community']

		if(_grant?.myApplications?.length > 0) {
			possibleRoles.push('builder')
		}

		if(scwAddress) {
			for(const member of _grant?.workspace?.members ?? []) {
				if(member.actorId.toLowerCase() === scwAddress.toLowerCase()) {
					logger.info({ member }, 'Member (ROLE)')
					possibleRoles.push(member.accessLevel === 'reviewer' ? 'reviewer' : 'admin')
					break
				}
			}
		}

		logger.info({ possibleRoles }, 'Possible roles (GET GRANT)')
		if(_role) {
			logger.info({ role: _role, check: possibleRoles.includes(_role as Roles) }, 'Role from params (GET GRANT)')
			// Check if the role the user is trying to access is valid
			if(possibleRoles.includes(_role as Roles) && !possibleRoles.includes('admin')) {
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

	const getFundsAllocated = useCallback(async() => {
		if(!grantId) {
			return 'no-grant-id'
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await fetchFundsAllocated({ id: grantId }, true)
		if(result?.grantApplications) {

			const totalAllocated = result?.grantApplications?.reduce((acc: number, grantApplication: { milestones: { amount: number }[] }) => {
				return acc + grantApplication.milestones.reduce((acc: number, milestone: { amount: number }) => acc + milestone.amount, 0)
			}, 0)
			const totalDisbursed = result?.grantApplications?.reduce((acc: number, grantApplication: { milestones: { amountPaid: number }[] }) => {
				return acc + grantApplication.milestones.reduce((acc: number, milestone: { amountPaid: number }) => acc + milestone.amountPaid, 0)
			}, 0)
			logger.info({ totalAllocated, totalDisbursed }, 'Funds allocated (GET FUNDS ALLOCATED)')
			setFundsAllocated({
				allocated: totalAllocated,
				disbursed: totalDisbursed
			})
		}

		return 'funds-allocated-fetched'
	}, [grantId])

	const handleComments = async(allComments: CommentType[]) => {
		logger.info({ allComments }, 'ALL COMMENTS (COMMENT DECRYPT)')
		const commentMap: CommentMap = {}
		for(const comment of allComments) {
			if(comment.isPrivate) {
				logger.info({ comment }, 'PRIVATE COMMENT before decrypt (COMMENT DECRYPT)')

				// if(comment.commentsEncryptedData?. .indexOf(scwAddress.toLowerCase()) === -1) {
				// 	logger.info({ comment }, 'public key not found (COMMENT DECRYPT)')
				// 	continue
				// }

				const sender = comment.id.split('.')[1]?.toLowerCase()
				let channel: {
					encrypt(plaintext: string): Promise<string>
					decrypt(ciphertext: string): Promise<string>
				} | undefined = undefined
				logger.info({ sender, scwAddress: scwAddress?.toLowerCase() }, 'SENDER (COMMENT DECRYPT)')
				if(webwallet && sender === scwAddress?.toLowerCase()) {
					channel = await getSecureChannelFromPublicKey(webwallet, webwallet.publicKey, getKeyForApplication(comment.application.id))
					logger.info({ privateKey: webwallet.privateKey, publicKey: webwallet.publicKey, role }, 'CHANNEL CONFIG (COMMENT DECRYPT)')
				} else if(webwallet) {
					const publicKey = comment.application.applicantId === sender ? comment.application.applicantPublicKey : comment.workspace.members.find(m => m.actorId === sender)?.publicKey
					if(!publicKey) {
						logger.info({ comment }, 'public key not found (COMMENT DECRYPT)')
						continue
					}

					logger.info({ publicKey }, 'PUBLIC KEY (COMMENT DECRYPT)')
					channel = await getSecureChannelFromPublicKey(webwallet, publicKey, getKeyForApplication(comment.application.id))
					logger.info({ privateKey: webwallet.privateKey, publicKey, role, channel }, 'CHANNEL CONFIG (COMMENT DECRYPT)')
				}

				const encryptedComments = scwAddress !== undefined ? (comment.commentsEncryptedData?.filter(c => c.id.toLowerCase().indexOf(scwAddress.toLowerCase()) !== -1) ?? []) : []
				logger.info({ comment }, 'ENCRYPTED COMMENTS (COMMENT DECRYPT)')
				const key = `${comment.application.id}.${getSupportedChainIdFromWorkspace(comment.workspace) ?? defaultChainId}`
				if(encryptedComments.length === 0) {
					logger.info({ comment }, 'NO ENCRYPTED COMMENTS (COMMENT DECRYPT)')
					const workspaceMember = comment.workspace.members.find(m => m.actorId === sender)?.accessLevel
					const role = comment.application.applicantId === sender ? 'builder' : workspaceMember === 'owner' ? 'admin' : workspaceMember
					if(!commentMap[key]) {
						commentMap[key] = []
					}

					commentMap[key].push({ ...comment, sender, role: role ?? 'community', message: '*** This is an encrypted comment ***', timestamp: comment.createdAt })
					continue
				} else if(channel) {
					const encrypted = encryptedComments[0]
					logger.info({ encrypted }, 'DECRYPTING NOW (COMMENT DECRYPT)')
					try {
						const decryptedData = JSON.parse(await channel.decrypt(encrypted.data))
						logger.info({ decryptedData }, 'comment decrypted (COMMENT DECRYPT)')

						if(decryptedData?.message) {
							const message = decryptedData?.message?.startsWith('Qm') ? await getFromIPFS(decryptedData.message) : decryptedData.message

							if(!commentMap[key]) {
								commentMap[key] = []
							}

							commentMap[key].push({ ...comment, ...decryptedData, message })
						} else {
							logger.info({ comment }, 'NO MESSAGE (COMMENT DECRYPT)')
						}
					} catch(e) {
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
				if(comment?.commentsPublicHash !== undefined) {
					if(typeof comment.commentsPublicHash === 'object') {
					  //@ts-ignore
					  const data = comment?.commentsPublicHash as { message: string }
					  if(data?.message) {
							if(!commentMap[key]) {
								commentMap[key] = []
							  }

						 commentMap[key].push({ ...comment, ...data, message: data.message })
					  }
					} else if(typeof comment.commentsPublicHash === 'string' && comment.commentsPublicHash.startsWith('Qm')) {
					  const commentData = JSON.parse(await getFromIPFS(comment.commentsPublicHash))
					  if(commentData?.message) {
							const message = await getFromIPFS(commentData.message)
							if(!commentMap[key]) {
						  commentMap[key] = []
							}

							logger.info({ commentData }, 'commentData (COMMENT DECRYPT)')
							logger.info({ message }, 'message (COMMENT DECRYPT)')
							commentMap[key].push({ ...comment, ...commentData, message })
					  }
					}
				  } else if(comment?.message !== undefined) {
					if(!commentMap[key]) {
						commentMap[key] = []
					}

					let message = comment?.message
					if(message?.trim() === '') {
						if(comment.role === 'builder' && comment.tag === 'submitted') {
							message = 'This proposal was resubmitted'
						} else if(comment.tag === 'approved') {
							message = 'Your proposal is accepted'
						} else if(comment.tag === 'rejected') {
							message = 'Sorry! we won\'t be able to proceed with your proposal'
						} else if(comment.tag === 'resubmit') {
							message = 'Please resubmit your proposal'
						}
					}

					commentMap[key].push({ ...comment, message })
				}
			}
		}

		const tempCommentMap = { ...commentMap }
		for(const application in tempCommentMap) {
			const comments = commentMap[application]
			for(const comment of comments) {
				if(comment.role === 'community') {
					const workspaceMember = comment.workspace.members.find(m => m.actorId === comment.sender?.toLowerCase())?.accessLevel
					const role = comment.application.applicantId === comment.sender?.toLowerCase() ? 'builder' : workspaceMember === 'owner' ? 'admin' : workspaceMember
					comment.role = role ?? 'community'
				}
			}
		}

		logger.info(tempCommentMap, 'commentMap (COMMENT DECRYPT)')
		return tempCommentMap
	}


	const fetchPerProposalComments = useCallback(async() => {
		if(typeof grantId !== 'string' || !proposalId || typeof proposalId !== 'string') {
			return 'no-grant-or-proposal'
		}

		const allComments: CommentType[] = []
		setAreCommentsLoading(true)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await fetchSpecificProposalComments({ grantId, proposalId }, true)
		logger.info({ result }, 'Results (Comments)')
		// if(result?.comments?.length === 0) {
		// 	setAreCommentsLoading(false)
		// }


		for(const comment of result?.comments ?? []) {
			allComments.push(comment)
		}


		logger.info({ allComments }, 'Fetched comments before actions')

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const results: any = await fetchSpecificApplicationActions({ grantId, proposalId }, true)
		logger.info({ results }, 'Results (Application Actions)')
		if(results?.grantApplications.length > 0) {
			const result = results?.grantApplications
			logger.info({ result }, 'Result (Application Actions Test)')
			for(const proposal of result ?? []) {
				logger.info({ proposal }, 'Proposal (Application Actions)')
				for(const action of proposal?.actions ?? []) {
					logger.info({ action }, 'Dummy Comment')
					const comment: CommentType = {
						id: action.id,
						isPrivate: false,
						commentsPublicHash: typeof action.feedback === 'string' && action?.feedback?.length !== 0 ? action.feedback : (action.feedback === null || action?.feedback?.length === 0) ? undefined : action.feedback,
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
						role: proposal.grant.workspace.members.map((m: { actorId: String }) => m.actorId).includes(action.updatedBy.toLowerCase()) ? 'admin' : 'builder',
						message: typeof action.feedback === 'string' && action?.feedback?.length !== 0 ? action.feedback : (action?.feedback === null || action?.feedback?.length === 0) ? '' : (action.feedback ?? '{}').message,
					}
					logger.info({ comment }, 'Dummy Comment')

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
		setAreCommentsLoading(false)

	}, [grant, grantId, proposalId, scwAddress])

	const getFetchBackgroundProposals = useCallback(async(proposals: Proposals[]) => {
		logger.info({ role, grantId, scwAddress }, 'Fetching proposals (GET PROPOSALS)')
		// if(!webwallet) {
		// 	return 'no-webwallet'
		// }
		if(!grantId || typeof grantId !== 'string') {
			return 'no-grant-id'
		}

		logger.info({ proposals }, 'Proposals (GET PROPOSALS)')
		const proposalData: Proposals = []

		const first = 50
		let skip = 10
		let shouldContinue = true
		do {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const results: any = await fetchMoreProposals({ first, skip, grantID: grantId }, true)
			logger.info({ results }, 'Results (Proposals)')
			if(results?.grantApplications?.length === 0) {
				shouldContinue = false
				break
			}

			//make sure the proposal is not already in the proposals array
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			proposalData.push(...results?.grantApplications?.filter((p: { id: string}) => !proposals.map((p: any) => p?.id).includes(p.id)) ?? [])
			setProposals([...proposals as [], ...proposalData])
			skip += first
		} while(shouldContinue)


		// append the proposals to the existing proposals
		// await getFetchCommentsInBackground()

		return 'proposals-fetched'
	}, [role, grantId, scwAddress, webwallet])

	const getProposals = useCallback(async() => {
		logger.info({ role, grantId, scwAddress }, 'Fetching proposals (GET PROPOSALS)')
		// if(!webwallet) {
		// 	return 'no-webwallet'
		// }
		if(!grantId || typeof grantId !== 'string') {
			return []
		}

		const proposals: Proposals = []

		const first = 10
		let skip = 0
		let shouldContinue = false
		do {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const results: any = await fetchMoreProposals({ first, skip, grantID: grantId }, true)


			logger.info({ results }, 'Results (Proposals)')
			if(results?.grantApplications?.length === 0) {
				shouldContinue = false
				break
			}

			if(!results?.grantApplications?.map((p: { id: string }) => p.id).includes(proposalId as string)) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const result: any = await fetchSpecificProposal({ grantID: grantId, proposalId }, true)
				if(result?.grantApplications) {
					proposals.push(...result?.grantApplications)
				}
			}

			proposals.push(...results?.grantApplications)

			skip += first
		} while(shouldContinue)

		setProposals(proposals)
		// setAreCommentsLoading(true)
		// await getComments()

		return proposals
	}, [role, grantId, scwAddress, webwallet])

	// const getFetchCommentsInBackground = useCallback(async() => {
	// 	logger.info({ role, grantId, scwAddress }, 'Fetching comments (GET COMMENTS)')
	// 	// if(!webwallet) {
	// 	// 	return 'no-webwallet'
	// 	// }
	// 	if(!grantId || typeof grantId !== 'string') {
	// 		return 'no-grant-id'
	// 	}

	// 	const allComments: CommentType[] = []
	// 	const first = 50
	// 	let skip = 50
	// 	let shouldContinue = true
	// 	do {
	// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 		const results: any = await fetchMoreComments({ first, skip, grantId }, true)
	// 		logger.info({ results }, 'Results (Comments)')
	// 		if(results?.comments?.length === 0) {
	// 			shouldContinue = false
	// 			break
	// 		}

	// 		for(const comment of results?.comments ?? []) {
	// 			allComments.push(comment)
	// 		}

	// 		skip += first
	// 	} while(shouldContinue)

	// 	logger.info({ allComments }, 'Fetched comments before actions')

	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	const results: any = await fetchMoreApplicationActions({ grantId }, true)
	// 	logger.info({ results }, 'Results (Application Actions)')
	// 	if(results?.grantApplications.length > 0) {
	// 		const result = results?.grantApplications
	// 		logger.info({ result }, 'Result (Application Actions Test)')
	// 		for(const proposal of result ?? []) {
	// 			logger.info({ proposal }, 'Proposal (Application Actions)')
	// 			for(const action of proposal?.actions ?? []) {
	// 				logger.info({ action }, 'Dummy Comment')
	// 				const comment: CommentType = {
	// 					id: action.id,
	// 					isPrivate: false,
	// 					commentsPublicHash: typeof action.feedback === 'string' ? action.feedback : action.feedback,
	// 					application: {
	// 						id: proposal.id,
	// 						applicantPublicKey: proposal.applicantPublicKey,
	// 						applicantId: proposal.applicantId
	// 					},
	// 					workspace: proposal.grant.workspace,
	// 					tag: action.state,
	// 					timestamp: action.updatedAtS,
	// 					sender: action.updatedBy,
	// 					createdAt: action.updatedAtS,
	// 					role: proposal.grant.workspace.members.map((m: { actorId: String }) => m.actorId).includes(action.updatedBy.toLowerCase()) ? 'admin' : 'builder',
	// 					message: typeof action.feedback === 'string' ? action.feedback : (action.feedback ?? '{}').message,
	// 				}
	// 				logger.info({ comment }, 'Dummy Comment')

	// 				allComments.push(comment)
	// 			}
	// 		}
	// 	}

	// 	logger.info({ allComments }, 'Fetched comments after actions')
	// 	const commentMap = await handleComments(allComments)
	// 	logger.info(commentMap, 'Comment map')
	// 	for(const key in commentMap) {
	// 		const comments = commentMap[key]
	// 		const sortedComments = comments.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
	// 		commentMap[key] = sortedComments
	// 	}

	// 	setCommentMap(commentMap)
	// 	setAreCommentsLoading(false)
	// }, [role, grantId, scwAddress, webwallet])

	// const getComments = useCallback(async() => {
	// 	logger.info({ role, grantId, scwAddress }, 'Fetching comments (GET COMMENTS)')
	// 	// if(!webwallet) {
	// 	// 	return 'no-webwallet'
	// 	// }
	// 	if(!grantId || typeof grantId !== 'string') {
	// 		return 'no-grant-id'
	// 	}

	// 	const allComments: CommentType[] = []
	// 	const first = 50
	// 	let skip = 0
	// 	let shouldContinue = false
	// 	do {
	// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 		const results: any = await fetchMoreComments({ first, skip, grantId }, true)
	// 		logger.info({ results }, 'Results (Comments)')
	// 		if(results?.comments?.length === 0) {
	// 			shouldContinue = false
	// 			break
	// 		}

	// 		for(const comment of results?.comments ?? []) {
	// 			allComments.push(comment)
	// 		}

	// 		skip += first
	// 	} while(shouldContinue)

	// 	logger.info({ allComments }, 'Fetched comments before actions')

	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// 	const results: any = await fetchMoreApplicationActions({ grantId }, true)
	// 	logger.info({ results }, 'Results (Application Actions)')
	// 	if(results?.grantApplications.length > 0) {
	// 		const result = results?.grantApplications
	// 		logger.info({ result }, 'Result (Application Actions Test)')
	// 		for(const proposal of result ?? []) {
	// 			logger.info({ proposal }, 'Proposal (Application Actions)')
	// 			for(const action of proposal?.actions ?? []) {
	// 				logger.info({ action }, 'Dummy Comment')
	// 				const comment: CommentType = {
	// 					id: action.id,
	// 					isPrivate: false,
	// 					commentsPublicHash: typeof action.feedback === 'string' ? action.feedback : action.feedback,
	// 					application: {
	// 						id: proposal.id,
	// 						applicantPublicKey: proposal.applicantPublicKey,
	// 						applicantId: proposal.applicantId
	// 					},
	// 					workspace: proposal.grant.workspace,
	// 					tag: action.state,
	// 					timestamp: action.updatedAtS,
	// 					sender: action.updatedBy,
	// 					createdAt: action.updatedAtS,
	// 					role: proposal.grant.workspace.members.map((m: { actorId: String }) => m.actorId).includes(action.updatedBy.toLowerCase()) ? 'admin' : 'builder',
	// 					message: typeof action.feedback === 'string' ? action.feedback : (action.feedback ?? '{}').message,
	// 				}
	// 				logger.info({ comment }, 'Dummy Comment')

	// 				allComments.push(comment)
	// 			}
	// 		}
	// 	}

	// 	logger.info({ allComments }, 'Fetched comments after actions')
	// 	const commentMap = await handleComments(allComments)
	// 	logger.info(commentMap, 'Comment map')
	// 	for(const key in commentMap) {
	// 		const comments = commentMap[key]
	// 		const sortedComments = comments.sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
	// 		commentMap[key] = sortedComments
	// 	}

	// 	setCommentMap(commentMap)
	// 	setAreCommentsLoading(false)
	// }, [role, grantId, scwAddress, webwallet])


	useEffect(() => {
		getGrant().then((r) => logger.info({ r }, 'Get grant result'))
	}, [grantId, chainId, scwAddress])
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getProposals().then((proposals: any) => {
			getFetchBackgroundProposals(proposals ?? [])
		})
	}, [grantId, chainId, scwAddress, webwallet])

	useEffect(() => {
		if(proposalId && typeof proposalId === 'string') {
			fetchPerProposalComments().then((r) => logger.info({ r }, 'Fetch per proposal comments result'))
		}
	}, [grantId, chainId, scwAddress, webwallet, proposalId])

	// useEffect(() => {
	// 	logger.info(proposals.length > 0, 'test')
	// 	if(!proposals.map((p) => p.id).includes(proposalId as string)) {
	// 		logger.info({ grantId, proposalId }, 'Fetching per proposal')
	// 		fetchPerProposal().then((r) => logger.info({ r }, 'Fetch per proposal result'))
	// 	}
	// }, [grantId, chainId, scwAddress, webwallet, proposalId])


	useEffect(() => {
		if(!grant || !role) {
			setIsLoading(true)
		} else {
			setIsLoading(false)
		}
	}, [grant, chainId])

	useEffect(() => {
		if(grantId) {
			getFundsAllocated().then((r) => logger.info({ r }, 'Get funds allocated result'))
		}
	}, [grantId])

	useEffect(() => {
		if(proposals.length === 0) {
			setSelectedProposals(new Set<string>())
			if(grant) {
				setIsLoading(false)
			}

			return
		}

		if(isRenderingProposalBody === 'true') {
			setDashboardStep(true)
		}

		if(proposalId && typeof proposalId === 'string') {
			// Scroll to the proposal
			const proposalIndex = proposals.findIndex((_) => _.id === proposalId)
			if(proposalIndex !== -1) {
				setSelectedProposals(new Set<string>([proposalId]))
				if(role === 'builder' || role === 'community') {
					setRole(proposals[proposalIndex].applicantId?.toLowerCase() === scwAddress?.toLowerCase() ? 'builder' : 'community')
				}

				let params = { ...router.query }
				if(proposalId) {
					params = { ...params, proposalId }
				}

				if(isRenderingProposalBody) {
					params = { ...params, isRenderingProposalBody }
				}

				if(params.isRenderingProposal || params.proposalId) {
					router.replace({
						pathname: '/dashboard',
						query: params
					}, undefined, { shallow: true })
				}
			}
		} else {
			const initialSelectionSet = new Set<string>()
			initialSelectionSet.add(proposals[0].id)
			if(role === 'builder' || role === 'community') {
				setRole(proposals[0].applicantId?.toLowerCase() === scwAddress?.toLowerCase() ? 'builder' : 'community')
			}

			let params = { ...router.query }
			if(isRenderingProposalBody) {
				params = { ...params, isRenderingProposalBody }
			}

			if(proposals[0].id) {
				params = { ...params, proposalId: proposals[0].id }
			}

			if(params.isRenderingProposal || params.proposalId) {
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
						if(refresh) {
							fetchPerProposalComments()
						}
					},
					refreshProposals: (refresh: boolean) => {
						if(refresh) {
							getProposals()
						}
					},
					filterState,
					setFilterState,
					fundsAllocated,
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
	const [isFundingMethodModalOpen, setIsFundingMethodModalOpen] = useState<boolean>(false)
	return (
		<ModalContext.Provider value={{ isSendAnUpdateModalOpen, setIsSendAnUpdateModalOpen, isLinkYourMultisigModalOpen, setIsLinkYourMultisigModalOpen, isFundingMethodModalOpen, setIsFundingMethodModalOpen }}>
			{children}
		</ModalContext.Provider>
	)
}

export { DashboardContext, DashboardProvider, FundBuilderContext, FundBuilderProvider, ModalContext, ModalProvider }