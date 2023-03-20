import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import { Dot } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import { getAvatar } from 'src/libraries/utils'
import { formatAddress } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { WorkspaceMembers } from 'src/screens/settings/_utils/types'

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
			bg={member?.enabled ? 'white' : 'gray.100'}
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
							variant='title'
							fontWeight='500'>
							{member?.fullName}
						</Text>
						<Text
							bg='gray.300'
							color='black.300'
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
									variant='body'
									color='gray.500'>
									{member?.email}
								</Text>
							)
						}
						{member?.email && <Dot />}
						<Text
							variant='body'
							color='gray.500'
						>
							{formatAddress(member?.actorId)}
						</Text>
					</Flex>
					<Flex gap={2}>
						<Button
							variant='link'
							bg={member?.enabled ? 'white' : 'gray.100'}
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