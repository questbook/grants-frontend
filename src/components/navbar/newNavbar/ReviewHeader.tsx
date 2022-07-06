import { Box, Text } from '@chakra-ui/react'

function ReviewHeader() {
	return (
		<Box
			width={'100%'}
			position={'absolute'}
			bottom={0}
		>
			<Box>
				<Box
					bg={'#DCE7D2'}
					w='100%'
					p={'2px'}
					borderRadius={'100px'}
					marginBottom='10px' />
				<Box
					display={'flex'}
					flexDirection='row'>
					<img
						src='/new_icons/review_almost_done.svg'
						style={{ marginRight: '10px' }}
						width='15.5px' />
					<Text color={ '#DCE7D2'}>
						All done!
					</Text>
				</Box>
			</Box>
			<Text
				fontSize='5xl'
				color={'#B6F72B'}
				fontWeight={'700'}>
                        Review your grant
			</Text>
		</Box>
	)
}

export default ReviewHeader