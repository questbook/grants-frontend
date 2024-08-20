import { Flex, Text } from '@chakra-ui/react'

function Banner({ message, link, linkText }: { message: string, link?: string, linkText?: string }) {
	return (
		<Flex
			bgColor='gray.200'
			padding={[5, 5]}
			align='center'
			maxHeight='400px'
			flexDirection='row'
			maxWidth='100%'
			w='100%'
			justifyContent={['center', 'center']}
			overflow='auto'
			flexWrap={['wrap', 'wrap']}
			mx='auto'
		>
			<Text
				fontWeight='500'
				color='black'
				fontSize='14px'
				textAlign='center'
				mx={1}
			>
				{message}
			</Text>
			{
				link && linkText && (
					<Text
						fontWeight='500'
						color='blue.500'
						cursor='pointer'
						fontSize='14px'
						textAlign='center'
						onClick={() => window.open(link, '_blank')}
						mx={2}
					>
						{linkText}
					</Text>
				)
			}
		</Flex>
	)
}

export default Banner
