import { ReactElement } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'

function Profile() {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				w='100vw'
				h='calc(100vh - 64px)'
				align='center'
				py={6}>
				<Flex
					w='63%'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					h='30%'
					borderRadius='4px'>
					{}
				</Flex>
				<Flex
					mt={6}
					w='63%'
					bg='white'
					boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
					h='70%'
					borderRadius='4px'>
					{}
				</Flex>
			</Flex>
		)
	}

	const grantsProgramDetails = () => {}


	return buildComponent()
}

Profile.getLayout = (page: ReactElement) => {
	return (
		<NavbarLayout renderSidebar={false}>
			{page}
		</NavbarLayout>
	)
}

export default Profile