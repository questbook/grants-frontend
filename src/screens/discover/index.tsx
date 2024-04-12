/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { EmailIcon } from '@chakra-ui/icons'
import { Box, Button, Container, Flex, Image, Input, Link, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import SubDomainConfig from 'src/constants/subdomain.json'
import { Telegram } from 'src/generated/icons'
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
import { getAvatar } from 'src/libraries/utils'
import { chainNames } from 'src/libraries/utils/constants'
import getErrorMessage from 'src/libraries/utils/error'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { ApiClientsContext, SignInContext, SignInTitleContext, WebwalletContext } from 'src/pages/_app' //TODO - move to /libraries/zero-wallet/context
import RFPGrid from 'src/screens/discover/_components/rfpGrid'
import { DiscoverContext, DiscoverProvider } from 'src/screens/discover/Context'
import HeroBanner from 'src/screens/discover/HeroBanner'
import { Roles } from 'src/types'

function Discover() {
	const router = useRouter()
	const { inviteInfo } = useContext(ApiClientsContext)!
	const { webwallet } = useContext(WebwalletContext)!
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
						() => {
							// setSectionName(e.target.value)
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

	const { grantsForYou, grantsForAll, grantProgram, sectionGrants, safeBalances, grantsAllocated } = useContext(DiscoverContext)!
	const { isQbAdmin } = useContext(QBAdminsContext)!
	const { searchString } = useContext(DAOSearchContext)!
	const { setSignIn } = useContext(SignInContext)!
	logger.info({ searchString }, 'dao')

	const toast = useCustomToast()
	const { isBiconomyInitialised, updateDaoVisibility, updateSection } = useUpdateDaoVisibility()

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number | undefined>()
	const [unsavedDomainState, setUnsavedDaosState] = useState<{ [_: number]: { [_: string]: boolean } }>({})
	const [unsavedSectionGrants, setUnsavedSectionGrants] = useState<{ [_: number]: string[] }>({})

	const [changedVisibility, setChangedVisibility] = useState('none')

	const [addSectionModalOpen, setAddSectionModalOpen] = useState(false)
	const [networkTransactionModalOpen, setNetworkTransactionModalOpen] = useState(false)
	const [currentStepIndex, setCurrentStepIndex] = useState(-1)
	const [sectionName] = useState('')
	const [filterGrantName] = useState('')

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
	const UserCard = ({ image, title, twitter, telegram }: {
		image: string
		title: string
		twitter?: string
		telegram?: string
	}) => (
		<Flex
			align='center'
			alignItems='center'
			px={3}
			gap={4}
			mb='6px'
		>
			<Flex
			>
				<Image
					borderWidth='1px'
					borderColor='black.100'
					hidden
					borderRadius='3xl'
					src={image ? getUrlForIPFSHash(image) : getAvatar(false, title)}
					boxSize='16px' />
				<Text
					fontWeight='500'
					fontSize='16px'
					variant='metadata'
					lineHeight='20px'
					color='#7E7E8F'

				>
					{title}
				</Text>
			</Flex>
			<Flex
				gap={2}
				mt={-1}
			>
				{
					telegram && (
						<motion.div
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
						>
							<Telegram
								cursor='pointer'
								_hover={{ color: 'blue.500' }}
								color='#7E7E8F'
								onClick={() => window.open(`https://t.me/${telegram}`)}
								boxSize='16px' />
						</motion.div>
					)
				}
				{
					twitter && (
						<motion.div
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
						>
							<EmailIcon
								cursor='pointer'
								color='#7E7E8F'
								_hover={{ color: 'blue.500' }}
								onClick={() => window.open(`mailto:${twitter}`)}
								boxSize='16px' />
						</motion.div>
					)
				}
			</Flex>

		</Flex>
	)
	const normalView = useMemo(() => {

		return (
			<>
				<Flex
					direction='column'
					w='100%'
				>
					<HeroBanner
						grants={(sectionGrants && sectionGrants.length > 0 ? sectionGrants : []) as []}

						safeBalances={Object.values(safeBalances).reduce((a, b) => a + b, 0) ?? 0}
						grantsAllocated={grantsAllocated ?? 0}
					/>
					<Container
						className='domainGrid'
						minWidth='100%'
						p={4}
						w='100%'
						bgColor='white'
					>


						<Flex
							w='100%'
							my={4}
							mt={isMobile ? '' : '12'}
							justify='space-between'
							direction={isMobile ? 'column' : 'row'}>

							<Flex
								direction='column'
								px={isMobile ? 0 : 4}
								w='100%'
							>


								{/* </Box> */}
								<Box
									display={sectionGrants?.length ? '' : 'none'}
								>
									<Flex
										justifyContent='space-between'
										alignItems='center'
										gap={2}
										w='100%'>
										<Text
											variant='heading3'
											fontWeight='700'
											w='100%'
											fontSize='24px'
											lineHeight='31.2px'
										>
											Domains
										</Text>

									</Flex>
									{
										(sectionGrants && sectionGrants?.length > 0) ? sectionGrants.map((section, index) => {
											const sectionName = Object.keys(section)[0]

											const grants = section[sectionName].grants.filter((grant) => grant.title.toLowerCase().includes(filterGrantName.trim().toLowerCase())).map(grant => ({ ...grant, role: 'community' as Roles }))
											return (
												<Flex
													my={6}
													key={index}
													w='100%'
													gap='46px'
													flexDirection={isMobile ? 'column' : 'row'}
												>

													<Flex flexGrow={1}>
														<RFPGrid
															type='all'
															grants={grants}
															unsavedDomainVisibleState={unsavedDomainState}
															onDaoVisibilityUpdate={onDaoVisibilityUpdate}
															onSectionGrantsUpdate={onGrantsSectionUpdate}
															changedVisibilityState={changedVisibility}
														/>
													</Flex>
													{

														(
															<Flex
																direction='column'
																w={isMobile ? 'auto' : '408px'}
																h='auto'
																gap={5}

															>
																<Box
																	w='100%'
																	background='white'
																	p='16px 16px 24px 16px'
																	h='100%'
																	// h='13'
																	position='relative'
																	borderRadius='8px'
																	border='1px solid #EFEEEB'
																>
																	{' '}
																	<Text
																		fontWeight='600'
																		lineHeight='23.4px'
																		fontSize='18px'
																		color='black.100'
																		px={3}
																	>
																		About
																	</Text>

																	<Text
																		fontSize='16px'
																		fontWeight='500'
																		lineHeight='20.16px'
																		py={1.5}
																		px={3}
																		textAlign='match-parent'
																		color='#7E7E8F'
																	>
																		{SubDomainConfig.info}
																	</Text>
																	<Box
																	>
																		{
																			SubDomainConfig.DA.map((user, index) => (
																				<UserCard
																					key={index}
																					image={user.image}
																					title={user.title}
																					twitter={user.twitter} />
																			))
																		}
																	</Box>
																</Box>

															</Flex>
														)
													}
												</Flex>
											)
										}) : null
									}
								</Box>
							</Flex>

						</Flex>
						<Flex
							flexDirection='column'
							w='100%'
							mt={48}
							align='center'
							justify='center'>
							<Link
								textAlign='center'
								isExternal
								variant='body'
								color='accent.azure'
								href='https://questbook.app/termsofservice.html'>
								Questbook - Terms of Service
							</Link>
							<Link
								textAlign='center'
								isExternal
								variant='body'
								color='accent.azure'
								href='questbook.app/privacypolicy.html'>
								Privacy Policy
							</Link>
						</Flex>

					</Container>
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
	}, [grantsForYou, unsavedDomainState, unsavedSectionGrants, grantsForAll, sectionGrants, filterGrantName, isMobile, safeBalances])

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