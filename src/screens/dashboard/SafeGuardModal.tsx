import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'

interface Props {
    isOpen: boolean
    onClose: () => void
}

function SafeGuardModal({ isOpen, onClose }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				size='xl'
				isCentered
				isOpen={isOpen}
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody p={6}>
						<Flex
							direction='column'
							alignItems='center'
							justifyContent='center'
							mb={4}>
							<Text fontWeight='500'>
								Assign Reviewers using  Safeguard
							</Text>
							<Text mt={2}>
								Safeguard aborts transactions if the reviews are not submitted.
							</Text>
							<Text mt={6}>
								This serves as an on chain financial guard for your grant program.
							</Text>
							<Image src='/v2/images/safeguard.svg' />
							<Button
								w='100%'
								variant='primaryLarge'
								mt={4}>
								<Text
									color='white'
									fontWeight='500'>
									Open Safeguard
								</Text>
							</Button>
						</Flex>

					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	return buildComponent()
}

export default SafeGuardModal