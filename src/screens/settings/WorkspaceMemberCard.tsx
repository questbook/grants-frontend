import { Flex, Image, Text } from '@chakra-ui/react'
import getAvatar from 'src/utils/avatarUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

interface WorkspaceMemberCardProps {
    role: string
    email: string
    address: string
    name: string
    pfp: string
    // isOwner: boolean
}

function WorkspaceMemberCard({ role, email, address, name, pfp }: WorkspaceMemberCardProps) {

	return (
		<Flex gap={2}>
			<Image
				boxSize={9}
				src={getUrlForIPFSHash(pfp)}
				fallbackSrc={getAvatar(false, address)} />
			<Flex direction='column'>
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
						{address}
					</Text>
				</Flex>
				<Flex gap={2}>
					<Text variant='textButton'>
						Edit
					</Text>
					<Image src='/v2/icons/dot.svg' />
					<Text variant='textButton'>
						Revoke Access
					</Text>
				</Flex>
			</Flex>
		</Flex>
	)
}

export default WorkspaceMemberCard