// This renders the single proposal along with the Discussion section or the aggregated proposals, and shows up as the 2nd column

import { useContext } from 'react'
import { Flex } from '@chakra-ui/react'
import { DashboardContext } from 'src/screens/dashboard/Context'

function Body() {
	const buildComponent = () => (
		<Flex
			maxW='48%'
			bg='accent.columbia'>
			{selectedGrant?.applications?.length?.toString()}
		</Flex>
	)

	const { selectedGrant } = useContext(DashboardContext)!

	return buildComponent()
}

export default Body