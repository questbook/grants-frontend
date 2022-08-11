import React from 'react'
import { AlertDialogOverlay, Image, Modal, ModalBody, ModalContent } from '@chakra-ui/react'

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
			size="2xl"
		>
			<AlertDialogOverlay
				background={'rgba(240, 240, 247, 0.7)'}
				backdropFilter={'blur(10px)'}
			/>

			<ModalContent
				boxShadow={'none'}
				filter={'drop-shadow(2px 4px 40px rgba(31, 31, 51, 0.05))'}
				borderRadius={'base'}
				fontFamily={'Neue-Haas-Grotesk-Display, sans-serif'}
				fontSize={'1rem'}
			>
				<ModalBody
					p={0}
				>
					<Image
						src="/ui_icons/domain-created-top.svg"
						w="100%"
						h="23%" />
					<Image
						src="/ui_icons/domain-created-illustration.png"
						w='50%'
						h="291px"
						mx="auto"
						border="1px solid black" />
					{/* <Text variant='' ></Text> */}
				</ModalBody>
			</ModalContent>

		</Modal>
	)
}

export default SuccessfulDomainCreationModal

// height: 291px;
// width: 388.836181640625px;
// left: 591px;
// top: 53.54833984375px;
// border-radius: 0px;
