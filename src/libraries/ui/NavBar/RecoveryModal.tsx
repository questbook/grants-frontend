import { ChangeEvent } from 'react'
import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import TextField from 'src/v2/components/InputFields/TextField'

interface Props {
    isOpen: boolean
    onClose: () => void
    type: 'import' | 'export'
    privateKey: string
    privateKeyError: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onImportClick: () => void
    onSaveAsTextClick: () => void
    onCopyAndSaveManuallyClick: () => void
}

function RecoveryModal({ isOpen, onClose, type, privateKey, privateKeyError, onChange, onImportClick, onSaveAsTextClick, onCopyAndSaveManuallyClick }: Props) {
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
							p={6}
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
							<Text
								variant='v2_body'
								mt={1}
								color='black.2'>
								{type === 'import' ? 'Enter the wallet private key to import wallet.' : 'Download the file, or save it in your password manager.'}
							</Text>
							{
								type === 'export' && (
									<Text
										mt={6}
										variant='v2_body'
										fontWeight='500'>
										For your eyes only. Anyone who has your private key can access your Questbook wallet
									</Text>
								)
							}
							<TextField
								w='100%'
								mt={4}
								isDisabled={type === 'export'}
								value={privateKey}
								errorText={privateKeyError}
								onChange={onChange} />

							{
								type === 'import' && (
									<Button
										mt={6}
										variant='primaryV2'
										disabled={privateKeyError !== '' || privateKey === '' || privateKey === localStorage.getItem('webwalletPrivateKey')}
										onClick={onImportClick}>
										Import wallet
									</Button>
								)
							}

							{
								type === 'export' && (
									<Flex mt={6}>
										<Button
											variant='link'
											leftIcon={
												<Image
													src='/ui_icons/export-download.svg'
													boxSize='24px' />
											}
											onClick={onSaveAsTextClick}>
											<Text
												color='#572EF5'
												variant='v2_body'
												fontWeight='500'>
												Download .txt file
											</Text>
										</Button>
										<Button
											ml={8}
											variant='link'
											leftIcon={
												<Image
													src='/ui_icons/export-copy.svg'
													boxSize='24px' />
											}
											onClick={onCopyAndSaveManuallyClick}>
											<Text
												color='#572EF5'
												variant='v2_body'
												fontWeight='500'>
												Copy & save manually
											</Text>

										</Button>
									</Flex>
								)
							}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	return buildComponent()
}

export default RecoveryModal