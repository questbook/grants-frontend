import type { ReactNode } from 'react'
import { AlertDialogOverlay, Box, Divider, Flex, HStack, Image, Modal, ModalBody, ModalContent, ModalHeader, Text, VStack } from '@chakra-ui/react'
import { CHAIN_INFO } from 'src/constants/chains'
import useChainId from 'src/hooks/utils/useChainId'
import { CheckCircle } from '../assets/custom chakra icons/CheckCircle'

export type NetworkTransactionModalProps = {
	isOpen: boolean
	/** main title of the transaction */
	title: string
	/** two words about what we're doing on chain, eg. "creating invite link" */
	subtitle: string

	description: ReactNode
	/** what step we're at */
	currentStepIndex: number
	/** title of the steps in the transaction */
	steps: string[]
}

type ModalStepProps = {
	state: 'to-do' | 'loading' | 'done'
	isLastStep: boolean
	text: string
}

export default ({
	isOpen,
	title,
	subtitle,
	description,
	currentStepIndex,
	steps
}: NetworkTransactionModalProps) => {
	const chainId = useChainId()

	const info = CHAIN_INFO[chainId]

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => { }}
			isCentered
			scrollBehavior={'outside'}
			size='sm'
		>
			<AlertDialogOverlay
				background='rgba(240, 240, 247, 0.7)'
				backdropFilter='blur(10px)'
			/>

			<ModalContent>
				<ModalHeader>
					<HStack>
						<Image
							boxSize='12'
							src='/ui_icons/network_transaction_logo.svg' />
						<VStack
							spacing='1'
							align='start'>
							<Text fontSize='xl'>
								{title}
							</Text>
							<HStack spacing='1'>
								<Text
									fontSize='sm'
									fontWeight='light'
									color='v2Grey'>
									{subtitle}
									{' on'}
								</Text>

								<Image
									boxSize='3'
									src={info?.icon || ''} />

								<Text
									fontSize='sm'
									fontWeight='bold'>
									{info?.name}
								</Text>
							</HStack>
						</VStack>
					</HStack>
				</ModalHeader>

				<Divider />

				<ModalBody p='5'>
					<VStack align='stretch'>
						<Flex
							p='4'
							borderRadius='base'
							bg='#D5F1EB'
						>
							{description}
						</Flex>
						<Text
							fontSize='sm'
							color='v2LightGrey'
							fontWeight='bold'>
							ACTIVITY
						</Text>

						{
							steps.map((step, index) => (
								<ModalStep
									key={step}
									state={
										index === currentStepIndex
											? 'loading'
											: (
												currentStepIndex > index
													? 'done'
													: 'to-do'
											)
									}
									isLastStep={index === steps.length - 1}
									text={step}
								/>
							))
						}
					</VStack>
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}

const ModalStep = ({
	state,
	isLastStep,
	text,
}: ModalStepProps) => {
	return (
		<VStack align='start'>
			<HStack>
				{
					state === 'done' ? (
						<CheckCircle
							color={'#3AE0AE'}
							boxSize={4} />
					) : (
						<>
							{
								state === 'loading' ? (
									<Box
										minW={4}
										minH={4}
										p={'2px'}
										bg={'linear-gradient(180deg, #89A6FB 5.88%, #B6F72B 94.12%)'}
										style={
											{
												aspectRatio: '1',
												WebkitMask: 'conic-gradient(#0000,#000), linear-gradient(#000 0 0) content-box',
												WebkitMaskComposite: 'source-out'
											}
										}
										borderRadius={'50%'}
										boxSizing={'border-box'}
										animation={'spinner 0.45s linear infinite'}
									 />
								) : (
									<Box
										minW={4}
										minH={4}
										borderColor={'#E0E0EC'}
										borderWidth={'2px'}

										borderRadius={'50%'}
										boxSizing={'border-box'}
						 />
								)
							}

						</>
					)
				}

				<Text
					fontWeight={state === 'loading' ? '500' : '400'}
					ml={3}
					color={state === 'loading' ? 'black' : '#AFAFCC'}
				>
					{text}
				</Text>
			</HStack>

			{
				!isLastStep && (
					<Box
						h='2'
						w={'2px'}
						style={{ marginLeft: '6px' }}
						bg={'#E0E0EC'} />
				)
			}
		</VStack>
	)
}