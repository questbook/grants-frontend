import { Box, Flex, Text } from '@chakra-ui/react'
import { CheckCircle } from 'src/v2/assets/custom chakra icons/CheckCircle'

const ModalStep = ({
	loadingFinished,
	loadingStarted,
	step,
	index,
}: {
	loadingFinished: boolean
	loadingStarted: boolean
	step: string
	index: number
}) => {
	return (
		<>
			{
				index !== 0 && (
					<Box
						h={3}
						w={'2px'}
						ml={'38px'}
						bg={'#E0E0EC'} />
				)
			}
			<Flex
				mt={0}
				mx={8}
				alignItems={'center'}>

				{
					loadingFinished ? (
						<CheckCircle
							color={'#3AE0AE'}
							boxSize={4} />
					) : (
						<>
							{
								loadingStarted ? (
									<Box
										minW={4}
										minH={4}
										p={'2px'}
										bg={'linear-gradient(180deg, #89A6FB 5.88%, #B6F72B 94.12%)'}
										style={
											{
												aspectRatio: '1',
												WebkitMask: 'conic-gradient(#0000,#000), linear-gradient(#000 0 0) content-box',
												WebkitMaskComposite: 'source-out'
											}
										}
										borderRadius={'50%'}
										boxSizing={'border-box'}
										animation={'spinner 0.45s linear infinite'}
									 />
								) : (
									<Box
										minW={4}
										minH={4}
										borderColor={'#E0E0EC'}
										borderWidth={'2px'}

										borderRadius={'50%'}
										boxSizing={'border-box'}
						 />
								)
							}

						</>
					)
				}

				<Text
					fontWeight={loadingStarted && !loadingFinished ? '500' : '400'}
					ml={3}
					color={!loadingStarted && !loadingFinished ? '#AFAFCC' : 'black'}
				>
					{step}
				</Text>
			</Flex>
		</>
	)
}

export default ModalStep