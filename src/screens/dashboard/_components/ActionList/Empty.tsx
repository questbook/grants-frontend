import { Flex } from '@chakra-ui/react'

function Empty() {
	const buildComponent = () => {
		return (
			<Flex
				px={5}
				py={4}>
				Wow! Such empty!
			</Flex>
		)
	}

	return buildComponent()
}

export default Empty