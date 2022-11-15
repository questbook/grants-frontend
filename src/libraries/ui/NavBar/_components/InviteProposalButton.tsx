import { Button, Text } from '@chakra-ui/react'

function InviteProposalButton() {
	const buildComponent = () => {
		return (
			<Button variant='ghost'>
				<Text>
					Invite Proposal
				</Text>
			</Button>
		)
	}

	return buildComponent()
}

export default InviteProposalButton