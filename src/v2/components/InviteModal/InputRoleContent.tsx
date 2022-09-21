import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Divider, HStack, Image, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spacer, Text, useToast, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'
import { serialiseInviteInfoIntoUrl, useMakeInvite } from 'screens/_utils/invite'
import { getRoleTitle } from 'src/v2/components/AcceptInviteModal/RoleDataDisplay'
import RoleSelect from 'src/v2/components/InviteModal/RoleSelect'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

export type InputRoleContentProps = {
	onLinkCreated: (link: string) => void
	onClose: () => void
}

const InputRoleContent = ({ onLinkCreated, onClose }: InputRoleContentProps) => {
	const { activeChain } = useNetwork()
	const router = useRouter()
	const [selectedRole, setSelectedRole] = useState<number>()
	const [createLinkStep, setCreateLinkStep] = useState<number>()

	const toast = useToast()

	const { makeInvite, isBiconomyInitialised } = useMakeInvite(selectedRole || 0)

	const [transactionHash, setTransactionHash] = useState<string>()
	const { t } = useTranslation()
	useEffect(() => {
		if(router.query.tab === 'members') {
			setSelectedRole(0x1)
		}
	}, [])

	const createLink = async() => {
		setCreateLinkStep(0)

		try {
			const info = await makeInvite(
				() => setCreateLinkStep(1),
				setTransactionHash,
			)

			setCreateLinkStep(2)

			// artificial delay to show the final completion state
			await new Promise(resolve => setTimeout(resolve, 2500))

			const url = serialiseInviteInfoIntoUrl(info)
			onLinkCreated(url)
		} catch(error) {
			// // console.error('error ', error)
			toast({
				title: `Error in generating the invite: "${(error as Error).message}"`,
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
								{t('/manage_dao.create_link')}
							</Text>
							<Text
								color='v2Grey'
								fontWeight='light'
								fontSize='0.8rem'>
								{t('/manage_dao.create_link_description')}
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
							{t('/manage_dao.role_info')}
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
							|| !isBiconomyInitialised
							}
							onClick={createLink}
							colorScheme='brandv2'
							variant='primaryV2'>
							{t('/manage_dao.create_link')}
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
						'Signing transaction with in-app wallet',
						'Wait for confirmation',
						'Invite link created on-chain'
					]
				}
				viewLink={getExplorerUrlForTxHash(activeChain, transactionHash)}
				onClose={
					() => {
						setCreateLinkStep(undefined)
					}
				}
			/>
		</>
	)
}

export default InputRoleContent
