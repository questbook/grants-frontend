import { ReactElement } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/layout/navbarLayout'

function Integrations() {
	return (
		<Flex
			w='100%'
			h='100vh'
			justify='center'
			align='center'>
			Coming soon...
		</Flex>
	)
}

Integrations.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default Integrations