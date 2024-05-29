import { useContext } from 'react'
import {
	Button,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Text,
	useToast,
} from '@chakra-ui/react'
import { GrantsProgramContext } from 'src/pages/_app'
import { FundBuilderContext } from 'src/screens/dashboard/Context'

interface Props {
    isOpen: boolean
    onClose: () => void
    setPayWithSafe: (payWithSafe: boolean) => void
}

function FundingMethod({
	isOpen,
	onClose,
	setPayWithSafe
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
						Fund Builder
					</Text>


					<Button
						mt={4}
						w='100%'
						variant='primaryLarge'
						onClick={
							() => {
								if(grant?.workspace?.safe) {
									setIsModalOpen(true)
								} else {
									toast({
										title: 'Please Link your multisig wallet',
										description: 'Connect your multisig wallet from the settings page',
										status: 'error',
										duration: 5000,
										isClosable: true
									})
								}

								setPayWithSafe(true)
								onClose()
							}
						}
					>
						{/* {isOwner ? 'Link Multisig' : 'Verify you are a signer'} */}
						Use a Multisig wallet
					</Button>

					<Button
						w='100%'
						variant='primaryLarge'
						onClick={
							() => {
								setIsModalOpen(true)
								setPayWithSafe(false)
								onClose()
							}
						}
					>
						{/* {isOwner ? 'Link Multisig' : 'Verify you are a signer'} */}
						Use OpenMask for TON blockchain
					</Button>


				</ModalContent>
			</Modal>
		)
	}

	const { grant } = useContext(GrantsProgramContext)!
	const toast = useToast()
	const { setIsModalOpen } = useContext(FundBuilderContext)!
	return buildComponent()
}

export default FundingMethod