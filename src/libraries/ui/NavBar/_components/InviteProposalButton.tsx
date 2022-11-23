import { Button, Image, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'

function InviteProposalButton() {
	const buildComponent = () => {
		return (
			<Button
				ml={3}
				variant='primaryMedium'
				py={1}
				px={2}
				leftIcon={
					<Image
						src='/v2/icons/add/white.svg'
						boxSize='20px' />
				}
				onClick={onClick}>
				<Text
					variant='body'
					color='white'>
					Invite Proposal
				</Text>
			</Button>
		)
	}

	const onClick = async() => {
		logger.info({}, 'InviteProposalButton clicked')
	}

	return buildComponent()
}

export default InviteProposalButton