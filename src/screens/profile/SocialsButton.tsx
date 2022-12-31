import { Flex, IconButton, Image } from '@chakra-ui/react'


function SocialsButton({ name, value }: { name: string, value: string }) {
	return (
		<Flex
			gap={2}
		>
			<IconButton
				aria-label={name}
				bg='gray.3'
				// boxSize={10}
				h='32px'
				w='44px'
				borderRadius='2px'
				onClick={() => window.open(value, '_blank')}
				icon={
					<Image
						// boxSize={10}
						src={`/v2/icons/${name}.svg`}
					/>
				}
			/>
		</Flex>
	)
}

export default SocialsButton