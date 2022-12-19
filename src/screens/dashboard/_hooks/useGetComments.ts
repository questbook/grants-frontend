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

	// const test = useCallback(async() => {
	// 	const pii = [
	// 		{ id: '0x1738d3f0207267ade0fb113dd62222082dac58f0', data: 'UDzeKLTFrjiyNvqrNdOHgiTGpNAJmYdWsseTDsrkvxzCuqSUIRWh4cXLVDbJKqBJKu4FrNtqcx3Pm7/eHdRIB4z3MZCyYeYJwzTklJfrq9Y5zUyTJt8mwCPOUpKo9Qr12MVimad9DYoW68GetbWJcph9Ib6sx5miHqRbRPrS3aiTULcP8cOB1MXYVp2MmiZTEOny5B0SxjQLL3Q4GaD3wg==', },
	// 		{ id: '0xd1bfd92ab161983e007aade98312b83eeca14f9a', data: 'p7ay6gNRG3YZlwQAqvkL7CC5D5ta0DU25KHyH2B06JlTcpbVSSJwk4+qUJzwnMpKhHbbxHLPXELA0cJJrB2K4zfyv95iyXlgY2MQ/2GllJgbcA53mg3rRFMoQXgYAvQwtLNBIo4pWr8Q7KTrZgjWrZkz1A4aSMH4mPaYpiwyWh/gAfrJDeVnkQY6x3ZZalMD6ol7lXQmIDK75WzP/J+ggw==' }
	// 	]

	// 	const ret = await decrypt({ commentsEncryptedData: pii })
	// 	logger.info(ret, 'comment decrypted (Comment)')
	// }, [proposal, webwallet, chainId])

	// useEffect(() => {
	// 	test()
	// }, [proposal, webwallet, chainId])

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
		if(!proposal?.id) {
			return
		}

		getComments().then((_) => {
			if(!_) {
				return
			}

			setComments(_)
		})
	}, [proposal])

	return comments
}

export default useGetComments