import { useState } from 'react'
import { Button, Checkbox, Fade, Flex, GridItem, Image, Text } from '@chakra-ui/react'
import { FundsCircleFilled } from 'src/v2/assets/custom chakra icons/Your Grants/FundsCircleFilled'

const AcceptedRow = ({ onSendFundsClicked }: {onSendFundsClicked: () => void}) => {
	const [isHovering, setIsHovering] = useState(false)
	return (
		<>
			<GridItem
				display='flex'
				alignItems='center'
				justifyContent='center'
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				bg={isHovering ? '#FBFBFD' : 'white'}
			>
				<Checkbox />
			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
			>
				<Flex
					py={2}
					px={4}
				>
					<Flex
						bg='#F0F0F7'
						borderRadius='20px'
						h={'40px'}
						w={'40px'}
					>
						<Image
											 />
					</Flex>

					<Flex
						direction='column'
						ml='12px'
					>
						<Text
							fontSize='14px'
							lineHeight='20px'
							fontWeight='500'
							noOfLines={1}
							textOverflow={'ellipsis'}
						>
											Storage provider tooling ideas
						</Text>
						<Text
							fontSize='12px'
							lineHeight='16px'
							fontWeight='400'
							mt="2px"
							color='#7D7DA0'
						>
												Ryan Adams • ryan@gmail.com
						</Text>
					</Flex>
				</Flex>
			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
			>
				<Text
					px={4}
					py={'18px'}
					color='#555570'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
										250 / 2000
				</Text>
			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
			>
				<Flex alignItems={'center'}>
					<Text
						px={4}
						py={'18px'}
						color='#555570'
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
						mr='auto'
					>
										1 / 4
					</Text>


					<Fade in={isHovering}>
						<Button
							px={3}
							py={'6px'}
							minW={0}
							minH={0}
							h="auto"
							borderRadius={'2px'}
							mr={6}
							onClick={() => onSendFundsClicked()}
						>
							<FundsCircleFilled />
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='500'
								ml={'6px'}
							>
								Send Funds
							</Text>
						</Button>
					</Fade>

				</Flex>
			</GridItem>
		</>
	)
}

export default AcceptedRow