// This renders the action-section, namely Reviews, Milestones and Payouts, that will show up as the third column

import { useContext, useMemo } from 'react'
import { Flex } from '@chakra-ui/react'
import MultiSelect from 'src/screens/dashboard/_components/ActionList/MultiSelect'
import SingleSelect from 'src/screens/dashboard/_components/ActionList/SingleSelect'
import { DashboardContext } from 'src/screens/dashboard/Context'

function ActionList() {
	const buildComponent = () => (
		<Flex
			w='25%'
			bg='white'
			direction='column'>
			{selectedProposalCount > 1 ? <MultiSelect /> : <SingleSelect /> }
		</Flex>
	)

	const { selectedProposals } = useContext(DashboardContext)!
	const selectedProposalCount = useMemo(() => {
		return selectedProposals.filter((_) => _).length
	}, [selectedProposals])

	return buildComponent()
}

export default ActionList