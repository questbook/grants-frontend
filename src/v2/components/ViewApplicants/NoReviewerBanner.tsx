import { Flex, Text } from '@chakra-ui/react'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { ErrorAlert } from 'src/v2/assets/custom chakra icons/ErrorAlertV2'

interface Props {
    onSetup: () => void
    onClose: () => void
}

function NoReviewerBanner({ onSetup, onClose }: Props) {
	return (
		<Flex
			px='18px'
			py={4}
			bg='orange.1'
			borderRadius='base'
			mb={5}
		>
			<ErrorAlert
				color='orange.2'
				boxSize={5}
				mt='2px'
			/>

			<Flex
				flexDirection='column'
				ml='18px'
				flex={1}
			>
				<Text
					fontSize='16px'
					lineHeight='24px'
					fontWeight='500'
				>
					Setup evaluation criteria
				</Text>

				<Text
					mt='8px'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='400'
				>
					You have no reviewers in your domain. To auto - assign reviewers and create an evaluation rubric, invite members to your domain.
				</Text>

				<Text
					mt='14px'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
					color='orange.2'
					cursor='pointer'
					onClick={onSetup}
				>
					Invite members
				</Text>
			</Flex>

			<CancelCircleFilled
				mb='auto'
				color='#7D7DA0'
				h={6}
				w={6}
				onClick={onClose}
				cursor='pointer'
			/>
		</Flex>
	)
}

export default NoReviewerBanner