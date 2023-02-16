import { useContext } from 'react'
import QRCode from 'react-qr-code'
import { Box, Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { NotificationContext } from 'src/pages/_app'

function QRCodeModal() {
	const buildComponent = () => {
		return (
			<Modal
				isCentered={true}
				size='md'
				isOpen={qrCodeText !== undefined}
				onClose={
					() => {
						setQrCodeText(undefined)
					}
				}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<Flex
						direction='column'
						w='100%'
						align='center'
						p={8}>
						<Text
							variant='v2_body'
							fontWeight='500'>
							Scan QR code with your phone camera
						</Text>
						<Box mt={4} />
						<QRCode
							fgColor='#4D9CD4'
							style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
							value={qrCodeText ?? ''} />
					</Flex>
				</ModalContent>
			</Modal>
		)
	}

	const { qrCodeText, setQrCodeText } = useContext(NotificationContext)!

	return buildComponent()
}

export default QRCodeModal