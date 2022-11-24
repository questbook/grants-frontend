import { Box, Flex } from '@chakra-ui/react'
import Discussions from 'src/screens/dashboard/_components/Body/SingleSelect/Discussions'
import Proposal from 'src/screens/dashboard/_components/Body/SingleSelect/Proposal'

function SingleSelect() {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				w='100%'>
				<Proposal />
				<Box mt={5} />
				<Discussions />
			</Flex>
		)
	}

	return buildComponent()
}

export default SingleSelect