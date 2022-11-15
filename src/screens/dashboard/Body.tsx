// This renders the single proposal along with the Discussion section or the aggregated proposals, and shows up as the 2nd column

import { Flex } from '@chakra-ui/react'

function Body() {
	const buildComponent = () => (
		<Flex
			mx='auto'
			bg='white'
			w='48%' />
	)

	return buildComponent()
}

export default Body