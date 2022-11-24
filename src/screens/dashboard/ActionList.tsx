// This renders the action-section, namely Reviews, Milestones and Payouts, that will show up as the third column

import { useContext, useMemo } from 'react'
import { Flex } from '@chakra-ui/react'
import Empty from 'src/screens/dashboard/_components/ActionList/Empty'
import MultiSelect from 'src/screens/dashboard/_components/ActionList/MultiSelect'
import SingleSelect from 'src/screens/dashboard/_components/ActionList/SingleSelect'
import { DashboardContext } from 'src/screens/dashboard/Context'

function ActionList() {
	const buildComponent = () => (
		<Flex
			w='25%'
			bg='white'
			direction='column'
			overflowY='auto'>
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