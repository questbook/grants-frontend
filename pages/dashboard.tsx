import { ReactElement } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/layout/navbarLayout'

function Dashboard() {
	return (
		<Flex
			w="100%"
			h="100vh"
			justify="center"
			align="center">
        Coming soon...
		</Flex>
	)
}

Dashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Dashboard