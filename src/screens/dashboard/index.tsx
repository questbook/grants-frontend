import { ReactElement, useContext, useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext } from 'src/pages/_app'
import ActionList from 'src/screens/dashboard/ActionList'
import Body from 'src/screens/dashboard/Body'
import { DashboardProvider } from 'src/screens/dashboard/Context'
import ProposalList from 'src/screens/dashboard/ProposalList'
import TopBar from 'src/screens/dashboard/TopBar'

function Dashboard() {
	const buildComponent = () => (
		<Flex direction='column'>
			<TopBar />
			<Flex w='100%'>
				<ProposalList />
				<Body />
				<ActionList />
			</Flex>
		</Flex>
	)

	const { workspace } = useContext(ApiClientsContext)!
	useEffect(() => {
		logger.info({ workspace }, 'Main UI Workspace')
	}, [])

	return buildComponent()
}

Dashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout renderSidebar={false}>
			<DashboardProvider>
				{page}
			</DashboardProvider>
		</NavbarLayout>
	)
}

export default Dashboard