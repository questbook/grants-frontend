import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { LinkIcon } from '@chakra-ui/icons'
import { Button, Container, Flex, Heading, Spacer, Text } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import DoaDashTableEmptyState from 'src/components/dao_dashboard/empty_states/dao_dashboard'
import BarGraph from 'src/components/dao_dashboard/graph/bar_graph'
import LineGraph from 'src/components/dao_dashboard/graph/line_graph'
import DaoStatBoard from 'src/components/dao_dashboard/statboard/stat_board'
import TableContent from 'src/components/dao_dashboard/table/content'
import Header from 'src/components/dao_dashboard/table/headers'
import { defaultChainId, SupportedChainId } from 'src/constants/chains'
import {
	GetAllGrantsForCreatorQuery,
	useGetAllGrantsForCreatorQuery,
} from 'src/generated/graphql'
import NavbarLayout from 'src/layout/navbarLayout'
import { UNIX_TIMESTAMP_MAX, UNIX_TIMESTAMP_MIN } from 'src/utils/generics'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import InviteModal from 'src/v2/components/InviteModal'

// const Tabledata = [
// 	{
// 		'name':'LP management tools for perp v2 LP management tools for perp v2',
// 		'Pendingapp':'15',
// 		'disburded':'$12500',
// 		'responseTa':'6d12hr',
// 		'status':'reviwed'
// 	},

// 	{
// 		'name':'LP management tools for perp v2',
// 		'Pendingapp':'15',
// 		'disburded':'$12500',
// 		'responseTa':'6d12hr',
// 		'status':'reviwed'
// 	},
// 	{
// 		'name':'LP management tools for perp v2',
// 		'Pendingapp':'15',
// 		'disburded':'$12500',
// 		'responseTa':'6d12hr',
// 		'status':'reviwed'
// 	},
// 	{
// 		'name':'LP management tools for perp v2',
// 		'Pendingapp':'15',
// 		'disburded':'$12500',
// 		'responseTa':'6d12hr',
// 		'status':'reviwed'
// 	},
// 	{
// 		'name':'Unity implementation of metametalang',
// 		'Pendingapp':'200',
// 		'disburded':'$1000500',
// 		'responseTa':'6d12hr',
// 		'status':'reviwed'
// 	},
// 	{
// 		'name':'LP management tools for perp v2',
// 		'Pendingapp':'15',
// 		'disburded':'$12500',
// 		'responseTa':'6d12hr',
// 		'status':'reviwed'
// 	},
// 	{
// 		'name':'Unity implementation of metametalang',
// 		'Pendingapp':'15',
// 		'disburded':'$12500',
// 		'responseTa':'6d12hr',
// 		'status':'reviwed'
// 	},
// ]

