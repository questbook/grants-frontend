import React, { useContext, useEffect, useState } from 'react'
import {
	Box,
	Button,
	Container,
	Flex,
	Image,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Text,
	useToast,
} from '@chakra-ui/react'
import router from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import {
	useGetNumberOfApplicationsLazyQuery,
	useGetNumberOfGrantsLazyQuery,
	useGetWorkspaceMembersLazyQuery,
} from 'src/generated/graphql'
import useActiveTabIndex from 'src/hooks/utils/useActiveTabIndex'
import { MinimalWorkspace } from 'src/types'
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import { useAccount, useConnect } from 'wagmi'
import AccountDetails from './accountDetails'
import Tab from './tab'

function Navbar({ renderTabs }: { renderTabs: boolean }) {
	const toast = useToast()
	const { isConnected, activeConnector } = useConnect()
	console.log(isConnected)
	const { data: accountData } = useAccount()
	console.log('account data' + accountData)
	const tabPaths = [
		'dao_dashboard',
		'your_grants',
		'funds',
		'manage_dao',
		'your_applications',
		'payouts',
	]
	const activeIndex = useActiveTabIndex(tabPaths)

	const [workspaces, setWorkspaces] = React.useState<MinimalWorkspace[]>([])
	const [applicationCount, setApplicationCount] = React.useState(0)

	const apiClients = useContext(ApiClientsContext)!
	const { workspace, setWorkspace, subgraphClients, connected } = apiClients
	const [isAdmin, setIsAdmin] = React.useState(false)
	const [isReviewer, setIsReviewer] = React.useState<boolean>(false)
	// const [accountData, setaccountData] = React.useState<any>()

	const [grantsCount, setGrantsCount] = React.useState(0)

	// eslint-disable-next-line max-len
	const getNumberOfApplicationsClients = Object.keys(subgraphClients)!.map(

		(key) => useGetNumberOfApplicationsLazyQuery({ client: subgraphClients[key].client }),
	)

	const getNumberOfGrantsClients = Object.fromEntries(
		Object.keys(subgraphClients)!.map((key) => [
			key,

			useGetNumberOfGrantsLazyQuery({ client: subgraphClients[key].client }),
		]),
	)

	// Detect network change
	// Set workspaces to an empty array
	useEffect(() => {
		if(workspaces) {
			setWorkspaces([])

		}
	}, [activeConnector])


	useEffect(() => {
		if(
			workspace
			&& workspace.members
			&& workspace.members.length > 0
			&& accountData
			&& accountData.address
		) {
			const tempMember = workspace.members.find(
				(m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
			)
			setIsAdmin(
				tempMember?.accessLevel === 'admin'
				|| tempMember?.accessLevel === 'owner',
			)
			setIsReviewer(tempMember?.accessLevel === 'reviewer')
		}

	}, [accountData, workspace])

	useEffect(() => {
		if(!accountData?.address) {
			return
		}

		if(!workspace) {
			return
		}

		const getNumberOfApplications = async() => {
			try {
				const promises = getNumberOfApplicationsClients.map(
					// eslint-disable-next-line no-async-promise-executor
					(query) => new Promise(async(resolve) => {
						const { data } = await query[0]({
							variables: { applicantId: accountData?.address! },
						})
						if(data && data.grantApplications.length > 0) {
							resolve(data.grantApplications.length)
						} else {
							resolve(0)
						}
					}),
				)
				Promise.all(promises).then((value: any[]) => {
					setApplicationCount(value.reduce((a, b) => a + b, 0))
				})
			} catch(e) {
				toast({
					title: 'Error getting application count',
					status: 'error',
				})
			}
		}

		const getNumberOfGrants = async() => {
			try {
				const query = getNumberOfGrantsClients[getSupportedChainIdFromWorkspace(workspace)!][0]
				const { data } = await query({
					variables: { workspaceId: workspace?.id },
				})
				if(data && data.grants.length > 0) {
					setGrantsCount(data.grants.length)
				} else {
					setGrantsCount(0)
				}
			} catch(e) {
				toast({
					title: 'Error getting grants count',
					status: 'error',
				})
			}
		}

		getNumberOfApplications()
		getNumberOfGrants()

	}, [accountData?.address, workspace?.id, isConnected])

	const getAllWorkspaces = Object.keys(subgraphClients)!.map(

		(key) => useGetWorkspaceMembersLazyQuery({ client: subgraphClients[key].client }),
	)


	useEffect(() => {
		if(!accountData?.address) {
			return
		}

		if(!getAllWorkspaces) {
			return
		}
		// if (!set) return;

		const getWorkspaceData = async(userAddress: string) => {
			try {
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
					}),
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
							(w) => w.id === savedWorkspaceDataId && w.supportedNetworks[0] === savedWorkspaceDataChain,
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

	}, [isConnected, accountData?.address, connected])

	const [isDiscover, setIsDiscover] = useState<boolean>(false)

	const { pathname } = router

	useEffect(() => {
		if(pathname !== '/') {
			setIsDiscover(false)
		} else {
			setIsDiscover(true)
		}
	}, [pathname, isDiscover])

	return (
		<Container
			zIndex={1}
			variant="header-container"
			maxW="100vw"
			pr={8}
			pl={0}
			alignItems="center"
			minH="80px"
		>
			{
				connected ? (
					<Menu>
						<MenuButton
							as={Button}
							m={0}
							h="100%"
							variant="ghost"
							display="flex"
							alignItems="center"
							borderRadius={0}
							background="linear-gradient(263.05deg, #EFF0F0 -7.32%, #FCFCFC 32.62%)"
							px="38px"
						>
							<Flex
								direction="row"
								align="center">
								<Image
									objectFit="cover"
									w="32px"
									h="32px"
									mr="10px"
									src={
										router.pathname === '/' || !workspace
											? '/ui_icons/gray/see.svg'
											: getUrlForIPFSHash(workspace.logoIpfsHash)
									}
									display="inline-block"
								/>
								<Text
									color="#414E50"
									fontWeight="500"
									fontSize="16px"
									lineHeight="24px"
									overflow="hidden"
									textOverflow="ellipsis"
								>
									{router.pathname === '/' || !workspace ? 'Discover Grants' : workspace.title}
								</Text>
								<Image
									ml={2}
									src="/ui_icons/dropdown_arrow.svg"
									alt="options" />
							</Flex>
						</MenuButton>

						<MenuList
							maxH="80vh"
							overflowY="auto">
							{
								workspaces.map((userWorkspace) => (
									<MenuItem
										key={`${userWorkspace.id}-${userWorkspace.supportedNetworks[0]}`}
										icon={
											(
												<Image
													boxSize="20px"
													src={getUrlForIPFSHash(userWorkspace.logoIpfsHash)}
												/>
											)
										}
										onClick={
											() => {
												setWorkspace(userWorkspace)
												router.push('/your_grants')
											}
										}
									>
										{userWorkspace.title}
									</MenuItem>
								))
							}
							<MenuItem
								icon={<Image src="/ui_icons/gray/see.svg" />}
								onClick={
									() => {
										router.push('/')
										setIsDiscover(true)
									}
								}
							>
								Discover Grants
							</MenuItem>
						</MenuList>
					</Menu>
				) : (
					<Image
						onClick={
							() => {
								router.push({
									pathname: '/',
								})
							}
						}
						h={9}
						w={8}
						src="/questbook_logo.svg"
						alt="Questbook"
						cursor="pointer"
						ml={8}
					/>
				)
			}

			{
				renderTabs ? (
					<>
						{
							(workspace?.id || grantsCount) && router.pathname !== '/' ? (
								<>
									<Box mr="12px" />

									<Flex
										h="100%"
										direction="column"
										display={isAdmin ? '' : 'none'}>
										<Tab
											label="Dashboard"
											icon={
												`/ui_icons/${activeIndex === 0 ? 'brand' : 'gray'
												}/grant-dao.svg`
											}
											isActive={activeIndex === 0}
											onClick={
												() => {
													router.push({
														pathname: `/${tabPaths[0]}`,
													})
												}
											}
										/>
										{
											activeIndex === 0 ? (
												<Box
													w="100%"
													h="2px"
													bgColor="#8850EA" />
											) : null
										}
									</Flex>
									<Flex
										h="100%"
										direction="column">
										<Tab
											label={isReviewer ? 'Grants Assigned' : 'Grants'}
											icon={
												`/ui_icons/${activeIndex === 1 ? 'brand' : 'gray'
												}/tab_grants.svg`
											}
											isActive={activeIndex === 1}
											onClick={
												() => {
													router.push({
														pathname: `/${tabPaths[1]}`,
													})
												}
											}
										/>
										{
											activeIndex === 1 ? (
												<Box
													w="100%"
													h="2px"
													bgColor="#8850EA" />
											) : null
										}
									</Flex>

									<Flex
										h="100%"
										direction="column"
										display={isAdmin ? '' : 'none'}>
										<Tab
											label="Funds"
											icon={
												`/ui_icons/${activeIndex === 2 ? 'brand' : 'gray'
												}/tab_funds.svg`
											}
											isActive={activeIndex === 2}
											onClick={
												() => {
													router.push({
														pathname: `/${tabPaths[2]}`,
													})
												}
											}
										/>
										{
											activeIndex === 2 ? (
												<Box
													w="100%"
													h="2px"
													bgColor="#8850EA" />
											) : null
										}
									</Flex>
									<Flex
										h="100%"
										direction="column"
										display={isAdmin ? '' : 'none'}>
										<Tab
											label="Manage DAO"
											icon={
												`/ui_icons/${activeIndex === 3 ? 'brand' : 'gray'
												}/tab_settings.svg`
											}
											isActive={activeIndex === 3}
											onClick={
												() => {
													router.push({
														pathname: `/${tabPaths[3]}`,
													})
												}
											}
										/>
										{
											activeIndex === 3 ? (
												<Box
													w="100%"
													h="2px"
													bgColor="#8850EA" />
											) : null
										}
									</Flex>
									{
										isReviewer && (
											<Flex
												h="100%"
												direction="column">
												<Tab
													label="Payouts"
													icon={
														activeIndex === 5
															? '/ui_icons/brand/tab_review_funds.svg'
															: '/ui_icons/gray/tab_funds.svg'
													}
													isActive={activeIndex === 5}
													onClick={
														() => {
															router.push({
																pathname: `/${tabPaths[5]}`,
															})
														}
													}
												/>
												{
													activeIndex === 5 ? (
														<Box
															w="100%"
															h="2px"
															bgColor="#8850EA" />
													) : null
												}
											</Flex>
										)
									}
								</>
							) : null
						}

						<Box mr="auto" />

						{
							(!workspace?.id || applicationCount > 0) && (
								<Flex
									h="100%"
									direction="column">
									<Tab
										label="My Applications"
										icon={
											`/ui_icons/${activeIndex === 4 ? 'brand' : 'gray'
											}/tab_grants.svg`
										}
										isActive={activeIndex === 4}
										onClick={
											() => {
												router.push({
													pathname: `/${tabPaths[4]}`,
												})
											}
										}
									/>
									{
										activeIndex === 4 ? (
											<Box
												w="100%"
												h="2px"
												bgColor="#8850EA" />
										) : null
									}
								</Flex>
							)
						}

						<Box mr="8px" />

						<Button
							display={isAdmin || !workspace || !workspace?.id ? undefined : 'none'}
							onClick={
								() => {
									console.log('Create a grant!')
									console.log(workspace)
									console.log(workspace?.id)
									if(!workspace?.id) {
										router.push({
											pathname: '/signup',
										})
									} else if(grantsCount === 0) {
										router.push({
											pathname: '/signup',
											query: { create_grant: true },
										})
									} else {
										router.push({
											pathname: '/your_grants/create_grant/',
										})
									}
								}
							}
							maxW="163px"
							variant="primary"
							mr="12px"
						>
							Create a Grant
						</Button>
					</>
				) : (
					<Box mr="auto" />
				)
			}

			<AccountDetails />
		</Container>
	)
}

// Navbar.defaultProps = defaultProps;
export default Navbar
