import React, {
	ReactElement, useContext,
	useEffect, useState, } from 'react'
import {
	Button, Divider, Flex, Text,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import Settings from 'src/components/manage_dao/settings'
import Loader from 'src/components/ui/loader'
import { defaultChainId } from 'src/constants/chains'
import { useGetWorkspaceDetailsQuery } from 'src/generated/graphql'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import NavbarLayout from 'libraries/ui/navbarLayout'
import { Workspace } from 'src/types'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import WorkspaceMembers from 'src/v2/components/WorkspaceMembers'

function ManageDAO() {
	const { workspace, subgraphClients } = useContext(ApiClientsContext)!
	const router = useRouter()
	const tabs = ['Settings', 'Members']
	const [selected, setSelected] = useState(
		router.query.tab === 'members' ? 1 : 0,
	)
	const [workspaceData, setWorkspaceData] = useState<Workspace>()
	const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
	const [isLoading, setIsLoading] = React.useState<boolean>(true)

	const { data: accountData } = useQuestbookAccount()

	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) || defaultChainId
      ].client,
	})

	useEffect(() => {
		if(!workspace) {
			return
		}

		setQueryParams({
			client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
			variables: { workspaceID: workspace.id },
		})

	}, [workspace])

	const { data } = useGetWorkspaceDetailsQuery(queryParams)

	useEffect(() => {
		if(!data) {
			return
		}

		setWorkspaceData(data!.workspace!)

		// console.log(data)
	}, [data])

	const switchTab = (to: number) => {
		setSelected(to)
	}

	useEffect(() => {
		if(
			workspace?.members
      		&& workspace.members.length > 0
			&& accountData
			&& accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			setIsAdmin(tempMember?.accessLevel === 'admin' || tempMember?.accessLevel === 'owner')
			setIsLoading(false)
		}
	}, [accountData, workspace])

	return (
		<Flex
			w='100%'
			px={10}
			bg='#F5F5FA'
			// overflowY='auto'
			mb={4}>
			{
				isAdmin ? (
					<Flex
						direction='row'
						w='100%'
						justify='space-evenly'>
						<Flex
							w={selected === 0 ? '100%' : '100%'}
							maxW='1036px'
							direction='column'
						>
							<Flex
								direction='row'
								w='full'
								justify='start'
								h={14}
								align='stretch'
								mb={4}
								mt={6}
							>
								{
									tabs.map((tab, index) => (
										<Button
											key={tab}
											variant='link'
											ml={index === 0 ? 0 : 12}
											_hover={
												{
													color: 'black',
												}
											}
											_focus={{}}
											fontWeight='700'
											fontStyle='normal'
											fontSize='28px'
											lineHeight='44px'
											letterSpacing={-1}
											borderRadius={0}
											color={index === selected ? '#122224' : '#A0A7A7'}
											onClick={() => switchTab(index)}
										>
											{tab}
										</Button>
									))
								}
							</Flex>
							<Divider
								w={selected === 0 ? '70%' : '100%'}
								bg='#A0A7A7'
								height='1px'
								mb={5} />
							{
								selected === 0
									? <Settings workspaceData={workspaceData!} />
									: <WorkspaceMembers />
							}
						</Flex>
						<Flex w='auto' />
					</Flex>
				)
					: (
						<>
							{' '}
							{
								isLoading
									? (
										<Flex
											m='auto'
											mt='25vh'>
											<Loader />
										</Flex>
									)
									: (
										<Text
											textAlign='center'
											p='2rem'>
											You do not have access to this DAO settings
										</Text>
									)
							}
						</>
					)
			}
		</Flex>
	)
}

ManageDAO.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default ManageDAO
