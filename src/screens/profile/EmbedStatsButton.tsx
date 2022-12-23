import { Button, ButtonProps, Image, Text } from '@chakra-ui/react'


function EmbedStatsButton({ ...props }: ButtonProps) {
	return (
		<Button
			variant='ghost'
			leftIcon={
				<Image
					src='/v2/icons/embed code.svg'
					boxSize='16px' />
			}
			{...props}
		>
			<Text
				variant='v2_body'
				fontWeight='500'>
				Embed stats
			</Text>
		</Button>
	)
}

export default EmbedStatsButton