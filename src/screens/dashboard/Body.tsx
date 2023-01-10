// This renders the single proposal along with the Discussion section or the aggregated proposals, and shows up as the 2nd column

import { useContext } from 'react'
import { Flex } from '@chakra-ui/react'
import Empty from 'src/screens/dashboard/_components/Body/Empty'
import MultiSelect from 'src/screens/dashboard/_components/Body/MultiSelect'
import SingleSelect from 'src/screens/dashboard/_components/Body/SingleSelect'
import { DashboardContext } from 'src/screens/dashboard/Context'

function Body() {
	const buildComponent = () => (
		<Flex
			mx='auto'
			w='48%'>
			{selectedProposals.size > 1 ? <MultiSelect /> : selectedProposals.size === 1 ? <SingleSelect /> : <Empty />}
		</Flex>
	)

	const { selectedProposals } = useContext(DashboardContext)!

	return buildComponent()
}

export default Body