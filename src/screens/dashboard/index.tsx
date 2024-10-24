import { ReactElement, useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Flex } from '@chakra-ui/react'
import { SupportedPayouts } from '@questbook/supported-safes'
import { NextSeo } from 'next-seo'
import logger from 'src/libraries/logger'
import LinkYourMultisigModal from 'src/libraries/ui/LinkYourMultisigModal'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import HelloSignModal from 'src/screens/dashboard/_components/HelloSignModal'
import HeroBannerBox from 'src/screens/dashboard/_components/HeroBanner'
import ThreeColumnSkeleton from 'src/screens/dashboard/_components/ThreeColumnSkeleton'
import { formatAmount } from 'src/screens/dashboard/_utils/formatters'
import { DynamicData } from 'src/screens/dashboard/_utils/types'
import ActionList from 'src/screens/dashboard/ActionList'
import Banner from 'src/screens/dashboard/Banner'
import Body from 'src/screens/dashboard/Body'
import { DashboardContext, DashboardProvider, FundBuilderProvider, ModalContext, ModalProvider } from 'src/screens/dashboard/Context'
import FundBuilderDrawer from 'src/screens/dashboard/FundBuilderDrawer'
import FundBuilderModal from 'src/screens/dashboard/FundBuilderModal'
import FundingMethod from 'src/screens/dashboard/FundingMethod'
import ProposalList from 'src/screens/dashboard/ProposalList'
import SendAnUpdateModal from 'src/screens/dashboard/SendAnUpdateModal'
import { disabledGrants, NewGrants, subdomainProposals } from 'src/screens/proposal_form/_utils/constants'

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
			{
				glyph && (
					<HeroBannerBox
						title={grant?.title as string}
						programDetails={grant?.link as string}
						logoURL={grant?.workspace?.logoIpfsHash as string}
						grantTicketSize={`${grant?.reward?.committed} ${grant?.reward?.token?.label}` as string}
						reviewers={grant?.workspace?.members as []}
						proposalCount={grant?.numberOfApplications as number}
						proposalCountAccepted={grant?.numberOfApplicationsSelected as number}
						paidOut={formatAmount(fundsAllocated?.disbursed as number ?? 0, grant?.reward?.token?.label as string)}
						allocated={formatAmount(fundsAllocated?.allocated as number ?? 0, grant?.reward?.token?.label as string)}
						safeBalances={formatAmount(safeBalances as number ?? 0)}
					/>
				)
			}
			<NextSeo
				title={title}
				description={description} />
			{
				!isLoading && isMobile && (
					<>

						{
							!grant?.acceptingApplications || disabledGrants?.includes(grant?.id as string) && (
								<Banner
									message={NewGrants.includes(grant?.id as string) ? 'Coming Soon ! Stay tuned for updates' : 'This program is not accepting applications at the moment, please contact domain allocators for more details'}
								/>
							)
						}
						{
							(role === 'admin' || role === 'reviewer') && (subdomainProposals?.flatMap((s) => s.grants).includes(grant?.id as string)) && (
								<Banner
									message='Please visit the subdomain for funds disbursal'
									link={
										`https://${subdomainProposals?.filter(
											(s) => s.grants?.includes(grant?.id as string)
										)?.map((s => s.name))}.questbook.app/dashboard/?grantId=${grant?.id}&chainId=10&role=admin`
									}
									linkText='[View Subdomain]'
								/>
							)
						}
						<Flex
							h={role === 'admin' || role === 'reviewer' ? 'calc(100vh - 64px)' : '100vh'}
							overflowY='auto'>
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
							!grant?.acceptingApplications || disabledGrants?.includes(grant?.id as string) && (
								<Banner
									message={NewGrants.includes(grant?.id as string) ? 'Coming Soon ! Stay tuned for updates' : 'This program is not accepting applications at the moment, please contact domain allocators for more details'}
								/>
							)
						}
						{
							(role === 'admin' || role === 'reviewer') && (subdomainProposals?.flatMap((s) => s.grants).includes(grant?.id as string)) && (
								<Banner
									message='Please visit the subdomain for funds disbursal'
									link={
										`https://${subdomainProposals?.filter(
											(s) => s.grants?.includes(grant?.id as string)
										)?.map((s => s.name))}.questbook.app/dashboard/?grantId=${grant?.id}&chainId=10&role=admin`
									}
									linkText='[View Subdomain]'
								/>
							)
						}
						<Flex
							h={role === 'admin' || role === 'reviewer' ? 'calc(100vh - 64px)' : '100vh'}
							overflowY='auto'>
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
			<HelloSignModal
				isOpen={isHelloSignModalOpen}
				onClose={
					() => {
						setIsHelloSignModalOpen(false)
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

	const { isLinkYourMultisigModalOpen, setIsLinkYourMultisigModalOpen, isFundingMethodModalOpen, setIsFundingMethodModalOpen, isHelloSignModalOpen, setIsHelloSignModalOpen } = useContext(ModalContext)!
	const { role, isLoading, grant } = useContext(GrantsProgramContext)!
	const { fundsAllocated } = useContext(DashboardContext)!
	const { dashboardStep, setDashboardStep, glyph } = useContext(WebwalletContext)!
	const [step, setStep] = useState(false)
	const [payWithSafe, setPayWithSafe] = useState <boolean> (true)
	const [safeBalances, setSafeBalances] = useState <number> (0)

	const isMobile = useMediaQuery({ query: '(max-width:959px)' })

	useEffect(() => {
		if(!grant?.workspace?.safe?.address || !grant?.workspace?.safe?.chainId) {
			return
		}

		try {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
			new SupportedPayouts().getSafe(parseInt(grant.workspace?.safe?.chainId), grant.workspace.safe.address).getTokenAndbalance().then((result: any) => {
				logger.info({ result }, 'safe balance')
				if(result?.value) {
					const total = result.value.reduce((acc: number, cur: { usdValueAmount: number }) => acc + cur.usdValueAmount, 0)
					localStorage.setItem(`safeBalance-${grant?.workspace?.safe?.address}-${grant?.workspace?.safe?.chainId}`, total.toString())
					logger.info({ total }, 'balance total')
					setSafeBalances(total)
				}
			}).catch((e: Error) => {
				if(localStorage.getItem(`safeBalance-${grant?.workspace?.safe?.address}-${grant?.workspace?.safe?.chainId}`)) {
					setSafeBalances(parseFloat(localStorage.getItem(`safeBalance-${grant?.workspace?.safe?.address}-${grant?.workspace?.safe?.chainId}`)!))
				}

				logger.error(e, 'error fetching safe balance')
			})
		} catch(e) {
			setSafeBalances(0)
			logger.error(e, 'error fetching safe balance')
		}

	}, [grant?.workspace?.safe])


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