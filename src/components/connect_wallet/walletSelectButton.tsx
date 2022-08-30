import React from 'react'
import {
	Box, Button, Image, Text, useTheme,
} from '@chakra-ui/react'

function WalletSelectButton({
	name,
	icon,
	onClick,
}: {
  name: string
  icon: string
  onClick: () => void
}) {
	const theme = useTheme()
	return (
		<Box
			background={theme.colors.backgrounds.card}
			border='1px solid #E8E9E9'
			borderRadius={12}
			px='18px'
			py={4}
			alignItems='center'
			display='flex'
			w='full'
		>
			<Image
				h='40px'
				w='40px'
				src={icon}
				alt='Connect using' />
			<Text
				fontWeight='700'
				ml={5}
				mr='auto'>
				{name}
			</Text>

			<Button
				variant='primary'
				onClick={onClick}>
				Connect
			</Button>
		</Box>
	)
}

export default WalletSelectButton
