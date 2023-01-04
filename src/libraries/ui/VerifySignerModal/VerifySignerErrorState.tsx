import { Button, Flex, IconButton, Text } from '@chakra-ui/react'
import { BackArrow } from 'src/libraries/assets/custom chakra icons/Arrows/BackArrow'
import { Cancel } from 'src/libraries/assets/custom chakra icons/Cancel'
import { ErrorAlert } from 'src/libraries/assets/custom chakra icons/ErrorAlertV2'

const VerifySignerErrorState = ({
	onBack,
	onClose,
}: {
  onBack: () => void
  onClose: () => void
}) => {
	return (
		<Flex
			direction='column'
			align='center'
		>
			<ErrorAlert
				mt={8}
				color='red'
				boxSize={8}
				p={1} />

			<Text
				mt={2}
				fontWeight='bold'
				fontSize='2xl'>
				Error Connecting..
			</Text>

			<Text
				mt={1}
				color='brandText'
			>
				The connection to your wallet failed.
			</Text>

			<Button
				colorScheme='brand'
				mt={6}>
				Try Again
			</Button>

			<Button
				onClick={onBack}
				mt={3}
				mb={8}
				variant='ghost'
				color='#0065FF'
			>
				Select another wallet
			</Button>

			<IconButton
				onClick={onBack}
				pos='absolute'
				top={4.5}
				left={4}
				icon={<BackArrow />}
				aria-label='Back'
				variant='ghost'
			/>

			<IconButton
				onClick={onClose}
				pos='absolute'
				top={4.5}
				right={4}
				icon={<Cancel />}
				aria-label='Close'
				variant='ghost'
			/>

		</Flex>
	)
}

export default VerifySignerErrorState