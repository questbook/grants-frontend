import React from 'react'
import {
	Box,
	Button,
	Container,
	Flex,
	Modal as ModalComponent,
	ModalContent,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import { IApplicantData } from 'src/types'
import { CancelCircleFilled } from 'src/v2/assets/custom chakra icons/CancelCircleFilled'
import { FishEye } from 'src/v2/assets/custom chakra icons/FishEye'
import { FundsCircle } from 'src/v2/assets/custom chakra icons/Your Grants/FundsCircle'
import RecipientDetails from 'src/v2/payouts/SendFundsModal/RecepientDetails'
import SafeOwner from 'src/v2/payouts/SendFundsModal/SafeOwner'
import { PhantomProvider } from 'src/v2/types/phantom'
import { TransactionType } from 'src/v2/types/safe'
import { useTranslation } from 'react-i18next'

interface Props {
	isOpen: boolean
	onClose: () => void
	safeAddress: string
	safeNetwork: string
	proposals: IApplicantData[]
	safeTokenList: any
	onChangeRecepientDetails: (applicationId: string, fieldName: string, fieldValue: string|number) => void
	phantomWallet: PhantomProvider | undefined
	isEvmChain: boolean
	signerVerified: boolean
	initiateTransactionData: TransactionType[]
	onModalStepChange: (value: string) => Promise<void>
	step: string
}

// export type ModalState = 'RECEIPT_DETAILS' | 'CONNECT_WALLET' | 'VERIFIED_OWNER' | 'TRANSATION_INITIATED'

// export const MODAL_STATE_INDEXES: {[_ in ModalState]: number} = {
// 	RECEIPT_DETAILS: 0,
// 	CONNECT_WALLET: 1,
// 	VERIFIED_OWNER: 2,
// 	TRANSATION_INITIATED: 3,
// }

// export type ModalStateType = keyof typeof MODAL_STATE_INDEXES

function SendFundsModal({
	isOpen,
	onClose,
	safeAddress,
	safeNetwork, 
	proposals,
	safeTokenList,
	onChangeRecepientDetails,
	phantomWallet,
	isEvmChain,
	signerVerified,
	initiateTransactionData,
	onModalStepChange,
	step,
}: Props) {
	const { t } = useTranslation()
	const [recepientError, setRecepientError] = React.useState('')
	return (
		<>
			<ModalComponent
				isCentered
				isOpen={isOpen}
				onClose={onClose}
				closeOnOverlayClick={false}
			>
				<ModalOverlay maxH='100vh' />
				<ModalContent
					minW={528}
					// h="min(90vh, 560px)"
					overflowY='auto'
					borderRadius='4px'>
					<Container
						px={6}
						py={4}>

						<Flex
							direction='row'
							align='center'>
							<Flex
								bg='#D1D7F4'
								h='48px'
								w='48px'
								borderRadius='2px'
								alignItems='center'
								justifyContent='center'
							>
								<FundsCircle
									color='#036AFF'
									h='28px'
									w='28px' />
							</Flex>

							<Flex
								ml={2}
								mr='auto'
								flexDirection='column'>
								<Text
									fontSize='20px'
									lineHeight='24px'
									fontWeight='500'
								>
									{t('/your_grants/view_applicants.send_funds')}
								</Text>
								<Text
									fontSize='14px'
									lineHeight='20px'
									fontWeight='400'
									mt={1}
									color='#7D7DA0'
								>
									{t('/your_grants/view_applicants.send_funds_description')}
								</Text>
							</Flex>

							<CancelCircleFilled
								mb='auto'
								color='#7D7DA0'
								h={6}
								w={6}
								onClick={onClose}
								cursor='pointer'
							/>
						</Flex>

						<Flex
							bg='#F0F0F7'
							h='1px'
							mx='-24px'
							my={4}
						/>

						<Flex
							maxH='412px'
							overflowY='auto'
							direction='column'>
							<Flex>
								<Flex
									flex={1}
									direction='column'
								>
									<Box
										bg={step === 'RECEIPT_DETAILS' ? '#785EF0' : '#E0E0EC'}
										borderRadius='20px'
										height={1}
									/>

									<Flex
										mt={2}
										color={step === 'RECEIPT_DETAILS' ? '#785EF0' : '#E0E0EC'}>
										{
											step === 'RECEIPT_DETAILS' ? (
												<FishEye
													h='14px'
													w='14px' />
											) : (
												<Box
													border='1px solid #E0E0EC'
													borderRadius='20px'
													height='14px'
													width='14px'
												/>
											)
										}
										<Text
											fontSize='12px'
											lineHeight='16px'
											fontWeight='500'
											ml={1}
											color={step === 'RECEIPT_DETAILS' ? '#785EF0' : '#1F1F33'}
										>
											{t('/your_grants/view_applicants.send_funds_recipient')}
										</Text>
									</Flex>
								</Flex>
								<Box w={1} />
								<Flex
									flex={1}
									direction='column'
								>
									<Box
										bg={step === 'VERIFIED_OWNER' || step === 'VERIFIED_OWNER' ? '#785EF0' : '#E0E0EC'}
										borderRadius='20px'
										height={1}
									/>

									<Flex
										mt={2}
										color={step === 'CONNECT_WALLET' || step === 'VERIFIED_OWNER' ? '#785EF0' : '#E0E0EC'}>
										{
											step === 'CONNECT_WALLET' || step === 'VERIFIED_OWNER' ? (
												<FishEye
													h='14px'
													w='14px' />
											) : (
												<Box
													border='1px solid #E0E0EC'
													borderRadius='20px'
													height='14px'
													width='14px'
												/>
											)
										}
										<Text
											fontSize='12px'
											lineHeight='16px'
											fontWeight='500'
											ml={1}
											color={step === 'CONNECT_WALLET' || step === 'VERIFIED_OWNER' ? '#785EF0' : '#1F1F33'}
										>
											{t('/your_grants/view_applicants.send_funds_verify')}
										</Text>
									</Flex>
								</Flex>
							</Flex>

							{
								step === 'RECEIPT_DETAILS' ? (
									<RecipientDetails
										safeNetwork={safeNetwork}
										safeTokenList={safeTokenList}
										isEvmChain={isEvmChain}
										applicantData={proposals[0]}
										initiateTransactionData={initiateTransactionData?.length > 0 ? initiateTransactionData[0] : undefined}
										onChangeRecepientError={setRecepientError}
										onChangeRecepientDetails={onChangeRecepientDetails} />
								) : (
									<SafeOwner
										isEvmChain={isEvmChain}
										phantomWallet={phantomWallet}
										signerVerified={signerVerified}
										gnosisSafeAddress={safeAddress} />
								)
							}
						</Flex>


						<Flex
							bg='#F0F0F7'
							h='1px'
							mx='-24px'
						/>

						<Flex
							mt={4}
							direction='row'
							align='center'>


							{
								step === 'RECEIPT_DETAILS' ? (
									<Button
										ml='auto'
										colorScheme='brandv2'
										disabled={
											(initiateTransactionData?.length > 0 ?
												initiateTransactionData[0]?.selectedMilestone === undefined
											|| initiateTransactionData[0]?.amount === undefined : false) || (
												recepientError != '' 
											)
										}
										onClick={
											async() => {
												onModalStepChange(step)
											}
										}>
										Continue
									</Button>
								) : null
							}


							{
								step === 'CONNECT_WALLET' || step === 'VERIFIED_OWNER' ? (
									<Button
										ml='auto'
										colorScheme='brandv2'
										disabled={!signerVerified}
										onClick={
											async() => {
												onModalStepChange(step)
											}
										}>
										Initiate Transaction
									</Button>
								) : null
							}

						</Flex>


					</Container>
				</ModalContent>
			</ModalComponent>
		</>
	)
}


export default SendFundsModal
