import { ReactElement, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Button, Center, Container, Flex, ToastId, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import Loader from 'src/components/ui/loader'
import ErrorToast from 'src/components/ui/toasts/errorToast'
import {
	GetDaOsForExploreQuery,
	useGetDaOsForExploreQuery,
	Workspace_Filter as WorkspaceFilter,
	Workspace_OrderBy as WorkspaceOrderBy,
} from 'src/generated/graphql'
import SupportedChainId from 'src/generated/SupportedChainId'
import { DAOSearchContext } from 'src/hooks/DAOSearchContext'
import { QBAdminsContext } from 'src/hooks/QBAdminsContext'
import useUpdateDaoVisibility from 'src/hooks/useUpdateDaoVisibility'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { WebwalletContext } from 'src/pages/_app' //TODO - move to /libraries/zero-wallet/context
import AcceptInviteModal from 'src/screens/discover/_components/AcceptInviteModal'
import DaosGrid from 'src/screens/discover/_components/DaosGrid'
import { useMultichainDaosPaginatedQuery } from 'src/screens/discover/_hooks/useMultiChainPaginatedQuery'
import { extractInviteInfo, InviteInfo } from 'src/screens/discover/_utils/invite'
import { mergeSortedArrays } from 'src/screens/discover/_utils/mergeSortedArrays'
import { chainNames } from 'src/utils/chainNames'
import getErrorMessage from 'src/utils/errorUtils'
import NetworkTransactionModal from 'src/v2/components/NetworkTransactionModal'

const PAGE_SIZE = 10

function Discover() {
	const buildComponent = () => {
		if(isQbAdmin === undefined) {
			return (
				<Center w='100%'>
					<Loader />
				</Center>
			)
		}

		return (
			<>
				<Flex
					direction='column'
					w='100%'>
					<Container
						maxWidth='1280px'
						my='16px'
						w='100%'>
						<DaosGrid
							renderGetStarted
							isAdmin={isQbAdmin}
							unsavedDaosVisibleState={unsavedDaosState}
							onDaoVisibilityUpdate={onDaoVisibilityUpdate}
							hasMore={hasMoreDaos}
							fetchMore={fetchMoreDaos}
							workspaces={totalDaos} />
					</Container>
					{
						isQbAdmin && Object.keys(unsavedDaosState).length !== 0 && (
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
												const chainsList = Object.keys(unsavedDaosState)

												const txSteps: string[] = []
												for(const chain of chainsList) {
													const chainName = chainNames.get(chain)!

													txSteps.push(`Initializing biconomy client for ${chainName}`)
													txSteps.push(`Signing transaction with in-app wallet on ${chainName}`)
													txSteps.push(`Waiting for transaction to complete on ${chainName}`)
													txSteps.push(`Indexing transaction on graph protocol for ${chainName}`)
													txSteps.push(`Changes updated on ${chainName}`)
												}

												setNetworkModalSteps(txSteps)

												try {
													await updateDaoVisibility(
														unsavedDaosState,
														setNetworkTransactionModalStep,
													)
												} catch(e) {
													setUnsavedDaosState({})
													setNetworkModalSteps(undefined)
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
				{networkModalSteps && buildNetworkModal()}
				<AcceptInviteModal
					inviteInfo={inviteInfo}
					onClose={
						() => {
							setInviteInfo(undefined)
							window.history.pushState(undefined, '', '/')
							router.reload()
						}
					} />
			</>
		)
	}

	const buildNetworkModal = () => {
		const chainsLength = Object.keys(unsavedDaosState).length

		if(!networkModalSteps || !chainsLength) {
			return
		}

		const daosLength = Object.values(unsavedDaosState)
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
				steps={networkModalSteps}
				onClose={router.reload} />
		)
	}

	const [inviteInfo, setInviteInfo] = useState<InviteInfo>()
	const [networkModalSteps, setNetworkModalSteps] = useState<Array<string>>()
	const [networkTransactionModalStep, setNetworkTransactionModalStep] = useState<number | undefined>()
	const [unsavedDaosState, setUnsavedDaosState] = useState<{ [_: number]: { [_: string]: boolean } }>({})

	const { scwAddress } = useContext(WebwalletContext)!

	const { isQbAdmin } = useContext(QBAdminsContext)!

	const { searchString } = useContext(DAOSearchContext)!

	const toastRef = useRef<ToastId>()
	const toast = useToast()

	const router = useRouter()

	const { isBiconomyInitialised, updateDaoVisibility } = useUpdateDaoVisibility()

	const onDaoVisibilityUpdate = (daoId: string, chainId: SupportedChainId, visibleState: boolean) => {
		if(unsavedDaosState[chainId]) {
			if(unsavedDaosState[chainId][daoId] !== undefined) {
				delete unsavedDaosState[chainId][daoId]

				if(!Object.keys(unsavedDaosState[chainId]).length) {
					delete unsavedDaosState[chainId]
				}
			} else {
				unsavedDaosState[chainId][daoId] = visibleState
			}
		} else {
			unsavedDaosState[chainId] = {}
			unsavedDaosState[chainId][daoId] = visibleState
		}

		setUnsavedDaosState({ ...unsavedDaosState })
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
		try {
			const inviteInfo = extractInviteInfo()
			if(inviteInfo) {
				setInviteInfo(inviteInfo)
			}
		} catch(error) {
			toast({
				title: `Invalid invite "${(error as Error).message}"`,
				status: 'error',
				duration: 9000,
				isClosable: true,
			})
		}
	}, [])

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

	return buildComponent()
}

Discover.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout renderSearchBar>
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
		pageSize: PAGE_SIZE,
		variables: { orderBy, filter: filter ?? {} },
		mergeResults(results) {
			let final: GetDaOsForExploreQuery['workspaces'] = []
			for(const { workspaces } of results) {
				// logger.info({ workspaces }, 'Browse DAO Workspaces')
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
