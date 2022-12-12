import { ReactNode, useCallback } from 'react'
import { AlertDialogOverlay, Box, Button, Divider, Flex, HStack, Image, Modal, ModalBody, ModalContent, ModalHeader, Text, VStack } from '@chakra-ui/react'
import { CheckCircle } from 'src/v2/assets/custom chakra icons/CheckCircle'
import { ExternalLink } from 'src/v2/assets/custom chakra icons/ExternalLink'

interface Props {
    isOpen: boolean
    currentStepIndex: number
    viewTxnLink: string
    showViewTransactionButton?: boolean
    onClose: () => void
}

type ModalStepProps = {
    state: 'to-do' | 'loading' | 'done'
    isLastStep: boolean
    text: string
}

const stepsHeader = ['On-chain transaction..', 'This shouldn’t take long..', 'Transaction successful..']
const steps = ['Initiate transaction', 'Complete indexing', 'Complete transaction']

function NetworkTransactionFlowStepperModal({ isOpen, currentStepIndex, viewTxnLink, showViewTransactionButton, onClose }: Props) {
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
						{stepsHeader[0]}
					</ModalHeader>


					<ModalBody p='5'>
						<VStack align='stretch'>

                            <Text
                                fontSize='sm'
                                color='gray.5'
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
								(viewTxnLink?.length || 0) > 0 && (
									<Flex mt='4'>
										{
											(showViewTransactionButton ?? true) && (
												<Button
													variant='link'
													rightIcon={<ExternalLink />}
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
                            <CheckCircle
                                color='brand.green'
                                boxSize={5} />
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