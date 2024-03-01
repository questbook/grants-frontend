// This renders the action-section, namely Reviews, Milestones and Payouts, that will show up as the third column

import { useContext } from 'react'
import { Flex } from '@chakra-ui/react'
import MultiSelect from 'src/screens/dashboard/_components/ActionList/MultiSelect'
import SingleSelect from 'src/screens/dashboard/_components/ActionList/SingleSelect'
import { DashboardContext } from 'src/screens/dashboard/Context'

function ActionList() {
	const buildComponent = () => (
		<Flex
			w={['100%', '100%', '100%', '25%']}
			bg='white'
			paddingBottom={['10px', '0px', '0px', '0px']}
			boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
			direction={['column', 'column', 'row', 'row']}
		>
			{selectedProposals.size > 1 ? <MultiSelect /> : <SingleSelect /> }
		</Flex>


	)

	const { selectedProposals } = useContext(DashboardContext)!

	return buildComponent()
}

export default ActionList