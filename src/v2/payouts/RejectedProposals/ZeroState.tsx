import { Flex, Text } from '@chakra-ui/react'

const ZeroState = () => {
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
				Nothing to review
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
				There are no rejected applications, they will come here as soon as they are submitted.
			</Text>

		</Flex>
	)
}

export default ZeroState