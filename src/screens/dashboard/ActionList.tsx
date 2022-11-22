// This renders the action-section, namely Reviews, Milestones and Payouts, that will show up as the third column

import { useContext, useMemo } from 'react'
import { Flex } from '@chakra-ui/react'
import Empty from 'src/screens/dashboard/_components/ActionListItems/Empty'
import MultiSelect from 'src/screens/dashboard/_components/ActionListItems/MultiSelect'
import SingleSelect from 'src/screens/dashboard/_components/ActionListItems/SingleSelect'
import { DashboardContext } from 'src/screens/dashboard/Context'

function ActionList() {
	const buildComponent = () => (
		<Flex
			w='25%'
			bg='white'
			direction='column'>
			{selectedProposalCount > 1 ? <MultiSelect /> : selectedProposalCount === 1 ? <SingleSelect /> : <Empty />}
		</Flex>
	)

	const { selectedProposals } = useContext(DashboardContext)!
	const selectedProposalCount = useMemo(() => {
		return selectedProposals.filter((_) => _).length
	}, [selectedProposals])

	return buildComponent()
}

export default ActionList