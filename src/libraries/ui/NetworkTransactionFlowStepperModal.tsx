import { AlertDialogOverlay, Box, Button, Flex, HStack, Modal, ModalBody, ModalContent, ModalHeader, Text, VStack } from '@chakra-ui/react'
import { CheckboxCircle, ShareBox, ThumbsUp } from 'src/generated/icons'

interface Props {
    isOpen: boolean
    currentStepIndex: number
    viewTxnLink: string
    showViewTransactionButton?: boolean
    onClose: () => void
	customStepsHeader?: string[]
	customSteps?: string[]
}

type ModalStepProps = {
    state: 'to-do' | 'loading' | 'done'
    isLastStep: boolean
    text: string
}

const stepsHeader = ['On-chain transaction', 'This shouldn’t take long..', 'Transaction successful..']
const steps = ['Initiate transaction', 'Complete indexing', 'Complete transaction']

function NetworkTransactionFlowStepperModal({ isOpen, currentStepIndex, viewTxnLink, showViewTransactionButton, onClose, customStepsHeader, customSteps }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isOpen}
				onClose={() => { }}
				isCentered
				scrollBehavior='outside'
				size='md'
			>
				<AlertDialogOverlay
					background='rgba(31, 31, 51, 0.75)'
				/>

				<ModalContent>
					<ModalHeader>
						{customStepsHeader?.length ? customStepsHeader[0] : stepsHeader[0]}
					</ModalHeader>


					<ModalBody py={4}>
						<VStack align='stretch'>

							<Text
								fontSize='sm'
								color='gray.5'
								fontWeight='bold'>
								ACTIVITY
							</Text>

							{
								customSteps?.length ? (
									customSteps.map((step, index) => (
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
								) :
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
								(viewTxnLink?.length || 0) > 0 && (
									<Flex
										mt='4'
										pt={4}>
										{
											(showViewTransactionButton ?? true) && (
												<Button
													variant='link'
													rightIcon={<ShareBox />}
													onClick={
														() => {
															window.open(viewTxnLink, '_blank')
														}
													}>
													View transaction
												</Button>
											)
										}
										<Button
											isDisabled={currentStepIndex < stepsHeader.length}
											ml='auto'
											variant='primaryV2'
											onClick={
												() => {
													onClose()
												}
											}>
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
							isLastStep ? (
								<ThumbsUp
									color='accent.azure'
									boxSize={5} />
							) : (
								<CheckboxCircle
									color='accent.azure'
									boxSize={5} />
							)
						) : (
							<>
								{
									state === 'loading' ? (
										<Box
											minW={4}
											minH={4}
											p='2px'
											bg='accent.azure'
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
							style={{ marginLeft: '8px' }}
							bg='#E0E0EC' />
					)
				}
			</VStack>
		)
	}


	return buildComponent()
}

export default NetworkTransactionFlowStepperModal