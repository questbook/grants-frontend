import { useState } from 'react'
import { Modal, ModalOverlay } from '@chakra-ui/react'
import InputRoleContent from './InputRoleContent'
import LinkCreatedContent from './LinkCreatedContent'

export type InviteModalProps = {
	isOpen: boolean
	onClose: () => void
}

const InviteModal = ({ isOpen, onClose: _onClose }: InviteModalProps) => {
	const [link, setLink] = useState<string>()

	const onClose = () => {
		// Reset the link
		// so the next time the modal is opened
		// fresh link can be generated
		setLink(undefined)
		_onClose()
	}

	return (
		<Modal
			isCentered={true}
			isOpen={isOpen}
			size='xl'
			onClose={onClose}
		>
			<ModalOverlay />
			{
				!link
					? (
						<InputRoleContent
							onClose={onClose}
							onLinkCreated={setLink} />
					)
					: (
						<LinkCreatedContent
							link={link}
							onClose={onClose} />
					)
			}
		</Modal>
	)
}

export default InviteModal