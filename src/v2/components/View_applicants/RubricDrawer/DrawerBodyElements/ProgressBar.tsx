import {
	Flex,
	Image,
	Progress,
	Text,
} from '@chakra-ui/react'

type ProgressBarProps = {
    setupStep: boolean
}

const ProgressBar = ({ setupStep }:ProgressBarProps) => {
	return (
		<Flex
			// maxW='100%'
			w="90%"
		>
			<Flex
				flexDirection="column"
				// ml={24}
				w="50%"
				gap={2}
			>
				<Progress
					colorScheme={setupStep ? 'blackAlpha' : 'messenger'}
					value={100}
					borderRadius="100px"
					w="100%"
					h="4px"
				/>
				<Flex gap={1}>
					<Image
						src={
							setupStep
								? '/ui_icons/setup_evaluation_black_bullet.svg'
								: '/ui_icons/setup_evaluation_blue_bullet.svg'
						}
						h="20px"
						w="20px"
					/>
					<Text
						fontWeight="500"
						fontSize="12px"
						lineHeight="16px"
						color={setupStep ? '#1F1F33' : '#4C9AFF'}
					>
                      Scoring Rubric
					</Text>
				</Flex>
			</Flex>

			<Flex
				flexDirection="column"
				ml={4}
				gap={2}
				w="50%">
				<Progress
					colorScheme={setupStep ? 'messenger' : '#D2D2E3'}
					value={100}
					borderRadius="100px"
					w="100%"
					h="4px"
				/>
				<Flex gap={1}>
					<Image
						src={
							setupStep
								? '/ui_icons/setup_evaluation_blue_bullet.svg'
								: '/ui_icons/setup_evaluation_transparent_bullet.svg'
						}
						h="20px"
						w="20px"
					/>
					<Text
						fontWeight="500"
						fontSize="12px"
						lineHeight="16px"
						color={setupStep ? '#4C9AFF' : '#AFAFCC'}
					>
                      Reviewers
					</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default ProgressBar