import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Flex, Image, Input, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { IApplicantData } from 'src/types'
import { chainNames } from 'src/utils/chainNames'
import logger from 'src/utils/logger'
import { ArrowDownCircle } from 'src/v2/assets/custom chakra icons/Arrows/ArrowDownCircle'
import { ExternalLink } from 'src/v2/assets/custom chakra icons/ExternalLink'
import { GnosisSafe } from 'src/v2/constants/safe/gnosis_safe'
import { getSafeDetails, RealmsSolana } from 'src/v2/constants/safe/realms_solana'
import AlertBanner from 'src/v2/payouts/SendFundsModal/AlertBanner'
import MilestoneSelect from 'src/v2/payouts/SendFundsModal/MilestoneSelect'
import TokenSelect from 'src/v2/payouts/SendFundsModal/TokenSelect'
import { TransactionType } from 'src/v2/types/safe'

const RecipientDetails = ({
	safeNetwork,
	applicantData,
	safeTokenList,
	initiateTransactionData,
	onChangeRecepientDetails,
	onChangeRecepientError,
}: {
	safeNetwork: string
	applicantData: IApplicantData
	safeTokenList: any
	initiateTransactionData: TransactionType | undefined
	onChangeRecepientDetails: (applicationId: string, fieldName: string, fieldValue: any) => void
	onChangeRecepientError: (error: string) => void
}) => {
	const router = useRouter()
	const { t } = useTranslation()
	const [applicationID, setApplicationId] = useState<any>('')
	const [invalidRecipientAddress, setInvalidRecipientAddress] = useState<boolean>(false)

	useEffect(() => {
		if(router && router.query) {
			const { applicationId: aId } = router.query
			setApplicationId(aId)
		}
	}, [router])

	useEffect(() => {
		isInvalidAddress(initiateTransactionData?.to).then((res) => {
			setInvalidRecipientAddress(res)
			if(res) {
				onChangeRecepientError('Invalid recipient address')
			}
		})
	}, [])

	const isSafeOnSolana = (safeNetwork == '9001' || safeNetwork == '90001' || safeNetwork == '900001' || safeNetwork == '9000001')

	// const [balance, setBalance] = useState(0)
	// useEffect(() => {
	// 	async function getBalance() {
	// 		// const balance = await getSafeDetails(initiateTransactionData?.from!)
	// 		// setBalance(balance?.amount!)
	// 	}

	// 	if(!isEvmChain) {
	// 		getBalance()
	// 	}
	// }, [])

	const isInvalidAddress = async(address: string | undefined) => {
		if(!address) {
			return true
		}

		let invalidRecipientAddress = false
		if(isSafeOnSolana) {
			const realms = new RealmsSolana('')
			invalidRecipientAddress = (!await realms.isValidRecipientAddress(address))
		} else {
			const gnosis = new GnosisSafe(1, '', '')
			invalidRecipientAddress = (!await gnosis.isValidRecipientAddress(address))
		}

		return invalidRecipientAddress
	}

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

				{
					initiateTransactionData?.from ? (
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
					color={initiateTransactionData?.from ? '' : ' #AFAFCC'}
				>
					To
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color={initiateTransactionData?.from ? '#7D7DA0' : ' #AFAFCC'}
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
						disabled={!initiateTransactionData?.from}
						variant='brandFlushed'
						placeholder={t('/your_grants/view_applicants.address_on_chain').replace('%CHAIN', chainNames.get(safeNetwork)!)}
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
						onChange={
							async(e) => {
								if(await isInvalidAddress(e.target.value)) {
									setInvalidRecipientAddress(true)
									onChangeRecepientError(t('/your_grants/view_applicants.invalid_address_on_chain').replace('%CHAIN', chainNames.get(safeNetwork)!))
								} else {
									setInvalidRecipientAddress(false)
									onChangeRecepientError('')
								}

								onChangeRecepientDetails(applicantData.applicationId, 'to', e.target.value)
							}
						}
						_disabled={{ color:' #AFAFCC', borderColor: ' #AFAFCC' }}
					/>

				</Flex>
				<Flex>
					{
						invalidRecipientAddress ? (
							<Text
								fontSize='12px'
								variant='error'
								textColor='red'>
								{t('/your_grants/view_applicants.invalid_address_on_chain').replace('%CHAIN', chainNames.get(safeNetwork)!)}
							</Text>
						) : null
					}
				</Flex>


				<Box h={6} />

				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					{t('/your_grants/view_applicants.send_funds_milestone')}
				</Text>

				<Text
					fontSize='12px'
					lineHeight='16px'
					fontWeight='400'
					color='#7D7DA0'
					mt='2px'
				>
					{t('/your_grants/view_applicants.send_funds_milestone_description')}
				</Text>

				<Box h={2} />

				<MilestoneSelect
					placeholder='Select from the list'
					value={initiateTransactionData?.selectedMilestone?.id}
					milestoneList={applicantData?.milestones}
					onChange={
						(value) => {
							logger.info({ value }, 'Value')
							return value && onChangeRecepientDetails(applicantData?.applicationId, 'selectedMilestone', value)
						}
					} />

				<Box h={6} />


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
						value={initiateTransactionData?.selectedToken}
						safeTokenList={safeTokenList}
						onChange={
							(value) => {
								console.log('change', value)
								onChangeRecepientDetails(applicantData?.applicationId, 'selectedToken', { name: value?.id, info: value?.info })
							}
						} />

					<Box h={6} />
				</>


				<Text
					fontSize='14px'
					lineHeight='20px'
					fontWeight='500'
				>
					Amount (in USD)
				</Text>

				{/* <Text
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
				</Text> */}


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
						value={initiateTransactionData?.amount}
						errorBorderColor='red'
						height='auto'
						type='number'
						onChange={
							async(e) => {
								onChangeRecepientDetails(applicantData.applicationId || applicationID, 'amount', parseFloat(e.target.value?.length > 0 ? e.target.value : '0'))
							}
						}
					/>
				</Flex>

			</Flex>

			<AlertBanner
				message={
					<Text>
						{t('/your_grants/view_applicants.send_funds_verification_message')}
					</Text>
				}
				type='infoSendFunds'
			/>
		</>
	)
}

export default RecipientDetails
