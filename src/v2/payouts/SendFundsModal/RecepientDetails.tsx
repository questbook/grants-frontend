import { useEffect, useState } from 'react'
import { Box, Flex, Input, Text } from '@chakra-ui/react'
import { IApplicantData } from 'src/types'
import { ArrowDownCircle } from 'src/v2/assets/custom chakra icons/Arrows/ArrowDownCircle'
import { ExternalLink } from 'src/v2/assets/custom chakra icons/ExternalLink'
import { getSafeDetails } from 'src/v2/constants/safe/realms_solana'
import AlertBanner from 'src/v2/payouts/SendFundsModal/AlertBanner'
import MilestoneSelect from 'src/v2/payouts/SendFundsModal/MilestoneSelect'
import { TransactionType } from 'src/v2/types/safe'

const RecipientDetails = ({
	applicantData,
	initiateTransactionData,
	onChangeRecepientDetails,
}: {
	applicantData: IApplicantData
	initiateTransactionData: TransactionType | undefined
	onChangeRecepientDetails: (applicationId: string, fieldName: string, fieldValue: string | number) => void
}) => {
	const [balance, setBalance] = useState(0)
	useEffect(() => {
		async function getBalance() {
			const balance = await getSafeDetails(initiateTransactionData?.from!)
			setBalance(balance?.amount!)
		}

		getBalance()
	}, [])
	return (
		<>
			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				flexDirection='column'
			>
				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					From
				</Text>

				<Flex
					alignItems='baseline'
					mt={2}
				>
					<Text
						fontSize='14px'
						lineHeight='20px'
						fontWeight='500'
					>
						{initiateTransactionData?.from}
					</Text>

					<ExternalLink
						ml={1}
						h='12px'
						w='12px'
						cursor='pointer'
					/>
				</Flex>

			</Flex>

			<Flex
				bg='white'
				mx='auto'
				mt='-10px'
			>
				<ArrowDownCircle
					color='#785EF0'
					h='28px'
					w='28px'
				/>
			</Flex>


			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				flexDirection='column'
			>
				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					To
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
					{applicantData?.projectName}
					{' '}
					•
					{' '}
					{applicantData?.applicantName}
				</Text>


				<Flex
					alignItems='baseline'
					mt={2}
				>
					<Input
						variant='brandFlushed'
						placeholder='Ethereum or Solana address'
						_placeholder={
							{
								color: 'blue.100',
								fontWeight: '500'
							}
						}
						fontWeight='500'
						fontSize='14px'
						defaultValue={initiateTransactionData?.to}
						errorBorderColor='red'
						height='auto'
						onChange={(e) => onChangeRecepientDetails(applicantData.applicationId, 'to', e.target.value)}
					/>
				</Flex>

				<Box h={6} />

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					Milestone
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
					On milestone completion funds are sent as a reward.
				</Text>

				<Box h={2} />

				<MilestoneSelect
					placeholder='Select from the list'
					value={initiateTransactionData?.selectedMilestone}
					milestoneList={applicantData.milestones}
					onChange={(value) => value && onChangeRecepientDetails(applicantData.applicationId, 'selectedMilestone', value?.id)} />

				<Box h={6} />

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					Amount (in USD)
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
					Balance:
					{' '}
					{balance}
					{' '}
					USD
				</Text>


				<Flex
					alignItems='baseline'
					mt={2}
				>
					<Input
						variant='brandFlushed'
						placeholder='Amount'
						_placeholder={
							{
								color: 'blue.100',
								fontWeight: '500'
							}
						}
						fontWeight='500'
						fontSize='14px'
						defaultValue=''
						errorBorderColor='red'
						height='auto'
						type='number'
						onChange={async(e) => onChangeRecepientDetails(applicantData.applicationId, 'amount', parseFloat(e.target.value))}
					/>
				</Flex>

			</Flex>

			<AlertBanner
				message={
					<Text>
						Next, you will asked be to confirm that you are an owner on the safe. Only safe owners are allowed to send funds.
					</Text>
				}
				type='infoSendFunds'
			/>
		</>
	)
}

export default RecipientDetails
