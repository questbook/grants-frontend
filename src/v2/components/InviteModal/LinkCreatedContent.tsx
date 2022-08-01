import { Button, Divider, HStack, Image, ModalBody, ModalCloseButton, ModalContent, ModalFooter, Spacer, Text, VStack } from '@chakra-ui/react'
import CopyButton from '../CopyButton'

type LinkCreatedContentProps = {
	link: string
	onClose: () => void
}

const LinkCreatedContent = ({ link, onClose }: LinkCreatedContentProps) => {
	return (
		<ModalContent>
			<ModalCloseButton />
			<ModalBody m='3'>
				<VStack spacing='4.5'>
					<VStack spacing='2.5'>
						<Image src='/ui_icons/invite_link_generated.svg' />
						<Text
							fontWeight='bold'
							fontSize='lg'>
							Invite Link Created
						</Text>
						<Text
							fontWeight='thin'
							fontSize='0.8rem'
							color='v2Grey'>
							The invite link is unique and can only be used once.
						</Text>
					</VStack>

					<Text fontWeight='bold'>
						Share this only with the member.
					</Text>

					<VStack w='100%'>
						<HStack w='100%'>
							<Text
								isTruncated
								maxWidth='25rem'
								fontStyle='italic'
								fontWeight='light'>
								{link}
							</Text>

							<Spacer />

							<CopyButton text={link} />
						</HStack>
						<Divider />
					</VStack>
				</VStack>
			</ModalBody>

			<Divider />

			<ModalFooter
				alignItems='center'
				justifyContent='center'>
				<Button
					variant='ghost'
					color='v2Grey'
					onClick={onClose}>
						I will share it later
				</Button>
			</ModalFooter>
		</ModalContent>
	)
}

export default LinkCreatedContent