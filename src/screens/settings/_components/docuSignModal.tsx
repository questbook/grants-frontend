import { useContext, useEffect, useState } from 'react'
import {
	Button,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Text,
	useToast,
} from '@chakra-ui/react'
import { logger } from 'ethers'
import { updateDocuSign } from 'src/generated/mutation/updateDocuSign'
import { executeMutation } from 'src/graphql/apollo'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { SettingsFormContext } from 'src/screens/settings/Context'

interface Props {
	isOpen: boolean
	onClose: () => void
}

function DocuSignModal({
	isOpen,
	onClose,
}: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size='xl'
				isCentered>
				<ModalOverlay />
				<ModalContent
					flexDirection='column'
					w='100%'
					gap={1}
					alignItems='center'
					p={8}
				>
					<ModalCloseButton />

					<Text fontWeight='500'>
						Connect your DocuSign account
					</Text>

					<Text mt={1}>
						Use your DocuSign account API key on Questbook.
					</Text>


					<FlushedInput
						w='100%'
						flexProps={{ w: '100%' }}
						mt={8}
						textAlign='left'
						placeholder='Enter your DocuSign API key'
						value={apiKey}
						onChange={
							(e) => {
								setApiKey(e.target.value)
							}
						}
					/>
					{
						!isAPIValid && apiKey.length > 0 && (
							<Text
								textAlign='center'
								mt={2}
								fontSize='14px'
								color='red.400'
							>
								Invalid API key
							</Text>
						)
					}


					<Text
						textAlign='center'
						mt={2}
						fontSize='14px'
						color='gray.400'
						cursor='pointer'
						onClick={() => window.open('https://app.hellosign.com/home/myAccount?current_tab=api', '_blank')}
					>
						Where do I find the API key?
					</Text>


					<Button
						w='70%'
						mt={8}
						variant='solid'
						isDisabled={apiKey.length === 0 || !isAPIValid}
						onClick={
							async() => {

								const data = await executeMutation(updateDocuSign, {
									id: workspace.id,
									docuSign: apiKey
								})
								if(data) {
									customToast({
										title: 'DocuSign account connected',
										status: 'success',
										duration: 5000,
									})
									setApiKey('')
									onClose()
								} else {
									customToast({
										title: 'Error connecting DocuSign account',
										status: 'error',
										duration: 5000,
									})
								}

							}
						}
					>
						Connect your DocuSign to Questbook
					</Button>


				</ModalContent>

			</Modal>
		)
	}


	const [apiKey, setApiKey] = useState<string>('')
	const [isAPIValid, setIsAPIValid] = useState<boolean>(true)
	const { workspace } = useContext(SettingsFormContext)!
	const customToast = useToast()

	const checkAPI = async(apiKey: string) => {
		try {
			logger.info({ apiKey }, 'DocuSignModal1')
			const response = await fetch(`https://${apiKey}:@api.hellosign.com/v3/template/list`)
			const data = await response.json()
			logger.info({ data }, 'DocuSignModal')
			if(data.templates) {
				setIsAPIValid(true)
				return true
			}

			setIsAPIValid(false)
			return false
		} catch(error) {
            logger.info('Error checking API key', error)
			setIsAPIValid(false)
			return false
		}
	}

	useEffect(() => {
		if(apiKey.length === 0 && apiKey.length < 64) {
			return
		}

		logger.info({ apiKey }, 'DocuSignModal')


		checkAPI(apiKey)
	}, [apiKey])


	return buildComponent()
}

export default DocuSignModal