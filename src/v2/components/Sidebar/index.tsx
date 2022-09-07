import React from 'react'
import { Divider, Flex, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import { useGetWorkspaceMembersLazyQuery } from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { MinimalWorkspace } from 'src/types'
import getTabFromPath from 'src/utils/tabUtils'
import Domains from 'src/v2/components/Sidebar/Domains'
import SidebarItem from 'src/v2/components/Sidebar/SidebarItem'
import { TAB_INDEXES, useGetTabs } from 'src/v2/components/Sidebar/Tabs'
import { useConnect } from 'wagmi'

function Sidebar() {
	const [topTabs, bottomTabs] = useGetTabs()
	const { data: accountData } = useQuestbookAccount()
	const { isConnected } = useConnect()
	const { workspace, setWorkspace, subgraphClients, connected } =
    React.useContext(ApiClientsContext)!

	const router = useRouter()
	const toast = useToast()

	const [tabSelected, setTabSelected] = React.useState<number>(TAB_INDEXES[getTabFromPath(router.pathname)])

	React.useEffect(() => {
		setTabSelected(TAB_INDEXES[getTabFromPath(router.pathname)])
	}, [router.pathname])

	const [workspaces, setWorkspaces] = React.useState<MinimalWorkspace[]>([])

	const getAllWorkspaces = Object.keys(subgraphClients)!.map((key) => useGetWorkspaceMembersLazyQuery({ client: subgraphClients[key].client }))
	React.useEffect(() => {
		if(!accountData?.address) {
			return
		}

		if(!getAllWorkspaces) {
			return
		}

		const getWorkspaceData = async(userAddress: string) => {
			try {
				const promises: Array<Promise<Array<MinimalWorkspace>>> = getAllWorkspaces.map(
					(allWorkspaces) => new Promise(async(resolve) => {
						try {
							const { data } = await allWorkspaces[0]({
								variables: { actorId: userAddress },
							})
							if(data && data.workspaceMembers.length > 0) {
								resolve(data.workspaceMembers.map((w) => w.workspace))
							} else {
								resolve([])
							}
						} catch(err) {
							resolve([])
						}
					})
				)
				Promise.all(promises).then((values) => {
					const allWorkspacesData = values as unknown as MinimalWorkspace[]
					const tempSet = new Set([...workspaces, ...allWorkspacesData])
					// console.log('WORKSPACE SET: ', tempSet)
					setWorkspaces(Array.from(tempSet))

					const savedWorkspaceData = localStorage.getItem('currentWorkspace')
					if(!savedWorkspaceData || savedWorkspaceData === 'undefined') {
						setWorkspace(allWorkspacesData[0])
					} else {
						const savedWorkspaceDataChain = savedWorkspaceData.split('-')[0]
						const savedWorkspaceDataId = savedWorkspaceData.split('-')[1]
						const i = allWorkspacesData.findIndex(
							(w) => w.id === savedWorkspaceDataId &&
                w.supportedNetworks[0] === savedWorkspaceDataChain
						)
						setWorkspace(allWorkspacesData[i])
					}
				})
			} catch(_) {
				toast({
					title: 'Error getting workspace data',
					status: 'error',
				})
			}
		}

		getWorkspaceData(accountData?.address)
	}, [isConnected, accountData, connected])

	return (
		<Flex
			position='sticky'
			left={0}
			top={0}
			h='calc(100vh - 64px)'
			w='25vw'
			bg='white'
			direction='column'
			overflowY='scroll'
			border='1px solid #E0E0EC'
		>
			{
				workspace?.id && accountData?.address && (
					<Domains
						workspaces={workspaces}
						onWorkspaceClick={
							(index) => {
								setWorkspace(workspaces[index])
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
