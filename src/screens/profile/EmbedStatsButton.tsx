import { Button, ButtonProps, Text } from '@chakra-ui/react'
import { Embed } from 'src/generated/icons'


function EmbedStatsButton({ ...props }: ButtonProps) {
	return (
		<Button
			variant='ghost'
			leftIcon={<Embed boxSize='16px' />}
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