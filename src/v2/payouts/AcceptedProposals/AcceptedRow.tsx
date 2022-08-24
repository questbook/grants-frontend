import { useState } from 'react'
import { Button, Checkbox, Fade, Flex, GridItem, Image, Text, Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CopyIcon from 'src/components/ui/copy_icon'
import getAvatar from 'src/utils/avatarUtils'
import { FundsCircleFilled } from 'src/v2/assets/custom chakra icons/Your Grants/FundsCircleFilled'

const AcceptedRow = ({
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
	const router = useRouter()
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
				<Checkbox
					isChecked={isChecked}
					onChange={onChange} />
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
				>
					<Flex
						bg='#F0F0F7'
						borderRadius='20px'
						h={'40px'}
						w={'40px'}
					>
						<Image
							borderRadius="3xl"
							src={getAvatar(applicantData?.applicant_address)}
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
							cursor='pointer'
							onClick={
								() => router.push({
									pathname: '/your_grants/view_applicants/manage/',
									query: {
										applicationId: applicantData?.applicationId,
									},
								})
							}
						>
							{applicantData?.project_name}
						</Text>
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
					{applicantData.amount_paid}
					{' '}
                /
					{' '}
					{applicantData.funding_asked?.amount}
					{' '}
					{applicantData.funding_asked?.symbol}
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
									 {applicantData?.milestones?.filter((milestone: any) => milestone?.state === 'approved')?.length}
						{' '}
/
						{' '}
						{applicantData?.milestones?.length}
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