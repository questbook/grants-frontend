import { ReactElement, useContext, useEffect, useMemo, useState } from 'react'
import { Container, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router'
import { GetDaOsForExploreQuery, useGetDaOsForExploreQuery, Workspace_Filter as WorkspaceFilter, Workspace_OrderBy as WorkspaceOrderBy } from 'src/generated/graphql'
import logger from 'src/libraries/logger'
import NavbarLayout from 'src/libraries/ui/navbarLayout'
import { WebwalletContext } from 'src/pages/_app' //TODO - move to /libraries/zero-wallet/context
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
				my='16px'
				w='100%'>
				<DaosGrid
					renderGetStarted
					hasMore={hasMoreDaos}
					fetchMore={fetchMoreDaos}
					workspaces={totalDaos} />
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

	const {
		results: daos,
		hasMore: hasMoreDaos,
		fetchMore: fetchMoreDaos
	} = useMultiChainDaosForExplore()

	const {
		results: myDaos,
		fetchMore: fetchMoreMyDaos
	} = useMultiChainDaosForExplore(
		{ members_: { actorId: scwAddress } },
	)

	const totalDaos = useMemo(() => [
		...(scwAddress ? myDaos : []),
		...daos,
	], [myDaos, daos])

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
		fetchMoreDaos(true)
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
	filter?: WorkspaceFilter
) {
	const orderBy = WorkspaceOrderBy.TotalGrantFundingDisbursedUsd;

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
		}
	})
}

export default Discover
