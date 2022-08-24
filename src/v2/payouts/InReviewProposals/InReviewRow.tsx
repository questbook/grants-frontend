import { useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Fade, Flex, forwardRef, GridItem, Image, Menu, MenuButton, MenuItem, MenuList, Text, TextProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import { IReview, IReviewFeedback } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { useLoadReview } from 'src/utils/reviews'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { AcceptApplication } from 'src/v2/assets/custom chakra icons/AcceptApplication'
import { RejectApplication } from 'src/v2/assets/custom chakra icons/RejectApplication'
import { ResubmitApplication } from 'src/v2/assets/custom chakra icons/ResubmitApplication'

const InReviewRow = ({
	onSendFundsClicked,
	applicantData,
	isChecked,
	onChange,
	someChecked,
	onAcceptClicked,
	onRejectClicked,
	onResubmitClicked,
}: {
	onSendFundsClicked: () => void;
	applicantData: any;
	isChecked: boolean;
	onChange: (e: any) => void;
	someChecked: boolean;
	onAcceptClicked: (e: any) => void;
	onRejectClicked: (e: any) => void;
	onResubmitClicked: (e: any) => void;
}) => {
	const { workspace } = useContext(ApiClientsContext)!
 	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId

	const router = useRouter()
	const [isHovering, setIsHovering] = useState(false)

	const { grant, reviews: submittedReviews } = applicantData || { }
	const { loadReview, isReviewPrivate } = useLoadReview(grant?.id, chainId)

	const [reviews, setReviews] = useState<{ [_id: string]: IReviewFeedback }>({ })

	const getReviews = async() => {
		const reviewsDataMap: typeof reviews = { }

		await Promise.all(
			submittedReviews!.map(async(review: IReview) => {
				try {
					console.log('review ', review)
					const reviewData = await loadReview(review, applicantData!.id)
					const [workspaceId, reviewerAddress] = review.reviewer!.id.split('.')
					reviewsDataMap[reviewerAddress] = reviewData
				} catch(error) {
					console.error(`failed to load review from "${review.reviewer!.id}"`, error)
					// do nothing for now
				}
			})
		)

		setReviews(reviewsDataMap)
	}

	useEffect(() => {
		if(submittedReviews?.length) {
			getReviews()
		}
	}, [applicantData])

	const totalScore = (items?: any[]) => {
		console.log(items)
		let s = 0
		items?.forEach((item) => {
			s += item.rating ?? 0
		})

		return s
	}

	return (
		<>
			<GridItem
				display='flex'
				alignItems='center'
				justifyContent='center'
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				bg={isHovering ? '#FBFBFD' : 'white'}
			>
				<Checkbox
					isChecked={isChecked}
					onChange={onChange}
				/>
			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
				display='flex'
				alignItems='center'
			>
				<Flex
					py={2}
					px={4}
					display='flex'
					alignItems='center'
				>
					<Flex
						bg='#F0F0F7'
						borderRadius='20px'
						h={'40px'}
						w={'40px'}
					>
						<Image
							borderRadius="3xl"
							src={getAvatar(applicantData?.applicant_address)}
						/>
					</Flex>

					<Flex
						direction='column'
						ml='12px'
						alignItems={'flex-start'}
					>
						<Text
							fontSize='14px'
							lineHeight='20px'
							fontWeight='500'
							noOfLines={1}
							textOverflow={'ellipsis'}
							cursor='pointer'
							onClick={
								() => router.push({
									pathname: '/your_grants/view_applicants/applicant_form/',
									query: {
										commentData: '',
										applicationId: applicantData?.applicationId,
									},
								})
							}
						>
							{applicantData?.project_name}
						</Text>
						<Text
							fontSize='12px'
							lineHeight='16px'
							fontWeight='400'
							mt="2px"
							color='#7D7DA0'
						>
							{applicantData?.applicantName}
							{' '}
•
							{' '}
							{applicantData?.applicantEmail}
						</Text>
						{/* <Text
							fontSize='12px'
							lineHeight='16px'
							fontWeight='400'
							mt="2px"
							color='#7D7DA0'
							display={'flex'}
							alignItems='center'
						>
							<Tooltip label={applicantData?.applicant_address}>


								{`${applicantData?.applicant_address?.substring(0, 6)}...`}

							</Tooltip>
							<Flex
								display="inline-block"
								ml={2}
							>
								<CopyIcon text={applicantData?.applicant_address!} />
							</Flex>
						</Text> */}
					</Flex>
				</Flex>
			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
				display='flex'
				alignItems='center'
			>
				<Menu>
					<MenuButton
						as={
							forwardRef<TextProps, 'div'>((props, ref) => (
								<Text
									px={4}
									py={'18px'}
									color='#555570'
									fontSize='14px'
									lineHeight='20px'
									fontWeight='500'
									{...props}
									ref={ref}
									aria-label='reviewers'
									cursor={'pointer'}
								>
									{
										applicantData?.reviewers?.length > 0 ?
					 						`${applicantData?.reviews?.length} / ${applicantData?.reviewers?.length}`
											: '-'
									}
								</Text>
							))
						}
					/>
					<MenuList
						overflow="scroll"
						minW={'240px'}
						maxH={'156px'}
						py={0}>
						<Flex
							bg={'#F0F0F7'}
							px={4}
							py={2}
						>
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='500'
								textAlign='center'
								color={'#555570'}
							>
								Reviewers
							</Text>
						</Flex>

						{
							applicantData?.reviewers?.map((reviewer: any, i: number) => {
								const reviewerIdSplit = reviewer?.id.split('.')
								const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]
								console.log(reviewerId)
								return (
									<>
										<MenuItem
											px={'16px'}
											py={'10px'}
										>

											<Flex
												key={`reviewer-${i}`}
												px={0}
												display='flex'
												alignItems='center'
												w='100%'
											>
												<Flex
													bg='#F0F0F7'
													borderRadius='20px'
													h={'20px'}
													w={'20px'}
												>
													<Image
														borderRadius="3xl"
														src={getAvatar(reviewerId)}
													/>
												</Flex>
												<Flex
													ml='12px'
													alignItems={'center'}
												>
													<Text
														fontSize='14px'
														lineHeight='20px'
														fontWeight='500'
														noOfLines={1}
														textOverflow={'ellipsis'}
													>
														{reviewer?.member?.fullName}
													</Text>


												</Flex>
												<Text
													fontSize='12px'
													lineHeight='16px'
													fontWeight='400'
													mt="2px"
													color='#7D7DA0'
													ml='auto'
												>
													{totalScore(reviews ? reviews[reviewerId] : [])}
												</Text>
											</Flex>
										</MenuItem>
									</>
								)
							})
						}
					</MenuList>
				</Menu>


			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
				display='flex'
				alignItems='center'
			>
				<Flex alignItems={'center'}>
					<Flex alignItems="center">
						{
							reviews &&
							[...Object.keys(reviews).sort((a, b) => totalScore(reviews[b]) - totalScore(reviews[a]))].map((reviewKey, i) => {
								return (
									<>
										<Menu key={`review-${reviewKey}-${i}`}>
											<MenuButton
												as={
													forwardRef<TextProps, 'div'>((props, ref) => (
														<Text
															px={4}
															py={'18px'}
															color='#555570'
															fontSize='14px'
															lineHeight='20px'
															fontWeight='500'
															{...props}
															ref={ref}
															aria-label='reviewers'
															cursor={'pointer'}
														>
															{totalScore(reviews[reviewKey])}
														</Text>
													))
												}
											/>
											<MenuList
												overflow="scroll"
												minW={'240px'}
												maxH={'156px'}
												py={0}>
												<Flex
													bg={'#F0F0F7'}
													px={4}
													py={2}
												>
													<Text
														fontSize='14px'
														lineHeight='20px'
														fontWeight='500'
														textAlign='center'
														color={'#555570'}
													>
												Score
													</Text>
												</Flex>
												{
													[applicantData?.reviewers?.find((reviewer: any) => {
														const reviewerIdSplit = reviewer?.id.split('.')
														const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]
														return reviewerId === reviewKey
													})].map((reviewer: any, i: number) => {
														const reviewerIdSplit = reviewer?.id.split('.')
														const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]
														console.log(reviewerId)
														return (
															<>
																<MenuItem
																	px={'16px'}
																	py={'10px'}
																>

																	<Flex
																		key={`reviewer-${i}`}
																		px={0}
																		display='flex'
																		alignItems='center'
																		w='100%'
																	>

																		<Flex
																			bg='#F0F0F7'
																			borderRadius='20px'
																			h={'20px'}
																			w={'20px'}
																		>
																			<Image
																				borderRadius="3xl"
																				src={getAvatar(reviewerId)}
																			/>
																		</Flex>

																		<Flex
																			ml='12px'
																			alignItems={'center'}
																		>
																			<Text
																				fontSize='14px'
																				lineHeight='20px'
																				fontWeight='500'
																				noOfLines={1}
																				textOverflow={'ellipsis'}
																			>
																				{reviewer?.member?.fullName}
																			</Text>


																		</Flex>
																		<Text
																			fontSize='12px'
																			lineHeight='16px'
																			fontWeight='400'
																			mt="2px"
																			color='#7D7DA0'
																			ml='auto'
																		>
																			{totalScore(reviews ? reviews[reviewerId] : [])}
																		</Text>
																	</Flex>
																</MenuItem>
															</>
														)
													})
												}

												{
													reviews[reviewKey]?.map((item: any) => {
														return (
															<>
																<MenuItem
																	px={'16px'}
																	py={'10px'}
																>

																	<Flex
																		key={`reviewDetail-${item?.rubric?.id}`}
																		px={0}
																		display='flex'
																		alignItems='center'
																		w='100%'
																	>

																		<Flex
																			ml='12px'
																			alignItems={'center'}
																		>
																			<Text
																				fontSize='14px'
																				lineHeight='20px'
																				fontWeight='500'
																				noOfLines={1}
																				textOverflow={'ellipsis'}
																			>
																				{item?.rubric?.title}
																			</Text>


																		</Flex>
																		<Text
																			fontSize='12px'
																			lineHeight='16px'
																			fontWeight='400'
																			mt="2px"
																			color='#7D7DA0'
																			ml='auto'
																		>
																			{item?.rating}
																		</Text>
																	</Flex>
																</MenuItem>
															</>
														)
													})
												}


											</MenuList>
										</Menu>
										{
											i < Object.keys(reviews).length - 1 && (
												<Text
													fontSize='14px'
													lineHeight='20px'
													fontWeight='500'
													textAlign='center'
													alignItems="center"
													color={'#555570'}
												>
													{' '}
•
													{' '}
												</Text>
											)
										}
									</>

								)
							})
						}
					</Flex>


					<Fade in={!someChecked && isHovering}>
						<Button
							px={3}
							py={'6px'}
							minW={0}
							minH={0}
							h="auto"
							borderRadius={'2px'}
							mr={4}
							ml='auto'
							onClick={(e) => onAcceptClicked(e)}
						>
							<AcceptApplication />
						</Button>

						<Button
							px={3}
							py={'6px'}
							minW={0}
							minH={0}
							h="auto"
							borderRadius={'2px'}
							mr={4}
							onClick={(e) => onResubmitClicked(e)}
						>
							<ResubmitApplication />
						</Button>

						<Button
							px={3}
							py={'6px'}
							minW={0}
							minH={0}
							h="auto"
							borderRadius={'2px'}
							mr={'auto'}
							onClick={(e) => onRejectClicked(e)}
						>
							<RejectApplication />
						</Button>
					</Fade>

				</Flex>
			</GridItem>
		</>
	)
}

export default InReviewRow