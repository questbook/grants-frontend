import { Button, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import logger from 'src/libraries/logger'

function InviteProposalButton() {
	const buildComponent = () => {
		return (
			<Button
				ml={3}
				variant='primaryMedium'
				py={1}
				px={2}
				onClick={onClick}>
				<Text
					variant='v2_body'
					color='white'
					fontWeight='500'
				>
					Run a grant program
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