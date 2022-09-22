import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ReviewSetRequest } from '@questbook/service-validator-client'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceMembersPublicKeysQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { IApplicantData, IReview, IReviewFeedback } from 'src/types'
import { getFromIPFS, uploadToIPFS } from 'src/utils/ipfsUtils'
import logger from 'src/utils/logger'
import { getKeyForApplication, getSecureChannelFromPublicKey, useGetPublicKeysOfGrantManagers } from 'src/utils/pii'

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

	const { fetch: fetchPubKeys } = useGetPublicKeysOfGrantManagers(grantId, chainId)
	const { fetchMore: fetchMembers } = useGetWorkspaceMembersPublicKeysQuery({
		skip: true,
		client
	})

	const loadPrivateReviewDataForReviewer = async(review: IReview) => {
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
		const { data } = await fetchMembers({ variables: { workspaceId } })

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

	const loadPrivateReviewDataForSelf = async(review: IReview) => {
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
		async(review: IReview, applicationId: string) => {
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
					{ reviewId: review.id, walletAddress: reviewData.walletAddress },
					'decrypting review using shared key'
				)

				const ipfsData = await getFromIPFS(reviewData!.dataIpfsHash)
				const { decrypt } = await getSecureChannelFromPublicKey(
					webwallet!,
					reviewData.publicKey,
					getKeyForApplication(applicationId)
				)

				logger.info({ walletAddress: reviewData!.walletAddress }, 'prepared secure channel for decryption')
				const jsonReview = await decrypt(ipfsData)
				data = JSON.parse(jsonReview)
			} else {
				const ipfsData = await getFromIPFS(review.publicReviewDataHash!)
				data = JSON.parse(ipfsData || '{}')
			}

			data.total = totalScore(data.items)
			data.createdAtS = review.createdAtS

			return data
		}, [scwAddress, webwallet, fetchPubKeys, fetchMembers]
	)

	return { loadReview }
}

type ApplicationData = Pick<IApplicantData, 'applicationId' | 'reviews' | 'grant'>

export const useLoadReviews = (
	applicationData: ApplicationData | undefined,
	chainId: SupportedChainId | undefined
) => {
	const submittedReviews = applicationData?.reviews

	const [reviews, setReviews] = useState<{ [_id: string]: IReviewFeedback }>({ })
	const { loadReview } = useLoadReview(applicationData?.grant?.id, chainId || defaultChainId)

	const loadingRef = useRef(false)

	const loadReviews = useCallback(
		async() => {
			const reviewsDataMap: typeof reviews = {}

			await Promise.all(
				submittedReviews!.map(async(review) => {
					try {
						const reviewData = await loadReview(review, applicationData!.applicationId)
						const [, reviewerAddress] = review.reviewer!.id.split('.')
						reviewsDataMap[reviewerAddress] = reviewData
					} catch(err) {
						logger.error({ err, review }, 'error in loading review')
					}
				})
			)

			setReviews(reviewsDataMap)
		}, [setReviews, loadReview, submittedReviews, applicationData]
	)

	useEffect(() => {
		if(submittedReviews?.length && !loadingRef.current) {
			loadingRef.current = true
			loadReviews()
				.finally(() => {
					loadingRef.current = false
				})
		}
	}, [submittedReviews, loadReviews])

	return { reviews }
}

export const useGenerateReviewData = ({
	grantId,
	isPrivate,
	chainId,
	applicationId,
}: GenerateReviewDataProps) => {
	const { scwAddress, webwallet } = useContext(WebwalletContext)!
	const { validatorApi } = useContext(ApiClientsContext)!
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
						encryptedReview[walletAddress] = (await uploadToIPFS(enc)).hash
					}
				)
			)

			if(!Object.keys(encryptedReview).length) {
				throw new Error('No valid managers to encrypt for!')
			}

			logger.info('generated encrypted reviews')
		} else {
			dataHash = (await uploadToIPFS(jsonReview)).hash
		}

		const {
			data: { ipfsHash },
		} = await validatorApi.validateReviewSet({
			reviewer: scwAddress!,
			reviewerPublicKey: webwallet.publicKey,
			publicReviewDataHash: dataHash,
			encryptedReview,
		} as ReviewSetRequest)

		return {
			ipfsHash
		}
	}

	return {
		generateReviewData
	}
}

function isReviewPrivate(review: IReview) {
	return !review.publicReviewDataHash
}

function totalScore(items: IReviewFeedback['items'] | undefined) {
	return items?.reduce((acc, item) => acc + (item.rating || 0), 0) || 0
}