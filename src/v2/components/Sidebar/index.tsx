import React from 'react'
import { Box, Button, Flex, Image, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { useGetWorkspaceMembersLazyQuery } from 'src/generated/graphql'
import { MinimalWorkspace } from 'src/types'
import getRole from 'src/utils/memberUtils'
import { useAccount, useConnect } from 'wagmi'
import ManageDAO from './ManageDAO'
import SidebarItem from './SidebarItem'
import { useGetTabs } from './Tabs'

function Sidebar() {
	const [topTabs, bottomTabs] = useGetTabs()
	const { data: accountData } = useAccount()
	const { isConnected } = useConnect()
	const { workspace, setWorkspace, subgraphClients, connected } =
    React.useContext(ApiClientsContext)!

	const toast = useToast()

	React.useEffect(() => {
		const savedWorkspaceData = localStorage.getItem('currentWorkspace')
		console.log('SAVED WORKSPACE: ', savedWorkspaceData)
	}, [])

	React.useEffect(() => {
		console.log('TOP TABS: ', topTabs)
		console.log('BOTTOM TABS: ', bottomTabs)
	}, [topTabs, bottomTabs])

	const [tabSelected, setTabSelected] = React.useState(topTabs[0].index)
	// const [bottomTabSelected, setBottomTabSelected] = React.useState(bottomTabs.length > 0 ? bottomTabs[0].index : 0)
	const [workspaces, setWorkspaces] = React.useState<MinimalWorkspace[]>([])

	const getAllWorkspaces = Object.keys(subgraphClients)!.map((key) => useGetWorkspaceMembersLazyQuery({ client: subgraphClients[key].client })
	)
	React.useEffect(() => {
		if(!accountData?.address) {
			return
		}

		if(!getAllWorkspaces) {
			return
		}
		// if (!set) return;

		const getWorkspaceData = async(userAddress: string) => {
			try {
				console.log('getallworkspace', getAllWorkspaces)
				const promises = getAllWorkspaces.map(
					// eslint-disable-next-line no-async-promise-executor
					(allWorkspaces) => new Promise(async(resolve) => {
						// console.log('calling grants');
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
				Promise.all(promises).then((values: any[]) => {
					const allWorkspacesData = [].concat(...values) as MinimalWorkspace[]
					// setGrants([...grants, ...allGrantsData]);
					// setCurrentPage(currentPage + 1);
					// console.log('all workspaces', allWorkspacesData);
					setWorkspaces([...workspaces, ...allWorkspacesData])

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
			} catch(e) {
				// console.log(e);
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
			position="sticky"
			left={0}
			top={0}
			h="calc(100vh - 80px)"
			w="20%"
			bg="#F0F0F7"
			direction="column"
		>
			<Flex
				direction="column"
				align="stretch"
				mt={3}
				mb={2}
				mx={6}>
				{
					topTabs.map((tab, index) => (
						<SidebarItem
							key={tab.id}
							index={tab.index}
							selected={tabSelected}
							id={tab.id}
							name={tab.name}
							onClick={
								() => {
									setTabSelected(tab.index)
								}
							}
						/>
					))
				}
			</Flex>
			<Flex
				bg="#E0E0EC"
				height="2px"
				w="100%" />
			<ManageDAO
				workspaces={workspaces}
				onWorkspaceClick={
					(index: number) => {
						setWorkspace(workspaces[index])
					}
				}
			/>
			<Flex
				bg="#E0E0EC"
				height="2px"
				w="100%"
				mt={2} />
			<Flex
				direction="column"
				align="stretch"
				mt={3}
				mb={2}
				mx={6}>
				{
					bottomTabs.map((tab, index) => (
						<SidebarItem
							key={tab.id}
							index={tab.index}
							selected={tabSelected}
							id={tab.id}
							name={tab.name}
							onClick={
								() => {
									setTabSelected(tab.index)
								}
							}
						/>
					))
				}
			</Flex>
			<Box my="auto" />
			{
				workspaces.length === 0 ||
        ((workspace && accountData?.address && getRole(workspace, accountData?.address) === 'Reviewer') && (
        	<Button
        		m={4}
        		h="40px"
        		bg="#1F1F33"
        		leftIcon={
        			<Image
        				boxSize="20px"
        			src="/ui_icons/rocket.svg" />
        		}
        		fontSize="14px"
        		lineHeight="20px"
        		color="white"
        	>
            Create your DAO
        	</Button>
        ))
			}
		</Flex>
	)
}

export default Sidebar
