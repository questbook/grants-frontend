import { useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from '@chakra-ui/react'
import AllDaosGrid from 'src/components/browse_daos/all_daos'
import BrowseDaoHeader from 'src/components/browse_daos/header'
import { CHAIN_INFO } from 'src/constants/chains'
import { useGetAllWorkspacesLazyQuery } from 'src/generated/graphql'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import Sidebar from 'src/v2/components/Sidebar'
import { useConnect } from 'wagmi'
import { ApiClientsContext } from './_app'

function BrowseDao() {
	const { subgraphClients, connected } = useContext(ApiClientsContext)!

	const toast = useToast()
	const allNetworkGrants = Object.keys(subgraphClients)!.map(
		(key) => useGetAllWorkspacesLazyQuery({ client: subgraphClients[key].client }),
	)
	const { isDisconnected } = useConnect()

	const [allWorkspaces, setAllWorkspaces] = useState([])
	const [selectedChainId, setSelectedChainId] = useState()
	const [selectedWorkspaces, setSelectedWorkspaces] = useState([])

	const getAllWorkspacesData = async() => {
		try {
			const promises = allNetworkGrants.map(
				// eslint-disable-next-line no-async-promise-executor
				(allWorkspaces) => new Promise(async(resolve) => {
					try {
						const { data } = await allWorkspaces[0]({})
						if(data && data.workspaces) {
							resolve(data.workspaces)
						} else {
							resolve([])
						}
					} catch(err) {
						resolve([])
					}
				})
			)
			Promise.all(promises).then((values: any[]) => {
				const allWorkspacesData = [].concat(
					...values
				)
				console.log('allworkspaces', allWorkspacesData)
				setAllWorkspaces(allWorkspacesData)
			})
		} catch(e) {
			toast({
				title: 'Error loading workspaces',
				status: 'error',
			})
		}
	}

	useEffect(() => {
		getAllWorkspacesData()
	}, [])

	useEffect(() => {
		setSelectedChainId(null)
	}, [isDisconnected])

	useEffect(() => {
		if(selectedChainId) {
			const filteredWorkspaces = allWorkspaces.filter((workspace) => selectedChainId === getSupportedChainIdFromSupportedNetwork(workspace.supportedNetworks[0]))
			setSelectedWorkspaces(filteredWorkspaces)
		}
	}, [selectedChainId])

	return (
		<Box
			background={'#F5F5FA'}
			minHeight={'100vh'}
			height={'100%'}
			pb={'50px'}>
			<BrowseDaoHeader />

			<Flex>
				{
					!isDisconnected && (
						<Flex
							w="20%"
							pos="sticky"
							top={0}>
							<Sidebar />
						</Flex>
					)
				}
				<Container maxW='1280px'>
					<Flex
						my={'16px'}
						width={'1280px'}>
						<Text
							fontSize={'24px'}
							fontWeight={'700'}>
						Discover
						</Text>
						<Box marginLeft={'auto'}>
							<Menu>
								<MenuButton
									as={Button}
									rightIcon={<Image src={'/ui_icons/black_down.svg'} />}>
    Network
								</MenuButton>
								<MenuList>
									{
										Object.values(CHAIN_INFO)
											.map(({ id, name, icon }, index) => (
												<MenuItem
													key={index}
													onClick={
														() => {
															setSelectedChainId(id)
														}
													}>
													<Image
														boxSize='2rem'
														borderRadius='full'
														src={icon}
														alt='Fluffybuns the destroyer'
														mr='12px'
													/>
													<span>
														{name}
													</span>
												</MenuItem>
											))
									}
								</MenuList>
							</Menu>
						</Box>
					</Flex>
					<AllDaosGrid allWorkspaces={selectedChainId ? selectedWorkspaces : allWorkspaces} />
				</Container>
			</Flex>
		</Box>
	)
}

export default BrowseDao