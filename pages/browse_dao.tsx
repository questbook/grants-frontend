import { ReactElement, useEffect, useState } from 'react'
import { Box, Button, Container, Divider, Flex, HStack, Image, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from '@chakra-ui/react'
import { logger } from 'ethers'
import AllDaosGrid from 'src/components/browse_daos/all_daos'
import { GetDaOsForExploreQuery, useGetDaOsForExploreQuery, Workspace_Filter as WorkspaceFilter, Workspace_OrderBy as WorkspaceOrderBy } from 'src/generated/graphql'
import { useMultiChainPaginatedQuery } from 'src/hooks/useMultiChainPaginatedQuery'
import NavbarLayout from 'src/layout/navbarLayout'
import { extractInviteInfo, InviteInfo } from 'src/utils/invite'
import { mergeSortedArrays } from 'src/utils/mergeSortedArrays'
import AcceptInviteModal from 'src/v2/components/AcceptInviteModal'

const PAGE_SIZE = 20

/**
 * Ah the browse DAOs page.
 * We've two sections here:
 * 1. Popular DAOs (either sort by number of applicants or the max award size)
 * 2. New DAOs -- sorted by most recent grant posted
 * @returns
 */
function BrowseDao() {
	const toast = useToast()

	const [sort, setSort] = useState<SortingOption>(WorkspaceOrderBy.TotalGrantFundingDisbursedUsd)
	const [inviteInfo, setInviteInfo] = useState<InviteInfo>()

	const {
		combinedResults: newDaos,
		fetchMore: fetchMoreNewDaos
	} = useMultiChainDaosForExplore(WorkspaceOrderBy.CreatedAtS, { })

	const {
		combinedResults: popularDaos,
		fetchMore: fetchMorePopularDaos
	} = useMultiChainDaosForExplore(
		sort,
		SORTING_OPTIONS.find(s => s.id === sort)!.filter
	)

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
		fetchMorePopularDaos(true)
	}, [sort])

	useEffect(() => {
		fetchMoreNewDaos()
		fetchMorePopularDaos()
	}, [])

	return (
		<>
			<Container
				maxWidth='1280px'
				w='100%'>
				<Flex
					my='16px'
					maxWidth='1280px'>
					<Text
						fontSize='24px'
						fontWeight='700'>
						Popular
					</Text>
					<Box marginLeft='auto'>
						<Menu>
							<MenuButton
								as={Button}
								rightIcon={<Image src='/ui_icons/black_down.svg' />}>
								Sort by
							</MenuButton>
							<MenuList>
								{
									SORTING_OPTIONS.map(({ id, name }) => (
										<MenuItem
											key={id}
											onClick={() => setSort(id)}>
											<Flex>
												<Image
													src={
														sort === id
															? '/ui_icons/sorting_checked.svg'
															: '/ui_icons/sorting_unchecked.svg'
													} />
												<Text ml='10px'>
													{name}
												</Text>
											</Flex>
										</MenuItem>
									))
								}
							</MenuList>
						</Menu>
					</Box>
				</Flex>

				<AllDaosGrid
					renderGetStarted
					workspaces={popularDaos} />

				<HStack
					align='center'
					justify='stretch'
					my='16px'
					maxWidth='1280px'>
					<Text
						fontSize='24px'
						fontWeight='700'>
						New
					</Text>

					<Divider />
				</HStack>

				<AllDaosGrid
					renderGetStarted={false}
					workspaces={newDaos} />
			</Container>
			<AcceptInviteModal
				inviteInfo={inviteInfo}
				onClose={
					() => {
						setInviteInfo(undefined)
						window.history.pushState(undefined, '', '/')
					}
				} />
		</>
	)
}

BrowseDao.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

const SORTING_OPTIONS = [
	{
		id: WorkspaceOrderBy.TotalGrantFundingDisbursedUsd,
		name: 'Grant Rewards',
		// eslint-disable-next-line camelcase
		filter: { totalGrantFundingDisbursedUSD_gte: 1000 } as WorkspaceFilter,
	},
	{
		id: WorkspaceOrderBy.NumberOfApplications,
		name: 'Number of Applicants',
		// eslint-disable-next-line camelcase
		filter: { numberOfApplications_gte: 1 } as WorkspaceFilter,
	}
] as const

type SortingOption = typeof SORTING_OPTIONS[number]['id']

function useMultiChainDaosForExplore(
	orderBy: WorkspaceOrderBy,
	filter: WorkspaceFilter,
) {
	return useMultiChainPaginatedQuery({
		useQuery: useGetDaOsForExploreQuery,
		pageSize: PAGE_SIZE,
		variables: { orderBy, filter },
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

			return final.filter((workspace) => {
				return workspace.id !== '0xe9' && workspace.supportedNetworks[0] !== 'chain_5'
			})
		}
	})
}

export default BrowseDao