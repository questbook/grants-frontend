import {
	Box,
	Flex,
	Image,
	Text,
} from '@chakra-ui/react'

type StepDescriptionProps = {
    setupStep: boolean
}

const StepDescription = ({ setupStep }: StepDescriptionProps) => {
	return (
		<Flex flexDirection="column">
			<Flex
				alignItems="flex-start"
				padding="16px"
				gap="16px"
				pl={0}>
				{
					!setupStep && (
						<Image
							mt={4}
							src="/ui_icons/scoring_rubric_logo.svg" />
					)
				}
				{
					setupStep && (
						<Image
							mt={4}
							src="/ui_icons/assign_reviewers_red.svg" />
					)
				}
				<Box>
					<Text
						fontWeight="500"
						fontSize="16px"
						lineHeight="24px"
						color="#1F1F33"
					>
						{setupStep ? 'Assign Reviewers' : 'Scoring Rubric'}
					</Text>
					<Text
						fontWeight="500"
						fontSize="14px"
						lineHeight="20px"
						color="#7D7DA0"
						letterSpacing="0.5px"
					>
						<Text
							as="span"
							color="#7D7DA0"
							fontWeight="400"
							letterSpacing="0.5px"
							lineHeight={2}
						>
							{' '}
							{
								setupStep
									? 'Reviewers are auto assigned equally.'
									: 'Total score is the sum of quality scores.'
							}
							{' '}
						</Text>
						{
							setupStep
								? 'Learn about auto assign'
								: 'Learn about scores'
						}
					</Text>
				</Box>
			</Flex>
			{
				!setupStep && (
					<Flex
						flexDirection="column"
						alignItems="flex-start"
						mt={5}
						maxW="100%">
						<Text
							color="#1F1F33"
							fontWeight="500"
							fontSize="14px"
							lineHeight="20px"
						>
                 Scoring Qualities
						</Text>
						<Text
							color="#7D7DA0"
							fontWeight="400"
							fontSize="12px"
							lineHeight="20px"
						>
                  Define the quality, and add a description
						</Text>
					</Flex>
				)
			}
		</Flex>
	)
}

export default StepDescription