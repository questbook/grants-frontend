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

interface Props {
	isOpen: boolean
	onClose: () => void
	safeAddress: string
	proposals: IApplicantData[]
	onChangeRecepientDetails: (applicationId: string, fieldName: string, fieldValue: string|number) => void
	phantomWallet: PhantomProvider | undefined
	isEvmChain: boolean
	signerVerified: boolean
	initiateTransactionData: TransactionType[]
	onModalStepChange: (value: number) => Promise<void>
	step: ModalStateType
}

export type ModalState = 'RECEIPT_DETAILS' | 'CONNECT_WALLET' | 'VERIFIED_OWNER' | 'TRANSATION_INITIATED'

export const MODAL_STATE_INDEXES: {[_ in ModalState]: number} = {
	RECEIPT_DETAILS: 0,
	CONNECT_WALLET: 1,
	VERIFIED_OWNER: 2,
	TRANSATION_INITIATED: 3,
}

export type ModalStateType = keyof typeof MODAL_STATE_INDEXES

function SendFundsModal({
	isOpen,
	onClose,
	safeAddress,
	proposals,
	onChangeRecepientDetails,
	phantomWallet,
	isEvmChain,
	signerVerified,
	initiateTransactionData,
	onModalStepChange,
	step,
}: Props) {

	// console.log('step', step)

	// const [step, setStep] = useState(0)
	// const [toAddressIsFocused, setToAddressIsFocused] = useState(false)
	// const [txnInitModalIsOpen, setTxnInitModalIsOpen] = useState(false)


	// const {
	// 	isError: isErrorConnecting,
	// 	connect,
	// 	connectors
	// } = useConnect()


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
									Send funds
								</Text>
								<Text
									fontSize='14px'
									lineHeight='20px'
									fontWeight='400'
									mt={1}
									color='#7D7DA0'
								>
									Use your safe to send funds to the applicant.
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
							overflowY='scroll'
							direction='column'>
							<Flex>
								<Flex
									flex={1}
									direction='column'
								>
									<Box
										bg={MODAL_STATE_INDEXES[step] === 0 ? '#785EF0' : '#E0E0EC'}
										borderRadius='20px'
										height={1}
									/>

									<Flex
										mt={2}
										color={MODAL_STATE_INDEXES[step] === 0 ? '#785EF0' : '#E0E0EC'}>
										{
											MODAL_STATE_INDEXES[step] === 0 ? (
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
											color={MODAL_STATE_INDEXES[step] === 0 ? '#785EF0' : '#1F1F33'}
										>
											Recipient Details
										</Text>
									</Flex>
								</Flex>
								<Box w={1} />
								<Flex
									flex={1}
									direction='column'
								>
									<Box
										bg={MODAL_STATE_INDEXES[step] === 1 || MODAL_STATE_INDEXES[step] === 2 ? '#785EF0' : '#E0E0EC'}
										borderRadius='20px'
										height={1}
									/>

									<Flex
										mt={2}
										color={MODAL_STATE_INDEXES[step] === 1 || MODAL_STATE_INDEXES[step] === 2 ? '#785EF0' : '#E0E0EC'}>
										{
											MODAL_STATE_INDEXES[step] === 1 || MODAL_STATE_INDEXES[step] === 2 ? (
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
											color={MODAL_STATE_INDEXES[step] === 1 || MODAL_STATE_INDEXES[step] === 2 ? '#785EF0' : '#1F1F33'}
										>
											Verify as a safe owner
										</Text>
									</Flex>
								</Flex>
							</Flex>

							{
								step === 'RECEIPT_DETAILS' ? (
									<RecipientDetails
										applicantData={proposals[0]}
										initiateTransactionData={initiateTransactionData?.length > 0 ? initiateTransactionData[0] : undefined}
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
											initiateTransactionData?.length > 0 ?
												initiateTransactionData[0]?.selectedMilestone === undefined
											|| initiateTransactionData[0]?.amount === undefined : false
										}
										onClick={
											async() => {
												onModalStepChange(MODAL_STATE_INDEXES[step])
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
												onModalStepChange(MODAL_STATE_INDEXES[step])
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
