import { Box, Text } from '@chakra-ui/react'

function Banner() {
	const buildComponent = () => {
		return (
			<Box
				bgColor='gray.200'
				padding={[5, 5]}
				justifyContent='flex-start'
				maxWidth='100%'
				overscroll='auto'
				maxHeight='400px'
			>


				<Text
					fontWeight='500'
					color='black.100'
					fontSize='14px'
					textAlign='center'
					mx={2}
				>
					The domain is closed until further notice as the funds have been fully allocated.
				</Text>

			</Box>


		)
	}

	return buildComponent()
}

export default Banner