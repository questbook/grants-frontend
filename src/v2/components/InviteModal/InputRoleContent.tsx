import { useState } from 'react'
import { Button, Divider, HStack, Image, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner, Text, useToast, VStack } from '@chakra-ui/react'
import { serialiseInviteInfoIntoUrl, useMakeInvite } from 'src/utils/invite'
import RoleSelect from './RoleSelect'

export type InputRoleContentProps = {
	onLinkCreated: (link: string) => void
	onClose: () => void
}

const InputRoleContent = ({ onLinkCreated, onClose }: InputRoleContentProps) => {
	const [selectedRole, setSelectedRole] = useState<number>()
	const [creatingLink, setCreatingLink] = useState(false)

	const toast = useToast()

	const { makeInvite } = useMakeInvite(selectedRole || 0)

	const createLink = async() => {
		setCreatingLink(true)

		try {
			const info = await makeInvite()
			const url = serialiseInviteInfoIntoUrl(info)

			onLinkCreated(url)
		} catch(error: any) {
			console.error('error ', error)
			toast({
				title: `Error in generating the invite: "${error.message}"`,
				status: 'error',
				isClosable: true
			})
		} finally {
			setCreatingLink(false)
		}
	}

	return (
		<ModalContent>
			<ModalCloseButton />
			<ModalHeader>
				<HStack spacing='1rem'>
					<Image src='/ui_icons/invite_link.svg' />
					<VStack
						align='left'
						spacing='0'>
						<Text fontSize='xl'>
								Create Invite Link
						</Text>
						<Text
							color='v2Grey'
							fontWeight='light'
							fontSize='0.8rem'>
								An invite link will be created.
								Share it only with your domain member.
						</Text>
					</VStack>
				</HStack>
			</ModalHeader>
			<Divider />
			<ModalBody
				mt='3'
				mb='3'>
				<VStack
					align='left'
					spacing='0'>
					<Text
						fontSize='md'
						fontWeight='bold'>
							Role
					</Text>
					<Text
						color='v2Grey'
						fontWeight='light'
						fontSize='0.8rem'>
							Level of access the invited member will have to your domain
					</Text>
				</VStack>

				<RoleSelect
					selectedRole={selectedRole}
					setSelectedRole={setSelectedRole} />
			</ModalBody>

			<Divider />

			<ModalFooter>
				<HStack align='center'>
					<Button
						variant='ghost'
						onClick={onClose}>
							Cancel
					</Button>

					<Button
						w='10rem'
						disabled={typeof selectedRole === 'undefined' || creatingLink}
						onClick={createLink}
						colorScheme='brandv2'>
						{
							creatingLink
								? <Spinner />
								: 'Create invite link'
						}
					</Button>
				</HStack>
			</ModalFooter>
		</ModalContent>
	)
}

export default InputRoleContent