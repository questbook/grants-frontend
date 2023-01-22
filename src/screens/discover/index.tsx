import { ReactElement, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Center, Container, Flex, Image, Input, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Loader from 'src/components/ui/loader'
import SupportedChainId from 'src/generated/SupportedChainId'
import { DAOSearchContext } from 'src/hooks/DAOSearchContext'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import useUpdateDaoVisibility from 'src/hooks/useUpdateDaoVisibility'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import ConfirmationModal from 'src/libraries/ui/ConfirmationModal'
import ImageUpload from 'src/libraries/ui/ImageUpload'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import SearchField from 'src/libraries/ui/SearchField'
import { ApiClientsContext } from 'src/contexts/ApiClientsContext' //TODO - move to /libraries/zero-wallet/context
import RFPGrid from 'src/screens/discover/_components/rfpGrid'
import { DiscoverContext, DiscoverProvider } from 'src/screens/discover/Context'
import HeroBanner from 'src/screens/discover/HeroBanner'
import StatsBanner from 'src/screens/discover/StatsBanner'
import { Roles } from 'src/types'
import { chainNames } from 'src/utils/chainNames'
import getErrorMessage from 'src/utils/errorUtils'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

function Discover() {
	const router = useRouter()
	const { inviteInfo } = useContext(ApiClientsContext)!

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

	const { grantsForYou, grantsForAll, grantProgram, setSearch, sectionGrants } = useContext(DiscoverContext)!
	const { isQbAdmin } = useContext(QBAdminsContext)!
	const { searchString, setSearchString } = useContext(DAOSearchContext)!

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

	const [imageFile, setImageFile] = useState<{file: File | null, hash?: string}>({ file: null })

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

	const normalView = useMemo(() => {
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
						<SearchField
							bg='white'
							w='100%'
							// inputGroupProps={{ ml: 4 }}
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
							}
						/>

						{
							isQbAdmin === undefined ? (
								<Center>
									<Loader />
								</Center>
							) : (
								<>
									<Box
										display={sectionGrants?.length ? '' : 'none'}
									>

										{

											(sectionGrants && sectionGrants?.length > 0) ? sectionGrants.map((section, index) => {
												logger.info('section', { section, sectionGrants })
												const sectionName = Object.keys(section)[0]
												const sectionImage = section[sectionName].sectionLogoIpfsHash
												const grants = section[sectionName].grants.map(grant => ({ ...grant, role: 'community' as Roles }))
												return (
													<Box
														my={6}
														key={index}
													>
														<Flex
															gap={3}
															alignItems='center'
															mb={4}
														>
															<Image
																src={getUrlForIPFSHash(sectionImage)}
																boxSize={8} />
															<Text
																fontWeight='500'
																fontSize='24px'
																lineHeight='32px'
															>
																{sectionName}
															</Text>
															<Text
																fontSize='16px'
																color='gray.5'
																fontWeight='500'
																ml='-6px'
															>
																(
																{grants.length}
																)
															</Text>
														</Flex>

														<RFPGrid
															type='personal'
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
											onSectionGrantsUpdate={onGrantsSectionUpdate}
											changedVisibilityState={changedVisibility}
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
											}
										/>

									</Flex>

									<RFPGrid
										type='all'
										unsavedDomainVisibleState={unsavedDomainState}
										onDaoVisibilityUpdate={onDaoVisibilityUpdate}
										onSectionGrantsUpdate={onGrantsSectionUpdate}
										grants={searchString === undefined || searchString === '' ? grantsForAll : grantsForAll?.filter(g => g.title.includes(searchString))}
										changedVisibilityState={changedVisibility}
									 />
								</>
							)
						}
					</Container>
					{
						isQbAdmin && (Object.keys(unsavedDomainState).length !== 0 || Object.keys(unsavedSectionGrants).length !== 0) && (
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
	}, [grantsForYou, unsavedDomainState, unsavedSectionGrants, grantsForAll, sectionGrants])


	useEffect(() => {
		logger.info('section update', unsavedSectionGrants)
	}, [unsavedSectionGrants])

	const onGetStartedClick = () => {
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
			renderSidebar={false}
		>
			<DiscoverProvider>
				{page}
			</DiscoverProvider>
		</NavbarLayout>
	)
}

export default Discover
