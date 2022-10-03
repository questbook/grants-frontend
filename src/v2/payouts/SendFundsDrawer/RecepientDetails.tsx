import { Box, Button, Flex, Image, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { IApplicantData } from 'src/types'
import { ArrowDownCircle } from 'src/v2/assets/custom chakra icons/Arrows/ArrowDownCircle'
import { ExternalLink } from 'src/v2/assets/custom chakra icons/ExternalLink'
import AlertBanner from 'src/v2/payouts/SendFundsDrawer/AlertBanner'
import MilestoneSelect from 'src/v2/payouts/SendFundsDrawer/MilestoneSelect'
import TokenSelect from 'src/v2/payouts/SendFundsDrawer/TokenSelect'
import { TransactionType } from 'src/v2/types/safe'

const RecipientDetails = ({
	applicantData,
	safeTokenList,
	initiateTransactionData,
	onChangeRecepientDetails,
}: {
	applicantData: IApplicantData[]
	safeTokenList: any
	initiateTransactionData: TransactionType[] | undefined
	onChangeRecepientDetails: (applicationId: string, fieldName: string, fieldValue: any) => void
}) => {
	const router = useRouter()
	return (
		<>
			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow='inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'
				flexDirection='column'
			>

				{
					initiateTransactionData?.[0]?.from ? (
						<>
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='500'
							>
								Tokens sent to recipient
							</Text>

							<Box h={2} />

							<TokenSelect
								placeholder='Select a token from the list'
								value={initiateTransactionData![0]?.selectedToken}
								safeTokenList={safeTokenList}
								onChange={
									(value) => {
										onChangeRecepientDetails('', 'selectedToken', { name: value?.id, info: value?.info })
									}
								} />

							<Box h={6} />
						</>
					) : null
				}


				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					From
				</Text>

				{
					initiateTransactionData?.[0]?.from ? (
						<Flex
							alignItems='baseline'
							mt={2}
						>
							<Text
								fontSize='14px'
								lineHeight='20px'
								fontWeight='500'
							>
								{initiateTransactionData?.[0]?.from}
							</Text>

							<ExternalLink
								ml={1}
								h='12px'
								w='12px'
								cursor='pointer'
							/>
						</Flex>
					) : (
						<Flex
							alignItems='baseline'
							mt={2}
							direction='column'
					 	>
							<Flex
								mb='8px'
								alignItems='flex-start'>
								<Image
									src='/ui_icons/info_orange.svg'
									mr='1em'
									pt='4px' />
								<Text
									fontSize='14px'
									color='#FF7545'>
									No multisig wallet found. Please add a multisig wallet to send funds
								</Text>
							</Flex>
							<Button
								px={3}
								py='6px'
								minW={0}
								minH={0}
								h='auto'
								borderRadius='2px'
								onClick={
									() => {
										router.push({ pathname: '/safe', query: {
											'show_toast': true,
										} })
									}
								}
								fontSize='14px'
								fontWeight='500'
							>
								<Image
									src='/ui_icons/add_black.svg'
									mr='0.5em' />

								Add a multisig wallet
							</Button>
						</Flex>
					)
				}

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
					mb={6}
				>
					To
				</Text>


				{
					applicantData.map((data, i) => (
						<>
							<Box
								fontSize='14px'
								lineHeight='20px'
								fontWeight='400'
								h='20px'
								w='20px'
								bg='#F0F0F7'
								display='flex'
								justifyContent='center'
								alignItems='center'
								mr={4}
								mb={2}
							>
								{i + 1}
							</Box>
							<Text
								fontSize='12px'
								lineHeight='16px'
								fontWeight='400'
								color='#7D7DA0'
								mt='2px'
							>
								{data?.projectName}
								{' '}
								•
								{' '}
								{data?.applicantName}
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
									defaultValue={initiateTransactionData ? initiateTransactionData[i]?.to : ''}
									errorBorderColor='red'
									height='auto'
									onChange={(e) => onChangeRecepientDetails(data.applicationId, 'to', e.target.value)}
								/>
							</Flex>

							<Box h={6} />

							<Flex alignItems='center' >
								<Flex
									flex={1}
									flexDirection='column'>

									<MilestoneSelect
										placeholder='Select from the list'
										value={initiateTransactionData ? initiateTransactionData[i].selectedMilestone : ''}
										milestoneList={data.milestones}
										onChange={(value) => value && onChangeRecepientDetails(data.applicationId, 'selectedMilestone', value?.id)} />
								</Flex>

								<Box w={6} />

								<Flex
									flex={1}
									flexDirection='column'>

									{/* <Box h={2} /> */}
									<InputGroup size='sm'>

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
											defaultValue={initiateTransactionData ? initiateTransactionData[i]?.amount : ''}
											errorBorderColor='red'
											height='auto'
											type='number'
											onChange={async(e) => onChangeRecepientDetails(data.applicationId, 'amount', parseFloat(e.target.value?.length > 0 ? e.target.value : '0'))}
										/>
										<InputRightAddon children='USD' />
									</InputGroup>

								</Flex>

							</Flex>

							<Box h={6} />
						</>
					))
				}

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
