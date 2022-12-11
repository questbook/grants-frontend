import { useContext, useEffect, useMemo } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { useLoadReview } from 'src/libraries/utils/reviews'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { DashboardContext } from 'src/screens/dashboard/Context'

function ReviewProposal() {
	const buildComponent = () => {
		return (
			<Flex
				py={4}
				direction='column'
				align='stretch'
				w='100%'
				h='100%'>
				<Text
					mx={5}
					fontWeight='500'>
					Review Proposals
				</Text>
				<Flex
					direction='column'
					overflowY='auto'>
					{
						review?.items?.map((item, rubricIndex) => {
							return (
								<Flex
									key={rubricIndex}
									px={5}
									py={4}
									borderBottom='1px solid #E7E4DD'
									direction='column'>
									<Text
										variant='v2_body'>
										{item.rubric.title}
									</Text>
									<Flex
										mt={3}
										w='100%'
										direction='row'
										justify='start'>
										{
											Array.from(Array(item.rubric.maximumPoints).keys()).map((_, index) => {
												const isSelected = item?.rating === index + 1
												return (
													<Button
														key={index}
														px={3}
														py={1}
														variant='outline'
														size='sm'
														ml={index === 0 ? 0 : 3}
														border='1px solid #E7E4DD'
														bg={isSelected ? 'accent.azure' : 'white'}
														isDisabled={!isReviewPending}
														cursor={isReviewPending ? 'pointer' : 'not-allowed'}
														_disabled={
															{
																_hover: {},
																_active: {},
																_focus: {},
															}
														}
														_hover={
															{
																bg: isSelected ? 'accent.azure' : 'gray.3'
															}
														}
														onClick={
															isReviewPending ? () => {
																if(isReviewPending) {
																	const temp = { ...review }
																	if(temp?.items && rubricIndex <= temp?.items?.length) {
																		temp.items[rubricIndex].rating = index + 1
																		setReview(temp)
																	}
																}
															} : undefined
														}>
														<Text
															variant='v2_body'
															color={isSelected ? 'white' : 'black.1'}>
															{index + 1}
														</Text>

													</Button>
												)
											})
										}
									</Flex>
									{
										isReviewPending && (
											<FlushedInput
												w='100%'
												value={item?.comment}
												textAlign='left'
												placeholder='Add comments'
												fontSize='14px'
												lineHeight='20px'
												maxLength={300}
												borderBottom='1px solid #E7E4DD'
												flexProps={{ mt: 3 }} />
										)
									}
									{
										!isReviewPending && (
											<Text
												mt={3}
												variant='v2_body'
												color='gray.5'>
												{item?.comment}
											</Text>
										)
									}
								</Flex>
							)
						})
					}
				</Flex>
				{
					isReviewPending && (
						<Flex
							px={5}
							py={4}>
							<Button
								disabled={review === undefined || review?.items?.some((item) => item.rating === 0)}
								w='100%'
								variant='primaryMedium'
								onClick={
									() => {

									}
								}>
								Submit Review
							</Button>
						</Flex>
					)
				}
			</Flex>
		)
	}

	const { chainId } = useContext(ApiClientsContext)!
	const { selectedProposals, proposals, selectedGrant, review, setReview } = useContext(DashboardContext)!
	const { scwAddress } = useContext(WebwalletContext)!

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const isReviewPending = useMemo(() => {
		return proposal?.pendingReviewerAddresses?.indexOf(scwAddress?.toLowerCase() ?? '') !== -1 && proposal?.state === 'submitted'
	}, [proposal, scwAddress])

	const { loadReview } = useLoadReview(selectedGrant?.id, chainId)

	useEffect(() => {
		if(!selectedGrant?.rubric?.items) {
			return
		}

		setReview({
			items: selectedGrant.rubric.items.map((rubric) => {
				return { rating: 0, comment: '', rubric }
			}),
			total: 0
		})
	}, [selectedGrant, proposal])

	useEffect(() => {
		const reviewToBeDecrypted = proposal?.reviews?.find((review) => review.reviewer.actorId === scwAddress?.toLowerCase())
		if(!reviewToBeDecrypted) {
			return
		}

		loadReview(reviewToBeDecrypted, proposal!.id).then((review) => {
			logger.info({ review }, 'Decrypted Review')
			setReview(review)
		})
	}, [proposal])

	useEffect(() => {
		logger.info({ review }, 'Review Changed')
	}, [review])

	return buildComponent()
}

export default ReviewProposal