import React from 'react'
import { AlertDialogOverlay, Modal, ModalBody, ModalContent } from '@chakra-ui/react'

const SuccessfulDomainCreationModal = ({
	isOpen,
	onClose,
	redirect,
}: {
	isOpen: boolean,
	onClose: () => void,
	redirect?: () => void,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			scrollBehavior={'outside'}
		>
			<AlertDialogOverlay
				background={'rgba(240, 240, 247, 0.7)'}
				backdropFilter={'blur(10px)'}
			/>

			<ModalContent
				w={'36rem'}
				boxShadow={'none'}
				filter={'drop-shadow(2px 4px 40px rgba(31, 31, 51, 0.05))'}
				borderRadius={'base'}
				fontFamily={'Neue-Haas-Grotesk-Display, sans-serif'}
				fontSize={'1rem'}
			>
				<ModalBody
					p={0}
				>
					
				</ModalBody>
			</ModalContent>

		</Modal>
	)
}

export default SuccessfulDomainCreationModal