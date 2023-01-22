import { Button, Flex, Modal, ModalBody, ModalBodyProps, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'

interface Props {
    isOpen: boolean
    onClose: () => void
    title: string
    subTitle: string
    actionText: string
    action: () => void
    onCancel: () => void
    modalBodyProps?: ModalBodyProps
}

function ConfirmationModal({ isOpen, onClose, title, subTitle, actionText, action, modalBodyProps }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isCentered={true}
				size='xl'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							align='flex-start'
							direction='column'
							p={6}
							gap={4}
						>
							<Text
								variant='v2_title'
								fontWeight='500'
							>
								{title}
							</Text>
							<Text
								variant='v2_body'
								fontWeight='400'
							>
								{subTitle}
							</Text>
							{modalBodyProps}
							<Flex mt={4}>
								<Button
                            		onClick={action}
                            		variant='primaryV2'>
									<Text
                            			variant='v2_body'
                            			color='white'>
										{actionText}
									</Text>
								</Button>
								<Button
                            		onClick={onClose}
                            		ml={4}
                            		variant='link'>
									<Text variant='v2_body'>
										Cancel
									</Text>
								</Button>
							</Flex>
						</Flex>
					</ModalBody>

				</ModalContent>
			</Modal>
		)
	}

	return buildComponent()
}

export default ConfirmationModal