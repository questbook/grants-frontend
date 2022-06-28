import { ReactElement } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { ErrorAlert } from '../../../../assets/custom chakra icons/ErrorAlertV2'

const AlertInfo = {
	info: {
		bg: 'bannerGrey',
		iconColor: '#89A6FB'
	},
	warning: {
		bg: '#FFF9D7',
		iconColor: '#F3D950'
	}
}

const AlertBanner = ({
	message,
	type
}: {
	message: ReactElement,
	type: keyof typeof AlertInfo,
}) => (
	<Flex
		mt={4}
		px={3}
		py={2}
		bg={AlertInfo[type].bg}
		borderRadius={'base'}
		w={'fit-content'}
	>
		<ErrorAlert
			color={AlertInfo[type].iconColor}
			boxSize={5} />

		<Text
			ml={1}
			fontSize={'sm'}>
			{message}
		</Text>
	</Flex>
)

export default AlertBanner