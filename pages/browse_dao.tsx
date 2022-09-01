import { ReactElement, useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import AllDaosGrid from 'src/components/browse_daos/all_daos'
import { GetAllGrantsQuery, useGetAllGrantsLazyQuery } from 'src/generated/graphql'
import NavbarLayout from 'src/layout/navbarLayout'
import { unixTimestampSeconds } from 'src/utils/generics'
import { extractInviteInfo, InviteInfo } from 'src/utils/invite'
import AcceptInviteModal from 'src/v2/components/AcceptInviteModal'
import { useAccount } from 'wagmi'

const PAGE_SIZE = 40

function BrowseDao() {
	const { subgraphClients } = useContext(ApiClientsContext)!

	const toast = useToast()
	const allNetworkGrantsForDao = Object.keys(subgraphClients)!.map((key) => useGetAllGrantsLazyQuery({ client: subgraphClients[key].client })
	)
	const { data: accountData } = useAccount()
	const [allWorkspaces, setAllWorkspaces] = useState([] as any[])
	// const [selectedChainId, setSelectedChainId] = useState<number|undefined>()
	const [sortedWorkspaces, setSortedWorkspaces] = useState([] as any[])
	const [newWorkspaces, setNewWorkspaces] = useState([] as any[])
	const [selectedSorting, setSelectedSorting] = useState('grant_rewards')

	const [currentPage, setCurrentPage] = useState(0)
	const [, setAllDataFectched] = useState<Boolean>(false)
	const [grants, setGrants] = useState<GetAllGrantsQuery['grants']>([])

	const [inviteInfo, setInviteInfo] = useState<InviteInfo>()

	const getGrantData = async(firstTime: boolean = false) => {
		// setLoading(true)
		try {
			const currentPageLocal = firstTime ? 0 : currentPage
			const promises = allNetworkGrantsForDao.map(
				// eslint-disable-next-line no-async-promise-executor
				(allGrants) => new Promise(async(resolve) => {
					// // console.log('calling grants');
					try {
						const { data } = await allGrants[0]({
							variables: {
								first: PAGE_SIZE,
								skip: currentPageLocal * PAGE_SIZE,
								applicantId: accountData?.address ?? '',
								minDeadline: unixTimestampSeconds(),
							},
						})
						if(data && data.grants) {
							// console.log('data.grants', data.grants)
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
			// // console.log(e);
			toast({
				title: 'Error loading grants',
				status: 'error',
			})
		}
	}

	useEffect(() => {
		var obj = {} as any
		if(grants.length > 0) {
			grants.map((grant,) => {
				obj [`${grant.workspace.id}-${grant.workspace.supportedNetworks[0]}`] = obj [`${grant.workspace.id}-${grant.workspace.supportedNetworks[0]}`] || []
				obj [`${grant.workspace.id}-${grant.workspace.supportedNetworks[0]}`].push(
					{
						workspaceid: grant.workspace.id,
						name: grant.workspace.title,
						icon: grant.workspace.logoIpfsHash,
						amount: grant.reward.committed,
						token: grant.reward.token,
						noOfApplicants: grant.numberOfApplications,
						createdAtS: grant.workspace.createdAtS,
					})
			})
			formatDataforWorkspace(obj)
		}
	}, [grants])

	const fetchDAO = async(chainId: string, daoId: string) => {
		try {
			var res = await fetch(
				'https://www.questbook-analytics.com/workspace-analytics',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					referrerPolicy: 'unsafe-url',
					body: JSON.stringify({
						chainId: chainId,
						workspaceId: daoId,
					}),
				}
			)
			var data = await res.json()
			return data

		} catch(error) {
			// console.log(error)
		}

	}

	const formatDataforWorkspace = async(workspaces: any) => {
		var result = Promise.all(Object.keys(workspaces).map(async(key) => {
			var data = await fetchDAO(key.split('_')[1], key.split('-')[0])
			var totalFunding = (!data.everydayFunding || data.everydayFunding.length === 0) ? 0 : data.everydayFunding.reduce((a: number, b: any) => a + Number(b['funding']), 0)

			var dao = {
				chainID: key.split('-')[1],
				workspaceID: key.split('-')[0],
				name: workspaces[key][0].name,
				icon: workspaces[key][0].icon,
				amount: totalFunding,
				token: workspaces[key][0].token,
				noOfApplicants: data.totalApplicants
				// noOfApplicants: workspaces[key][0].noOfApplicants
			}
			return (dao)
		}))
		setAllWorkspaces(await result)


	}

	useEffect(() => {
		getGrantData(true)
		setTimeout(() => {
			getGrantData()
		}, 1000)
	}, [])

	useEffect(() => {
		if(selectedSorting === 'grant_rewards') {
			var workspaces = [...allWorkspaces].filter(w => w.amount > 999)
			workspaces.sort((a: any, b: any) => {
				return parseFloat(b.amount) - parseFloat(a.amount) || Number(isNaN(a.amount)) - Number(isNaN(b.amount))
			})
			// console.log('sorted reward-wise workspace')
			setSortedWorkspaces(workspaces)
		} else if(selectedSorting === 'no_of_applicants') {
			var workspaces = [...allWorkspaces].filter(w => w.amount > 999)
			workspaces.sort((a, b) => {
				return parseFloat(b.noOfApplicants) - parseFloat(a.noOfApplicants) || Number(isNaN(a.noOfApplicants)) - Number(isNaN(b.noOfApplicants))
			})
			// console.log('sorted applicant-wise workspace')
			setSortedWorkspaces(workspaces)
		}

		const newWorkspaces = [...allWorkspaces].filter(w => workspaces.find(ww => ww.workspaceID === w.workspaceID) === undefined)
		newWorkspaces.sort((a: any, b: any) => {
			return b.createdAtS - a.createdAtS
		})
		setNewWorkspaces(newWorkspaces)

	}, [selectedSorting, allWorkspaces])

	useEffect(() => {
		try {
			const inviteInfo = extractInviteInfo()
			if(inviteInfo) {
				setInviteInfo(inviteInfo)
			}
		} catch(error: any) {
			// console.error('invalid invite ', error)
			toast({
				title: `Invalid invite "${error.message}"`,
				status: 'error',
				duration: 9000,
				isClosable: true,
			})
		}
	}, [])

	return (
	// <Box
	// 	width={{ base: 'max-content', sm:'100%' }}
	// 	background={'#F5F5FA'}
	// 	minHeight={'100vh'}
	// 	height={'100%'}
	// 	pb={'50px'}>
	// 	<BrowseDaoHeader />

	// 	<Flex>
	// 		{
	// 			 (
	// 				<Flex
	// 					display={{ base:'none', lg:'flex' }}
	// 					w="20%"
	// 					pos="sticky"
	// 					top={0}>
	// 					<Sidebar />
	// 				</Flex>
	// 			)
	// 		}
	// 		<Container
	// 			maxWidth={'1280px'}
	// 			w="80%">
	// 			<Flex
	// 				my={'16px'}
	// 				maxWidth={'1280px'}>
	// 				<Text
	// 					fontSize={'24px'}
	// 					fontWeight={'700'}>
	// 				Discover
	// 				</Text>
	// 				<Box marginLeft={'auto'}>
	// 					<Menu>
	// 						<MenuButton
	// 							as={Button}
	// 							rightIcon={<Image src={'/ui_icons/black_down.svg'} />}>
    	// 							Sort by
	// 						</MenuButton>
	// 						<MenuList>
	// 							<MenuItem
	// 								justifyContent={'center'}
	// 								bg={'#F0F0F7'}>
	// 								<Text
	// 									fontWeight={'700'}>
	// 									Sort by
	// 								</Text>
	// 							</MenuItem>
	// 							<MenuItem
	// 								onClick={
	// 									() => {
	// 										setSelectedSorting('grant_rewards')
	// 									}
	// 								}>
	// 								<Flex>
	// 									<Image src={selectedSorting === 'grant_rewards' ? '/ui_icons/sorting_checked.svg' : '/ui_icons/sorting_unchecked.svg'} />
	// 									<Text ml={'10px'}>
	// 											Grant rewards
	// 									</Text>
	// 								</Flex>
	// 							</MenuItem>
	// 							<MenuItem
	// 								onClick={
	// 									() => {
	// 										setSelectedSorting('no_of_applicants')
	// 									}
	// 								}>
	// 								<Flex>
	// 									<Image src={selectedSorting === 'no_of_applicants' ? '/ui_icons/sorting_checked.svg' : '/ui_icons/sorting_unchecked.svg'} />
	// 									<Text ml={'10px'}>
	// 											Number of Applicants
	// 									</Text>
	// 								</Flex>
	// 							</MenuItem>
	// 						</MenuList>
	// 					</Menu>
	// 				</Box>
	// 			</Flex>
	// 			<AllDaosGrid allWorkspaces={sortedWorkspaces} />
	// 		</Container>
	// 	</Flex>

		// 	<AcceptInviteModal
		// 		inviteInfo={inviteInfo}
		// 		onClose={
		// 			() => {
		// 				setInviteInfo(undefined)
		// 				window.history.pushState(undefined, '', '/')
		// 			}
		// 		} />
		// </Box>
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
								<MenuItem
									justifyContent='center'
									bg='#F0F0F7'>
									<Text
										fontWeight='700'>
										Sort by
									</Text>
								</MenuItem>
								<MenuItem
									onClick={
										() => {
											setSelectedSorting('grant_rewards')
										}
									}>
									<Flex>
										<Image src={selectedSorting === 'grant_rewards' ? '/ui_icons/sorting_checked.svg' : '/ui_icons/sorting_unchecked.svg'} />
										<Text ml='10px'>
											Grant rewards
										</Text>
									</Flex>
								</MenuItem>
								<MenuItem
									onClick={
										() => {
											setSelectedSorting('no_of_applicants')
										}
									}>
									<Flex>
										<Image src={selectedSorting === 'no_of_applicants' ? '/ui_icons/sorting_checked.svg' : '/ui_icons/sorting_unchecked.svg'} />
										<Text ml='10px'>
											Number of Applicants
										</Text>
									</Flex>
								</MenuItem>
							</MenuList>
						</Menu>
					</Box>
				</Flex>
				<AllDaosGrid
					renderGetStarted
					allWorkspaces={sortedWorkspaces} />

				<Flex
					my='16px'
					maxWidth='1280px'>
					<Text
						fontSize='24px'
						fontWeight='700'>
						New
					</Text>
				</Flex>

				<AllDaosGrid
					renderGetStarted={false}
					allWorkspaces={newWorkspaces} />
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

export default BrowseDao