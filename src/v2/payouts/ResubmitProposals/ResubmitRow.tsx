import { useEffect, useState } from 'react'
import { Flex, forwardRef, GridItem, Image, Menu, MenuButton, MenuItem, MenuList, Text, TextProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import getAvatar from 'src/utils/avatarUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'

const ResubmitRow = ({
	applicantData,
}: {
	applicantData: any;
}) => {
	const router = useRouter()
	const [isHovering, setIsHovering] = useState(false)
	useEffect(() => console.log(applicantData), [applicantData])

	const [reviews, setReviews] = useState<any>()

	const getReview = async(hash: string) => {
		if(hash === '') {
			return {}
		}

		const d = await getFromIPFS(hash)
		try {
			const data = JSON.parse(d)
			return data
		} catch(e) {
			console.log('incorrect review', e)
			return {}
		}
	}

	const getReviews = async(reviews: any[]) => {
		const reviewsDataMap = {} as any
		const reviewsData = await Promise.all(reviews?.map(async(review) => {
			const data = await getReview(review?.publicReviewDataHash)
			return data
		}))

		reviewsData.forEach((review, i) => {
			const reviewerIdSplit = reviews[i]?.reviewer?.id.split('.')
			const reviewerId = reviewerIdSplit[reviewerIdSplit.length - 1]
			reviewsDataMap[reviewerId] = review.items
		})

		console.log('reviewsData', reviewsData)
		console.log('reviewsData', reviewsDataMap)
		setReviews(reviewsDataMap)
	}

	useEffect(() => {
		if(applicantData?.reviews?.length) {
			getReviews(applicantData.reviews)
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
				<Text
					px={4}
					py={'18px'}
					color='#555570'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					{applicantData?.updated_on ?? '-'}
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


		</>
	)
}

export default ResubmitRow