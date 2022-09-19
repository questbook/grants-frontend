import React, { useEffect } from 'react'
import { Divider, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { GetWorkspaceMembersQuery, useGetWorkspaceMembersQuery } from 'src/generated/graphql'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import { MinimalWorkspace } from 'src/types'
import logger from 'src/utils/logger'
import getTabFromPath from 'src/utils/tabUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import Domains from 'src/v2/components/Sidebar/Domains'
import SidebarItem from 'src/v2/components/Sidebar/SidebarItem'
import { TAB_INDEXES, useGetTabs } from 'src/v2/components/Sidebar/Tabs'

function Sidebar() {
	const [topTabs, bottomTabs] = useGetTabs()
	const { data: accountData } = useQuestbookAccount()
	const { network, switchNetwork } = useNetwork()
	const { workspace, setWorkspace } = React.useContext(ApiClientsContext)!

	const router = useRouter()

	const [tabSelected, setTabSelected] = React.useState<number>(TAB_INDEXES[getTabFromPath(router.pathname)])

	React.useEffect(() => {
		setTabSelected(TAB_INDEXES[getTabFromPath(router.pathname)])
	}, [router.pathname])

	const [workspaces, setWorkspaces] = React.useState<MinimalWorkspace[]>([])

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersQuery,
		options: {
			variables: {
				actorId: accountData?.address ?? '',
			}
		}
	})

	useEffect(() => {
		if(accountData?.address) {
			fetchMore({
				actorId: accountData?.address,
			}, true)
		}
	}, [accountData?.address])

	useEffect(() => {
		const workspaces: MinimalWorkspace[] = []
		results.forEach((result: GetWorkspaceMembersQuery | undefined) => {
			if(result !== undefined && (result?.workspaceMembers?.length || 0) > 0) {
				result.workspaceMembers?.forEach((workspaceMember) => {
					workspaces.push(workspaceMember?.workspace)
				})
			}
		})
		setWorkspaces(workspaces)

		if(workspaces.length > 0) {
			const savedWorkspaceData = localStorage.getItem('currentWorkspace')
			if(!savedWorkspaceData || savedWorkspaceData === 'undefined') {
				setWorkspace(workspaces[0])
			} else {
				const savedWorkspaceDataChain = savedWorkspaceData.split('-')[0]
				const savedWorkspaceDataId = savedWorkspaceData.split('-')[1]
				const i = workspaces.findIndex(
					(w) => w.id === savedWorkspaceDataId &&
	            w.supportedNetworks[0] === savedWorkspaceDataChain
				)
				setWorkspace(workspaces[i])
			}
		}
	}, [results])

	return (
		<Flex
			position='sticky'
			left={0}
			top={0}
			h='calc(100vh - 64px)'
			w='25vw'
			bg='white'
			direction='column'
			overflowY='auto'
			border='1px solid #E0E0EC'
		>
			{
				workspace?.id && accountData?.address && (
					<Domains
						workspaces={workspaces}
						onWorkspaceClick={
							(index, onComplete: () => void) => {
								setWorkspace(workspaces[index])
								router.push('/your_grants').then(onComplete)

								const workspaceChainID = getSupportedChainIdFromWorkspace(workspaces[index])
								if(network !== workspaceChainID) {
									logger.info('SWITCH NETWORK (sidebar.tsx 1): ', workspaceChainID)
									switchNetwork(workspaceChainID)
								}
							}
						}
					/>
				)
			}
			<Flex
				direction='column'
				align='stretch'
				my={2}
				mx={2}>
				{
					bottomTabs.map((tab,) => (
						<SidebarItem
							key={tab.id}
							index={tab.index}
							selected={tabSelected}
							id={tab.id}
							name={tab.name}
							onClick={
								() => {
									setTabSelected(tab.index)

									// @Dhairya: uncomment this when you want dashboards to be public
									// it will add chainid and daoid in url
									// if(tab.path === '/dashboard') {
									// 	if(!workspace) {
									// 		return
									// 	}

									// 	router.push({ pathname: tab.path, query: {
									// 		daoId: workspace.id,
									// 		chainId: getSupportedChainIdFromWorkspace(workspace)
									// 	} })

									// 	return
									// }

									router.push({ pathname: tab.path })

								}
							}
						/>
					))
				}
			</Flex>
			{
				workspaces.length > 0 && (
					<Divider variant='sidebar' />
				)
			}
			<Flex
				direction='column'
				align='stretch'
				my={2}
				mx={2}>
				{
					topTabs.map((tab,) => (
						<SidebarItem
							key={tab.id}
							index={tab.index}
							selected={tabSelected}
							id={tab.id}
							name={tab.name}
							onClick={
								() => {
									setTabSelected(tab.index)
									router.push({ pathname: tab.path })
								}
							}
						/>
					))
				}
			</Flex>
			<Divider
				variant='sidebar'
				mt={2} />
		</Flex>
	)
}

export default Sidebar
