import QRCode from 'react-qr-code'
import { Button, Flex, Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'


function ProofQrModal({
	isOpen,
	onClose,
	proofQr,
}: {
    isOpen: boolean
    onClose: () => void
    proofQr: string
}) {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isOpen}
				onClose={() => onClose()}
				size='xl'
				closeOnEsc
				isCentered
				scrollBehavior='outside'>
				<ModalOverlay />
				<ModalContent
					borderRadius='8px'
				>
					<ModalHeader
						fontSize='24px'
						fontWeight='700'
						lineHeight='32.4px'
						color='#07070C'
						alignItems='center'
					>
						Verify using Reclaim
						<ModalCloseButton
							mt={1}
						/>
					</ModalHeader>
					<Flex
						direction='column'
						alignContent='center'
						alignItems='center'
						w='100%'
						gap='24px'
						padding='20px 10px'
						justifyContent='center'
						mx='auto'
						h='100%'>
						{
							!proofQr && (
								<Text
									color='#7E7E8F'
									fontSize='18px'
									fontStyle='normal'
									fontWeight='700'
									lineHeight='135%'>
									Generating QR code
								</Text>
							)
						}
						{
							proofQr && (
								<QRCode
									fgColor='#4D9CD4'
									style={{ height: '320px', maxWidth: '100%', width: '320px' }}
									value={proofQr ?? ''} />
							)
						}
						<Button
							color='#699804'
							textAlign='center'
							fontSize='18px'
							fontStyle='normal'
							fontWeight='700'
							lineHeight='135%'
							isLoading={true}
							loadingText='Pending'
						>
							Scan QR code with your phone camera
						</Button>
						{
							proofQr && (
								<Text
									color='#699804'
									textAlign='center'
									fontSize='18px'
									fontStyle='normal'
									fontWeight='700'
									lineHeight='135%'>
									Scan QR code with your phone camera
								</Text>
							)
						}


					</Flex>
					<Text
						color='#7E7E8F'
						fontSize='14px'
						fontStyle='normal'
						align='right'
						p={4}
						fontWeight='400'
						lineHeight='135%'>
						Powered by
						{' '}
						<Text
							cursor='pointer'
							onClick={() => window.open('https://reclaimprotocol.org', '_blank')}
							as='span'
							fontSize='14px'
							color='#4D9CD4'>
							Reclaim Protocol
						</Text>
					</Text>
				</ModalContent>
			</Modal>
		)
	}

	return buildComponent()
}


export default ProofQrModal