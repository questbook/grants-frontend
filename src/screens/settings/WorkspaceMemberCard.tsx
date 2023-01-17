import { Box, Flex, Image, Text } from '@chakra-ui/react'
import getAvatar from 'src/utils/avatarUtils'
import { truncateStringFromMiddle } from 'src/utils/formattingUtils'
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
						>
							Revoke Access
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Box>

	)
}

export default WorkspaceMemberCard