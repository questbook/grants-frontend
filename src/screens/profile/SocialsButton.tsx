import { Flex, Image } from '@chakra-ui/react'


function SocialsButton() {
	return (
		<Flex
			gap={2}
		>
			<Image
				boxSize={10}
				src='/v2/icons/twitter.svg'
			/>
			<Image
				boxSize={10}
				src='/v2/icons/discord.svg'
			/>
			<Image
				boxSize={10}
				src='/v2/icons/telegram.svg'
			/>
		</Flex>
	)
}

export default SocialsButton