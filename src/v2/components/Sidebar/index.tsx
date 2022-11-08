import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Divider, Flex } from '@chakra-ui/react'
import { SupportedSafes } from '@questbook/supported-safes'
import { useRouter } from 'next/router'
import { useSafeContext } from 'src/contexts/safeContext'
import { useGetWorkspaceMembersQuery } from 'src/generated/graphql'
import { useNetwork } from 'src/hooks/gasless/useNetwork'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import { useMultiChainQuery } from 'src/hooks/useMultiChainQuery'
import { ApiClientsContext } from 'src/pages/_app'
import { MinimalWorkspace } from 'src/types'
import logger from 'src/utils/logger'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import Domains from 'src/v2/components/Sidebar/Domains'
import SidebarItem from 'src/v2/components/Sidebar/SidebarItem'
import { getTabFromPath, TABS, useGetTabs } from 'src/v2/components/Sidebar/Tabs'

function Sidebar() {
	const tabList = useGetTabs()
	const { data: accountData } = useQuestbookAccount()
	const { network, switchNetwork } = useNetwork()
	const { workspace, setWorkspace } = useContext(ApiClientsContext)!

	const { safeObj, setSafeObj } = useSafeContext()

	const router = useRouter()

	const [tabSelected, setTabSelected] = useState(getTabFromPath(router.pathname))

	const { results, fetchMore } = useMultiChainQuery({
		useQuery: useGetWorkspaceMembersQuery,
		options: {
			variables: {
				actorId: accountData?.address ?? '',
			}
		}
	})

	const workspaces = useMemo(() => {
		const workspaces: MinimalWorkspace[] = []
		for(const result of results) {
			if(result?.workspaceMembers?.length) {
				for(const mem of result.workspaceMembers) {
					if(mem?.workspace) {
						workspaces.push(mem.workspace)
					}
				}
			}
		}

		return workspaces
	}, [results])

	useEffect(() => {
		if(workspaces.length && !workspace) {
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
	}, [workspaces, workspace])

	useEffect(() => {
		if(workspace?.id!) {
			const currentSafe = new SupportedSafes().getSafe(parseInt(workspace?.safe?.chainId!), workspace.safe?.address!)
			setSafeObj(currentSafe)
		}
	}, [workspace?.id!])

	useEffect(() => {
		if(accountData?.address) {
			fetchMore({
				actorId: accountData?.address,
			}, true)
		}
	}, [accountData?.address])

	useEffect(() => {
		setTabSelected(getTabFromPath(router.pathname))
	}, [router.pathname])

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
			{
				!!workspaces.length && (
					<Divider variant='sidebar' />
				)
			}
			<Flex
				direction='column'
				align='stretch'
				my={2}
				mx={2}>
				{
					tabList.map((tabs, i) => (
						<>
							{
								tabs.map(tabId => {
									const tab = TABS[tabId]
									return (
										<SidebarItem
											key={tabId}
											isSelected={tabId === tabSelected}
											id={tabId}
											name={tab.name}
											onClick={
												() => {
													setTabSelected(tabId)
													router.push({ pathname: `/${tab.path}` })
												}
											}
										/>
									)
								})
							}
							{
								i !== (tabList.length - 1) && (
									<Divider variant='sidebar' />
								)
							}
						</>
					))
				}
			</Flex>
		</Flex>
	)
}

export default Sidebar
