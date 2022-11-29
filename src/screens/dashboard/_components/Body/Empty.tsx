import { useContext } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'
import { ApiClientsContext } from 'src/pages/_app'

function Empty() {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				h='100%'
				bg='white'
				direction='column'
				align='center'
				justify='center'>
				<Text
					variant='heading3'
					fontWeight='500'>
					Your invitation for proposals is live!
				</Text>

				<Text mt={1}>
					Builders can start submitting proposals from today.
				</Text>

				<Image
					mt={8}
					src='/v2/images/empty-body.svg'
					w='329px'
					h='152px' />

				<Text
					mt={6}
					fontWeight='500'>
					Share with builders
				</Text>
				<Text
					mt={1}
					variant='body'>
					Attract builders to
					{' '}
					{workspace?.title}
					{' '}
					with a link, or use embed.
				</Text>
			</Flex>
		)
	}

	const { workspace } = useContext(ApiClientsContext)!

	return buildComponent()
}

export default Empty