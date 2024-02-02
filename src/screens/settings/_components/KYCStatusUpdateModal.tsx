import { useContext, useState } from 'react'
import {
	Button,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Select,
	Text,
} from '@chakra-ui/react'
import { updateKYCStatusMutation } from 'src/generated/mutation'
import { executeMutation } from 'src/graphql/apollo'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import { SettingsFormContext } from 'src/screens/settings/Context'


interface Props {
	type: 'kyc' | 'hellosign'
	isOpen: boolean
	onClose: () => void
	grantId: string
}

function KYCStatusUpdateModal({
	isOpen,
	onClose,
	type,
	grantId
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
						Update
						{' '}
						{type === 'kyc' ? 'KYC' : 'Grant Agreement'}
						{' '}
						status
					</Text>


					<Select
						w='100%'
						mt={8}
						placeholder='Select a status'
						onChange={
							(e) => {
								setOptions(e.target.value as 'verified' | 'pending')
							}
						}
					>
						<option value='verified'>
							Verified
						</option>
						<option value='pending'>
							Pending
						</option>
					</Select>


					<Button
						w='70%'
						mt={8}
						variant='solid'
						onClick={
							async() => {
								const data = await executeMutation(updateKYCStatusMutation, {
									id: grantId,
									type: type === 'kyc' ? 'synaps' : 'hellosign',
									status: options,
									workspace: workspace?.id
								})
								if(data?.updateKYCStatus?.recordId) {
									customToast({
										title: 'Status updated',
										description: 'Status updated',
										status: 'success',
									})
									await refreshWorkspace(true)
								} else {
									customToast({
										title: 'Error updating status',
										description: 'Error updating status',
										status: 'error',
									})
								}

								onClose()
							}
						}
					>
						Update status
					</Button>


				</ModalContent>

			</Modal>
		)
	}


	const { refreshWorkspace, workspace } = useContext(SettingsFormContext)!

	const [options, setOptions] = useState<'verified' | 'pending'>('pending')
	const customToast = useCustomToast()

	return buildComponent()
}

export default KYCStatusUpdateModal