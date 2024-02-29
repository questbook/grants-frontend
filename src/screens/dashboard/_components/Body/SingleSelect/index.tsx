import { Flex, useMediaQuery } from '@chakra-ui/react'
import Discussions from 'src/screens/dashboard/_components/Body/SingleSelect/Discussions'
import Proposal from 'src/screens/dashboard/_components/Body/SingleSelect/Proposal'
import ActionList from 'src/screens/dashboard/ActionList'

function SingleSelect() {
	const buildComponent = () => (
		<Flex
			direction='column'
			overflowY='auto'
			w='100%'>
			<Proposal />
			{
				isMobile[0] && (
					<ActionList />)
			}
			<Discussions />
		</Flex>
	)
	const isMobile = useMediaQuery(['(max-width:768px)'])

	return buildComponent()
}

export default SingleSelect