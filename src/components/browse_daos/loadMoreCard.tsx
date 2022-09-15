import { Box, Text } from '@chakra-ui/react'

function LoadMoreCard({
	onClick,
}: {
  onClick: () => void
}) {
	return (
		<Box
			w='100%'
			minHeight='172px'
			background='white'
			p='24px'
			position='relative'
			display='flex'
			flexDirection='column'
			justifyContent='center'
		>
			<Box
				bg='#1F1F33'
				color='white'
				py='8px'
				alignItems='center'
				borderRadius='4px'
				cursor='pointer'
				onClick={onClick}
			>
				<Text
					textAlign='center'
					fontSize='14px'
					fontWeight='500'>
					Load More
				</Text>
			</Box>

		</Box>
	)
}

export default LoadMoreCard