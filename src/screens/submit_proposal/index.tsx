import { ReactElement } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'

function SubmitProposal() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='calc(100vh - 64px)'
				align='start'
				justify='center'
				pt={5}>
				<Flex
					direction='column'
					w='90%'
					h='50%'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					overflowY='auto' />
			</Flex>
		)
	}

	return buildComponent()
}

SubmitProposal.getLayout = (page: ReactElement) => {
	return (
		<NavbarLayout renderSidebar={false}>
			{page}
		</NavbarLayout>
	)
}

export default SubmitProposal