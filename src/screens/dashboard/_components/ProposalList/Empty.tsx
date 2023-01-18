import { Flex, Text } from '@chakra-ui/react'

function Empty() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='100%'
				px={5}
				py={4}
				align='center'>
				<Text
					my='auto'
					mx='auto'
					textAlign='center'>
					Proposals from builders show up here.
				</Text>
			</Flex>
		)
	}

	return buildComponent()
}

export default Empty