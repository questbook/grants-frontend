import { useContext, useState } from 'react'
import {
	Button,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Select,
	Text,
	useToast,
} from '@chakra-ui/react'
import { logger } from 'ethers'
import { updateSynaps } from 'src/generated/mutation/updateSynaps'
import { executeMutation } from 'src/graphql/apollo'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { SettingsFormContext } from 'src/screens/settings/Context'

interface Props {
	isOpen: boolean
	onClose: () => void
}

function SynapsModel({
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
						Connect your Synaps account
					</Text>

					<Text mt={1}>
						Use your Synaps account API key on Questbook.
					</Text>


					<FlushedInput
						w='100%'
						flexProps={{ w: '100%' }}
						mt={8}
						textAlign='left'
						placeholder='Enter your Synaps API key'
						value={apiKey}
						onChange={
							(e) => {
								setApiKey(e.target.value)
							}
						}
					/>


					<Text
						textAlign='center'
						mt={2}
						fontSize='14px'
						color='gray.400'
						cursor='pointer'
						onClick={() => window.open('https://docs.synaps.io/quickstart#3-get-your-api-key', '_blank')}
					>
						Where do I find the API key?
					</Text>

					<Select
						mt={2}
						w='100%'
						placeholder='Select Verification type'
						variant='flushed'
						value={kycType}
						onChange={
							(e) => {
								setKycType(e.target.value as 'KYC' | 'KYB')
							}
						}
						defaultValue={kycType}
					>
						<option value='KYC'>
							KYC
						</option>
						<option value='KYB'>
							KYB
						</option>
					</Select>

					<Button
						w='70%'
						mt={8}
						variant='solid'
						isDisabled={apiKey.length === 0}
						onClick={
							async() => {
								const data = await executeMutation(updateSynaps, {
									id: workspace.id,
									synapsId: apiKey,
									type: kycType,
								})
								if(data) {
									customToast({
										title: 'Synaps account connected',
										status: 'success',
										duration: 5000,
									})
									setApiKey('')
									onClose()
								} else {
									customToast({
										title: 'Error connecting Synaps account',
										status: 'error',
										duration: 5000,
									})
								}

							}
						}
					>
						Connect your Synaps to Questbook
					</Button>


				</ModalContent>

			</Modal>
		)
	}


	const [apiKey, setApiKey] = useState<string>('')
	const [kycType, setKycType] = useState<'KYC' | 'KYB'>('KYC')
	const { workspace } = useContext(SettingsFormContext)!
	const customToast = useToast()
	logger.info({ workspace }, 'LinkYourSynapseModal')


	return buildComponent()
}

export default SynapsModel