import { useContext, useEffect, useState } from 'react'
import { Box, Button, Container, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import AllDaosGrid from 'src/components/browse_daos/all_daos'
import BrowseDaoHeader from 'src/components/browse_daos/header'
import { GetAllGrantsQuery, useGetAllGrantsLazyQuery, useGetAllWorkspacesLazyQuery } from 'src/generated/graphql'
import { formatAmount } from 'src/utils/formattingUtils'
import { unixTimestampSeconds } from 'src/utils/generics'
import Sidebar from 'src/v2/components/Sidebar'
import { useAccount, useConnect } from 'wagmi'

const PAGE_SIZE = 40

function BrowseDao() {
	const { subgraphClients, connected } = useContext(ApiClientsContext)!

	const toast = useToast()
	const allNetworkWorkspace = Object.keys(subgraphClients)!.map(
		(key) => useGetAllWorkspacesLazyQuery({ client: subgraphClients[key].client }),
	)
	const allNetworkGrantsForDao = Object.keys(subgraphClients)!.map((key) => useGetAllGrantsLazyQuery({ client: subgraphClients[key].client })
	)
	const { data: accountData } = useAccount()
	const { isDisconnected } = useConnect()

	const [allWorkspaces, setAllWorkspaces] = useState([] as any[])
	// const [selectedChainId, setSelectedChainId] = useState<number|undefined>()
	const [sortedWorkspaces, setSortedWorkspaces] = useState([] as any[])
	const [selectedSorting, setSelectedSorting] = useState('grant_rewards')

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
								first: PAGE_SIZE,
								skip: currentPageLocal * PAGE_SIZE,
								applicantId: accountData?.address ?? '',
								minDeadline: unixTimestampSeconds(),
							},
						})
						if(data && data.grants) {
							console.log('data.grants', data.grants)
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
			// console.log(e);
			toast({
				title: 'Error loading grants',
				status: 'error',
			})
		}
	}

	useEffect(() => {
		var obj = {} as any
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
			formatDataforWorkspace(obj)
		}
	}, [grants])

	const formatDataforWorkspace = (workspaces: any) => {
		var result = Object.keys(workspaces).map((key) => {
			var totalamount = 0
			if(workspaces[key].length > 1) {
				workspaces[key].map((grant: any) => {
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
		setAllWorkspaces(result)
	}

	useEffect(() => {
		getGrantData(true)
		setTimeout(() => {
			getGrantData()
		}, 1000)
	}, [])

	useEffect(() => {
		console.log('selectedSorting', selectedSorting)
		if(selectedSorting === 'grant_rewards') {
			var workspaces = [...allWorkspaces]
			workspaces.sort((a:any, b:any) => {
				return parseFloat(b.amount) - parseFloat(a.amount) || Number(isNaN(a.amount)) - Number(isNaN(b.amount))
			})
			console.log('sorted reward-wise workspace', workspaces)
			setSortedWorkspaces(workspaces)
		} else if(selectedSorting === 'no_of_applicants') {
			var workspaces = [...allWorkspaces]
			workspaces.sort((a, b) => {
				return parseFloat(b.noOfApplicants) - parseFloat(a.noOfApplicants) || Number(isNaN(a.noOfApplicants)) - Number(isNaN(b.noOfApplicants))
			})
			console.log('sorted applicant-wise workspace', workspaces)
			setSortedWorkspaces(workspaces)
		}
	}, [selectedSorting, allWorkspaces])


	return (
		<Box
			width={{ base: 'max-content', sm:'100%' }}
			background={'#F5F5FA'}
			minHeight={'100vh'}
			height={'100%'}
			pb={'50px'}>
			<BrowseDaoHeader />

			<Flex>
				{
					 (
						<Flex
							display={{ base:'none', lg:'flex' }}
							w="20%"
							pos="sticky"
							top={0}>
							<Sidebar />
						</Flex>
					)
				}
				<Container
					maxWidth={'1280px'}
					w="80%">
					<Flex
						my={'16px'}
						maxWidth={'1280px'}>
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
    								Sort by
								</MenuButton>
								<MenuList>
									<MenuItem
										justifyContent={'center'}
										bg={'#F0F0F7'}>
										<Text
											fontWeight={'700'}>
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
											<Text ml={'10px'}>
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
											<Text ml={'10px'}>
													Number of Applicants
											</Text>
										</Flex>
									</MenuItem>
								</MenuList>
							</Menu>
						</Box>
					</Flex>
					<AllDaosGrid allWorkspaces={sortedWorkspaces} />
				</Container>
			</Flex>
		</Box>
	)
}

export default BrowseDao