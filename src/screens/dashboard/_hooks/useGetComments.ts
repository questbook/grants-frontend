import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { defaultChainId } from 'src/constants/chains'
import { GetCommentsQuery, useGetCommentsQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import logger from 'src/libraries/logger'
import { usePiiForComment } from 'src/libraries/utils/pii'
import { WebwalletContext } from 'src/pages/_app'
import { CommentType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function useGetComments() {
	const { webwallet } = useContext(WebwalletContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ?? defaultChainId
	}, [proposal])

	const { fetchMore } = useMultiChainQuery({
		useQuery: useGetCommentsQuery,
		options: {},
		chains: [chainId]
	})

	const { decrypt } = usePiiForComment(
		proposal?.grant?.workspace?.id,
		proposal?.id,
		webwallet?.publicKey,
		chainId,
	)

	const [comments, setComments] = useState<CommentType[]>([])
	const [shouldRefresh, setShoulRefresh] = useState<boolean>(true)

	const getComments = useCallback(async() => {
		const finalComments: CommentType[] = []
		const localComments: Exclude<GetCommentsQuery['comments'], null | undefined> = []

		const first = 100
		let skip = 0
		let shouldContinue = true
		do {
			const results = await fetchMore({ first, skip, proposalId: proposal?.id }, true)
			if(results?.length === 0 || !results[0] || !results[0]?.comments?.length) {
				shouldContinue = false
				break
			}

			localComments.push(...results[0]?.comments)
			skip += first
		} while(shouldContinue)

		for(const comment of localComments) {
			if(comment.isPrivate) {
				if(comment?.commentsEncryptedData) {
					const decryptedData = await decrypt(comment)
					logger.info({ decryptedData }, 'comment decrypted (Comment)')

					if(decryptedData?.message) {
						const message = await getFromIPFS(decryptedData.message)
						finalComments.push({ ...comment, ...decryptedData, message, })
					}
				}
			} else {
				if(!comment?.commentsPublicHash) {
					return
				}

				const data = JSON.parse(await getFromIPFS(comment?.commentsPublicHash))
				const messageHash = data?.message
				data.message = await getFromIPFS(messageHash)
				finalComments.push({ ...comment, ...data })
			}
		}

		return finalComments
	}, [proposal])

	useEffect(() => {
		if(!proposal?.id || !shouldRefresh) {
			return
		}

		getComments().then((_) => {
			if(!_) {
				return
			}

			setShoulRefresh(false)
			setComments(_)
		})
	}, [proposal, shouldRefresh])

	const refresh = useCallback(() => {
		setShoulRefresh(true)
	}, [setShoulRefresh])

	return { comments, refresh }
}

export default useGetComments