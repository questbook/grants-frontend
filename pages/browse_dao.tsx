import { useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from '@chakra-ui/react'
import AllDaosGrid from 'src/components/browse_daos/all_daos'
import BrowseDaoHeader from 'src/components/browse_daos/header'
import { CHAIN_INFO } from 'src/constants/chains'
import { GetAllGrantsQuery, useGetAllGrantsForAllDaoLazyQuery, useGetAllWorkspacesLazyQuery } from 'src/generated/graphql'
import { Workspace } from 'src/types'
import { formatAmount } from 'src/utils/formattingUtils'
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils'
import Sidebar from 'src/v2/components/Sidebar'
import { useAccount, useConnect } from 'wagmi'
import { ApiClientsContext } from './_app'

const PAGE_SIZE = 40

function BrowseDao() {
	const { subgraphClients, connected } = useContext(ApiClientsContext)!

	const toast = useToast()
	const allNetworkWorkspace = Object.keys(subgraphClients)!.map(
		(key) => useGetAllWorkspacesLazyQuery({ client: subgraphClients[key].client }),
	)
	const allNetworkGrantsForDao = Object.keys(subgraphClients)!.map((key) => useGetAllGrantsForAllDaoLazyQuery({ client: subgraphClients[key].client })
	)
	const { data: accountData } = useAccount()
	const { isDisconnected } = useConnect()

	const [allWorkspaces, setAllWorkspaces] = useState([])
	const [selectedChainId, setSelectedChainId] = useState<number|undefined>()
	const [selectedWorkspaces, setSelectedWorkspaces] = useState([])

	const [currentPage, setCurrentPage] = useState(0)
	const [allDataFetched, setAllDataFectched] = useState<Boolean>(false)
	const [grants, setGrants] = useState<GetAllGrantsQuery['grants']>([])

	const getGrantData = async(firstTime: boolean = false) => {
		// setLoading(true)
		try {
			const currentPageLocal = firstTime ? 0 : currentPage
			const promises = allNetworkGrantsForDao.map(
				// eslint-disable-next-line no-async-promise-executor
				(allGrants) => new Promise(async(resolve) => {
					// console.log('calling grants');
					try {
						const { data } = await allGrants[0]({
							variables: {
								acceptingApplications: true,
							},
						})
						if(data && data.grants) {
							const filteredGrants = data.grants.filter(
								(grant) => grant.applications.length === 0
							)
							resolve(filteredGrants)
						} else {
							resolve([])
						}
					} catch(err) {
						resolve([])
					}
				})
			)
			Promise.all(promises).then((values: any[]) => {
				const allGrantsData = [].concat(
					...values
				) as GetAllGrantsQuery['grants']
				if(allGrantsData.length < PAGE_SIZE) {
					setAllDataFectched(true)
				}

				console.log('allGrantsData', allGrantsData)

				if(firstTime) {
					setGrants(
						allGrantsData.sort((a: any, b: any) => b.createdAtS - a.createdAtS)
					)

					// setLoading(false)
				} else {
					setGrants(
						[...grants, ...allGrantsData].sort(
							(a: any, b: any) => b.createdAtS - a.createdAtS
						)
					)
					// setLoading(false)
				}

				setCurrentPage(firstTime ? 1 : currentPage + 1)
				// @TODO: Handle the case where a lot of the grants are filtered out.
			})
		} catch(e) {
			// console.log(e);
			toast({
				title: 'Error loading grants',
				status: 'error',
			})
		}
	}

	useEffect(() => {
		var obj = {}
		if(grants.length > 0) {
			grants.map((grant, i) => {
				obj [`${grant.workspace.id}-${grant.workspace.supportedNetworks[0]}`] = obj [`${grant.workspace.id}-${grant.workspace.supportedNetworks[0]}`] || []
				obj [`${grant.workspace.id}-${grant.workspace.supportedNetworks[0]}`].push(
					{
						workspaceid: grant.workspace.id,
						name: grant.workspace.title,
						icon: grant.workspace.logoIpfsHash,
						amount: grant.reward.committed,
						token: grant.reward.token,
						noOfApplicants: grant.numberOfApplications
					})
			})
			console.log('allgrants after filter', obj)
			formatDataforWorkspace(obj)
		}
	}, [grants])

	const formatDataforWorkspace = (workspaces) => {
		var result = Object.keys(workspaces).map((key) => {
			var totalamount = 0
			if(workspaces[key].length > 1) {
				workspaces[key].map((grant) => {
					totalamount += Number(formatAmount(grant.amount))
				})
			}

			var dao = {
				chainID: key.split('-')[1],
				workspaceID: key.split('-')[0],
				name: workspaces[key][0].name,
				icon: workspaces[key][0].icon,
				amount:totalamount === 0 ? Number(formatAmount(workspaces[key][0].amount)) : totalamount,
				token: workspaces[key][0].token,
				noOfApplicants: workspaces[key][0].noOfApplicants
			}
			return (dao)
		})
		console.log('allgrants after formating', result)
		setAllWorkspaces(result)
	}

	// const getAllWorkspacesData = async() => {
	// 	try {
	// 		const promises = allNetworkWorkspace.map(
	// 			// eslint-disable-next-line no-async-promise-executor
	// 			(allWorkspaces) => new Promise(async(resolve) => {
	// 				try {
	// 					const { data } = await allWorkspaces[0]({})
	// 					if(data && data.workspaces) {
	// 						resolve(data.workspaces)
	// 					} else {
	// 						resolve([])
	// 					}
	// 				} catch(err) {
	// 					resolve([])
	// 				}
	// 			})
	// 		)
	// 		Promise.all(promises).then((values: any[]) => {
	// 			const allWorkspacesData = [].concat(
	// 				...values
	// 			)
	// 			console.log('allworkspaces', allWorkspacesData)
	// 			setAllWorkspaces(allWorkspacesData)
	// 		})
	// 	} catch(e) {
	// 		toast({
	// 			title: 'Error loading workspaces',
	// 			status: 'error',
	// 		})
	// 	}
	// }

	useEffect(() => {
		// getAllWorkspacesData()
		getGrantData()
	}, [])

	useEffect(() => {
		setSelectedChainId(undefined)
	}, [isDisconnected])

	useEffect(() => {
		if(selectedChainId) {
			const filteredWorkspaces = allWorkspaces.filter((workspace:Workspace) => selectedChainId === getSupportedChainIdFromSupportedNetwork(workspace.chainID))
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