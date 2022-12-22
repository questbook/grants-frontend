import { Button, Image, Text } from '@chakra-ui/react'


function EmbedStatsButton() {
	return (
		<Button
			variant='ghost'
			leftIcon={
				<Image
					src='/v2/icons/embed code.svg'
					boxSize='16px' />
			}>
			<Text
				variant='v2_body'
				fontWeight='500'>
				Embed stats
			</Text>
		</Button>
	)
}

export default EmbedStatsButton