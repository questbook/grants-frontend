import { Box, Flex } from '@chakra-ui/react'
import Discussions from 'src/screens/dashboard/_components/Body/SingleSelect/Discussions'
import Proposal from 'src/screens/dashboard/_components/Body/SingleSelect/Proposal'

function SingleSelect() {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				overflowY='auto'
				w='100%'
				h='100%'>
				<Proposal />
				<Discussions />
			</Flex>
		)
	}

	return buildComponent()
}

export default SingleSelect