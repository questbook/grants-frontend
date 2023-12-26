import { useCallback, useContext } from 'react'
import SupportedChainId from 'src/generated/SupportedChainId'
import { getWorkspaceMembersPublicKeysQuery } from 'src/libraries/data/getWorkspaceMembersPublicKeysQuery'
import { useQuery } from 'src/libraries/hooks/useQuery'
import { getFromIPFS, } from 'src/libraries/utils/ipfs'
import logger from 'src/libraries/utils/logger'
import { getKeyForApplication, getSecureChannelFromPublicKey, useGetPublicKeysOfGrantManagers } from 'src/libraries/utils/pii'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { IReview, IReviewFeedback } from 'src/types'

type PrivateReviewData = {
	walletAddress: string
	publicKey: string
	dataIpfsHash: string
}

type GenerateReviewDataProps = {
	grantId: string
	isPrivate: boolean
	chainId: SupportedChainId
	applicationId: string
}

export function useLoadReview(
	grantId: string | undefined,
	chainId: SupportedChainId
) {
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { subgraphClients } = useContext(ApiClientsContext)!
	const { client } = subgraphClients[chainId]
	logger.info({ client }, 'Config')

	const { fetch: fetchPubKeys } = useGetPublicKeysOfGrantManagers(grantId, chainId)
	// const { fetchMore: fetchMembers } = useGetWorkspaceMembersPublicKeysQuery({
	// 	skip: true,
	// 	client
	// })

	const loadPrivateReviewDataForReviewer = async(review: {data: Pick<IReview['data'][number], 'id' | 'data' >[], reviewer: Pick<IReview['reviewer'], 'id'>}) => {
		const { fetchMore: fetchMembers } = await useQuery({
			query: getWorkspaceMembersPublicKeysQuery,
		})

		const meAddress = scwAddress?.toLocaleLowerCase()
		const meData = review.data.find(d => {
			const walletAddress = d.id.split('.').pop()
			if(walletAddress?.toLocaleLowerCase() === meAddress) {
				return true
			}
		})
		if(!meData) {
			throw new Error('Private review not accessible')
		}

		const { data: dataIpfsHash } = meData
		const [workspaceId, reviewerAddress] = review.reviewer!.id.split('.')

		interface getWorkspaceMembersPublicKeysQuery {
			workspaceMembers: {
				actorId: string
				publicKey: string
			}[]
		}
		const data = await fetchMembers({ variables: { workspaceId } }) as getWorkspaceMembersPublicKeysQuery

		const member = data.workspaceMembers.find(w => w.actorId === reviewerAddress)
		if(!member) {
			throw new Error('failed to find reviewer in workspace')
		}

		if(!member?.publicKey) {
			throw new Error("Internal Error. Reviewer's public key no longer available")
		}

		return {
			walletAddress: reviewerAddress,
			publicKey: member.publicKey,
			dataIpfsHash,
		}
	}

	const loadPrivateReviewDataForSelf = async(review: Pick<IReview, 'data'>) => {
		// load the grant manager tx map
		const grantManagerMap = await fetchPubKeys()
		// find some review that we have a shared key with
		const reviewDataList = review.data.map(d => {
			const walletAddress = d.id.split('.').pop()!
			const publicKey = grantManagerMap[walletAddress]
			if(publicKey) {
				return {
					walletAddress,
					dataIpfsHash: d.data,
					publicKey
				}
			}
		})

		const reviewData = reviewDataList.find(d => !!d)!
		if(!reviewData) {
			throw new Error('No available encrypted review')
		}

		return reviewData
	}

	const loadReview = useCallback(
		async(review: Pick<IReview, 'id' | 'createdAtS' | 'publicReviewDataHash'> & {reviewer: Pick<IReview['reviewer'], 'id'>, data: Pick<IReview['data'][number], 'id' | 'data'>[]}, applicationId: string) => {
			const isPrivate = isReviewPrivate(review)
			let data: IReviewFeedback

			if(isPrivate) {
				if(!scwAddress) {
					throw new Error('Webwallet not initialized. Cannot decrypt')
				}

				const isReviewer = review.reviewer?.id?.toLocaleLowerCase().endsWith(scwAddress.toLocaleLowerCase())
				let reviewData: PrivateReviewData
				if(isReviewer) {
					reviewData = await loadPrivateReviewDataForSelf(review)
				} else {
					reviewData = await loadPrivateReviewDataForReviewer(review)
				}

				logger.info(
					{ reviewId: review.id, walletAddress: reviewData.walletAddress, reviewData },
					'decrypting review using shared key'
				)

				const ipfsData = typeof reviewData?.dataIpfsHash !== 'string' ? JSON.parse(reviewData?.dataIpfsHash) : await getFromIPFS(reviewData!.dataIpfsHash)
				logger.info({ ipfsData }, 'got encrypted review data from ipfs')
				const { decrypt } = await getSecureChannelFromPublicKey(
					webwallet!,
					reviewData.publicKey,
					getKeyForApplication(applicationId)
				)

				logger.info({ walletAddress: reviewData!.walletAddress }, 'prepared secure channel for decryption')
				const jsonReview = await decrypt(ipfsData)
				logger.info({ review: JSON.parse(jsonReview) }, 'decrypted review data')
				data = JSON.parse(jsonReview)
			} else {
				const ipfsData = typeof review?.publicReviewDataHash === 'string' ? await getFromIPFS(review.publicReviewDataHash!) : review.publicReviewDataHash
				data = typeof ipfsData === 'string' ? JSON.parse(ipfsData) : ipfsData
			}

			logger.info({ review }, 'loaded review data')
			const newData = {
				...data,
				reviewer: review.reviewer.id.substring(review.reviewer.id.indexOf('.') + 1),
				total: totalScore(data.items),
				createdAtS: review.createdAtS,
			}

			return newData
		}, [scwAddress, webwallet, fetchPubKeys]
	)

	return { loadReview }
}

