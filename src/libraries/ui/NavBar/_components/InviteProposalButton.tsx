import { Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Add } from 'src/generated/icons'
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
					<Add
						boxSize='20px'
						color='white' />
				}
				onClick={onClick}>
				<Text
					variant='v2_body'
					color='white'>
					Invite Proposal
				</Text>
			</Button>
		)
	}

	const router = useRouter()
	const onClick = async() => {
		logger.info({}, 'InviteProposalButton clicked')
		router.push({
			pathname: '/request_proposal',
		})
	}

	return buildComponent()
}

export default InviteProposalButton