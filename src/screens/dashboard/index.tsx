import { ReactElement } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import ActionList from 'src/screens/dashboard/ActionList'
import Body from 'src/screens/dashboard/Body'
import { DashboardProvider, FundBuilderProvider } from 'src/screens/dashboard/Context'
import FundBuilderDrawer from 'src/screens/dashboard/FundBuilderDrawer'
import FundBuilderModal from 'src/screens/dashboard/FundBuilderModal'
import ProposalList from 'src/screens/dashboard/ProposalList'
import TopBar from 'src/screens/dashboard/TopBar'

function Dashboard() {
	const buildComponent = () => (
		<Flex
			direction='column'
			w='100vw'
			h='calc(100vh - 64px)'>
			<TopBar />
			<Flex
				h='calc(100vh - 128px)'
				overflowY='clip'>
				<ProposalList />
				<Body />
				<ActionList />
			</Flex>

			{/* Modals */}
			<FundBuilderModal />

			{/* Drawers */}
			<FundBuilderDrawer />
		</Flex>
	)

	return buildComponent()
}

Dashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderSidebar={false}
			renderNavbar
			navbarConfig={
				{
					bg: 'gray.1',
					showLogo: false,
					showSearchBar: false,
					showInviteProposals: true,
					showAddMembers: true,
					showDomains: true,
					showStats: true
				}
			}>
			<DashboardProvider>
				<FundBuilderProvider>
					{page}
				</FundBuilderProvider>
			</DashboardProvider>
		</NavbarLayout>
	)
}

export default Dashboard