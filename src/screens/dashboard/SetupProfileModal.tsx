import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useSetupProfile from 'src/libraries/hooks/useSetupProfile'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import { formatAddress, getExplorerUrlForTxHash } from 'src/libraries/utils/formatting'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import { useAccount, useSignMessage } from 'wagmi'

interface Props {
	walletAddress: string
	isOpen: boolean
	onClose: () => void
}

function SetupProfileModal({ walletAddress, isOpen, onClose }: Props) {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isOpen}
				size={isConnected ? '3xl' : 'lg'}
				onClose={onClose}
				isCentered
				scrollBehavior='outside'>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						{
							isConnected && (
								<Flex
									p={6}
									direction='column'
									align='center'
									w='100%'>
									<Text fontWeight='500'>
										Setup
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
							)
						}
						{
							!isConnected && (
								<Verify
									signerVerifiedState='unverified'
									setSignerVerifiedState={() => {}}
									shouldVerify={false} />
							)
						}
					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const { grant } = useContext(GrantsProgramContext)!
	const { scwAddress } = useContext(WebwalletContext)!
	const toast = useCustomToast()
	const router = useRouter()

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(grant?.workspace) ?? defaultChainId
	}, [grant])

	const [name, setName] = useState<string>('')
	const [email, setEmail] = useState<{data: string, state: 'loading' | 'loaded'}>({ data: '', state: 'loaded' })
	useEffect(() => {
		logger.info(email, 'UpdateProfileModal: email')
	}, [email])
	const [imageFile, setImageFile] = useState<{file: File | null, hash?: string}>({ file: null })

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number>()
	const [transactionHash, setTransactionHash] = useState<string>('')

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

	const { setupProfile } = useSetupProfile(
		{
			workspaceId: grant?.workspace?.id,
			memberId: `${grant?.workspace?.id}.${scwAddress}`,
			chainId,
			type: 'join-reviewer-guard',
			setNetworkTransactionModalStep,
			setTransactionHash,
		})

	const isDisabled = useMemo(() => {
		return name === '' || email.data === ''
	}, [name, email])

	const { address, isConnected } = useAccount()

	const { signMessageAsync } = useSignMessage()

	const onClick = async() => {
		if(isDisabled || networkTransactionModalStep !== undefined || !address) {
			return
		}

		const message = 'Verification message'
		const hashedMessage = ethers.utils.solidityKeccak256(['string'], [message])
		const signature = await signMessageAsync({ message: hashedMessage })
		if(!signature) {
			return
		}

		logger.info(signature, address)

		const res = await setupProfile({
			name,
			email: email.data,
			imageFile: imageFile.file,
			role: 1,
			signedMessage: signature,
			walletAddress,
		})

		logger.info({ res }, 'SetupProfileModal: setupProfile received')

		if(res) {
			onClose()
			router.reload()
		}
	}

	useEffect(() => {
		if(isConnected && walletAddress) {
			toast({
				title: `Verified owner of wallet ${formatAddress(walletAddress)}. Setup your profile to submit the review`,
				status: 'success',
				position: 'top'
			})
		}
	}, [isConnected])

	return buildComponent()
}

export default SetupProfileModal