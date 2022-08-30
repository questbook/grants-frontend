import { ReactElement } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { ErrorAlert } from 'src/v2/assets/custom chakra icons/ErrorAlertV2'

const AlertInfo = {
	info: {
		bg: 'bannerGrey',
		iconColor: '#89A6FB'
	},
	warning: {
		bg: '#FFF9D7',
		iconColor: '#F3D950'
	},
	infoSendFunds: {
		bg: '#C8CBFC',
		iconColor: '#785EF0'
	}
}

const AlertBanner = ({
	message,
	type
}: {
	message: ReactElement
	type: keyof typeof AlertInfo
}) => (
	<Flex
		mt={4}
		px='18px'
		py={4}
		bg={AlertInfo[type].bg}
		borderLeft={`4px solid ${AlertInfo[type].iconColor}`}
		borderRadius='base'
		w='fit-content'
	>
		<ErrorAlert
			color={AlertInfo[type].iconColor}
			boxSize={5} />

		<Text
			ml='18px'
			fontSize='sm'
			lineHeight='20px'
		>
			{message}
		</Text>
	</Flex>
)

export default AlertBanner