import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import { WorkspaceMembers } from 'src/screens/settings/_utils/types'
import getAvatar from 'src/utils/avatarUtils'
import { truncateStringFromMiddle } from 'src/utils/formattingUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

interface WorkspaceMemberCardProps {
    member: WorkspaceMembers[number]
	setOpenConfirmationModal: (openConfirmationModal: WorkspaceMembers[number]) => void
    // isOwner: boolean
}

function WorkspaceMemberCard({ member, setOpenConfirmationModal }: WorkspaceMemberCardProps) {
	const buildComponent = () => (
		<Box
			border='1px solid #E7E4DD'
			borderRadius='4px'
			bg={member?.enabled ? 'white' : 'gray.1'}
			p={4}
		>
			<Flex gap={2}>
				<Image
					borderRadius='full'
					boxSize={9}
					src={getUrlForIPFSHash(member.profilePictureIpfsHash!)}
					fallbackSrc={getAvatar(false, member?.actorId)} />
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
							{member?.fullName}
						</Text>
						<Text
							bg='gray.3'
							color='black.3'
							fontWeight='500'
							px={2}
							borderRadius='4px'
						>
							{member?.accessLevel}
						</Text>
					</Flex>
					<Flex gap={2}>
						{
							member?.email && (
								<Text
									variant='v2_body'
									color='gray.5'>
									{member?.email}
								</Text>
							)
						}
						{member?.email && <Image src='/v2/icons/dot.svg' />}
						<Text
							variant='v2_body'
							color='gray.5'
						>
							{truncateStringFromMiddle(member?.actorId)}
						</Text>
					</Flex>
					<Flex gap={2}>
						<Button
							variant='link'
							bg={member?.enabled ? 'white' : 'gray.1'}
							onClick={
								() => {
									setOpenConfirmationModal(member)
									logger.info('revoke clicked', member)
									// revokeAccess(address, 2, false)
								}
							}
						>
							{member?.enabled ? 'Revoke' : 'Restore'}
							{' '}
							Access
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)

	return buildComponent()
}

export default WorkspaceMemberCard