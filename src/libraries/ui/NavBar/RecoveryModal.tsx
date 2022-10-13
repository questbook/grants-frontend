import { Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'

interface Props {
    isOpen: boolean
    onClose: () => void
    type: 'import' | 'export'
}
function RecoveryModal({ isOpen, onClose, type }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isCentered={true}
				size='2xl'
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							direction='column'
							align='center'>
							<Image
								src='/ui_icons/recovery-icon.svg'
								boxSize='40px' />
							<Text
								variant='v2_subheading'
								fontWeight='500'
								mt={5}>
								{type === 'import' ? 'Use another wallet' : 'Export wallet'}
							</Text>
						</Flex>
					</ModalBody>
				</ModalContent>

			</Modal>
		)
	}

	return buildComponent()
}

export default RecoveryModal