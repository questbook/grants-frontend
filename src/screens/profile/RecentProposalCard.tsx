import { Button, Divider, Flex, Image, Text } from '@chakra-ui/react'
import getAvatar from 'src/utils/avatarUtils'

interface RecentProposalCardProps {
    proposalTitle: string
    tldr: string
    applicantName: string
    updatedAt: string
}

function RecentProposalCard({ proposalTitle, tldr, applicantName, updatedAt }: RecentProposalCardProps) {
	return (
		<Flex
			direction='column'
			gap={4}
			width='100%'
		>
			<Text
				variant='v2_subheading'
				fontWeight='500'
			>
				{proposalTitle}
			</Text>
			<Text
				variant='v2_title'
				fontWeight='400'>
				{tldr}
			</Text>
			<Flex
				alignItems='center'
				gap={2}
				width='100%'
				justifyContent='space-between'
			>
				<Flex
					gap={2}
					alignItems='center'
				>
					<Image
						boxShadow='0px 4px 16px rgba(31, 31, 51, 0.15)'
						borderRadius='3xl'
						src={getAvatar(false, '')}
						boxSize='36px' />
					<Text
						variant='v2_title'
						fontWeight='500'
					>
						{applicantName}
					</Text>
					<Image src='/v2/icons/ellipse.svg' />
					<Text
						variant='v2_title'
						color='black.3'>
						Submitted On
						{' '}
						{updatedAt}
					</Text>
				</Flex>
				<Flex>
					<Button
						variant='secondaryV2'
						height={8}
						width='118px'
						borderRadius='2px'
						fontSize='14px'
						fontWeight='500'
					>
						View Proposal
					</Button>
				</Flex>

			</Flex>
			<Divider />
		</Flex>
	)
}

export default RecentProposalCard