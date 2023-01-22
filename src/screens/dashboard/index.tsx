import { ReactElement, useContext, useEffect } from 'react'
import { Flex } from '@chakra-ui/react'
import { GrantProgramContext } from 'src/contexts/GrantProgramContext'
import logger from 'src/libraries/logger'
import LinkYourMultisigModal from 'src/libraries/ui/LinkYourMultisigModal'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import ThreeColumnSkeleton from 'src/libraries/ui/ThreeColumnSkeleton'
import ActionList from 'src/screens/dashboard/ActionList'
import Body from 'src/screens/dashboard/Body'
import { DashboardProvider, FundBuilderProvider, ModalContext, ModalProvider } from 'src/screens/dashboard/Context'
import FundBuilderDrawer from 'src/screens/dashboard/FundBuilderDrawer'
import FundBuilderModal from 'src/screens/dashboard/FundBuilderModal'
import ProposalList from 'src/screens/dashboard/ProposalList'
import SendAnUpdateModal from 'src/screens/dashboard/SendAnUpdateModal'

function Dashboard() {
	const buildComponent = () => (
		<Flex
			direction='column'
			w='100vw'
			h='calc(100vh - 64px)'>
			{/* {!isLoading && (role === 'admin' || role === 'reviewer') && <TopBar />} */}
			{
				!isLoading && (
					<Flex
						h={role === 'admin' || role === 'reviewer' ? 'calc(100vh - 64px)' : '100vh'}
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
			<LinkYourMultisigModal
				isOpen={isLinkYourMultisigModalOpen}
				onClose={
					() => {
						setIsLinkYourMultisigModalOpen(false)
					}
				} />

			{/* Drawers */}
			<FundBuilderDrawer />
		</Flex>
	)

	const { isLinkYourMultisigModalOpen, setIsLinkYourMultisigModalOpen } = useContext(ModalContext)!
	const { role, isLoading } = useContext(GrantProgramContext)!

	useEffect(() => {
		logger.info({ isLoading }, 'Loading state changed')
	}, [isLoading])

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
					<ModalProvider>
						{page}
					</ModalProvider>
				</FundBuilderProvider>
			</DashboardProvider>
		</NavbarLayout>
	)
}

export default Dashboard