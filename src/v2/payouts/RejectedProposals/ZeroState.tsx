import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@chakra-ui/react'

const ZeroState = () => {
	const { t } = useTranslation()
	return (
		<Flex
			h='calc(100vh - 352px)'
			justifyContent='center'
			alignItems='center'
			flexDirection='column'
		>
			<Text
				fontSize='20px'
				lineHeight='24px'
				fontWeight='500'
				textAlign='center'
			>
				{t('/your_grants/view_applicants.no_rejected')}
			</Text>
			<Text
				mt={2}
				mb={4}
				fontSize='14px'
				lineHeight='20px'
				fontWeight='400'
				textAlign='center'
				color='#7D7DA0'
				maxW='754px'
			>
				{t('/your_grants/view_applicants.no_rejected_description')}
			</Text>

		</Flex>
	)
}

export default ZeroState