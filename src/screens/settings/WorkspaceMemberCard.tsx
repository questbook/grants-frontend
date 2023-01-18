import { Box, Flex, Image, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import ConfimationModal from 'src/libraries/ui/ConfirmationModal'
import getAvatar from 'src/utils/avatarUtils'
import { truncateStringFromMiddle } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

interface WorkspaceMemberCardProps {
    role: string
    email: string
    address: string
    name: string
    pfp: string
	openConfirmationModal: boolean
	setOpenConfirmationModal: (openConfirmationModal: boolean) => void
	revokeAccess: (memberAddress: string, role: number, enable: boolean) => void
    // isOwner: boolean
}

function WorkspaceMemberCard({ role, email, address, name, pfp, openConfirmationModal, setOpenConfirmationModal, revokeAccess }: WorkspaceMemberCardProps) {

	return (
		<Box
			border='1px solid #E7E4DD;'
			p={4}
			// width='max-content'
		>
			<Flex gap={2}>
				<Image
					borderRadius='full'
					boxSize={9}
					src={getUrlForIPFSHash(pfp)}
					fallbackSrc={getAvatar(false, address)} />
				<Flex
					direction='column'
					gap={1}
				>
					<Flex
						gap={2}
						alignItems='center'>
						<Text
							variant='v2_title'
							fontWeight='500'>
							{name}
						</Text>
						<Text
							bg='gray.3'
							color='black.3'
							fontWeight='500'
							px={2}
							borderRadius='4px'
						>
							{role}
						</Text>
					</Flex>
					<Flex gap={2}>
						{
							email && (
								<Text
									variant='v2_body'
									color='gray.5'>
									{email}
								</Text>
							)
						}
						{email && <Image src='/v2/icons/dot.svg' />}
						<Text
							variant='v2_body'
							color='gray.5'
						>
							{truncateStringFromMiddle(address)}
						</Text>
					</Flex>
					<Flex gap={2}>
						{/* <Text variant='textButton'>
							Edit
						</Text>
						<Image src='/v2/icons/dot.svg' /> */}
						<Text
							variant='textButton'
							onClick={
								() => {
									setOpenConfirmationModal(true)
									logger.info('revoke clicked', address)
									// revokeAccess(address, 2, false)
								}
							}
						>
							Revoke Access
						</Text>
					</Flex>
				</Flex>
			</Flex>
			{
				openConfirmationModal && (
					<ConfimationModal
						isOpen={openConfirmationModal}
						onClose={() => setOpenConfirmationModal(false)}
						title='Revoke access for the member?'
						subTitle='Are you sure you want to remove the access for the member? This cannot be undone.'
						actionText='Revoke Access'
						action={
							() => {
								revokeAccess(address, 2, false)
								setOpenConfirmationModal(false)
							}
						}
						onCancel={() => setOpenConfirmationModal(false)}
						// modalBodyProps
					/>
				)
			}
		</Box>

	)
}

export default WorkspaceMemberCard