export const useGenerateReviewData = ({
	grantId,
	isPrivate,
	chainId,
	applicationId,
}: GenerateReviewDataProps) => {
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { fetch: fetchPubKeys } = useGetPublicKeysOfGrantManagers(grantId, chainId)

	const generateReviewData = async(data: Pick<IReviewFeedback, 'items'>) => {
		if(!webwallet) {
			throw new Error('Webwallet not initialized')
		}

		const jsonReview = JSON.stringify(data)
		const encryptedReview: { [key in string]: string } = {}
		let dataHash: string | undefined
		if(isPrivate) {
			const grantManagerMap = await fetchPubKeys()

			const managers = Object.keys(grantManagerMap)
			if(!managers.length) {
				throw new Error('No grant managers on the grant. Please contact support')
			}

			logger.info({ data, count: managers.length }, 'encrypting review for admins...')
			// we go through all wallet addresses
			// and upload the private review for each
			await Promise.all(
				managers.map(
					async walletAddress => {
						const publicKey = grantManagerMap[walletAddress]
						if(!publicKey) {
							logger.warn(`manager "${walletAddress}" does not have private key set, ignoring...`)
							return
						}

						const { encrypt } = await getSecureChannelFromPublicKey(
							webwallet!,
							publicKey,
							getKeyForApplication(applicationId!)
						)
						const enc = await encrypt(jsonReview)
						encryptedReview[walletAddress] = (await (enc))
					}
				)
			)

			if(!Object.keys(encryptedReview).length) {
				throw new Error('No valid managers to encrypt for!')
			}

			logger.info('generated encrypted reviews')
		} else {
			dataHash = (await (jsonReview))
		}

		const ipfsHash = (await ({
			reviewer: scwAddress!,
			reviewerPublicKey: webwallet.publicKey,
			publicReviewDataHash: JSON.parse(dataHash || '{}'),
			encryptedReview,
		}))

		return {
			ipfsHash
		}
	}

	return {
		generateReviewData
	}
}

function isReviewPrivate(review: Pick<IReview, 'publicReviewDataHash'>) {
	return !review.publicReviewDataHash
}

function totalScore(items: IReviewFeedback['items'] | undefined) {
	return items?.reduce((acc, item) => acc + (item.rating || 0), 0) || 0
}