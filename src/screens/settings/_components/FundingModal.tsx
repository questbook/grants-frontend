import { useContext } from 'react'
import {
	Button,
	Modal,
	ModalCloseButton,
	ModalContent,
	ModalOverlay,
	Text,
} from '@chakra-ui/react'
import { FundBuilderContext } from 'src/screens/dashboard/Context'

interface Props {
    isOpen: boolean
    onClose: () => void
    setPayWithSafe: (payWithSafe: boolean) => void
}

function FundingModal({
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
						w='100%'
						mt={4}
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
						Use Keplr Wallet for Axelar
					</Button>


				</ModalContent>
			</Modal>
		)
	}

	const { setIsModalOpen } = useContext(FundBuilderContext)!
	return buildComponent()
}

export default FundingModal
