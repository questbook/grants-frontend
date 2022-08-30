import React from 'react'
import {
	Box,
	Container,
	Flex,
	Heading,
	IconButton, Image,
	Modal as ModalComponent,
	ModalContent,
	ModalOverlay,
} from '@chakra-ui/react'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  alignTitle?: 'left' | 'center' | 'right'
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  // topIcon?: React.ReactNode;
  modalWidth?: string | number
  closeButtonMargin?: string | number
  showCloseButton?: boolean
}

function Modal({
	isOpen,
	onClose,
	title,
	children,
	leftIcon,
	rightIcon,
	// topIcon,
	alignTitle,
	modalWidth,
	closeButtonMargin,
	showCloseButton,
}: Props) {
	return (
		<ModalComponent
			isCentered
			isOpen={isOpen}
			onClose={onClose}
			closeOnOverlayClick={false}
		>
			<ModalOverlay maxH='100vh' />
			<ModalContent
				minW={modalWidth}
				maxH='90vh'
				overflowY='auto'
				borderRadius='12px'>
				<Container
					px={8}
					pt={9}>
					{/* {typeof topIcon !== 'undefined' && (
            <Flex direction="column" align="center">
              {topIcon}
              <Box mb={5} />
            </Flex>
          )} */}
					<Flex
						direction='row'
						w='100%'
						align='center'>
						{typeof leftIcon !== 'undefined' && leftIcon}
						<Heading
							textAlign={alignTitle}
							variant='modal'>
							{title}
						</Heading>
						<Box mx='auto' />
						{typeof rightIcon !== 'undefined' && rightIcon}
						{
							showCloseButton && (
								<IconButton
									m={closeButtonMargin}
									aria-label='close-button'
									size='14px'
									icon={
										<Image
											boxSize='14px'
											_active={{}}
											_hover={{}}
											src='/ui_icons/close.svg' />
									}
									_hover={{}}
									_active={{}}
									variant='ghost'
									onClick={onClose}
								/>
							)
						}
					</Flex>
				</Container>
				{children}
			</ModalContent>
		</ModalComponent>
	)
}

Modal.defaultProps = {
	leftIcon: undefined,
	rightIcon: undefined,
	// topIcon: undefined,
	alignTitle: 'left',
	modalWidth: 480,
	closeButtonMargin: '0px 0px 0px 20px',
	showCloseButton: true,
}

export default Modal
