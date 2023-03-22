import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useSetupProfile from 'src/libraries/hooks/useSetupProfile'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import { getExplorerUrlForTxHash } from 'src/libraries/utils/formatting'
import { usePiiForWorkspaceMember } from 'src/libraries/utils/pii'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'

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
										color='gray.600'>
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
										color='gray.600'>
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
										color='gray.600'>
										Email
									</Text>
									<FlushedInput
										placeholder={email.data === '' && email.state === 'loaded' ? 'name@sample.com' : 'Loading...'}
										value={email.data}
										isDisabled={email.state === 'loading'}
										onChange={(e) => setEmail({ data: e.target.value, state: 'loaded' })}
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
								isLoading={networkTransactionModalStep !== undefined}
								onClick={onClick}>
								<Text
									color='white'
									fontWeight='500'>
									Save
								</Text>
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const { grant } = useContext(GrantsProgramContext)!
	const { scwAddress } = useContext(WebwalletContext)!

	const member = useMemo(() => {
		return grant?.workspace?.members?.find((member) => member.actorId === scwAddress?.toLowerCase())
	}, [grant, scwAddress])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const toast = useCustomToast()

	const { decrypt } = usePiiForWorkspaceMember(grant?.workspace?.id, member?.id, member?.publicKey, chainId)

	const [name, setName] = useState<string>('')
	const [email, setEmail] = useState<{data: string, state: 'loading' | 'loaded'}>({ data: '', state: 'loaded' })
	useEffect(() => {
		logger.info(email, 'UpdateProfileModal: email')
	}, [email])
	const [imageFile, setImageFile] = useState<{file: File | null, hash?: string}>({ file: null })

	useEffect(() => {
		logger.info({ member }, 'UpdateProfileModal: member')
		if(member) {
			setName(member.fullName ?? '')
			setImageFile({ file: null, hash: member.profilePictureIpfsHash ?? undefined })
		}
	}, [member])

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>('')

	useEffect(() => {
		logger.info('UpdateProfileModal: decryption start')
		if(member?.pii) {
			setEmail({ data: '', state: 'loading' })
			decrypt({ pii: member?.pii }).then((res) => {
				logger.info({ res }, 'Decrypted PII')
				setEmail({ data: res?.email ?? '', state: 'loaded' })
			})
		} else {
			setEmail({ data: '', state: 'loaded' })
		}
	}, [member?.pii])

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
			workspaceId: grant?.workspace?.id,
			memberId: member?.id,
			chainId,
			type: 'update',
			setNetworkTransactionModalStep,
			setTransactionHash,
		})

	const isDisabled = useMemo(() => {
		return name === '' || email.data === '' || !isBiconomyInitialised
	}, [name, email, isBiconomyInitialised])

	const onClick = async() => {
		if(isDisabled || networkTransactionModalStep !== undefined) {
			return
		}

		await setupProfile({
			name,
			email: email.data,
			imageFile: imageFile.file,
			role: member?.accessLevel === 'reviewer' ? 1 : 0
		})
	}

	return buildComponent()
}

export default UpdateProfileModal