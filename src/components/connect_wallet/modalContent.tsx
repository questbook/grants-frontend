import React from 'react'
import {
	Button, Container, Image, ModalBody, ModalFooter, Text,
	VStack, } from '@chakra-ui/react'

interface Props {
  onClose: () => void
}

function ModalContent({
	onClose,
}: Props) {
	return (
		<>
			<ModalBody>
				<Container
					px={6}
					py={8}>
					<VStack
						alignItems='flex-start'
						spacing={4}>
						<Text>
							Click on the
							<Image
								mx={2}
								display='inline-block'
								src='/wallet_icons/metamask.svg'
								alt='metamak'
							/>
							icon in your browser.
						</Text>
						<Image
							w='432px'
							h='193.11px'
							src='/images/metamask_modal.png'
							alt='metamask help'
						/>
					</VStack>
				</Container>
			</ModalBody>

			<ModalFooter>
				<Button
					variant='primary'
					onClick={onClose}>
					OK
				</Button>
			</ModalFooter>

		</>
	)
}

export default ModalContent
