import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { Copy, Export, ExportDownload, Import } from 'src/generated/icons'

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
				<ModalContent
					maxW={['94%', '70%', '50%', '45%']}
				>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							p={6}
							direction='column'
							align='center'>
							{type === 'import' ? <Import boxSize='48px' /> : <Export boxSize='48px' />}
							<Text
								variant='subheading'
								fontWeight='500'
								mt={5}>
								{type === 'import' ? `${t('account_details.import.heading')}` : `${t('account_details.export.heading')}`}
							</Text>
							<Text
								variant='body'
								mt={1}
								color='black.3'>
								{type === 'import' ? `${t('account_details.import.subheading')}` : `${t('account_details.export.subheading')}` }
							</Text>
							{
								type === 'export' && (
									<Text
										mt={6}
										variant='body'
									>
										{t('account_details.export.warning-line-1')}
									</Text>
								)
							}
							{
								type === 'export' && (
									<Text
										mt={1}
										variant='body'
									>
										{t('account_details.export.warning-line-2')}
									</Text>
								)
							}
							<Input
								w='100%'
								mt={4}
								isDisabled={type === 'export'}
								value={privateKey}
								onChange={onChange} />

							{
								type === 'import' && (
									<Button
										mt={6}
										variant='primaryV2'
										disabled={privateKeyError !== '' || privateKey === '' || privateKey === localStorage.getItem('webwalletPrivateKey')}
										onClick={onImportClick}>
										{t('account_details.import.button')}
									</Button>
								)
							}

							{
								type === 'export' && (
									<Flex mt={6}>
										<Button
											variant='link'
											leftIcon={
												<ExportDownload
													boxSize='24px' />
											}
											onClick={onSaveAsTextClick}>
											<Text
												color='#572EF5'
												variant='body'
												fontWeight='500'>
												{t('account_details.export.download')}
											</Text>
										</Button>
										<Button
											ml={8}
											variant='link'
											leftIcon={
												<Copy
													color='#572EF5'
													boxSize='24px' />
											}
											onClick={onCopyAndSaveManuallyClick}>
											<Text
												color='#572EF5'
												variant='body'
												fontWeight='500'>
												{t('account_details.export.copy_and_save_manually')}
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

	const { t } = useTranslation()

	return buildComponent()
}

export default RecoveryModal