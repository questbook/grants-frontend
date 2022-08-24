import { useContext } from 'react'
import { ApiClientsContext, WebwalletContext } from 'pages/_app'
import { useGetWorkspaceMembersPublicKeysQuery } from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { IReview, IReviewFeedback } from 'src/types'
import { getFromIPFS, uploadToIPFS } from './ipfsUtils'
import { getKeyForApplication, getSecureChannelFromPublicKey, useGetPublicKeysOfGrantManagers } from './pii'

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

	const isReviewPrivate = (review: IReview) => {
		return !review.publicReviewDataHash
	}

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

	const loadReview = async(
		review: IReview,
		applicationId: string
	) => {
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

			console.log(`decrypting "${review.id}" using "${reviewData.walletAddress}" shared key`)

			const ipfsData = await getFromIPFS(reviewData!.dataIpfsHash)
			const { decrypt } = await getSecureChannelFromPublicKey(
				webwallet!,
				reviewData.publicKey,
				getKeyForApplication(applicationId)
			)

			console.log(`prepared secure channel for decryption with "${reviewData!.walletAddress}"`)
			const jsonReview = await decrypt(ipfsData)
			data = JSON.parse(jsonReview)
		} else {
			const ipfsData = await getFromIPFS(review.publicReviewDataHash!)
			data = JSON.parse(ipfsData || '{}')
		}

		return data
	}

	return {
		loadReview,
		isReviewPrivate
	}
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

	const generateReviewData = async(data: IReviewFeedback) => {
		const jsonReview = JSON.stringify(data)
		const encryptedReview: { [key in string]: string } = {}
		let dataHash: string | undefined
		if(isPrivate) {
			const grantManagerMap = await fetchPubKeys()

			const managers = Object.keys(grantManagerMap)
			if(!managers.length) {
				throw new Error('No grant managers on the grant. Please contact support')
			}

			console.log(`encrypting review for ${managers.length} admins...`)

			// we go through all wallet addresses
			// and upload the private review for each
			await Promise.all(
				managers.map(
					async walletAddress => {
						const publicKey = grantManagerMap[walletAddress]
						if(!publicKey) {
							console.log(`manager "${walletAddress}" does not have private key set, ignoring...`)
							return
						}

						const { encrypt } = await getSecureChannelFromPublicKey(
							webwallet!,
							publicKey,
							getKeyForApplication(applicationId!)
						)
						const enc = await encrypt(jsonReview)
						console.log(`encrypted review for ${walletAddress}`)

						const encHash = (await uploadToIPFS(enc)).hash
						console.log(`uploaded encrypted review for ${walletAddress} to ${encHash}`)

						encryptedReview[walletAddress] = encHash
					}
				)
			)

			if(!Object.keys(encryptedReview).length) {
				throw new Error('No valid managers to encrypt for!')
			}

			console.log('generated encrypted reviews')
		} else {
			dataHash = (await uploadToIPFS(jsonReview)).hash
		}

		const {
			data: { ipfsHash },
		} = await validatorApi.validateReviewSet({
			reviewer: scwAddress!,
			reviewerPublicKey: webwallet?.publicKey,
			publicReviewDataHash: dataHash,
			encryptedReview,
		})

		return {
			ipfsHash
		}
	}

	return {
		generateReviewData
	}
}