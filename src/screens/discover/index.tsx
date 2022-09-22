import { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Divider, Flex, HStack, Text, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { WebwalletContext } from 'pages/_app' //TODO - move to /libraries/zero-wallet/context
import { GetDaOsForExploreQuery, useGetDaOsForExploreQuery, Workspace_Filter as WorkspaceFilter, Workspace_OrderBy as WorkspaceOrderBy } from 'src/generated/graphql'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import AcceptInviteModal from 'src/screens/discover/_components/AcceptInviteModal'
import DaosGrid from 'src/screens/discover/_components/DaosGrid'
import { useMultichainDaosPaginatedQuery } from 'src/screens/discover/_hooks/useMultiChainPaginatedQuery'
import { extractInviteInfo, InviteInfo } from 'src/screens/discover/_utils/invite'
import { mergeSortedArrays } from 'src/screens/discover/_utils/mergeSortedArrays'

const PAGE_SIZE = 3

function Discover() {

	const buildComponent = () => (
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
						{t('/.section_1.title')}
					</Text>
				</Flex>

				<DaosGrid
					renderGetStarted
					workspaces={totalDaos} />

				<HStack
					align='center'
					justify='stretch'
					my='16px'
					maxWidth='1280px'>
					<Text
						fontSize='24px'
						fontWeight='700'>
						{t('/.section_2.title')}
					</Text>

					<Divider />
				</HStack>

				<DaosGrid
					renderGetStarted={false}
					workspaces={newDaos}
					hasMore={hasMoreNewDaos}
					fetchMore={() => fetchMoreNewDaos()} />
			</Container>
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


	const { scwAddress } = useContext(WebwalletContext)!

	const toast = useToast()
	const router = useRouter()

	const [inviteInfo, setInviteInfo] = useState<InviteInfo>()

	const { t } = useTranslation()

	const {
		results: newDaos,
		hasMore: hasMoreNewDaos,
		fetchMore: fetchMoreNewDaos,
	} = useMultiChainDaosForExplore(
		WorkspaceOrderBy.CreatedAtS,
		// eslint-disable-next-line camelcase
		{ totalGrantFundingCommittedUSD_gt: 0 }
	)

	const {
		results: popularDaos,
		fetchMore: fetchMorePopularDaos
	} = useMultiChainDaosForExplore(
		WorkspaceOrderBy.TotalGrantFundingDisbursedUsd,
		// eslint-disable-next-line camelcase
		{ totalGrantFundingDisbursedUSD_gte: 1000 },
	)

	const {
		results: myDaos,
		fetchMore: fetchMoreMyDaos
	} = useMultiChainDaosForExplore(
		WorkspaceOrderBy.TotalGrantFundingDisbursedUsd,
		{ members_: { actorId: scwAddress } },
	)

	const totalDaos = useMemo(() => [
		...(scwAddress ? myDaos : []),
		...popularDaos,
	], [myDaos, popularDaos])

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
		logger.info('fetching daos')
		fetchMoreNewDaos(true)
		fetchMorePopularDaos(true)
		if(scwAddress) {
			fetchMoreMyDaos(true)
		}
	}, [])

	useEffect(() => {
		if(scwAddress) {
			fetchMoreMyDaos(true)
		}
	}, [scwAddress])

	return buildComponent()
}

Discover.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

function useMultiChainDaosForExplore(
	orderBy: WorkspaceOrderBy,
	filter: WorkspaceFilter
) {
	return useMultichainDaosPaginatedQuery({
		useQuery: useGetDaOsForExploreQuery,
		pageSize: PAGE_SIZE,
		variables: { orderBy, filter },
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

			return final.filter((workspace) => {
				return !DAOS_TO_IGNORE.includes(workspace.id)
					&& workspace.supportedNetworks[0] !== 'chain_5'
			})
		}
	})
}

const DAOS_TO_IGNORE = [ '0xe9' ]

export default Discover