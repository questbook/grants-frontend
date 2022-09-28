import { Flex, Image, Text } from '@chakra-ui/react'

interface Props {
    title: string
    sideText: string
    description: string
}

function SideItem({ title, sideText, description }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				bg='white'
				px={5}
				py={3}>
				<Flex align='center'>
					<Text
						color='black.3'
						variant='v2_metadata'
						fontWeight='500'>
						{title}
					</Text>
					<Image
						mx={2}
						src='/ui_icons/ellipse.svg'
						boxSize='4px' />
					<Text
						color='black.3'
						variant='v2_metadata'
						fontWeight='500'>
						{sideText}
					</Text>
				</Flex>
				<Text variant='v2_body'>
					{description}
				</Text>
			</Flex>
		)
	}

	return buildComponent()
}

export default SideItem