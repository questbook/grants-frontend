import React, { useEffect, useState } from 'react'
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
import { PublicKey } from '@solana/web3.js'
import { FishEye } from 'src/v2/assets/custom chakra icons/FishEye'
import { SupportedSafes } from 'src/v2/constants/safe/supported_safes'
import { useConnect } from 'wagmi'
import { CancelCircleFilled } from '../../assets/custom chakra icons/CancelCircleFilled'
import { FundsCircle } from '../../assets/custom chakra icons/Your Grants/FundsCircle'
import TransactionInitiatedModal from '../TransactionInitiatedModal'
import RecipientDetails from './RecepientDetails'
import SafeOwner from './SafeOwner'

interface Props {
  isOpen: boolean;
  onClose: () => void;
	onComplete: () => void;
	safeAddress: string;
	proposals: any[];
}

type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';

interface ConnectOpts {
    onlyIfTrusted: boolean;
}

interface PhantomProvider {
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: ()=>Promise<void>;
    on: (event: PhantomEvent, callback: (args:any)=>void) => void;
    isPhantom: boolean;
	publicKey: PublicKey;
	isConnected: boolean;
}

type WindowWithSolana = Window & {
    solana?: PhantomProvider;
}


function SendFundsModal({
	isOpen,
	onClose,
	onComplete,
	safeAddress,
	proposals,
}: Props) {

	const [step, setStep] = useState(0)
	const [toAddressIsFocused, setToAddressIsFocused] = useState(false)
	const [txnInitModalIsOpen, setTxnInitModalIsOpen] = useState(false)


	const [milestoneId, setMilestoneId] = useState<string>()
	const [amount, setAmount] = useState<number>()

	const [ walletAvail, setWalletAvail ] = useState(false)
	const [phantomWallet, setPhantomWallet] = useState<PhantomProvider>()
	const [phantomWalletConnected, setPhantomWalletConnected] = useState(false)
	const [signerVerified, setSignerVerififed] = useState(false)
	const [proposalAddr, setProposalAddr] = useState('')

	const supported_safes = new SupportedSafes()
	const chainId = 9000001
	const current_safe = supported_safes.getSafeByChainId(chainId)


	useEffect(() => {
		if('solana' in window) {
			const solWindow = window as WindowWithSolana
			if(solWindow?.solana?.isPhantom) {
				setPhantomWallet(solWindow.solana)
				setWalletAvail(true)
			}
		}
	}, [])

	useEffect(() => {
		phantomWallet?.on('connect', () => {
			console.log('phantom wallet connected ')
			setPhantomWalletConnected(true)
		})
		phantomWallet?.on('disconnect', () => {
			console.log('phantom wallet disconnected')
		})

	}, [phantomWallet?.isConnected])

	useEffect(() => {
		const getVerification = async() => {
			if(phantomWallet?.publicKey?.toString()) {
				const isVerified = await current_safe?.isOwner(phantomWallet.publicKey?.toString())
				console.log('realms_solana verification', isVerified)
				if(isVerified) {
					setSignerVerififed(true)
					setStep(2)
				}
			}
		}

		if(phantomWalletConnected) {
			getVerification()
		}
	}, [phantomWalletConnected])

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
				onClose={
					async() => {
						if(phantomWallet?.isConnected) {
							await phantomWallet.disconnect()
							setPhantomWalletConnected(false)
						}

						setStep(0)
						setMilestoneId(undefined)
						setAmount(undefined)
						onClose()
					}
				}
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
								onClick={
									() => {
										setStep(0)
										setMilestoneId(undefined)
										setAmount(undefined)
										onClose()
									}
								}
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
								step === 0 ? (
									<RecipientDetails
										milestoneId={milestoneId}
										setMilestoneId={setMilestoneId}
										amount={amount}
										setAmount={setAmount}
										safeAddress={safeAddress}
										applicantData={proposals[0]}
										step={step} />
								) : (
									<SafeOwner
										chainId={chainId}
										phantomWallet={phantomWallet}
										signerVerified={signerVerified} />
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

							<Button
								ml='auto'
								colorScheme={'brandv2'}
								disabled={step === 0 ? milestoneId === undefined || amount === undefined : step === 1}
								onClick={
									async() => {
										if(step === 0) {
											setStep(1)
										}

										if(step === 2) {
											setStep(0)
											setTxnInitModalIsOpen(true)
											setMilestoneId(undefined)
											setAmount(undefined)
											onComplete()
											const proposaladdress = await current_safe?.proposeTransactions([], phantomWallet)
											setProposalAddr(proposaladdress?.toString())
										}
									}
								}>
								{step === 0 ? 'Continue' : 'Initiate Transaction'}
							</Button>

						</Flex>


					</Container>
				</ModalContent>
			</ModalComponent>
			<TransactionInitiatedModal
				isOpen={txnInitModalIsOpen}
				onClose={() => setTxnInitModalIsOpen(false)}
				onComplete={() => setTxnInitModalIsOpen(false)}
				proposalUrl={`http://localhost:3002/dao/${current_safe.realmPk}/proposal/${proposalAddr}`}
			/>
		</>
	)
}


export default SendFundsModal
