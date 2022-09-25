import { useTranslation } from 'react-i18next'
import { Flex, Link, Text } from '@chakra-ui/react'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { ErrorAlert } from 'src/v2/assets/custom chakra icons/ErrorAlertV2'

interface Props {
    onSetup: () => void
    onClose: () => void
}

function RubricNotSetBanner({ onSetup, onClose }: Props) {
	const { t } = useTranslation()
	return (
		<Flex
			px='18px'
			py={4}
			bg='#C8CBFC'
			borderRadius='base'
			mb={5}
		>
			<ErrorAlert
				color='#785EF0'
				boxSize={5}
				mt='2px'
			/>

			<Flex
				flexDirection='column'
				ml='18px'
				flex={1}
			>
				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='400'
				>
					{t('/your_grants/view_applicants.create_review_no_rubrics')}
					{' '}
				</Text>

				<Text
					mt='14px'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
					color='#785EF0'
					cursor='pointer'
					onClick={onSetup}
				>
					{t('/your_grants/view_applicants.create_rubric')}
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

export default RubricNotSetBanner