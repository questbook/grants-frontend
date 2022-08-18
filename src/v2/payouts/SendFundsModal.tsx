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
import { ArrowDownCircle } from '../assets/custom chakra icons/Arrows/ArrowDownCircle'
import { CancelCircleFilled } from '../assets/custom chakra icons/CancelCircleFilled'
import { ExternalLink } from '../assets/custom chakra icons/ExternalLink'
import { FishEye } from '../assets/custom chakra icons/FishEye'
import { FundsCircle } from '../assets/custom chakra icons/Your Grants/FundsCircle'

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function SendFundsModal({
	isOpen,
	onClose,
}: Props) {

	const [step, setStep] = useState(0)
	return (
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
							onClick={
								() => {
									setStep(0)
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
									bg={step === 1 ? '#785EF0' : '#E0E0EC'}
									borderRadius='20px'
									height={1}
								/>

								<Flex
									mt={2}
									color={step === 1 ? '#785EF0' : '#E0E0EC'}>
									{
										step === 1 ? (
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
										color={step === 1 ? '#785EF0' : '#1F1F33'}
									>
										Verify as a safe owner
									</Text>
								</Flex>
							</Flex>
						</Flex>

						<Flex
							mt={4}
							p={4}
							borderRadius='2px'
							boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
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
								alignItems={'baseline'}
								mt={2}
							>
								<Text
									fontSize='14px'
									lineHeight='20px'
									fontWeight='500'
								>
									0x0CF4b49b4cdE2Cf4BE5dA09B8Fc5570D2c422027
								</Text>

								<ExternalLink
									ml={1}
									h={'12px'}
									w={'12px'}
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
								h="28px"
								w='28px'
							/>
						</Flex>


						<Flex
							mt={4}
							p={4}
							borderRadius='2px'
							boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
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
								alignItems={'baseline'}
								mt={2}
							>
								<Text
									fontSize='14px'
									lineHeight='20px'
									fontWeight='500'
								>
									0x0CF4b49b4cdE2Cf4BE5dA09B8Fc5570D2c422027
								</Text>

								<ExternalLink
									ml={1}
									h={'12px'}
									w={'12px'}
									cursor='pointer'
								/>
							</Flex>

						</Flex>

					</Flex>


					<Flex
						mt={4}
						direction="row"
						align="center">

						<Button
							ml='auto'
							onClick={
								() => {
									if(step === 0) {
										setStep(1)
									}
								}
							}>
							Continue
						</Button>
					</Flex>


				</Container>
			</ModalContent>
		</ModalComponent>
	)
}


export default SendFundsModal
