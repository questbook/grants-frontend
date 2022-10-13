import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'

interface Props {
    isOpen: boolean
    onClose: () => void
    saveWallet: () => void
}

function ImportConfirmationModal({ isOpen, onClose, saveWallet }: Props) {
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
							align='center'
							direction='column'
							p={6}>
							<Text
								variant='v2_subheading'
								fontWeight='500'
								textAlign='center'>
								Importing a wallet will overwrite your current wallet. Are you sure, you want to continue?
							</Text>
							<Flex mt={4}>
								<Button
									onClick={saveWallet}
									variant='primaryV2'>
									<Text
										variant='v2_body'
										color='white'>
										Yes
									</Text>
								</Button>
								<Button
									onClick={onClose}
									ml={4}
									variant='link'>
									<Text variant='v2_body'>
										No
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

export default ImportConfirmationModal