import { useTranslation } from 'react-i18next'
import { Checkbox, Flex, Image, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Switch, Text, Tooltip } from '@chakra-ui/react'
import CopyIcon from 'src/components/ui/copy_icon'
import { SidebarReviewer } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

interface Props {
	minCount: number
	maxCount: number
	defaultSliderValue: number
	sliderValue: number
	isPrivateReviews: boolean
	setIsPrivateReviews: (_: boolean) => void
	onSlide: (value: number) => void
	reviewers: SidebarReviewer[]
	onReviewerChange: (reviewer: SidebarReviewer) => void
}

const AssignReviewers = ({ minCount, maxCount, defaultSliderValue, sliderValue, isPrivateReviews, setIsPrivateReviews, onSlide, reviewers, onReviewerChange }: Props) => {
	const { t } = useTranslation()
	return (
		<>
			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				flexDirection='column'
			>

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					{t('/your_grants/view_applicants.how_many_reviewers')}
				</Text>

				<Flex

				>
					<Slider
						mt='24px'
						mb='30px'
						aria-label='slider-ex-1'
						defaultValue={defaultSliderValue}
						min={minCount}
						max={maxCount}
						step={1}
						onChangeEnd={onSlide}
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
							border='2px solid #785EF0'
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
					{sliderValue}
					{' '}
					{t('/your_grants/view_applicants.how_many_reviewers_description')}

				</Text>
			</Flex>

			<Flex
				my={4}
				p={4}
				borderRadius='2px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				flexDirection='column'
				maxH='378px'
				minH='240px'
				overflow='auto'
			>

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
					mb={6}
				>
					{t('/your_grants/view_applicants.pick_reviewers')}
				</Text>

				{
					reviewers.map((reviewer: SidebarReviewer) => {
						return (
							<Flex
								key={`reviewer-${reviewer.index}`}
								py={2}
								px={0}
								display='flex'
								alignItems='center'
							>
								<Checkbox
									isChecked={reviewer.isSelected}
									onChange={() => onReviewerChange(reviewer)}
								/>
								<Flex
									bg='#F0F0F7'
									borderRadius='20px'
									h='40px'
									w='40px'
									ml='12px'
								>
									<Image
										borderRadius='3xl'
										src={reviewer.data?.profilePictureIpfsHash ? getUrlForIPFSHash(reviewer.data.profilePictureIpfsHash) : getAvatar(false, reviewer.data?.actorId)}
									/>
								</Flex>

								<Flex
									direction='column'
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
										{reviewer.data.fullName}
									</Text>
									<Text
										fontSize='12px'
										lineHeight='16px'
										fontWeight='400'
										mt='2px'
										color='#7D7DA0'
										display='flex'
										alignItems='center'
									>
										<Tooltip label={reviewer.data.actorId}>
											{formatAddress(reviewer.data.actorId)}
										</Tooltip>
										<Flex
											display='inline-block'
											ml={2}
										>
											<CopyIcon text={reviewer.data.actorId} />
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
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				flexDirection='column'

			>
				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					{t('/your_grants/view_applicants.make_reviews_private')}
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
						{t('/your_grants/view_applicants.make_reviews_private_description')}
					</Text>
					<Switch
						isChecked={isPrivateReviews}
						onChange={e => setIsPrivateReviews(e.target.checked)}
						// isChecked={partnersRequired}
						// onChange={
						// 	(e: any) => {
						// 		setPartnersRequired(e.target.checked)
						// 		const newPartners = partners?.map((partner: any) => ({
						// 			...partner,
						// 			nameError: false,
						// 		}))
						// 		setPartners(newPartners)
						// 	}
						// }
					/>
				</Flex>
			</Flex>
		</>
	)
}

export default AssignReviewers