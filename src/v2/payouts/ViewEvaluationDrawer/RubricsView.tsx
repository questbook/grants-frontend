import { Box, Flex, Text } from '@chakra-ui/react'

const RubricsView = ({ rubrics }: {rubrics: any[]}) => {
	return (
		<>
			<Flex
				p={4}
				borderRadius='2px'
				boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
				flexDirection='column'
			>
				{
					rubrics?.map((rubric, i) => {
						return (
							<>
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
									{i + 1}
								</Box>

								<Text
									fontSize='14px'
									lineHeight='20px'
									fontWeight='500'
								>
									{rubric.title}
								</Text>

								<Text
									fontSize='12px'
									lineHeight='16px'
									fontWeight='400'
									color='#7D7DA0'
									mt='2px'
								>
									{rubric.details}
								</Text>

								<Box mb={6} />
							</>
						)
					})
				}

			</Flex>

		</>
	)
}

export default RubricsView