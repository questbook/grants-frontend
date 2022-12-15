import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useSetupProfile from 'src/libraries/hooks/useSetupProfile'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import { usePiiForWorkspaceMember } from 'src/libraries/utils/pii'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app'
import { getExplorerUrlForTxHash } from 'src/utils/formattingUtils'

interface Props {
	isOpen: boolean
	onClose: () => void
}

function UpdateProfileModal({ isOpen, onClose }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isOpen}
				size='3xl'
				onClose={onClose}
				isCentered
				scrollBehavior='outside'>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							p={6}
							direction='column'
							align='center'
							w='100%'>
							<Text fontWeight='500'>
								{member?.fullName ? 'Update' : 'Setup'}
								{' '}
								Profile
							</Text>
							<ImageUpload
								mt={6}
								imageFile={imageFile}
								setImageFile={setImageFile} />
							<Flex
								mt={6}
								w='100%'
								direction='column'
								border='1px solid #E7E4DD'>
								<Flex
									p={4}
									w='100%'
									align='center'
									borderBottom='1px solid #E7E4DD'>
									<Text
										minW='20%'
										color='gray.6'>
										Name
									</Text>
									<FlushedInput
										placeholder='John Adams'
										value={name}
										onChange={(e) => setName(e.target.value)}
										fontSize='16px'
										fontWeight='400'
										lineHeight='20px'
										borderBottom={undefined}
										variant='unstyled'
										w='100%'
										textAlign='left'
										flexProps={
											{
												w: '100%',
											}
										} />
								</Flex>
								<Flex
									p={4}
									w='100%'
									align='center'
									borderBottom='1px solid #E7E4DD'>
									<Text
										minW='20%'
										color='gray.6'>
										In-app wallet
									</Text>
									<Text>
										{scwAddress}
									</Text>
								</Flex>
								<Flex
									p={4}
									w='100%'
									align='center'>
									<Text
										minW='20%'
										color='gray.6'>
										Email
									</Text>
									<FlushedInput
										placeholder='name@sample.com'
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										fontSize='16px'
										fontWeight='400'
										lineHeight='20px'
										borderBottom={undefined}
										variant='unstyled'
										w='100%'
										textAlign='left'
										flexProps={
											{
												w: '100%',
											}
										} />
								</Flex>
							</Flex>

							<Button
								mt={8}
								isDisabled={isDisabled}
								variant='primaryLarge'
								w='100%'
								onClick={onClick}>
								<Text
									color='white'
									fontWeight='500'>
									{networkTransactionModalStep === undefined ? 'Save' : `${TXN_STEPS[networkTransactionModalStep]}...`}
								</Text>
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const { workspace, chainId } = useContext(ApiClientsContext)!
	const { scwAddress } = useContext(WebwalletContext)!

	const member = useMemo(() => {
		return workspace?.members?.find((member) => member.actorId === scwAddress?.toLowerCase())
	}, [workspace, scwAddress])

	const toast = useCustomToast()

	const { decrypt } = usePiiForWorkspaceMember(workspace?.id, member?.id, member?.publicKey, chainId)

	const [name, setName] = useState<string>(member?.fullName ?? '')
	const [email, setEmail] = useState<string>('')
	const [imageFile, setImageFile] = useState<File | null>(null)

	const TXN_STEPS = ['Initiate transaction', 'Complete indexing', 'Complete transaction']
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>('')

	// TODO: Uncomment this once we have the PII decryption working upon subrgaph sync complete
	useEffect(() => {
		if(member?.pii) {
			decrypt({ pii: member?.pii }).then((res) => {
				setEmail(res?.email ?? '')
			})
		}
	}, [])

	useEffect(() => {
		if(transactionHash !== '') {
			toast({
				duration: 5000,
				title: 'Member details updated successfully',
				action: () => {
					window.open(getExplorerUrlForTxHash(chainId, transactionHash), '_blank')
				},
				actionText: 'Transaction Link',
				status: 'success'
			})
		}
	}, [transactionHash])

	const { setupProfile, isBiconomyInitialised } = useSetupProfile(
		{
			workspaceId: workspace?.id,
			memberId: member?.id,
			chainId,
			type: 'update',
			setNetworkTransactionModalStep,
			setTransactionHash,
		})

	const isDisabled = useMemo(() => {
		return name === '' || email === '' || !isBiconomyInitialised
	}, [name, email, isBiconomyInitialised])

	const onClick = async() => {
		if(isDisabled || networkTransactionModalStep !== undefined) {
			return
		}

		await setupProfile({
			name,
			email,
			imageFile, role: member?.accessLevel === 'reviewer' ? 1 : 0
		})
	}

	return buildComponent()
}

export default UpdateProfileModal