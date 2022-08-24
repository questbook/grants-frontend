import React, { useContext, useEffect, useState } from 'react'
import StarRatings from 'react-star-ratings'
import {
	Badge,
	Box, Button, Divider,
	Drawer, DrawerContent, DrawerOverlay, Flex, Image, Link, Text, } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import Loader from 'src/components/ui/loader'
import { defaultChainId } from 'src/constants/chains'
import { GetApplicationDetailsQuery } from 'src/generated/graphql'
import { IReviewFeedback } from 'src/types'
import { truncateStringFromMiddle } from 'src/utils/formattingUtils'
import { useLoadReview } from 'src/utils/reviews'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

interface RubricSidebarProps {
  applicationData: GetApplicationDetailsQuery['grantApplication']
}

type RubricResult = {
	title: string
	maximumPoints: number
	rating: number
	total: number
}

function RubricSidebar({ applicationData }: RubricSidebarProps) {
	const { workspace } = useContext(ApiClientsContext)!
	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId

	const [loading, setLoading] = useState(false)
	const [detailedReviews, setDetailedReviews] = useState<any[]>([])
	const [aggregatedResults, setAggregatedResults] = useState<any>()
	const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
	const [reviewerDrawerOpen, setReviewerDrawerOpen] = useState(false)
	const [reviewSelected, setReviewSelected] = useState<any>()
	const [reviewerSelected, setReviewerSelected] = useState<any>()

	const [forPercentage, setForPercentage] = useState<number>(0)
	const [againstPercentage, setAgainstPercentage] = useState<number>(0)

	const total = Math.max(
		applicationData?.reviewers?.length || 0,
		applicationData?.reviews?.length || 0,
	)

	const { grant, reviews } = applicationData || { }
	const rubric = grant?.rubric
	const { loadReview, isReviewPrivate } = useLoadReview(grant?.id, chainId)

	const isPrivate = reviews?.[0] ? isReviewPrivate(reviews[0]) : false

	const decodeReviews = async() => {
		setLoading(true)

		const feedbacks: IReviewFeedback[] = []
		await Promise.all(
			reviews!.map(
				async review => {
					try {
						const reviewData = await loadReview(review, applicationData!.id)
						feedbacks.push(reviewData)
					} catch(error) {
						console.error(`failed to load review from "${review.reviewer!.id}"`, error)
						// do nothing for now
					}
				}
			)
		)

		setDetailedReviews(feedbacks)

		const results: { [id: string]: RubricResult } = { }
		rubric!.items.forEach((item) => {
			results[item.id] = {
				title: item.title,
				maximumPoints: item.maximumPoints,
				rating: 0,
				total: 0,
			}
		})

		let forCount = 0
		feedbacks.forEach((review) => {
			if(review.isApproved) {
				forCount += 1
			}

			review.items.forEach((item: any) => {
				results[item.rubric.id].rating += item.rating
				results[item.rubric.id].total += 1
			})
		})

		const forPercentage = Math.ceil((forCount / feedbacks.length) * 100)
		const againstPercentage = 100 - forPercentage

		if(feedbacks.length) {
			setForPercentage(forPercentage)
			setAgainstPercentage(againstPercentage)
		}

		setAggregatedResults(results)
		setLoading(false)
	}

	useEffect(() => {
		if(!rubric) {
			return
		}

		decodeReviews()
	}, [reviews, rubric])

	const motion = [
		{
			label: 'Against',
			percentage: againstPercentage,
			icon: '/ui_icons/like_down.svg',
			color: '#EE7979',
		},
		{
			label: 'For',
			percentage: forPercentage,
			icon: '/ui_icons/like_up.svg',
			color: '#39C696',
		},
	]

	if(!reviews?.length) {
		return null
	}

	if(loading) {
		return (
			<Flex
				bg="white"
				border="2px solid #D0D3D3"
				borderRadius={8}
				w={340}
				direction="column"
				alignItems="stretch"
				px="28px"
				py="22px"
			>
				<Flex
					direction="row"
					justify="space-between">
					<Text
						variant="tableHeader"
						color="#122224">
            			Application Review
					</Text>
				</Flex>

				<Loader />
			</Flex>
		)
	}

	return (
		<>
			<Flex
				bg="white"
				border="2px solid #D0D3D3"
				borderRadius={8}
				w={340}
				direction="column"
				alignItems="stretch"
				px="28px"
				py="22px"
			>
				<Flex
					direction="row"
					justify="space-between">
					<Text
						variant="tableHeader"
						color="#122224">
            			Application Review
					</Text>

					{
						isPrivate && (
							<Badge
								fontSize='x-small'
								p='1'
								pr='2'
								pl='2'>
								Private
							</Badge>
						)
					}
				</Flex>
				<Flex
					mt={3}
					alignItems="center">
					<Text
						fontSize="14px"
						mr="auto"
						variant="applicationText">
						{detailedReviews.length}
           				/
						{total}
						{' '}
            			Reviews Submitted
					</Text>

					<Text fontSize="12px">
            			(
						{total - detailedReviews.length}
						{' '}
           				waiting)
					</Text>
				</Flex>

				<Box mt={2} />

				{
					forPercentage === 0 && againstPercentage === 0 ? null : (
						<Flex
							direction="column"
							mt={8}>

							{
								motion.map((motionItem, index) => (
									<Flex
										key={motionItem.label}
										w="100%"
										justify="space-between"
										position="relative"
										align="center"
										mt={index === 0 ? 0 : '44px'}
									>
										<Flex
											w={`${motionItem.percentage}%`}
											bg={motionItem.color}
											borderRadius="4px"
											h="32px"
											position="absolute"
											left={0}
										/>

										<Flex
											direction="row"
											align="center"
											pos="absolute">
											<Image
												w="12px"
												h="12px"
												src={motionItem.icon}
												mx={3} />
											<Text
												fontSize="14px"
												lineHeight="24px"
												fontWeight="500"
												color="#FFFFFF"
											>
												{motionItem.label}
											</Text>
										</Flex>
										<Text
											position="absolute"
											right={2}
											fontSize="18px"
											lineHeight="24px"
											fontWeight="700"
											color="#414E50"
										>
											{motionItem.percentage}
                  %
										</Text>
									</Flex>
								))
							}
						</Flex>
					)
				}

				{
					aggregatedResults && Object.values(aggregatedResults).length > 0 ? (
						<Text
							mt={14}
							variant="tableHeader"
							color="#122224">
            Evaluation Rubric
						</Text>
					) : null
				}
				<Flex
					direction="column"
					mt={4}>
					{
						aggregatedResults && Object.values(aggregatedResults)
							.map((r: any, i: number) => (
								<Flex
									key={r.title}
									direction="row"
									mt={i === 0 ? 0 : 5}
									alignItems="center">
									<Text
										fontSize="16px"
										lineHeight="16px"
										fontWeight="400"
										color="#122224"
									>
										{r.title}
									</Text>
									<Box mx="auto" />
									<StarRatings
										rating={r.total === 0 ? 0 : r.rating / r.total}
										starRatedColor="#88BDEE"
										starDimension="16px"
										starSpacing="2px"
										numberOfStars={r.maximumPoints}
									/>
								</Flex>
							))
					}
				</Flex>

				{
					aggregatedResults && Object.values(aggregatedResults).length > 0 ? (
						<Link
							mt={5}
							onClick={() => setDetailDrawerOpen(true)}
							fontSize="14px"
							lineHeight="24px"
							fontWeight="500">
								See detailed feedback
						</Link>
					) : null
				}
			</Flex>

			<Drawer
				isOpen={detailDrawerOpen}
				placement="right"
				onClose={() => setDetailDrawerOpen(false)}
				size="lg"
			>
				<DrawerOverlay />
				<DrawerContent>
					<Flex
						direction="column"
						py={8}
						px={4}
						h="100%"
						overflow="scroll">
						<Flex
							px={4}
							mb={8}
							alignItems="center">
							<Text
								color="#122224"
								fontWeight="bold"
								fontSize="16px"
								lineHeight="20px"
								mr="auto"
							>
								Select Reviewer
							</Text>
							<Image
								src="/ui_icons/close_drawer.svg"
								cursor="pointer"
								h="20px"
								w="20px"
								onClick={() => setDetailDrawerOpen(false)}
							/>
						</Flex>
						{
							reviews?.map((review, i: number) => (
								<Button
									key={review.id}
									onClick={
										() => {
											console.log(review)
											setReviewerDrawerOpen(true)
											console.log(detailedReviews[i])
											setReviewSelected(detailedReviews[i])
											setReviewerSelected(review.reviewer)
										}
									}
									mb={4}
									py={8}
									px={4}
									mx="-2px"
									backgroundColor="white"
								>
									<Flex
										w="100%"
										h="64px"
										align="center"
										py={3}
									>
										<Image src="/ui_icons/reviewer_account.svg" />
										<Flex
											direction="column"
											ml={4}
											justifyContent="center"
											textAlign="left">
											<Text
												fontWeight="700"
												color="#122224"
												fontSize="14px"
												lineHeight="16px"
											>
												{
													review.reviewer?.fullName
													|| truncateStringFromMiddle(review.reviewer?.id.split('.')?.[1] || '')
												}
											</Text>
											<Text
												mt={review.reviewer?.email ? 1 : 0}
												color="#717A7C"
												fontSize="12px"
												lineHeight="16px">
												{review.reviewer?.email}
											</Text>
										</Flex>
										<Image
											ml="auto"
											mr={2}
											src="/ui_icons/drawer_navigate_right.svg" />
									</Flex>
								</Button>
							))
						}
					</Flex>
				</DrawerContent>
			</Drawer>

			<Drawer
				isOpen={reviewerDrawerOpen}
				placement="right"
				onClose={
					() => {
						setReviewerDrawerOpen(false)
						setReviewSelected(null)
						setReviewerSelected(null)
					}
				}
				size="lg"
			>
				<DrawerOverlay />
				<DrawerContent>

					<Flex
						direction="column"
						overflow="scroll"
						p={8}>
						<Flex
							mb={6}
							alignItems="center">
							<Image
								src="/ui_icons/back_arrow.svg"
								cursor="pointer"
								mr="12px"
								h="16px"
								w="16px"
								onClick={
									() => {
										setReviewerDrawerOpen(false)
										setReviewSelected(null)
										setReviewerSelected(null)
									}
								}
							/>
							<Text
								color="#122224"
								fontWeight="bold"
								fontSize="16px"
								lineHeight="20px"
							>
                Application Feedback
							</Text>
						</Flex>

						<Flex
							w="100%"
							h="64px"
							align="center"
							py={3}
						>
							<Image src="/ui_icons/reviewer_account.svg" />
							<Flex
								direction="column"
								ml={4}
								justifyContent="center"
								textAlign="left">
								<Text
									fontWeight="700"
									color="#122224"
									fontSize="14px"
									lineHeight="16px"
								>
									{truncateStringFromMiddle(reviewerSelected?.id.split('.')[1])}
								</Text>
								<Text
									mt={reviewerSelected?.email ? 1 : 0}
									color="#717A7C"
									fontSize="12px"
									lineHeight="16px">
									{reviewerSelected?.email}
								</Text>
							</Flex>
						</Flex>

						{
							reviewSelected && reviewSelected.items && reviewSelected.items.length > 0 ? (
								<>
									<Text
										mt="18px"
										color="#122224"
										fontWeight="bold"
										fontSize="16px"
										lineHeight="20px"
									>
                  Overall Recommendation
									</Text>
									<Flex
										pt="12px"
										pb="18px">
										<Button
											onClick={() => {}}
											variant={!reviewSelected?.isApproved ? 'outline' : 'solid'}
											h={12}
											minW="130px"
											colorScheme="brandGreen"
											borderRadius="6px"
										>
											<Image
												h="16px"
												w="16px"
												src={!reviewSelected?.isApproved ? '/ui_icons/like_up_green.svg' : '/ui_icons/like_up.svg'} />
											<Box mr="6px" />
											<Text color={!reviewSelected?.isApproved ? '#39C696' : '#FFFFFF'}>
For
											</Text>
										</Button>

										<Box ml={4} />

										<Button
											onClick={() => {}}
											variant={reviewSelected?.isApproved ? 'outline' : 'solid'}
											h={12}
											minW="130px"
											colorScheme="brandRed"
											borderRadius="6px"
										>
											<Image
												h="16px"
												w="16px"
												src={reviewSelected?.isApproved ? '/ui_icons/like_down_red.svg' : '/ui_icons/like_down.svg'} />
											<Box mr="6px" />
											<Text color={reviewSelected?.isApproved ? '#EE7979' : '#FFFFFF'}>
Against
											</Text>
										</Button>
									</Flex>
									{
										reviewSelected?.items?.map((feedback: any) => (
											<>
												<Flex
													mt={4}
													gap="2"
													direction="column"
												>
													<Text
														mt="18px"
														color="#122224"
														fontWeight="bold"
														fontSize="16px"
														lineHeight="12px"
													>
														{feedback.rubric.title}
													</Text>
													<Text
														color="#69657B"
														fontWeight="400"
														fontSize="12px"
														lineHeight="12px"
													>
														{feedback.rubric.details}
													</Text>

													<Box mt="2px">
														<StarRatings
															numberOfStars={feedback.rubric.maximumPoints}
															starRatedColor="#88BDEE"
															rating={feedback.rating}
															name="rating"
															starHoverColor="#88BDEE"
															starDimension="18px"
															starSpacing="4px"
														/>
													</Box>

													<MultiLineInput
														value={feedback.comment}
														onChange={() => {}}
														placeholder="Feedback"
														isError={false}
														errorText="Required"
														disabled
													/>
												</Flex>
												<Divider mt={4} />
											</>
										))
									}
								</>
							) : (
								<Text
									mt="18px"
									color="#122224"
									fontWeight="bold"
									fontSize="16px"
									lineHeight="20px"
								>
                Unable to decrpyt review
								</Text>
							)
						}
					</Flex>
				</DrawerContent>
			</Drawer>
		</>
	)
}

export default RubricSidebar
