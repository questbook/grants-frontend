import { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Center, Container, Flex, Image, Text, ToastId, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Loader from 'src/components/ui/loader'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import { defaultChainId } from 'src/constants/chains'
import {
	GetAllGrantsForExploreQuery,
	GetAllGrantsForMemberQuery,
	GetDaOsForExploreQuery,
	useGetAllGrantsForBuilderQuery,
	useGetAllGrantsForExploreQuery,
	useGetAllGrantsForMemberQuery,
	useGetDaOsForExploreQuery,
	useGetGrantsProgramDetailsQuery,
	Workspace_Filter as WorkspaceFilter,
	Workspace_OrderBy as WorkspaceOrderBy,
} from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { DAOSearchContext } from 'src/hooks/DAOSearchContext'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import useUpdateDaoVisibility from 'src/hooks/useUpdateDaoVisibility'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { ApiClientsContext, WebwalletContext } from 'src/pages/_app' //TODO - move to /libraries/zero-wallet/context
import PersonalRFPGrid from 'src/screens/discover/_components/PersonalRFPGrid'
import AllRFPsGrid from 'src/screens/discover/_components/rfpGrid'
import RightArrowIcon from 'src/screens/discover/_components/RightArrowIcon'
import { useMultichainDaosPaginatedQuery } from 'src/screens/discover/_hooks/useMultiChainPaginatedQuery'
import { mergeSortedArrays } from 'src/screens/discover/_utils/mergeSortedArrays'
import { BuilderGrant, Grant, PersonalGrant } from 'src/screens/discover/_utils/types'
import { chainNames } from 'src/utils/chainNames'
import getErrorMessage from 'src/utils/errorUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

const PAGE_SIZE = 10

function Discover() {
	const router = useRouter()
	const { fromDashboard } = router.query
	const { isNewUser, role, setRole, possibleRoles, inviteInfo } = useContext(ApiClientsContext)!

	useEffect(() => {
		if(inviteInfo || fromDashboard === 'true') {
			return
		}

		logger.info({ isNewUser, role, possibleRoles }, '(Navigation) Is New User')
		if(!isNewUser && (possibleRoles.length > 1 || role !== 'community')) {
			if(role === 'community') {
				setRole(possibleRoles[1])
			}

			router.replace({ pathname: '/dashboard' })
		}
	}, [isNewUser, role, possibleRoles, inviteInfo, fromDashboard])

	const buildComponent = () => {
		return inviteInfo ? inviteView() : normalView()
	}

	const normalView = () => {
		return (
			<>
				<Flex
					direction='column'
					w='100%'>
					{/* Start Hero Container */}
					<Flex
						direction='row'
						w='100%'
						alignItems='stretch'
						alignContent='stretch'
						h='460px'>
						<Flex
							bgColor='black.1'
							padding={24}
							flexDirection='column'
							textColor='white'
							width='600px'>
							<Text
								fontWeight='500'
								fontSize='40px'
								lineHeight='48px'
								color='white'>
								Home for
								<Text
									fontWeight='500'
									fontSize='40px'
									lineHeight='48px'
									color='#FFE900'
									as='span'>
									{' '}
									high quality
									{' '}
								</Text>
								{' '}
								builders
							</Text>

							<Text
								mt={2}
								fontSize='16px'
								lineHeight='24px'
								fontWeight='400'
								color='white'>
								Invite proposals from builders. Review and fund proposals with milestones - all on chain.
							</Text>

							<Flex>
								<Button
									variant='primaryLarge'
									mt={8}
									rightIcon={<RightArrowIcon />}
									onClick={
										() => router.push({
											pathname: '/request_proposal',
										})
									}>
									Run a grant program
								</Button>
							</Flex>

						</Flex>
						<Flex
							bgColor='brand.green'
							flexGrow={1}
							justifyContent='center'>
							<Image
								mt={10}
								src='/illustrations/Browsers.svg' />
						</Flex>
					</Flex>
					{/* End Hero Container */}

					{/* Start Stats Banner */}
					<Flex
						bgColor='gray.2'
						padding={8}
						gap={4}
						justifyContent='space-evenly'>
						<Flex
							flexDirection='column'
							alignItems='center'>
							<Text
								fontWeight='500'
								fontSize='40px'
								lineHeight='48px'>
								20000+
							</Text>
							<Text
								fontWeight='500'
								fontSize='15px'
								lineHeight='22px'
								textTransform='uppercase'>
								Builders
							</Text>
						</Flex>
						<Flex
							flexDirection='column'
							alignItems='center'>
							<Text
								fontWeight='500'
								fontSize='40px'
								lineHeight='48px'>
								$2m+
							</Text>
							<Text
								fontWeight='500'
								fontSize='15px'
								lineHeight='22px'
								textTransform='uppercase'>
								Paid Out
							</Text>
						</Flex>
						<Flex
							flexDirection='column'
							alignItems='center'>
							<Text
								fontWeight='500'
								fontSize='40px'
								lineHeight='48px'>
								1000+
							</Text>
							<Text
								fontWeight='500'
								fontSize='15px'
								lineHeight='22px'
								textTransform='uppercase'>
								Proposals
							</Text>
						</Flex>
					</Flex>
					{/* End Stats Banner */}
					<Container
						className='domainGrid'
						minWidth='100%'
						p={12}
						ml={8}
						mr={8}
						w='100%'>
						{
							isQbAdmin === undefined ? (
								<Center>
									<Loader />
								</Center>
							) : (
								<>
									<Box my={4}>
										<Text
											fontWeight='500'
											fontSize='24px'
											lineHeight='32px'>
											For You
										</Text>
									</Box>
									<PersonalRFPGrid
										personalGrants={personalGrants!}
										builderGrants={builderGrants!}
										unsavedDomainVisibleState={unsavedDomainState}
										onDaoVisibilityUpdate={onDaoVisibilityUpdate}
										hasMore={hasMoreDaos}
										fetchMore={fetchMoreDaos}
										isAdmin={isQbAdmin}
									 />

									<Box my={4}>
										<Text
											fontWeight='500'
											fontSize='24px'
											lineHeight='32px'>
											Discover
										</Text>
									</Box>

									<AllRFPsGrid
										isAdmin={isQbAdmin}
										unsavedDomainVisibleState={unsavedDomainState}
										onDaoVisibilityUpdate={onDaoVisibilityUpdate}
										hasMore={hasMoreDaos}
										fetchMore={fetchMoreDaos}
										grants={grants!} />
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
													toastRef.current = toast({
														position: 'top',
														render: () => ErrorToast({
															content: message,
															close: () => {
																if(toastRef.current) {
																	toast.close(toastRef.current)
																}
															},
														}),
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
					{grantsProgramTitle}
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

	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number | undefined>()
	const [unsavedDomainState, setUnsavedDaosState] = useState<{ [_: number]: { [_: string]: boolean } }>({})

	const { scwAddress } = useContext(WebwalletContext)!

	const { isQbAdmin } = useContext(QBAdminsContext)!

	const { searchString } = useContext(DAOSearchContext)!
	const { fetchMore } = useMultiChainQuery({
		useQuery: useGetGrantsProgramDetailsQuery,
		options: {
			variables: {
				workspaceID: inviteInfo ? `0x${inviteInfo.workspaceId.toString(16)}` : ''
			}
		},
		chains: inviteInfo?.chainId ? [inviteInfo.chainId] : [defaultChainId]
	})

	const { fetchMore: fetchAllGrantProgram } = useMultiChainQuery({
		useQuery: useGetAllGrantsForExploreQuery,
		options: {},
	})

	const { fetchMore: fetchAllGrantsForMember } = useMultiChainQuery({
		useQuery: useGetAllGrantsForMemberQuery,
		options: {}
	})

	const { fetchMore: fetchAllGrantsForBuilder } = useMultiChainQuery({
		useQuery: useGetAllGrantsForBuilderQuery,
		options: {}
	})

	const [grantsProgramTitle, setGrantsProgramTitle] = useState<string>()

	const [first, setFirst] = useState(10)
	const [skip, setSkip] = useState(0)
	const [grants, setGrants] = useState<Grant[]>()
	const [personalGrants, setPersonalGrants] = useState<PersonalGrant[]>()
	const [builderGrants, setBuilderGrants] = useState<BuilderGrant[]>()

	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const { isBiconomyInitialised, updateDaoVisibility } = useUpdateDaoVisibility()

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

	const getExploreDaosRequestFilters = (additionalFilters?: WorkspaceFilter) => {
		let filters: WorkspaceFilter = {}

		if(searchString) {
			// eslint-disable-next-line camelcase
			filters.title_contains_nocase = searchString
		}

		if(!isQbAdmin) {
			filters.isVisible = true
		}

		filters = {
			...filters,
			...additionalFilters,
		}

		return filters
	}

	const {
		results: daos,
		hasMore: hasMoreDaos,
		fetchMore: fetchMoreDaos,
	} = useMultiChainDaosForExplore(getExploreDaosRequestFilters())

	const {
		results: myDaos,
		fetchMore: fetchMoreMyDaos,
	} = useMultiChainDaosForExplore(
		getExploreDaosRequestFilters({
			members_: { actorId: scwAddress },
			isVisible: undefined,
		}),
	)

	const totalDaos = useMemo(() => {
		let exploreDaos = [...(daos ?? [])]

		// removing myDaos from explore daos
		exploreDaos = exploreDaos.filter((exploreDao) => {
			const filtered = myDaos.filter(e => e.id === exploreDao.id)
			return !filtered.length
		})

		return [
			...(scwAddress ? myDaos : []),
			...exploreDaos,
		]
	}, [daos, myDaos])

	useEffect(() => {
		(async() => {
			if(isQbAdmin === undefined) {
				return
			}

			fetchMoreDaos(true)
			if(scwAddress) {
				fetchMoreMyDaos(true)
			}
		})()
	}, [scwAddress, isQbAdmin, searchString])

	const fetchDetails = useCallback(async() => {
		if(!inviteInfo?.workspaceId || !inviteInfo?.chainId) {
			return
		}

		logger.info({ inviteInfo }, 'Invite Info')

		const workspaceID = `0x${inviteInfo.workspaceId.toString(16)}`
		logger.info({ workspaceID }, 'Workspace ID')
		const results = await fetchMore({ workspaceID }, true)
		logger.info({ results }, 'Results')

		if(!results?.length) {
			return
		}

		logger.info({ grantsProgram: results[0] }, 'Results')
		setGrantsProgramTitle(results[0]?.grantsProgram?.title)
	}, [inviteInfo])

	const fetchAllGrantProgramForExplore = useCallback(async() => {
		const response = (await fetchAllGrantProgram({
			first: first,
			skip: skip,
		})).filter(e => e !== undefined)


		logger.info('Grant program fetched', response)
		// return workspace
		const allFetchedGrants: GetAllGrantsForExploreQuery['grants'] = []

		for(const res of response) {
			if(!res) {
				continue
			}

			const grants = res.grants
			// const mergedArray = mergeSortedArrays(allFetchedGrants, grants, (a, b) => {
			// 	return b.deadlineS > a.deadlineS
			// })
			allFetchedGrants.push(...grants)
		}

		logger.info('all fetched grants', allFetchedGrants)
		setGrants(allFetchedGrants)
	}, [first, skip])

	const fetchAllGrantsForMemberExplore = useCallback(async() => {
		const response = await fetchAllGrantsForMember({
			memberId: scwAddress
		})
		const allFetchedGrants: GetAllGrantsForMemberQuery['grants'] = []
		for(const res of response) {
			if(!res) {
				continue
			}

			const grants = res.grants
			// const mergedArray = mergeSortedArrays(allFetchedGrants, grants, (a, b) => {
			// 	return a.createdAtS > b.createdAtS
			// })
			// logger.info('merged array', mergedArray, grants.length)
			allFetchedGrants.push(...grants)
		}

		setPersonalGrants(allFetchedGrants)

	}, [first, skip, isBiconomyInitialised, scwAddress])

	const fetchAllGrantsForBuilderExplore = useCallback(async() => {
		const response = await fetchAllGrantsForBuilder({
			applicantId: scwAddress
		})

		const allFetchedGrants: GetAllGrantsForMemberQuery['grants'] = []
		for(const res of response) {
			if(!res) {
				continue
			}

			const grants = res.grants
			// const mergedArray = mergeSortedArrays(allFetchedGrants, grants, (a, b) => {
			// 	return a.createdAtS > b.createdAtS
			// })
			// logger.info('merged array', mergedArray, grants.length)
			allFetchedGrants.push(...grants)
		}

		setBuilderGrants(allFetchedGrants)

	}, [first, skip, isBiconomyInitialised, scwAddress])


	useEffect(() => {
		fetchDetails()
	}, [inviteInfo])

	useEffect(() => {
		fetchAllGrantProgramForExplore()
		fetchAllGrantsForMemberExplore()
		fetchAllGrantsForBuilderExplore()
	}, [first, skip, isBiconomyInitialised, scwAddress])

	const onGetStartedClick = () => {
		router.push({ pathname: '/setup_profile' })
	}

	return buildComponent()
}

Discover.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout
			renderSidebar={false}
		>
			{page}
		</NavbarLayout>
	)
}

function useMultiChainDaosForExplore(
	filter?: WorkspaceFilter,
) {
	const orderBy = WorkspaceOrderBy.TotalGrantFundingDisbursedUsd

	return useMultichainDaosPaginatedQuery({
		useQuery: useGetDaOsForExploreQuery,
		listGetter: (e) => e.workspaces,
		pageSize: PAGE_SIZE,
		variables: { orderBy, filter: filter ?? {} },
		mergeResults(results) {
			let final: GetDaOsForExploreQuery['workspaces'] = []
			for(const { workspaces } of results) {
				logger.info({ workspaces }, 'Browse DAO Workspaces')
				final = mergeSortedArrays(final, workspaces, (a, b) => {
					// @ts-ignore
					// basically, we use the order key to fetch the sorting property
					// and sort the results
					return b[orderBy] < a[orderBy]
				})
			}

			return final
		},
	})
}

export default Discover
