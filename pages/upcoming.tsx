import { ReactElement } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/layout/navbarLayout'

function Upcoming() {
	return (
		<Flex
			h="100vh"
			w="100%"
			align='center'
			justify="center">
Work in Progress
		</Flex>
	)
}

Upcoming.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Upcoming