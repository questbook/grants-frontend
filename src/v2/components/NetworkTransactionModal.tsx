import { ReactNode } from 'react'
import { AlertDialogOverlay, Box, Button, Divider, Flex, HStack, Image, Modal, ModalBody, ModalContent, ModalHeader, Text, VStack } from '@chakra-ui/react'
import { CheckCircle } from 'src/v2/assets/custom chakra icons/CheckCircle'
import { ExternalLink } from 'src/v2/assets/custom chakra icons/ExternalLink'

export type NetworkTransactionModalProps = {
	isOpen: boolean
	/** two words about what we're doing on chain, eg. "creating invite link" */
	subtitle: string

	description: ReactNode
	/** what step we're at */
	currentStepIndex: number
	/** title of the steps in the transaction */
	steps: string[]

	/** transaction hash of the completed transaction */
	transactionHash: string | undefined
	/** function to execute when closing the modal */
	onClose: () => void
}

type ModalStepProps = {
	state: 'to-do' | 'loading' | 'done'
	isLastStep: boolean
	text: string
}

export default ({
	isOpen,
	subtitle,
	description,
	currentStepIndex,
	steps,
	transactionHash,
	onClose,
}: NetworkTransactionModalProps) => {

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => { }}
			isCentered
			scrollBehavior='outside'
			size='sm'
		>
			<AlertDialogOverlay
				background='rgba(31, 31, 51, 0.75)'
			/>

			<ModalContent>
				<ModalHeader>
					<HStack>
						<Image
							boxSize='12'
							src='/ui_icons/network_transaction_logo.svg' />

						<Box w='1' />

						<VStack
							spacing='0'
							align='start'>
							<Text fontSize='xl'>
								Network transaction
							</Text>

							<Text
								fontSize='sm'
								fontWeight='light'
								color='v2Grey'>
								{subtitle}
							</Text>
						</VStack>
					</HStack>
				</ModalHeader>

				<Divider />

				<ModalBody p='5'>
					<VStack align='stretch'>
						<Flex
							p='3'
							borderRadius='base'
							bg='#D5F1EB'
						>
							{description}
						</Flex>

						<Box height='2' />

						<Text
							fontSize='sm'
							color='v2Grey'
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

						{
							currentStepIndex === steps.length && (transactionHash?.length || 0) > 0 && (
								<Flex mt='4'>
									<Button
										variant='link'
										rightIcon={<ExternalLink />}>
										View transaction
									</Button>
									<Button
										ml='auto'
										variant='primaryV2'
										onClick={onClose}>
										Okay
									</Button>
								</Flex>
							)
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
							color='#3AE0AE'
							boxSize={4} />
					) : (
						<>
							{
								state === 'loading' ? (
									<Box
										minW={4}
										minH={4}
										p='2px'
										bg='linear-gradient(180deg, #89A6FB 5.88%, #B6F72B 94.12%)'
										style={
											{
												aspectRatio: '1',
												WebkitMask: 'conic-gradient(#0000,#000), linear-gradient(#000 0 0) content-box',
												WebkitMaskComposite: 'source-out'
											}
										}
										borderRadius='50%'
										boxSizing='border-box'
										animation='spinner 0.45s linear infinite'
									/>
								) : (
									<Box
										minW={4}
										minH={4}
										borderColor='#E0E0EC'
										borderWidth='2px'

										borderRadius='50%'
										boxSizing='border-box'
									/>
								)
							}

						</>
					)
				}

				<Text
					fontWeight={state === 'loading' ? 'bold' : 'light'}
					ml={3}
					color={state === 'loading' ? 'black' : '#555570'}
				>
					{text}
				</Text>
			</HStack>

			{
				!isLastStep && (
					<Box
						h='2'
						w='2px'
						style={{ marginLeft: '6px' }}
						bg='#E0E0EC' />
				)
			}
		</VStack>
	)
}