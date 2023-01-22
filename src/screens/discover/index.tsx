import { ReactElement, useContext, useRef, useState } from 'react'
import { Box, Button, Center, Container, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Loader from 'src/components/ui/loader'
import SupportedChainId from 'src/generated/SupportedChainId'
import { DAOSearchContext } from 'src/hooks/DAOSearchContext'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import useUpdateDaoVisibility from 'src/hooks/useUpdateDaoVisibility'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import SearchField from 'src/libraries/ui/SearchField'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext' //TODO - move to /libraries/zero-wallet/context
import RFPGrid from 'src/screens/discover/_components/rfpGrid'
import { DiscoverContext, DiscoverProvider } from 'src/screens/discover/Context'
import HeroBanner from 'src/screens/discover/HeroBanner'
import StatsBanner from 'src/screens/discover/StatsBanner'
import { chainNames } from 'src/utils/chainNames'
import getErrorMessage from 'src/utils/errorUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

function Discover() {
	const router = useRouter()
	const { inviteInfo } = useContext(ApiClientsContext)!

	const buildComponent = () => {
		return inviteInfo ? inviteView() : normalView()
	}

	const normalView = () => {
		return (
			<>
				<Flex
					direction='column'
					w='100%'
				>
					<HeroBanner />
					<StatsBanner />

					<Container
						className='domainGrid'
						minWidth='100%'
						p={12}
						w='100%'>
						{
							isQbAdmin === undefined ? (
								<Center>
									<Loader />
								</Center>
							) : (
								<>
									<Box
										display={grantsForYou?.length ? '' : 'none'}
									>
										<Box my={4}>
											<Text
												fontWeight='500'
												fontSize='24px'
												lineHeight='32px'>
												For You
											</Text>
										</Box>
										<RFPGrid
											type='personal'
											grants={grantsForYou}
											unsavedDomainVisibleState={unsavedDomainState}
											onDaoVisibilityUpdate={onDaoVisibilityUpdate}
										/>

									</Box>

									<Flex
										ref={discoverRef}
										my={12}
										mb={4}>
										<Text
											fontWeight='500'
											fontSize='24px'
											lineHeight='32px'>
											Discover
										</Text>
										<SearchField
											bg='white'
											w='30%'
											inputGroupProps={{ ml: 4 }}
											placeholder='Enter Grant Program Name to search'
											value={searchString}
											onKeyDown={
												(e) => {
													if(e.key === 'Enter' && searchString !== undefined) {
														setSearch(searchString)
													}
												}
											}
											onChange={
												(e) => {
													setSearchString(e.target.value.trim())
												}
											} />

									</Flex>

									<RFPGrid
										type='all'
										unsavedDomainVisibleState={unsavedDomainState}
										onDaoVisibilityUpdate={onDaoVisibilityUpdate}
										grants={searchString === undefined || searchString === '' ? grantsForAll : grantsForAll?.filter(g => g.title.includes(searchString))} />
								</>
							)
						}
					</Container>
					{
						isQbAdmin && Object.keys(unsavedDomainState).length !== 0 && (
							<Box
								background='#f0f0f7'
								bottom={0}
								style={{ position: 'sticky' }}>
								<Flex
									px='25px'
									py='20px'
									alignItems='center'
									justifyContent='center'>
									You have made changes to your Discover page on Questbook.
									<Button
										onClick={
											async() => {
												try {
													await updateDaoVisibility(
														unsavedDomainState,
														setNetworkTransactionModalStep,
													)
												} catch(e) {
													setUnsavedDaosState({})
													setNetworkTransactionModalStep(undefined)
													const message = getErrorMessage(e as Error)
													toast({
														position: 'top',
														title: message,
														status: 'error',
													})
												}
											}
										}
										variant='primaryV2'
										disabled={!isBiconomyInitialised}
										mx='20px'>
										Save
									</Button>
									<Button
										bg='transparent'
										style={{ fontWeight: 'bold' }}
										onClick={() => setUnsavedDaosState({})}>
										Cancel
									</Button>
								</Flex>
							</Box>
						)
					}
				</Flex>
				{buildNetworkModal()}
				{/* <Tooltip label='Scroll to discover section'>
					<ArrowDownCircle
						position='absolute'
						left={4}
						bottom={4}
						boxSize='5%'
						cursor='pointer'
						onClick={
							() => {
								discoverRef?.current?.scrollIntoView({ behavior: 'smooth' })
							}
						}>
						Scroll to Discover
					</ArrowDownCircle>
				</Tooltip> */}
			</>
		)
	}

	const inviteView = () => {
		return (
			<Flex
				w='100%'
				h='100vh'
				direction='column'
				justify='center'
				align='center'
				bg='black.1'>
				<Text
					mt='auto'
					color='white'
					variant='v2_heading_1'>
					👋 gm, Welcome to Questbook!
				</Text>
				<Text
					mt={3}
					color='white'
					variant='v2_title'>
					You’re invited to
					{' '}
					{grantProgram?.title}
					{' '}
					as
					{' '}
					{inviteInfo?.role === 0 ? 'an admin' : 'a reviewer'}
					.
				</Text>
				{
					inviteInfo?.role === 1 && (
						<Text
							mt={8}
							color='white'
							variant='v2_title'>
							As a reviewer you can review grant proposals assigned to you, and communicate with builders to schedule interviews, and clarify your questions.
						</Text>
					)
				}
				<Button
					mt={12}
					variant='primaryLarge'
					isDisabled={grantProgram?.id === undefined}
					onClick={onGetStartedClick}>
					<Text color='white'>
						Get Started
					</Text>
				</Button>
				<Image
					mt='auto'
					src='/illustrations/Browsers.svg' />
			</Flex>
		)
	}

	const buildNetworkModal = () => {
		const chainsList = Object.keys(unsavedDomainState)

		const txSteps: string[] = []
		for(const chain of chainsList) {
			const chainName = chainNames.get(chain)!

			txSteps.push(`Initializing biconomy client for ${chainName}`)
			txSteps.push(`Signing transaction with in-app wallet on ${chainName}`)
			txSteps.push(`Waiting for transaction to complete on ${chainName}`)
			txSteps.push(`Indexing transaction on graph protocol for ${chainName}`)
			txSteps.push(`Changes updated on ${chainName}`)
		}

		const chainsLength = chainsList.length
		const daosLength = Object.values(unsavedDomainState)
			.map(e => Object.keys(e).length).reduce((a, b) => a + b, 0)
		const description = `Updating ${daosLength} dao${daosLength === 1 ? '\'' : ''}s${daosLength === 1 ? '' : '\''} visibility state across ${chainsLength} chain${chainsLength === 1 ? '' : 's'}!`

		return (
			<NetworkTransactionModal
				isOpen={networkTransactionModalStep !== undefined}
				subtitle='Submitting dao visibility changes'
				viewLink='.'
				showViewTransactionButton={false}
				description={description}
				currentStepIndex={networkTransactionModalStep || 0}
				steps={txSteps}
				onClose={router.reload} />
		)
	}

	const discoverRef = useRef<HTMLDivElement>(null)

	const { grantsForYou, grantsForAll, grantProgram, setSearch } = useContext(DiscoverContext)!
	const { isQbAdmin } = useContext(QBAdminsContext)!
	const { searchString, setSearchString } = useContext(DAOSearchContext)!

	const toast = useCustomToast()
	const { isBiconomyInitialised, updateDaoVisibility } = useUpdateDaoVisibility()

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number | undefined>()
	const [unsavedDomainState, setUnsavedDaosState] = useState<{ [_: number]: { [_: string]: boolean } }>({})

	const onDaoVisibilityUpdate = (daoId: string, chainId: SupportedChainId, visibleState: boolean) => {
		if(unsavedDomainState[chainId]) {
			if(unsavedDomainState[chainId][daoId] !== undefined) {
				delete unsavedDomainState[chainId][daoId]

				if(!Object.keys(unsavedDomainState[chainId]).length) {
					delete unsavedDomainState[chainId]
				}
			} else {
				unsavedDomainState[chainId][daoId] = visibleState
			}
		} else {
			unsavedDomainState[chainId] = {}
			unsavedDomainState[chainId][daoId] = visibleState
		}

		setUnsavedDaosState({ ...unsavedDomainState })
	}

	const onGetStartedClick = () => {
		if(!grantProgram?.id) {
			return
		}

		router.push({ pathname: '/setup_profile', query: { grantId: grantProgram.id } })
	}

	return buildComponent()
}

Discover.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderSidebar={false}
		>
			<DiscoverProvider>
				{page}
			</DiscoverProvider>
		</NavbarLayout>
	)
}

export default Discover
