import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { useLoadReview } from 'src/libraries/utils/reviews'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import useSubmitReview from 'src/screens/dashboard/_hooks/useSubmitReview'
import { ReviewData } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'

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
					{' '}
					{process.env.NODE_ENV === 'development' && proposal?.id}
				</Text>
				{/* {selectedGrant?.reviewType === 'voting' ? vote() : rubric()} */}
				{
					!isReviewPending && review?.items?.map((r, index) => {
						logger.info({ r, index }, 'Review item')
						if(r.rubric.maximumPoints > 1) {
							return rubricItem(r, index)
						} else {
							return voteItem(r, index)
						}
					})
				}
				{
					isReviewPending && (
						<Flex
							direction='column'
							overflowY='auto'>
							{review?.items?.map(selectedGrant?.reviewType === 'voting' ? voteItem : rubricItem)}
						</Flex>
					)
				}
				{
					isReviewPending && (
						<Flex
							px={5}
							py={4}>
							<Button
								disabled={review === undefined || review?.items?.some((item) => (item.rating === 0 && selectedGrant?.reviewType === 'rubrics') || (item.rating === -1 && selectedGrant?.reviewType === 'voting')) || !isBiconomyInitialised}
								w='100%'
								variant='primaryMedium'
								onClick={submitReview}>
								Submit Review
							</Button>
						</Flex>
					)
				}

				<NetworkTransactionFlowStepperModal
					isOpen={networkTransactionModalStep !== undefined}
					currentStepIndex={networkTransactionModalStep || 0}
					viewTxnLink={getExplorerUrlForTxHash(chainId, transactionHash)}
					onClose={
						() => {
							setNetworkTransactionModalStep(undefined)
							router.reload()
						}
					} />
			</Flex>
		)
	}

	const rubricItem = (item: ReviewData, index: number) => {
		return (
			<Flex
				key={index}
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
												if(temp?.items && index <= temp?.items?.length) {
													temp.items[index].rating = index + 1
													if(!temp.total) {
														temp.total = 0
													}

													temp.total += index + 1
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
							flexProps={{ mt: 3 }}
							onChange={
								(e) => {
									const temp = { ...review }
									if(temp?.items && index <= temp?.items?.length) {
										temp.items[index].comment = e.target.value
										setReview(temp)
									}
								}
							} />
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
	}

	const voteItem = (item: ReviewData, index: number) => {
		logger.info({ item, index }, 'Vote Item')
		return (
			<Flex
				key={index}
				px={5}
				py={4}
				borderBottom='1px solid #E7E4DD'
				direction='column'>
				<Text
					variant='v2_body'>
					Vote for
				</Text>
				{
					[1, 0].map((vote, voteIndex) => {
						return (
							<Button
								key={voteIndex}
								mt={voteIndex === 0 ? 4 : 6}
								variant='primaryMedium'
								border={`1px solid ${item.rating === vote ? '#1D1919' : '#E7E4DD'}`}
								borderRadius='4px'
								cursor={isReviewPending ? 'pointer' : 'default'}
								bg='white'
								onClick={
									isReviewPending ? () => {
										if(isReviewPending) {
											const temp = { ...review }
											if(temp?.items && index <= temp?.items?.length) {
												temp.items[index].rating = vote
												temp.total = vote
												setReview(temp)
											}
										}
									} : undefined
								}>
								<Text
									variant='v2_body'
									fontWeight='500'>
									{vote ? 'Yes' : 'No'}
								</Text>
							</Button>
						)
					})
				}
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
							flexProps={{ mt: 3 }}
							onChange={
								(e) => {
									const temp = { ...review }
									if(temp?.items && index <= temp?.items?.length) {
										temp.items[index].comment = e.target.value
										setReview(temp)
									}
								}
							} />
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
	}

	const { chainId } = useContext(ApiClientsContext)!
	const { selectedProposals, proposals, selectedGrant, review, setReview } = useContext(DashboardContext)!
	const { scwAddress } = useContext(WebwalletContext)!

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>()
	const { submitReview, isBiconomyInitialised } = useSubmitReview({ setNetworkTransactionModalStep, setTransactionHash })

	const router = useRouter()

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
		if(selectedGrant?.reviewType === 'voting') {
			if(!selectedGrant?.rubric?.items?.[0]) {
				return
			}

			setReview({
				items: [{ rating: -1, comment: '', rubric: selectedGrant?.rubric?.items?.[0] }],
				total: 0
			})
		} else {
			if(!selectedGrant?.rubric?.items) {
				return
			}

			setReview({
				items: selectedGrant.rubric.items.map((rubric) => {
					return { rating: 0, comment: '', rubric }
				}),
				total: 0
			})
		}
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