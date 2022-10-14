import { useState } from 'react'
import { Button, Flex, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react'
import { WorkspaceMember } from 'src/generated/graphql'
import TextField from 'src/v2/components/InputFields/TextField'

export type Props = {
    member: Partial<WorkspaceMember>
	isOpen: boolean
    onSaveClick: (name: string) => void
	onClose: () => void
    isSaveEnabled: boolean
}

function EditMemberModal({ member, isOpen, onClose, onSaveClick, isSaveEnabled }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isCentered={true}
				isOpen={isOpen}
				size='xl'
				onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalHeader boxShadow='0px 2px 4px rgba(31, 31, 51, 0.08)'>
						<Flex>
							<Image
								src='/ui_icons/edit_member_header_icon.svg'
								boxSize='48px' />
							<Flex
								direction='column'
								ml={4}>
								<Text
									variant='v2_subheading'
									fontWeight='500'>
									Edit member details
								</Text>
								<Text
									fontWeight='400'
									variant='v2_body'
									color='black.3'>
									Edit the name of the member.
								</Text>
							</Flex>
						</Flex>
					</ModalHeader>
					<ModalBody>
						<TextField
							mt={6}
							label='Name'
							helperText='Others can identify this member better.'
							placeholder='Enter name'
							value={name}
							onChange={
								(e) => {
									setName(e.target.value)
								}
							} />

						<Flex
							mt={6}
							mb={4}>
							<Button
								onClick={onClose}
								ml='auto'
								variant='link'>
								<Text
									variant='v2_body'
									fontWeight='500'>
									Cancel
								</Text>
							</Button>
							<Button
								onClick={
									() => {
										onSaveClick(name)
									}
								}
								disabled={isSaveEnabled && (name === '' || name.trim() === member?.fullName)}
								variant='primaryV2'
								ml={4}>
								<Text
									variant='v2_body'
									fontWeight='500'
									color='white'>
									Save
								</Text>
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const [name, setName] = useState<string>(member?.fullName ?? '')

	return buildComponent()
}

export default EditMemberModal