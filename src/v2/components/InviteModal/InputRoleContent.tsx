import { useState } from 'react'
import { Button, Divider, HStack, Image, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spacer, Text, useToast, VStack } from '@chakra-ui/react'
import { serialiseInviteInfoIntoUrl, useMakeInvite } from 'src/utils/invite'
import { getRoleTitle } from 'src/v2/components/AcceptInviteModal/RoleDataDisplay'
import RoleSelect from 'src/v2/components/InviteModal/RoleSelect'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

export type InputRoleContentProps = {
	onLinkCreated: (link: string) => void
	onClose: () => void
}

const InputRoleContent = ({ onLinkCreated, onClose }: InputRoleContentProps) => {
	const [selectedRole, setSelectedRole] = useState<number>()
	const [createLinkStep, setCreateLinkStep] = useState<number>()

	const toast = useToast()

	const { makeInvite, getMakeInviteGasEstimate } = useMakeInvite(selectedRole || 0)

	const createLink = async() => {
		setCreateLinkStep(0)

		try {
			const info = await makeInvite(
				() => setCreateLinkStep(1),
			)

			setCreateLinkStep(2)

			// artificial delay to show the final completion state
			await new Promise(resolve => setTimeout(resolve, 2500))

			const url = serialiseInviteInfoIntoUrl(info)
			onLinkCreated(url)
		} catch(error: any) {
			// // console.error('error ', error)
			toast({
				title: `Error in generating the invite: "${error.message}"`,
				status: 'error',
				isClosable: true
			})
		} finally {
			setCreateLinkStep(undefined)
		}
	}

	return (
		<>
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
					<HStack
						align='center'
						w='100%'>
						{/* <NetworkFeeEstimateView
							getEstimate={getMakeInviteGasEstimate} /> */}

						<Spacer />

						<Button
							variant='ghost'
							onClick={onClose}>
							Cancel
						</Button>

						<Button
							w='10rem'
							disabled={
								typeof selectedRole === 'undefined'
							|| typeof createLinkStep !== 'undefined'
							}
							onClick={createLink}
							colorScheme='brandv2'
							variant='primaryV2'>
							Create invite link
						</Button>
					</HStack>
				</ModalFooter>
			</ModalContent>

			<NetworkTransactionModal
				currentStepIndex={createLinkStep || 0}
				isOpen={typeof createLinkStep !== 'undefined'}
				subtitle='Creating invite link'
				description={
					<HStack w='100%'>
						<VStack
							// slightly lesser spacing between lines
							spacing='-0.2rem'
							align='left'>
							<Text
								fontWeight='bold'
								color='#3F8792'>
								Invite link for
							</Text>
							<Text color='#3F8792'>
								{getRoleTitle(selectedRole || 0)}
							</Text>
						</VStack>

						<Spacer />

						<Image src='/ui_icons/invite_link.svg' />
					</HStack>
				}
				steps={
					[
						'Sign transaction',
						'Wait for confirmation',
						'Invite link created on-chain'
					]
				}
			/>
		</>
	)
}

export default InputRoleContent