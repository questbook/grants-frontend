import { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { Box, Button, Container, Flex, Image, Input, Skeleton, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import SupportedChainId from 'src/generated/SupportedChainId'
import { DAOSearchContext } from 'src/libraries/hooks/DAOSearchContext'
import { QBAdminsContext } from 'src/libraries/hooks/QBAdminsContext'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import useUpdateDaoVisibility from 'src/libraries/hooks/useUpdateDaoVisibility'
import logger from 'src/libraries/logger'
import ConfirmationModal from 'src/libraries/ui/ConfirmationModal'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import SearchField from 'src/libraries/ui/SearchField'
import { chainNames } from 'src/libraries/utils/constants'
import getErrorMessage from 'src/libraries/utils/error'
import { ApiClientsContext, SignInContext, SignInTitleContext, WebwalletContext } from 'src/pages/_app' //TODO - move to /libraries/zero-wallet/context
import BuildersModal from 'src/screens/discover/_components/BuilderModal'
import ProposalCard from 'src/screens/discover/_components/ProposalCard'
import RFPGrid from 'src/screens/discover/_components/rfpGrid'
import { DiscoverContext, DiscoverProvider } from 'src/screens/discover/Context'
import FeaturedSections from 'src/screens/discover/FeaturedSections'
import Footer from 'src/screens/discover/Footer'
import HeroBanner from 'src/screens/discover/HeroBanner'
import StatsBanner from 'src/screens/discover/StatsBanner'
import { Roles } from 'src/types'

function Discover() {
	const router = useRouter()
	const { inviteInfo } = useContext(ApiClientsContext)!
	const { webwallet, loadingScw } = useContext(WebwalletContext)!
	const { setSignInTitle } = useContext(SignInTitleContext)!
	const buildComponent = () => {
		return inviteInfo ? inviteView() : normalView
	}

	const inviteView = () => {
		return (
			<Flex
				w='100%'
				h='100vh'
				direction='column'
				justify='center'
				align='center'
				bg='black.100'>
				<Text
					mt='auto'
					color='white'
					variant='heading1'>
					👋 gm, You’ve been invited to Questbook!
				</Text>
				<Text
					mt={3}
					color='white'
					variant='title'>
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
							variant='title'>
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
						Join as
						{' '}
						{inviteInfo?.role === 0 ? 'an admin' : 'a reviewer'}
					</Text>
				</Button>
				<Image
					mt='auto'
					src='/Browser Mock.svg' />
			</Flex>
		)
	}

	const renderSectionUpdateModalBody = () => {
		return (
			<Flex
				direction='column'
				gap={4}
				w='100%'
			>
				<Input
					variant='flushed'
					placeholder='Enter Section Name'
					onChange={
						(e) => {
							setSectionName(e.target.value)
							// debugger
						}
					}
				/>
				<ImageUpload
					mt={6}
					imageFile={imageFile}
					setImageFile={setImageFile}
				/>
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

		// const chainsLength = chainsList.length
		// const daosLength = Object.values(unsavedDomainState)
		// 	.map(e => Object.keys(e).length).reduce((a, b) => a + b, 0)
		// const description = `Updating ${daosLength} dao${daosLength === 1 ? '\'' : ''}s${daosLength === 1 ? '' : '\''} visibility state across ${chainsLength} chain${chainsLength === 1 ? '' : 's'}!`

		return (
			<NetworkTransactionFlowStepperModal
				isOpen={networkTransactionModalStep !== undefined}
				viewTxnLink='.'
				showViewTransactionButton={false}
				currentStepIndex={networkTransactionModalStep || 0}
				customSteps={txSteps}
				onClose={router.reload}
			/>
		)
	}

	// const discoverRef = useRef<HTMLDivElement>(null)

	const { grantsForYou, grantsForAll, grantProgram, sectionGrants, recentProposals, isLoading, stats } = useContext(DiscoverContext)!
	const { isQbAdmin } = useContext(QBAdminsContext)!
	const { searchString } = useContext(DAOSearchContext)!
	const { setSignIn } = useContext(SignInContext)!

	const toast = useCustomToast()
	const { isBiconomyInitialised, updateDaoVisibility, updateSection } = useUpdateDaoVisibility()

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number | undefined>()
	const [unsavedDomainState, setUnsavedDaosState] = useState<{ [_: number]: { [_: string]: boolean } }>({})
	const [unsavedSectionGrants, setUnsavedSectionGrants] = useState<{ [_: number]: string[] }>({})

	const [changedVisibility, setChangedVisibility] = useState('none')

	const [addSectionModalOpen, setAddSectionModalOpen] = useState(false)
	const [networkTransactionModalOpen, setNetworkTransactionModalOpen] = useState(false)
	const [currentStepIndex, setCurrentStepIndex] = useState(-1)
	const [sectionName, setSectionName] = useState('')
	const [filterGrantName, setFilterGrantName] = useState('')

	const [imageFile, setImageFile] = useState<{ file: File | null, hash?: string }>({ file: null })

	const onDaoVisibilityUpdate = (daoId: string, chainId: SupportedChainId, visibleState: boolean) => {
		// check if any changes have been made for the chain id passed
		if(unsavedDomainState[chainId]) {
			// if yes, check if the dao id passed is present in the chain id
			if(unsavedDomainState[chainId][daoId] !== undefined) {
				// if yes, remove that dao id from the chain id because it must have gotten here
				// because of a change in visibility state to true
				delete unsavedDomainState[chainId][daoId]

				// if the chain id has no more dao ids, remove the chain id from the unsaved state
				if(!Object.keys(unsavedDomainState[chainId]).length) {
					delete unsavedDomainState[chainId]
				}
			} else { // if no, add the dao id to the chain id
				unsavedDomainState[chainId][daoId] = visibleState
			}
		} else { // if no, add the chain id and dao id to the unsaved state
			unsavedDomainState[chainId] = {}
			unsavedDomainState[chainId][daoId] = visibleState
		}

		if(!Object.keys(unsavedDomainState).length) {
			setChangedVisibility('none')
		} else {
			setChangedVisibility('toggle')
		}

		setUnsavedDaosState({ ...unsavedDomainState })
	}

	const onGrantsSectionUpdate = (chainId: SupportedChainId, grantId: string) => {
		logger.info('onGrantsSectionUpdate', unsavedSectionGrants, chainId, grantId)
		if(unsavedSectionGrants[chainId]) {
			if(unsavedSectionGrants[chainId].includes(grantId)) {
				unsavedSectionGrants[chainId] = unsavedSectionGrants[chainId].filter(e => e !== grantId)
			} else {
				unsavedSectionGrants[chainId].push(grantId)
			}
		} else {
			unsavedSectionGrants[chainId] = [grantId]
		}

		if(!Object.keys(unsavedSectionGrants).length) {
			setChangedVisibility('none')
		}

		logger.info('onGrantsSectionUpdate', unsavedSectionGrants)
		setUnsavedSectionGrants({ ...unsavedSectionGrants })
		setChangedVisibility('checkbox')
	}

	const isMobile = useMediaQuery({ query: '(max-width:600px)' })

	const normalView = useMemo(() => {
		const calculateLoadingHeight = () => {
			// if scw is done loading and there's still no webwallet
			// it means no loading section should be displayed (need to sign in)
			if(!loadingScw && !webwallet) {
			  return '0'
			// if we have a webwallet and section grants (but still no "For you" grants)
			// we show a small loading section
			} else if(sectionGrants?.length) {
			  return '70px'
			// if we're loading the scw or the webwallet but no section grants
			// we show a big loading section
			} else {
			  return '500px'
			}
		}

		return (
			<>
				<Flex
					bg='white'
					direction='column'
					w='100%'
				>
					<HeroBanner />

					<StatsBanner
						builders={stats?.builders}
						funds={stats?.funds}
						proposals={stats?.proposals}
					/>
					<FeaturedSections sections={sectionGrants ?? []} />
					<BuildersModal />

					<Container
						bg='white'
						className='domainGrid'
						minWidth='100%'
						p={4}
						w='100%'>
						<Text
							color='#07070C'
							fontSize='32px'
							lineHeight='41.6px'
							variant='heading3'
							fontWeight='700'
							mt={8}
							mb={8}
						>
							Explore Grants
						</Text>
						<SearchField
							bg='white'
							border='1px solid #E1DED9'
							w={isMobile ? '100%' : '70%'}
							// inputGroupProps={{ ml: 4 }}
							mb={6}
							placeholder='Enter Grant Program Name to search'
							value={filterGrantName}
							onKeyDown={
								(e) => {
									if(e.key === 'Enter' && filterGrantName !== undefined) {
										setFilterGrantName(filterGrantName)
									}
								}
							}
							onChange={
								(e) => {
									setFilterGrantName(e.target.value)
								}
							}
						/>

						<Flex
							w='100%'
							my={4}
							justify='space-between'>
							<Flex
								direction='column'
								w={isMobile ? '100%' : { sm: '50%', md: '60%', lg: '70%' }}>
								<Box
									mb={4}
									display={grantsForYou?.length ? '' : 'none'}>
									<Text
										fontWeight='500'
										fontSize='24px'
										lineHeight='32px'>
										For You
									</Text>
								</Box>
								{
									!isLoading ?
										(
											<>

												<RFPGrid
													type='personal'
													grants={grantsForYou}
													unsavedDomainVisibleState={unsavedDomainState}
													onDaoVisibilityUpdate={onDaoVisibilityUpdate}
													onSectionGrantsUpdate={onGrantsSectionUpdate}
													changedVisibilityState={changedVisibility}
													filter={filterGrantName}
												/>
											</>
										) : (
											<Skeleton
												width='100%'
												h={calculateLoadingHeight()}
												startColor='gray.300'
												endColor='gray.400'
											/>
										)
								}
								{/* </Box> */}
								<Box
									display={sectionGrants?.length ? '' : 'none'}
								>
									{
										(sectionGrants && sectionGrants?.length > 0) ? sectionGrants.map((section, index) => {
											logger.info('section', { section, sectionGrants })
											const sectionName = Object.keys(section)[0]
											const sectionLink = sectionName === 'Arbitrum' ? 'arbitrum' : sectionName === 'Compound' ? 'compoundgrants' : sectionName === 'Alchemix' ? 'alchemix' : false
											const grants = section[sectionName].grants.filter((grant) => grant.title.toLowerCase().includes(filterGrantName.trim().toLowerCase())).map(grant => ({ ...grant, role: 'community' as Roles }))
											return (
												<Box
													id={sectionName}
													my={6}
													key={index}
												>
													<Flex
														gap={3}
														mt={8}
														alignItems='center'
														mb={4}
													>
														<Text
															color='#07070C'
															fontWeight='700'
															fontSize='24px'
															lineHeight='31.2px'
															variant='subheading'
															onClick={() => sectionLink ? window.open(`https://${sectionLink}.questbook.app`, '_blank') : null}
															cursor={sectionLink ? 'pointer' : 'text'}
															_hover={{ color: sectionLink ? '#6A6A6D' : '' }}
														>
															{sectionName}
														</Text>
													</Flex>

													<RFPGrid
														type='all'
														grants={grants}
														unsavedDomainVisibleState={unsavedDomainState}
														onDaoVisibilityUpdate={onDaoVisibilityUpdate}
														onSectionGrantsUpdate={onGrantsSectionUpdate}
														changedVisibilityState={changedVisibility}
													/>
												</Box>
											)
										}) : null
									}
								</Box>
							</Flex>
							{
								!isMobile && (
									<Flex
										direction='column'
										w={{ sm: '48%', md: '38%', lg: '28%' }}
										gap={5}
										overflowY='auto'
										maxH='-webkit-max-content'>
										<Text
											fontWeight='500'
											variant='subheading'>
											Recently funded
										</Text>
										{
											recentProposals?.map((proposal, index) => {
												return (
													<ProposalCard
														key={index}
														proposal={proposal} />
												)
											})
										}
									</Flex>
								)
							}
						</Flex>


					</Container>
					<Footer />
					{
						isQbAdmin && (
							<>
								<Text
									fontWeight='500'
									fontSize='24px'
									lineHeight='32px'>
									Discover
								</Text>
								<RFPGrid
									type='all'
									unsavedDomainVisibleState={unsavedDomainState}
									onDaoVisibilityUpdate={onDaoVisibilityUpdate}
									onSectionGrantsUpdate={onGrantsSectionUpdate}
									grants={searchString === undefined || searchString === '' ? grantsForAll : grantsForAll?.filter(g => g.title.includes(searchString))}
									changedVisibilityState={changedVisibility}
									filter={filterGrantName}
								/>
							</>

						)
					}
					{
						isQbAdmin && (Object.keys(unsavedDomainState).length !== 0 || Object.keys(unsavedSectionGrants).length !== 0) && (
							<>
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
													if(changedVisibility === 'toggle') {
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
													} else if(changedVisibility === 'checkbox') {
														logger.info('Updating grants section')
														setAddSectionModalOpen(true)
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
											onClick={
												() => {
													setUnsavedDaosState({})
													setUnsavedSectionGrants({})
													setChangedVisibility('none')
												}
											}>
											Cancel
										</Button>
									</Flex>
								</Box>
							</>

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
	}, [grantsForYou, unsavedDomainState, unsavedSectionGrants, grantsForAll, sectionGrants, filterGrantName, isMobile, stats])

	useEffect(() => {
		if(!inviteInfo) {
			setSignInTitle('default')
			return
		}

		setTimeout(() => {
			setSignInTitle(inviteInfo?.role === 0 ? 'admin' : 'reviewer')
			setSignIn(true)
		}, 2000)

	}, [inviteInfo])

	useEffect(() => {
		logger.info('section update', unsavedSectionGrants)
	}, [unsavedSectionGrants])

	const onGetStartedClick = () => {
		if(!webwallet) {
			setSignInTitle(inviteInfo?.role === 0 ? 'admin' : 'reviewer')
			setSignIn(true)
			return
		}

		if(!grantProgram?.id) {
			return
		}

		router.push({ pathname: '/setup_profile', query: { grantId: grantProgram.id } })
	}

	return (
		<>
			<ConfirmationModal
				isOpen={addSectionModalOpen}
				onClose={() => setAddSectionModalOpen(false)}
				title='Add Section'
				subTitle=''
				actionText='Add Section'
				action={
					async() => {
						setNetworkTransactionModalOpen(true)
						try {
							updateSection(unsavedSectionGrants, sectionName, imageFile, setCurrentStepIndex)
						} catch(e) {
							setNetworkTransactionModalOpen(false)
							setCurrentStepIndex(-1)
							logger.info('Error in updating section', e)
						}

					}
				}
				onCancel={
					() => {
						setAddSectionModalOpen(false)
					}
				}
				modalBodyProps={renderSectionUpdateModalBody()}
			/>
			<NetworkTransactionFlowStepperModal
				isOpen={networkTransactionModalOpen}
				currentStepIndex={currentStepIndex}
				viewTxnLink='.'
				onClose={
					() => {
						setCurrentStepIndex(-1)
						router.reload()
					}
				}
			/>
			{buildComponent()}
		</>
	)
}

Discover.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
		>
			<DiscoverProvider>
				{page}
			</DiscoverProvider>
		</NavbarLayout>
	)
}

export default Discover