import {
	Box,
	Image,
	RangeSlider,
	RangeSliderFilledTrack,
	RangeSliderMark,
	RangeSliderThumb,
	RangeSliderTrack,
	Text
} from '@chakra-ui/react'

type NumOfReviewersSliderProps = {
    maxReviewers: number
}

const NumOfReviewersSlider = ({ maxReviewers }:NumOfReviewersSliderProps) => {
	return (
		<>
			<Text
				color="#1F1F33"
				fontWeight="500"
				fontSize="14px"
				lineHeight="20px"
				mb={2}
			>
								 Select the number of reviewers assigned per applicant

			</Text>
			<RangeSlider
				defaultValue={[2]}
				// step={20}
				min={1}
				max={maxReviewers}
				size="lg"
			>
				{
					[...Array(maxReviewers)].map((_, index) => (
						<RangeSliderMark
							key={index}
							value={index + 1}
							mt="2"
							ml="-1"
							fontWeight={500}
							fontSize="12px"
							lineHeight="12px"
							color="#7D7DA0"
						>
							{index + 1}
						</RangeSliderMark>
					))
				}

				<RangeSliderTrack>
					<RangeSliderFilledTrack background="linear-gradient(90deg, #0065FF 0%, #00FFA3 100%)" />
				</RangeSliderTrack>
				<RangeSliderThumb
					boxSize={4}
					index={0}>
					<Box
						width="50px"
						height="24px">
						<Image
							src="/ui_icons/slider_thumb_blue.svg"
							width="50px"
							height="24px"
						/>
					</Box>
				</RangeSliderThumb>
			</RangeSlider>
		</>
	)
}

export default NumOfReviewersSlider