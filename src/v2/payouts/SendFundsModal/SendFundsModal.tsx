import React, { useState } from 'react'
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
import { FishEye } from 'src/v2/assets/custom chakra icons/FishEye'
import { PhantomProvider } from 'src/v2/types/phantom'
import { Safe, TransactionType } from 'src/v2/types/safe'
import { useConnect } from 'wagmi'
import { CancelCircleFilled } from '../../assets/custom chakra icons/CancelCircleFilled'
import { FundsCircle } from '../../assets/custom chakra icons/Your Grants/FundsCircle'
import RecipientDetails from './RecepientDetails'
import SafeOwner from './SafeOwner'

interface Props {
	isOpen: boolean;
	onClose: () => void;
	safeAddress: string;
	proposals: any[];
	onChangeRecepientDetails :(applicationId: any, fieldName: string, fieldValue: any)=>void;
	phantomWallet : PhantomProvider | undefined;
	setPhantomWalletConnected: (value: boolean)=>void;
	isEvmChain: boolean;
	current_safe: Safe;
	signerVerified: boolean;
	initiateTransaction: ()=>Promise<void>;
	initiateTransactionData: TransactionType[];
	onModalStepChange: (value: number)=>Promise<void>;
	step: ModalState;
}

enum ModalState {
	RECEIPT_DETAILS,
	CONNECT_WALLET,
	VERIFIED_OWNER,
	TRANSATION_INITIATED
}

function SendFundsModal({
	isOpen,
	onClose,
	safeAddress,
	proposals,
	onChangeRecepientDetails,
	phantomWallet,
	setPhantomWalletConnected,
	isEvmChain,
	current_safe,
	signerVerified,
	initiateTransaction,
	initiateTransactionData,
	onModalStepChange,
	step,
}: Props) {

	console.log('step', step)

	// const [step, setStep] = useState(0)
	const [toAddressIsFocused, setToAddressIsFocused] = useState(false)
	const [txnInitModalIsOpen, setTxnInitModalIsOpen] = useState(false)


	const {
		isError: isErrorConnecting,
		connect,
		connectors
	} = useConnect()


	return (
		<>
			<ModalComponent
				isCentered
				isOpen={isOpen}
				onClose={onClose}
				closeOnOverlayClick={false}
			>
				<ModalOverlay maxH="100vh" />
				<ModalContent
					minW={528}
					// h="min(90vh, 560px)"
					overflowY="auto"
					borderRadius="4px">
					<Container
						px={6}
						py={4}>

						<Flex
							direction="row"
							align="center">
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
							h={'1px'}
							mx={'-24px'}
							my={4}
						/>

						<Flex
							maxH={'412px'}
							overflowY={'scroll'}
							direction={'column'}>
							<Flex>
								<Flex
									flex={1}
									direction={'column'}
								>
									<Box
										bg={step === 0 ? '#785EF0' : '#E0E0EC'}
										borderRadius='20px'
										height={1}
									/>

									<Flex
										mt={2}
										color={step === 0 ? '#785EF0' : '#E0E0EC'}>
										{
											step === 0 ? (
												<FishEye
													h={'14px'}
													w={'14px'} />
											) : (
												<Box
													border='1px solid #E0E0EC'
													borderRadius='20px'
													height={'14px'}
													width={'14px'}
												/>
											)
										}
										<Text
											fontSize='12px'
											lineHeight='16px'
											fontWeight='500'
											ml={1}
											color={step === 0 ? '#785EF0' : '#1F1F33'}
										>
										Recipient Details
										</Text>
									</Flex>
								</Flex>
								<Box w={1} />
								<Flex
									flex={1}
									direction={'column'}
								>
									<Box
										bg={step === 1 || step === 2 ? '#785EF0' : '#E0E0EC'}
										borderRadius='20px'
										height={1}
									/>

									<Flex
										mt={2}
										color={step === 1 || step === 2 ? '#785EF0' : '#E0E0EC'}>
										{
											step === 1 || step === 2 ? (
												<FishEye
													h={'14px'}
													w={'14px'} />
											) : (
												<Box
													border='1px solid #E0E0EC'
													borderRadius='20px'
													height={'14px'}
													width={'14px'}
												/>
											)
										}
										<Text
											fontSize='12px'
											lineHeight='16px'
											fontWeight='500'
											ml={1}
											color={step === 1 || step === 2 ? '#785EF0' : '#1F1F33'}
										>
										Verify as a safe owner
										</Text>
									</Flex>
								</Flex>
							</Flex>

							{
								step === ModalState.RECEIPT_DETAILS ? (
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
							h={'1px'}
							mx={'-24px'}
						/>

						<Flex
							mt={4}
							direction="row"
							align="center">


							{
								step === ModalState.RECEIPT_DETAILS ? (
									<Button
										ml='auto'
										colorScheme={'brandv2'}
										disabled={
											initiateTransactionData?.length > 0 ?
												initiateTransactionData[0]?.selectedMilestone === undefined
											|| initiateTransactionData[0]?.amount === undefined : false
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
								step === ModalState.CONNECT_WALLET || step === ModalState.VERIFIED_OWNER ? (
									<Button
										ml='auto'
										colorScheme={'brandv2'}
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
