import React, { useState } from 'react'
import { Badge, Button, Checkbox, Fade, Flex, GridItem, Image, Text, Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import CopyIcon from 'src/components/ui/copy_icon'
import { IApplicantData } from 'src/types'
import getAvatar from 'src/utils/avatarUtils'
import { getRewardAmountMilestones } from 'src/utils/formattingUtils'
import { FundsCircleFilled } from 'src/v2/assets/custom chakra icons/Your Grants/FundsCircleFilled'

const AcceptedRow = ({
	isEvmChain,
	onSendFundsClicked,
	applicationStatus,
	applicationAmount,
	applicantData,
	isChecked,
	onChange,
	rewardAssetDecimals,
}: {
	onSendFundsClicked: () => void
	applicationStatus: number
	applicantData: IApplicantData
	isChecked: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
						h='40px'
						w='40px'
					>
						<Image
							borderRadius='3xl'
							src={getAvatar(applicantData?.applicantAddress)}
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
							textOverflow='ellipsis'
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
							{applicantData?.projectName}
						</Text>
						{
							applicantData?.applicantAddress && (
								<Text
									fontSize='12px'
									lineHeight='16px'
									fontWeight='400'
									mt='2px'
									color='#7D7DA0'
									display='flex'
									alignItems='center'
								>
									<Tooltip label={applicantData?.applicantAddress}>
										{`${applicantData?.applicantAddress?.substring(0, 6)}...`}
									</Tooltip>
									<Flex
										display='inline-block'
										ml={2}
									>
										<CopyIcon text={applicantData?.applicantAddress!} />
									</Flex>
								</Text>
							)
						}
						{
							!applicantData?.applicantAddress && (
								<Text
									fontSize='12px'
									lineHeight='16px'
									fontWeight='400'
									mt='2px'
									color='#7D7DA0'
									display='flex'
									alignItems='center'
								>
									No applicant address found
								</Text>
							)
						}
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
					py='18px'
					color='#555570'
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					{applicationAmount || 0}
					{' '}
					/
					{' '}
					{applicantData ? getRewardAmountMilestones(rewardAssetDecimals, applicantData) || applicantData.funding_asked?.amount : 0}
					{' '}
					{!isEvmChain ? 'USD' : applicantData.funding_asked?.symbol}

				</Text>

				<Badge
					variant='subtle'
					color='#0F7ABC'>
					{applicationStatus === 0 ? 'Transaction in Queue' : ''}
				</Badge>

			</GridItem>
			<GridItem
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}

				bg={isHovering ? '#FBFBFD' : 'white'}
				display='flex'
				alignItems='center'
			>
				<Flex alignItems='center'>
					<Text
						px={4}
						py='18px'
						color='#555570'
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
						mr='auto'
					>
						{applicantData?.milestones?.filter((milestone) => milestone?.state === 'approved')?.length}
						{' '}
						/
						{' '}
						{applicantData?.milestones?.length}
					</Text>


					<Fade in={isHovering}>
						<Button
							px={3}
							py='6px'
							minW={0}
							minH={0}
							h='auto'
							borderRadius='2px'
							mr={6}
							onClick={() => onSendFundsClicked()}
						>
							<FundsCircleFilled />
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='500'
								ml='6px'
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
