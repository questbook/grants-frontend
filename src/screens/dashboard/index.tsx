import { ReactElement, useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Flex } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import logger from 'src/libraries/logger'
import LinkYourMultisigModal from 'src/libraries/ui/LinkYourMultisigModal'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import ThreeColumnSkeleton from 'src/screens/dashboard/_components/ThreeColumnSkeleton'
import { DynamicData } from 'src/screens/dashboard/_utils/types'
import ActionList from 'src/screens/dashboard/ActionList'
import Banner from 'src/screens/dashboard/Banner'
import Body from 'src/screens/dashboard/Body'
import { DashboardProvider, FundBuilderProvider, ModalContext, ModalProvider } from 'src/screens/dashboard/Context'
import FundBuilderDrawer from 'src/screens/dashboard/FundBuilderDrawer'
import FundBuilderModal from 'src/screens/dashboard/FundBuilderModal'
import FundingMethod from 'src/screens/dashboard/FundingMethod'
import ProposalList from 'src/screens/dashboard/ProposalList'
import SendAnUpdateModal from 'src/screens/dashboard/SendAnUpdateModal'

function Dashboard(props: DynamicData) {
	const { title, description } = props

	if(typeof window === 'undefined') {
		logger.info(title)
	}

	const buildComponent = () => (
		<Flex
			direction='column'
			w='100vw'
			h='calc(100vh - 64px)'>
			{/* {!isLoading && (role === 'admin' || role === 'reviewer') && <TopBar />} */}
			<NextSeo
				title={title}
				description={description} />
			{
				!isLoading && isMobile && (
					<>

						{
							grant?.id === '0x4494cf7375aa61c9a483259737c14b3dba6c04e6' && (
								<Banner
									message='The domain is closed until further notice as the funds have been fully allocated.'
								/>
							)
						}
						<Flex
							h={role === 'admin' || role === 'reviewer' ? 'calc(100vh - 64px)' : '100vh'}
							overflowY='clip'>
							{
								(dashboardStep === false) && (
									<ProposalList
										step={step}
										setStep={setStep} />
								)
							}
							{
								(dashboardStep === true) && (
									<>
										<Body />
									</>
								)
							}
						</Flex>
					</>
				)
			}
			{
				!isLoading && (isMobile === false) && (
					<>
						{
							grant?.id === '0x4494cf7375aa61c9a483259737c14b3dba6c04e6' && (
								<Banner
									message='The domain is closed until further notice as the funds have been fully allocated.'
								/>
							)
						}
						<Flex
							h={role === 'admin' || role === 'reviewer' ? 'calc(100vh - 64px)' : '100vh'}
							overflowY='clip'>
							<ProposalList />
							<Body />
							<ActionList />
						</Flex>
					</>
				)
			}

			{
				isLoading && (isMobile === false) && (
					<Flex h='100vh'>
						<ThreeColumnSkeleton />
					</Flex>
				)
			}

			{/* Modals */}
			<FundBuilderModal
				payWithSafe={payWithSafe}
			/>
			<SendAnUpdateModal />
			<LinkYourMultisigModal
				isOpen={isLinkYourMultisigModalOpen}
				onClose={
					() => {
						setIsLinkYourMultisigModalOpen(false)
					}
				} />

			{/* Drawers */}
			<FundingMethod
				isOpen={isFundingMethodModalOpen}
				onClose={
					() => {
						setIsFundingMethodModalOpen(false)
					}
				}
				setPayWithSafe={setPayWithSafe}
			/>
			<FundBuilderDrawer />
		</Flex>
	)

	const { isLinkYourMultisigModalOpen, setIsLinkYourMultisigModalOpen, isFundingMethodModalOpen, setIsFundingMethodModalOpen } = useContext(ModalContext)!
	const { role, isLoading, grant } = useContext(GrantsProgramContext)!
	const { dashboardStep, setDashboardStep } = useContext(WebwalletContext)!
	const [step, setStep] = useState(false)
	const [payWithSafe, setPayWithSafe] = useState <boolean> (true)

	const isMobile = useMediaQuery({ query: '(max-width:600px)' })

	useEffect(() => {
		logger.info({ isLoading }, 'Loading state changed')
	}, [isLoading])
	useEffect(() => {
		setDashboardStep(false)
	}, [])

	return buildComponent()
}

Dashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderNavbar
			dashboard={true}
			navbarConfig={
				{
					bg: 'gray.100',
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