import React from 'react'
import { ChakraProvider, Text } from '@chakra-ui/react'
import themev2 from '../themev2'

function ConnectWalletModal() {
	return (
		// <Modal
		// 	isOpen={true}
		// 	onClose={() => {}}>
		// 	<ModalOverlay />
		// 	<ModalContent>
		// 		<ModalBody>
		// 			<Text>
	//         Yolo
		// 			</Text>
		// 		</ModalBody>
		// 	</ModalContent>
		// </Modal>
		<ChakraProvider
			theme={themev2}
			cssVarsRoot={'body'}>
			<Text>
Open
			</Text>
		</ChakraProvider>
	)
}

export default ConnectWalletModal

