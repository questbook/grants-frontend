import { ReactElement, useContext } from 'react'
import { Flex } from '@chakra-ui/react'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import ThreeColumnSkeleton from 'src/libraries/ui/ThreeColumnSkeleton'
import { ApiClientsContext } from 'src/pages/_app'
import ActionList from 'src/screens/dashboard/ActionList'
import Body from 'src/screens/dashboard/Body'
import { DashboardContext, DashboardProvider, FundBuilderProvider, SendAnUpdateProvider } from 'src/screens/dashboard/Context'
import FundBuilderDrawer from 'src/screens/dashboard/FundBuilderDrawer'
import FundBuilderModal from 'src/screens/dashboard/FundBuilderModal'
import ProposalList from 'src/screens/dashboard/ProposalList'
import SendAnUpdateModal from 'src/screens/dashboard/SendAnUpdateModal'
import TopBar from 'src/screens/dashboard/TopBar'

function Dashboard() {
	const buildComponent = () => (
		<Flex
			direction='column'
			w='100vw'
			h='calc(100vh - 64px)'>
			{!isLoading && (role === 'admin' || role === 'reviewer') && <TopBar />}
			{
				!isLoading && (
					<Flex
						h={role === 'admin' || role === 'reviewer' ? 'calc(100vh - 128px)' : '100vh'}
						overflowY='clip'>
						<ProposalList />
						<Body />
						<ActionList />
					</Flex>
				)
			}

			{
				isLoading && (
					<Flex h='100vh'>
						<ThreeColumnSkeleton />
					</Flex>
				)
			}

			{/* Modals */}
			<FundBuilderModal />
			<SendAnUpdateModal />

			{/* Drawers */}
			<FundBuilderDrawer />
		</Flex>
	)

	const { role } = useContext(ApiClientsContext)!
	const { isLoading } = useContext(DashboardContext)!

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
					// showSubmitANewProposal: true,
					showInviteProposals: true,
					showAddMembers: true,
					showDomains: true,
					showStats: true
				}
			}>
			<DashboardProvider>
				<FundBuilderProvider>
					<SendAnUpdateProvider>
						{page}
					</SendAnUpdateProvider>
				</FundBuilderProvider>
			</DashboardProvider>
		</NavbarLayout>
	)
}

export default Dashboard