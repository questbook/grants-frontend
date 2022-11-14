import { ReactElement } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import ActionList from 'src/screens/dashboard/ActionList'
import Body from 'src/screens/dashboard/Body'
import { DashboardProvider } from 'src/screens/dashboard/Context'
import ProposalList from 'src/screens/dashboard/ProposalList'
import TopBar from 'src/screens/dashboard/TopBar'

function Dashboard() {
	const buildComponent = () => (
		<Flex
			direction='column'
			w='100vw'
			h='calc(100vh - 64px)'>
			<TopBar />
			<Flex>
				<ProposalList />
				<Body />
				<ActionList />
			</Flex>
		</Flex>
	)

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