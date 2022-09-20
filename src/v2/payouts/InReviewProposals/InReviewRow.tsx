import React, { MouseEventHandler, useContext, useMemo, useState } from 'react'
import {
	Button,
	Checkbox,
	Fade,
	Flex,
	forwardRef,
	GridItem,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	TextProps,
	Tooltip,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { defaultChainId } from 'src/constants/chains'
import { IApplicantData } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { useLoadReviews } from 'src/utils/reviews'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { AcceptApplication } from 'src/v2/assets/custom chakra icons/AcceptApplication'
import { RejectApplication } from 'src/v2/assets/custom chakra icons/RejectApplication'
import { ResubmitApplication } from 'src/v2/assets/custom chakra icons/ResubmitApplication'

const InReviewRow = ({
	applicantData,
	isChecked,
	onChange,
	someChecked,
	onAcceptClicked,
	onRejectClicked,
	onResubmitClicked,
}: {
	applicantData: IApplicantData
	isChecked: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	someChecked: boolean
	onAcceptClicked: MouseEventHandler | undefined
	onRejectClicked: MouseEventHandler | undefined
	onResubmitClicked: MouseEventHandler | undefined
}) => {
	const { workspace } = useContext(ApiClientsContext)!
 	const chainId = getSupportedChainIdFromWorkspace(workspace) || defaultChainId

	const router = useRouter()
	const [isHovering, setIsHovering] = useState(false)

	const { reviews: submittedReviews } = applicantData || { }
	const { reviews } = useLoadReviews(applicantData, chainId)

	const sortedReviews = useMemo(() => (
		[...Object.keys(reviews).sort((a, b) => reviews[b].total - reviews[a].total)]
	), [reviews])

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
						h='40px'
						w='40px'
					>
						<Image
							borderRadius='3xl'
							src={getAvatar(applicantData?.applicantAddress)}
						/>
					</Flex>

					<Flex
						direction='column'
						ml='12px'
						alignItems='flex-start'
					>
						<Text
							fontSize='14px'
							lineHeight='20px'
							fontWeight='500'
							noOfLines={1}
							textOverflow='ellipsis'
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
							{applicantData?.projectName}
						</Text>
						<Text
							fontSize='12px'
							lineHeight='16px'
							fontWeight='400'
							mt='2px'
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
							<Tooltip label={applicantData?.applicantAddress}>


								{`${applicantData?.applicantAddress?.substring(0, 6)}...`}

							</Tooltip>
							<Flex
								display="inline-block"
								ml={2}
							>
								<CopyIcon text={applicantData?.applicantAddress!} />
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
									py='18px'
									color='#555570'
									fontSize='14px'
									lineHeight='20px'
									fontWeight='500'
									{...props}
									ref={ref}
									aria-label='reviewers'
									cursor='pointer'
								>
									{
										applicantData?.reviewers?.length > 0 ?
					 						`${submittedReviews?.length} / ${applicantData?.reviewers?.length}`
											: '-'
									}
								</Text>
							))
						}
					/>
					<MenuList
						overflow='auto'
						minW='240px'
						maxH='156px'
						py={0}>
						<Flex
							bg='#F0F0F7'
							px={4}
							py={2}
						>
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='500'
								textAlign='center'
								color='#555570'
							>
								Reviewers
							</Text>
						</Flex>

						{
							applicantData?.reviewers?.map((reviewer, i) => {
								const reviewerIdSplit = reviewer?.id.split('.')
								const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]
								return (
									<>
										<MenuItem
											px='16px'
											py='10px'
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
													h='20px'
													w='20px'
												>
													<Image
														borderRadius='3xl'
														src={getAvatar(reviewerId)}
													/>
												</Flex>
												<Flex
													ml='12px'
													alignItems='center'
												>
													<Text
														fontSize='14px'
														lineHeight='20px'
														fontWeight='500'
														noOfLines={1}
														textOverflow='ellipsis'
													>
														{reviewer?.member?.fullName}
													</Text>


												</Flex>
												<Text
													fontSize='12px'
													lineHeight='16px'
													fontWeight='400'
													mt='2px'
													color='#7D7DA0'
													ml='auto'
												>
													{reviews[reviewerId]?.total || 0}
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
				<Flex alignItems='center'>
					<Flex alignItems='center'>
						{
							sortedReviews.map((reviewKey, i) => {
								return (
									<>
										<Menu key={`review-${reviewKey}-${i}`}>
											<MenuButton
												as={
													forwardRef<TextProps, 'div'>((props, ref) => (
														<Text
															px={4}
															py='18px'
															color='#555570'
															fontSize='14px'
															lineHeight='20px'
															fontWeight='500'
															{...props}
															ref={ref}
															aria-label='reviewers'
															cursor='pointer'
														>
															{reviews[reviewKey]?.total}
														</Text>
													))
												}
											/>
											<MenuList
												overflow='auto'
												minW='240px'
												maxH='156px'
												py={0}>
												<Flex
													bg='#F0F0F7'
													px={4}
													py={2}
												>
													<Text
														fontSize='14px'
														lineHeight='20px'
														fontWeight='500'
														textAlign='center'
														color='#555570'
													>
														Score
													</Text>
												</Flex>
												{
													[applicantData?.reviewers?.find((reviewer) => {
														const reviewerIdSplit = reviewer?.id.split('.')
														const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]
														return reviewerId === reviewKey
													})].map((reviewer, i) => {
														const reviewerIdSplit = reviewer?.id.split('.')
														const reviewerId = reviewerIdSplit ? reviewerIdSplit[reviewerIdSplit.length - 1] : undefined
														// console.log(reviewerId)
														return (
															<>
																<MenuItem
																	px='16px'
																	py='10px'
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
																			h='20px'
																			w='20px'
																		>
																			<Image
																				borderRadius='3xl'
																				src={getAvatar(reviewerId)}
																			/>
																		</Flex>

																		<Flex
																			ml='12px'
																			alignItems='center'
																		>
																			<Text
																				fontSize='14px'
																				lineHeight='20px'
																				fontWeight='500'
																				noOfLines={1}
																				textOverflow='ellipsis'
																			>
																				{reviewer?.member?.fullName}
																			</Text>


																		</Flex>
																		<Text
																			fontSize='12px'
																			lineHeight='16px'
																			fontWeight='400'
																			mt='2px'
																			color='#7D7DA0'
																			ml='auto'
																		>
																			{reviews[reviewerId!]?.total}
																		</Text>
																	</Flex>
																</MenuItem>
															</>
														)
													})
												}

												{
													reviews[reviewKey]?.items.map((item) => {
														return (
															<>
																<MenuItem
																	px='16px'
																	py='10px'
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
																			alignItems='center'
																		>
																			<Text
																				fontSize='14px'
																				lineHeight='20px'
																				fontWeight='500'
																				noOfLines={1}
																				textOverflow='ellipsis'
																			>
																				{item?.rubric?.title}
																			</Text>


																		</Flex>
																		<Text
																			fontSize='12px'
																			lineHeight='16px'
																			fontWeight='400'
																			mt='2px'
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
											i < sortedReviews.length - 1 && (
												<Text
													fontSize='14px'
													lineHeight='20px'
													fontWeight='500'
													textAlign='center'
													alignItems='center'
													color='#555570'
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
						<Tooltip label='Accept application'>
							<Button
								px={3}
								py='6px'
								minW={0}
								minH={0}
								h='auto'
								borderRadius='2px'
								mr={4}
								ml='auto'
								onClick={onAcceptClicked}
							>
								<AcceptApplication />
							</Button>
						</Tooltip>

						<Tooltip label='Ask for resubmission'>
							<Button
								px={3}
								py='6px'
								minW={0}
								minH={0}
								h='auto'
								borderRadius='2px'
								mr={4}
								onClick={onResubmitClicked}
							>
								<ResubmitApplication />
							</Button>
						</Tooltip>

						<Tooltip label='Reject Application'>
							<Button
								px={3}
								py='6px'
								minW={0}
								minH={0}
								h='auto'
								borderRadius='2px'
								mr='auto'
								onClick={onRejectClicked}
							>
								<RejectApplication />
							</Button>
						</Tooltip>
					</Fade>

				</Flex>
			</GridItem>
		</>
	)
}

export default InReviewRow
