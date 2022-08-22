import { Checkbox, Flex, Image, Link, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Switch, Text, Tooltip } from '@chakra-ui/react'
import CopyIcon from 'src/components/ui/copy_icon'

const AssignReviewers = () => {
	return (
		<>
			<Text
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
			>
				Assign Reviewers
			</Text>

			<Text
				fontSize='12px'
				lineHeight='16px'
				fontWeight='400'
				color='#7D7DA0'
				mt='2px'
			>
				Reviewers are auto assigned equally.
				{' '}
				<Link
					textDecoration={'none'}
					fontWeight='500'
					color='#1F1F33'
				>
					Learn more
				</Link>
			</Text>

			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
				flexDirection='column'
			>

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
				Select the number of reviewers to be auto assigned per application
				</Text>

				<Flex

				>
					<Slider
						mt={'24px'}
						mb='30px'
						aria-label='slider-ex-1'
						defaultValue={2}
						min={1}
						max={5}
						step={1}
					>
						{
							Array(6).fill(0).map((_, i) => i > 0 && (
								<SliderMark
									key={`assignReviewmark-${i}`}
									value={i}
									mt={2}
									fontSize='14px'
									lineHeight='20px'
									fontWeight='500'
									ml='-2px'
								>
									{i}
								</SliderMark>
							))
						}

						<SliderTrack>
							<SliderFilledTrack />
						</SliderTrack>
						<SliderThumb
							border={'2px solid #785EF0'}
							borderColor='#785EF0'
						/>
					</Slider>
				</Flex>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
				2 reviewers will be chosen randomly and assigned to each application

				</Text>
			</Flex>

			<Flex
				my={4}
				p={4}
				borderRadius='2px'
				boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
				flexDirection='column'
				maxH={'378px'}
				minH={'240px'}
				overflow='scroll'
			>

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
					mb={6}
				>
				Select reviewers to be auto - assigned
				</Text>

				{
					Array(10).fill(0).map((_, i) => {
						return (
							<Flex
								key={`reviewer-${i}`}
								py={2}
								px={0}
								display='flex'
								alignItems='center'
							>
								<Checkbox
								// isChecked={isChecked}
								// onChange={onChange}
								/>
								<Flex
									bg='#F0F0F7'
									borderRadius='20px'
									h={'40px'}
									w={'40px'}
									ml={'12px'}
								>
									<Image
									/>
								</Flex>

								<Flex
									direction='column'
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
							Ryan Adams
									</Text>
									{/* <Text
							fontSize='12px'
							lineHeight='16px'
							fontWeight='400'
							mt="2px"
							color='#7D7DA0'
						>
							{applicantData?.} • ryan@gmail.com
						</Text> */}
									<Text
										fontSize='12px'
										lineHeight='16px'
										fontWeight='400'
										mt="2px"
										color='#7D7DA0'
										display={'flex'}
										alignItems='center'
									>
										<Tooltip label={'0x71......976f'}>
											{/* <Tooltip label={applicantData?.applicant_address}> */}

											{/* {`${applicantData?.applicant_address?.substring(0, 6)}...`} */}
                0x71......976f

										</Tooltip>
										<Flex
											display="inline-block"
											ml={2}
										>
											{/* <CopyIcon text={applicantData?.applicant_address!} /> */}
											<CopyIcon text={'0x71......976f'} />
										</Flex>
									</Text>
								</Flex>
							</Flex>
						)
					})
				}
			</Flex>

			<Flex
				my={4}
				p={4}
				borderRadius='2px'
				boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
				flexDirection='column'

			>
				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
				Make reviews private
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
				The reviews will be encrypted on-chain if enabled.
				</Text>

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
					mt={6}
				>
				Hide scoring rubric & reviews
				</Text>

				<Flex>
					<Text
						fontSize='12px'
						lineHeight='16px'
						fontWeight='400'
						color='#7D7DA0'
						mt='2px'
						mr='auto'
					>
				The reviews will be encrypted on-chain if enabled.
					</Text>
					<Switch
						id="encrypt"
						// // isChecked={partnersRequired}
						// // onChange={
						// // 	(e: any) => {
						// // 		setPartnersRequired(e.target.checked)
						// // 		const newPartners = partners?.map((partner: any) => ({
						// // 			...partner,
						// // 			nameError: false,
						// // 		}))
						// // 		setPartners(newPartners)
						// // 	}
						// }
					/>
				</Flex>
			</Flex>
		</>
	)
}

export default AssignReviewers