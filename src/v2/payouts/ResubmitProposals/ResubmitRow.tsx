import { useState } from 'react'
import { Flex, forwardRef, GridItem, Image, Menu, MenuButton, MenuItem, MenuList, Text, TextProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import SupportedChainId from 'src/generated/SupportedChainId'
import { IApplicantData } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { useLoadReviews } from 'src/utils/reviews'

type ResubmitRowProps = {
	applicantData: IApplicantData
	chainId: SupportedChainId
}

const ResubmitRow = ({
	applicantData,
	chainId
}: ResubmitRowProps) => {
	const router = useRouter()
	const [isHovering, setIsHovering] = useState(false)
	const { reviews } = useLoadReviews(applicantData, chainId)

	return (
		<>
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
					as='button'
					onClick={
						() => router.push({
							pathname: '/your_grants/view_applicants/applicant_form/',
							query: {
								commentData: '',
								applicationId: applicantData?.applicationId,
							},
						})
					}
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
							src={getAvatar(false, applicantData?.applicantAddress)}
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
				<Text
					px={4}
					py='18px'
					color='#555570'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					{applicantData?.updatedOn ?? '-'}
				</Text>

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
					 						`${applicantData?.reviews?.length} / ${applicantData?.reviewers?.length}`
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
														src={getAvatar(false, reviewerId)}
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
													{reviews[reviewerId]?.total}
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


		</>
	)
}

export default ResubmitRow