function DaoDashboard() {
	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
	const [chainID, setChainId] = React.useState<SupportedChainId>()
	const [daoID, setDaoId] = React.useState<string>()

	const [daoStats, setDaoStats] = useState<{
    totalApplicants: number
    uniqueApplicants: number
    repeatApplicants: number
		winnerApplicants: number
		tat: number
    everydayApplications: any[]
    everydayFunding: any[]
    totalFunding: number
    grantsFunding: any
		grantsPending: any
		grantsTat: any
  }>()

	const [grants, setGrants] = React.useState<
    GetAllGrantsForCreatorQuery['grants']
  >([])
	const [queryParams, setQueryParams] = useState<any>({
		client:
      subgraphClients[
      	chainID || defaultChainId
      ].client,
	})

	// Uncomment to support public dashboards
	// Will cause conflict with changing workspace in future
	// useEffect(() => {
	// 	if(router && router.query) {
	// 		const { chainId: cId, daoId: dId } = router.query
	// 		setChainId((cId as unknown) as SupportedChainId)
	// 		setDaoId(dId?.toString())
	// 	}
	// }, [router])

	useEffect(() => {
		setChainId(getSupportedChainIdFromWorkspace(workspace))
		setDaoId(workspace?.id)
	}, [workspace])

	useEffect(() => {

		// console.log('rec workspace, daostats')

		if(!daoID || !chainID) {
			return
		}

		const query = {
			// fetch all grants,
			acceptingApplications: [true, false],
			minDeadline: UNIX_TIMESTAMP_MIN,
			maxDeadline: UNIX_TIMESTAMP_MAX,
		}

		setQueryParams({
			client:
        subgraphClients[chainID].client,
			variables: {
				first: 999,
				skip: 0,
				workspaceId: daoID,
				...query,
			},
			fetchPolicy: 'network-only',
		})

		getAnalyticsData()
	}, [chainID, daoID])


	const data = useGetAllGrantsForCreatorQuery(queryParams)

	useEffect(() => {
		if(data.data && data.data.grants && data.data.grants.length > 0) {
			// console.log('data.grants', data.data.grants)
			if(
				grants.length > 0 &&
        grants[0].workspace.id === data.data.grants[0].workspace.id &&
        grants[0].id !== data.data.grants[0].id
			) {
				setGrants([...grants, ...data.data.grants])
			} else {
				setGrants(data.data.grants)
			}
		}
	}, [data])

	const getAnalyticsData = async() => {
		// console.log('calling analytics')
		try {
			//const res = await fetch('https://www.questbook-analytics.com/workspace-analytics', {
			const res = await fetch(
				'https://www.questbook-analytics.com/workspace-analytics',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					referrerPolicy: 'unsafe-url',
					body: JSON.stringify({
						chainId: chainID,
						workspaceId: daoID,
					}),

					// For testing
					// body: JSON.stringify({
					// 	chainId: 137,
					// 	workspaceId: '0x2'
					// })
				}
			)

			const data = await res.json()
			// console.log('res', data)

			const { everydayFunding, totalFunding } = extractLast30Fundings(data)

			const grantsFunding = {} as any
			data?.grantsFunding?.forEach((f: any) => {
				grantsFunding[f.grantId] = f.funding
			})

			const grantsPending = {} as any
			data?.grantsPending?.forEach((f: any) => {
				grantsPending[f.grantId] = f.res
			})

			const grantsTat = {} as any
			data?.grantsTat?.forEach((f: any) => {
				grantsTat[f.grantId] = f.res
			})

			// console.log(grantsPending)

			setDaoStats({
				totalApplicants: data.totalApplicants,
				repeatApplicants: data.repeatApplicants,
				uniqueApplicants: data.uniqueApplicants,
				winnerApplicants: data.winnerApplicants,
				tat: data.tat,
				everydayApplications: extractLast30Applications(data),
				everydayFunding,
				totalFunding,
				grantsFunding,
				grantsPending,
				grantsTat
			})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch(e: any) {
			// console.log(e)
		}
	}

	const extractLast30Applications = (data: any) => {
		const everydayApplications = data.everydayApplications

		if(!everydayApplications || !everydayApplications.length) {
			return []
		}

		// console.log('everydayApplications', everydayApplications)

		const everydayApplicationsMap = {} as any
		everydayApplications.forEach((application: any) => {
			const timekey = application.fordate.split('T')[0] + 'T00:00:00.000Z'
			everydayApplicationsMap[timekey] = application.numApps
		})

		// const date = new Date(everydayApplications[0].fordate)
		// console.log(date)

		let today = new Date()
		// today = new Date(today.setDate(today.getDate() + 1))
		// console.log('today', today)

		// console.log('everydayApplicationsMap', everydayApplicationsMap)

		const everydayApplicationsLast30 = []
		for(let i = 0; i < 365; i++) {
			const timekey = today.toISOString().split('T')[0] + 'T00:00:00.000Z'
			// 00:00:00.000Z
			if(everydayApplicationsMap[timekey]) {
				everydayApplicationsLast30.push({
					date: today,
					applications: everydayApplicationsMap[timekey],
				})
			} else {
				everydayApplicationsLast30.push({
					date: today,
					applications: 0,
				})
			}

			today = new Date(today.setDate(today.getDate() - 1))
		}

		// console.log('everydayApplicationsLast30', everydayApplicationsLast30)
		return everydayApplicationsLast30.reverse()
	}

	const extractLast30Fundings = (data: any) => {
		const everydayFundings = data.everydayFunding
		let totalFunding = 0

		if(!everydayFundings || everydayFundings.length === 0) {
			return {
				everydayFunding: [],
				totalFunding,
			}
		}

		const everydayFundingsMap = {} as any
		everydayFundings.forEach((application: any) => {
			totalFunding += parseInt(application.funding)
			const timekey = application.fordate.split('T')[0] + 'T00:00:00.000Z'
			everydayFundingsMap[timekey] = application.funding
		})

		// const date = new Date(everydayFundings[0].fordate)
		// console.log(date)

		let today = new Date()
		// today = new Date(today.setDate(today.getDate() - 1))
		// console.log('today', today)

		// console.log('everydayApplicationsMap', everydayApplicationsMap)

		const everydayFundingsLast30 = []
		for(let i = 0; i < 365; i++) {
			const timekey = today.toISOString().split('T')[0] + 'T00:00:00.000Z'
			// 00:00:00.000Z
			if(everydayFundingsMap[timekey]) {
				everydayFundingsLast30.push({
					date: today,
					funding: everydayFundingsMap[timekey],
				})
			} else {
				everydayFundingsLast30.push({
					date: today,
					funding: 0,
				})
			}

			today = new Date(today.setDate(today.getDate() - 1))
		}

		// console.log('everydayApplicationsLast30', everydayApplicationsLast30)
		return {
			everydayFunding: everydayFundingsLast30.reverse(),
			totalFunding,
		}
	}

	return (
		<>
			<Container
				maxW='100%'
				display='flex'
				mb='300px'
				height='100%'>
				<Container
					flex={1}
					display='flex'
					flexDirection='column'
					maxW='1116px'
					alignItems='stretch'
					pb={8}
					px={10}
					pos='relative'
				>
					<Flex
						direction='row'
						mt={5}
						align='center'>
						<Text
							variant='heading'
							mr='14'>
							DAO Stats
						</Text>
						<Spacer />
						<Button
							onClick={() => setIsInviteModalOpen(true)}
							leftIcon={<LinkIcon />}
							variant='primaryV2' >
							Create invite link
						</Button>
						{/* <Menu
							placement="bottom"
							// align="right"
						>
							<Box
								width="169px"
								height="32px"
								borderRadius="8px"
								border="1px solid #AAAAAA"
								alignItems="center"
							>
								<MenuButton
									as={Button}
									mt="1"
									aria-label="View More Options"
									// mt="-28px"
									// pl="16px"
									variant="link"
									textDecoration="none"
									_focus={{}}
									leftIcon={<Image src="/ui_icons/calender-dao.svg" />}
									color="#373737"
									rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
									fontSize="16px"
									fontWeight="500"
									w="fit-content"
									mx="auto"
								>
          Last Month
								</MenuButton>
							</Box>
							<MenuList
								minW="164px"
								p={0}>
								<MenuItem>
									<Text
										fontSize="14px"
										fontWeight="400"
										lineHeight="20px"
										color="#122224"
									 >
										Last 3 Month
									</Text>
								</MenuItem>

								<MenuItem>
									<Text
										fontSize="14px"
										fontWeight="400"
										lineHeight="20px"
										color="#122224"
									 >
										Last 3 Month
									</Text>
								</MenuItem>
								<MenuItem>
									<Text
										fontSize="14px"
										fontWeight="400"
										lineHeight="20px"
										color="#122224"
									 >
										Last 3 Month
									</Text>
								</MenuItem>

							</MenuList>
						</Menu> */}
					</Flex>

					<DaoStatBoard
						totalApplicants={daoStats?.totalApplicants ?? 0}
						uniqueApplicants={daoStats?.uniqueApplicants ?? 0}
						repeatApplicants={daoStats?.repeatApplicants ?? 0}
						winnerApplicants={daoStats?.winnerApplicants ?? 0}
						tat={daoStats?.tat ?? 0}
					/>

					<Flex mt='4'>
						<Flex
							display='flex'
							flexDirection='row'
							alignItems='flex-start'
							gap='20px'
						>
							<BarGraph
								applications={daoStats?.everydayApplications ?? []}
								totalApplicants={daoStats?.totalApplicants ?? 0}
							/>

							<LineGraph
								fundings={daoStats?.everydayFunding ?? []}
								totalFunding={daoStats?.totalFunding ?? 0}
							/>
						</Flex>
					</Flex>

					<Heading
						fontSize='24px'
						fontWeight='700'
						mt='10'>
						{
							!grants || grants.filter(item => !daoStats?.grantsPending[item.id] || daoStats?.grantsPending[item.id] === 0).length > 0 ?
								'Grants' :
								`Grants (${grants.length})`
						}
					</Heading>

					<Flex mt='2'>
						<Flex
							direction='column'
							width='100%'
							align='center'
							borderRadius='8px 8px 0px 0px'
							borderBottom='1px solid #E8E9E9'
							background='#FFFFFF'
							height='56px'
							boxShadow='0px 0px 8px rgba(18, 34, 36, 0.15)'
						>
							<Header />
							{
								// !grants || grants.filter(item => !daoStats?.grantsPending[item.id] || daoStats?.grantsPending[item.id] === 0).length > 0 ? (
								grants?.filter(item => (daoStats?.grantsPending[item.id] > 0)).length > 0 ? (
									<>
										<TableContent
											grants={
												grants.map((g) => ({
													name: g.title,
													id: g.id,
												}))
											}
											funding={daoStats?.grantsFunding ?? {}}
											pending={daoStats?.grantsPending ?? {}}
											tat={daoStats?.grantsTat ?? {}}
										/>
									</>

								) : (
									<>
										<Flex
											mt='15px'
											direction='column'
											w='100%'
											border='1px solid #E8E9E9'
											align='stretch'
											background='#FFFFFF'
										>
											<DoaDashTableEmptyState />
										</Flex>
									</>
								)
							}
						</Flex>
					</Flex>
				</Container>
			</Container>
			<InviteModal
				isOpen={isInviteModalOpen}
				onClose={() => setIsInviteModalOpen(false)} />
		</>
	)
}

DaoDashboard.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default DaoDashboard
