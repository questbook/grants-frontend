import { useContext, useEffect, useMemo, useState } from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import { ApiClientsContext } from 'src/pages/_app'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { IReviewFeedback } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { useLoadReview } from 'src/utils/reviews'

function Reviews() {
	const buildComponent = () => {
		return (
			<Flex
				px={5}
				py={4}
				direction='column'
				align='stretch'
				w='100%'>
				<Flex
					justify='space-between'
					onClick={
						() => {
							if(proposals?.length > 0) {
								setExpanded(!expanded)
							}
						}
					}>
					<Text fontWeight='500'>
						Reviews
					</Text>
					{
						proposals?.length > 0 && (
							<Image
								mr={2}
								src='/v2/icons/dropdown.svg'
								transform={expanded ? 'rotate(180deg)' : 'rotate(0deg)'}
								alt='options'
								cursor='pointer'
							/>
						)
					}
				</Flex>

				<Flex
					display={expanded ? 'block' : 'none'}
					direction='column'>
					{
						details.map((detail, index) => {
							return (
								<Flex
									key={index}
									mt={index === 0 ? 5 : 4}
									w='100%'>
									<Text
										w='50%'
										variant='v2_body'
										color='gray.6'>
										{detail.title}
									</Text>
									<Text
										w='50%'
										variant='v2_body'>
										{detail.value}
									</Text>
								</Flex>
							)
						})
					}
					{
						(proposal?.applicationReviewers?.length || 0) > 0 && (
							<Text
								mt={4}
								variant='v2_metadata'
								color='gray.5'
								fontWeight='500'>
								REVIEWER EVALUATION
							</Text>
						)
					}

					{
						proposal?.applicationReviewers?.map((reviewer, index) => {
							return reviewerItem(reviewer?.member, reviews.find(r => r.reviewer === reviewer?.member.actorId), index)
						})
					}
				</Flex>
			</Flex>
		)
	}

	const reviewerItem = (reviewer: ProposalType['applicationReviewers'][number]['member'], review: IReviewFeedback | undefined, index: number) => {
		return (
			<Flex
				mt={index === 0 ? 5 : 3}
				direction='column'
				key={index}>
				<Flex
					w='100%'
					align='center'
					onClick={
						() => {
							const copy = [...reviewersExpanded]
							copy[index] = !reviewersExpanded[index]
							setReviewersExpanded(copy)
						}
					}>
					<Flex
						maxW='70%'
						align='center'
					>
						<Image
							borderRadius='3xl'
							boxSize='28px'
							src={getAvatar(false, reviewer?.actorId)}
						/>
						<Text
							variant='v2_body'
							fontWeight='500'
							ml={3}
							noOfLines={3}>
							{reviewer?.fullName}
						</Text>
					</Flex>

					<Box ml='auto' />

					{
						review && (
							<Flex
								align='center'
								justify='end'
							>
								<Image
									mr={2}
									src='/v2/icons/dropdown.svg'
									transform={reviewersExpanded[index] ? 'rotate(180deg)' : 'rotate(0deg)'}
									alt='options'
									cursor='pointer'
								/>
								<Text
									variant='v2_body'
									textAlign='right'
									fontWeight='500'>
									{review?.total}
									<Text
										ml={1}
										color='black.3'
										display='inline-block'>
										{' / '}
										{review?.items?.reduce((acc, item) => acc + item?.rubric?.maximumPoints, 0)}
									</Text>
								</Text>
							</Flex>
						)
					}

					{
						!review && (
							<Text
								bg='gray.4'
								py={1}
								px={2}
								borderRadius='8px'
								color='black.3'
								variant='v2_metadata'
								fontWeight='500'>
								Pending
							</Text>
						)
					}

				</Flex>

				<Flex
					mt={2}
					pl={1}
					display={reviewersExpanded[index] ? 'block' : 'none'}
					direction='column'>
					{
						review?.items?.map((item, index) => {
							return (
								<Flex
									key={index}
									mt={index === 0 ? 0 : 3}
									align='start'>
									<Flex direction='column'>
										<Text
											variant='v2_body'>
											{item?.rubric?.title}
										</Text>
										<Text
											variant='v2_metadata'
											color='gray.6'>
											{item?.rubric?.details}
										</Text>
									</Flex>

									<Text
										ml='auto'
										textAlign='right'
										variant='v2_body'>
										{item?.rating}
										<Text
											ml={1}
											color='black.3'
											display='inline-block'>
											{' / '}
											{item?.rubric?.maximumPoints}
										</Text>
									</Text>
								</Flex>
							)
						})
					}
				</Flex>
			</Flex>
		)
	}

	const { chainId } = useContext(ApiClientsContext)!
	const { proposals, grants, selectedGrantIndex, selectedProposals } = useContext(DashboardContext)!
	const { loadReview } = useLoadReview(grants[selectedGrantIndex!]?.id, chainId)

	const [expanded, setExpanded] = useState<boolean>(false)
	const [reviews, setReviews] = useState<IReviewFeedback[]>([])
	const [reviewersExpanded, setReviewersExpanded] = useState<boolean[]>([])

	useEffect(() => {
		if(proposals?.length === 0) {
			setExpanded(true)
		}
	}, [proposals])

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const details = useMemo(() => {
		return [{ title: 'Reviewer', value: proposal?.applicationReviewers?.length }, { title: 'Review with', value: 'Rubric' }]
	}, [proposal])

	useEffect(() => {
		setReviewersExpanded(Array(proposal?.applicationReviewers?.length).fill(false))
	}, [proposal])

	useEffect(() => {
		if(!proposal) {
			return
		}

		const decryptedReviews: Promise<IReviewFeedback>[] = []
		for(const review of proposal?.reviews || []) {
			decryptedReviews.push(loadReview(review, proposal?.id))
		}

		Promise.all(decryptedReviews).then((reviews) => {
			logger.info({ reviews }, 'Decrypted reviews')
			setReviews(reviews)
		})
	}, [])

	return buildComponent()
}

export default Reviews