import { useEffect, useState } from 'react'
import { Button, Checkbox, Fade, Flex, GridItem, Image, Text, Tooltip } from '@chakra-ui/react'
import CopyIcon from 'src/components/ui/copy_icon'
import { AcceptApplication } from 'src/v2/assets/custom chakra icons/AcceptApplication'
import { RejectApplication } from 'src/v2/assets/custom chakra icons/RejectApplication'
import { ResubmitApplication } from 'src/v2/assets/custom chakra icons/ResubmitApplication'

const InReviewRow = ({
	onSendFundsClicked,
	applicantData,
	isChecked,
	onChange,
}: {
	onSendFundsClicked: () => void;
	applicantData: any;
	isChecked: boolean;
	onChange: (e: any) => void;
}) => {
	const [isHovering, setIsHovering] = useState(false)
	useEffect(() => console.log(applicantData), [applicantData])
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
				<Checkbox
					isChecked={isChecked}
					onChange={onChange}
				/>
			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
				display='flex'
				alignItems='center'
			>
				<Flex
					py={2}
					px={4}
					display='flex'
					alignItems='center'
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
						alignItems={'center'}
					>
						<Text
							fontSize='14px'
							lineHeight='20px'
							fontWeight='500'
							noOfLines={1}
							textOverflow={'ellipsis'}
						>
							{applicantData?.project_name}
						</Text>
						{/* <Text
							fontSize='12px'
							lineHeight='16px'
							fontWeight='400'
							mt="2px"
							color='#7D7DA0'
						>
							{applicantData?.} • ryan@gmail.com
						</Text> */}
						<Text
							fontSize='12px'
							lineHeight='16px'
							fontWeight='400'
							mt="2px"
							color='#7D7DA0'
							display={'flex'}
							alignItems='center'
						>
							<Tooltip label={applicantData?.applicant_address}>


								{`${applicantData?.applicant_address?.substring(0, 6)}...`}

							</Tooltip>
							<Flex
								display="inline-block"
								ml={2}
							>
								<CopyIcon text={applicantData?.applicant_address!} />
							</Flex>
						</Text>
					</Flex>
				</Flex>
			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
				display='flex'
				alignItems='center'
			>
				<Text
					px={4}
					py={'18px'}
					color='#555570'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					5 / 5
				</Text>
			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
				display='flex'
				alignItems='center'
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
						15 • 15 • 15 • 15
					</Text>


					<Fade in={isHovering}>
						<Button
							px={3}
							py={'6px'}
							minW={0}
							minH={0}
							h="auto"
							borderRadius={'2px'}
							mr={4}
							ml='auto'
							onClick={() => onSendFundsClicked()}
						>
							<AcceptApplication />
						</Button>

						<Button
							px={3}
							py={'6px'}
							minW={0}
							minH={0}
							h="auto"
							borderRadius={'2px'}
							mr={4}
							onClick={() => onSendFundsClicked()}
						>
							<ResubmitApplication />
						</Button>

						<Button
							px={3}
							py={'6px'}
							minW={0}
							minH={0}
							h="auto"
							borderRadius={'2px'}
							mr={'auto'}
							onClick={() => onSendFundsClicked()}
						>
							<RejectApplication />
						</Button>
					</Fade>

				</Flex>
			</GridItem>
		</>
	)
}

export default InReviewRow