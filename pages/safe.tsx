import { Flex, Text } from '@chakra-ui/react'
import NavbarLayout from 'src/layout/navbarLayout'

function Safe() {
	return (
		<Flex
			direction='column'
			px={8}
			py={6}>
			<Text
				variant='v2_heading_3'
				fontWeight='700'>
				Safe
			</Text>
		</Flex>
	)
}

Safe.getLayout = function(page: React.ReactElement) {
	return (
		<NavbarLayout renderGetStarted>
			{page}
		</NavbarLayout>
	)
}

export default Safe