import { Box, Button, Flex, Input, Link, Text } from '@chakra-ui/react'

const RubricsForm = () => {
	return (
		<>
			<Text
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
			>
				Scoring quality
			</Text>

			<Text
				fontSize='12px'
				lineHeight='16px'
				fontWeight='400'
				color='#7D7DA0'
				mt='2px'
			>
							Total score is the sum of quality scores.
				{' '}
				<Link
					textDecoration={'none'}
					fontWeight='500'
					color='#1F1F33'
				>
								Learn more
				</Link>
			</Text>

			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
				flexDirection='column'
			>
				<Box
					fontSize='14px'
					lineHeight='20px'
					fontWeight='400'
					h='20px'
					w='20px'
					bg='#F0F0F7'
					display='flex'
					justifyContent={'center'}
					alignItems={'center'}
					mr={4}
					mb={2}
				>
          2
				</Box>
				<Flex
					mt={2}
					flexDirection='column'

				>
					<Input
						variant={'brandFlushed'}
						placeholder={'Criterion'}
						_placeholder={
							{
								color: 'blue.100',
								fontWeight: '500'
							}
						}
						fontWeight={'500'}
						fontSize='14px'
						value={undefined}
						errorBorderColor={'red'}
						height={'auto'}
					/>

					<Text
						fontSize='12px'
						lineHeight='16px'
						fontWeight='400'
						color='#7D7DA0'
						textAlign='right'
						mt={1}
					>
                  0/30
					</Text>
				</Flex>


				<Flex
					mt={4}
					flexDirection='column'

				>
					<Input
						variant={'brandFlushed'}
						placeholder={'Description'}
						_placeholder={
							{
								color: 'blue.100',
								fontWeight: '500'
							}
						}
						fontWeight={'500'}
						fontSize='14px'
						value={undefined}
						errorBorderColor={'red'}
						height={'auto'}
					/>

					<Text
						fontSize='12px'
						lineHeight='16px'
						fontWeight='400'
						color='#7D7DA0'
						textAlign='right'
						mt={1}
					>
                  0/30
					</Text>
				</Flex>


				<Box mt={'30px'}>
					<Button
						variant={'ghost'}
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
						color='#1F1F33'
						minW={0}
						minH={0}
						h='auto'
						p={'6px'}
					>
            Add another criterion
					</Button>
				</Box>

			</Flex>

		</>
	)
}

export default RubricsForm