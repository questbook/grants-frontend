import React, {
	ReactElement, useContext, useEffect, useState,
} from 'react'
import { Box, Button, Container, Flex, Heading, Image, Menu, MenuButton, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import DoaDashTableEmptyState from 'src/components/dao_dashboard/empty_states/dao_dashboard'
import BarGraph from 'src/components/dao_dashboard/graph/bar_graph'
import LineGraph from 'src/components/dao_dashboard/graph/line_graph'
import DaoStatBoard from 'src/components/dao_dashboard/statboard/stat_board'
import TableContent from 'src/components/dao_dashboard/table/content'
import Header from 'src/components/dao_dashboard/table/headers'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'
import NavbarLayout from '../../src/layout/navbarLayout'

const Tabledata = [
	{
		'name':'LP management tools for perp v2 LP management tools for perp v2',
		'Pendingapp':'15',
		'disburded':'$12500',
		'responseTa':'6d12hr',
		'status':'reviwed'
	},

	{
		'name':'LP management tools for perp v2',
		'Pendingapp':'15',
		'disburded':'$12500',
		'responseTa':'6d12hr',
		'status':'reviwed'
	},
	{
		'name':'LP management tools for perp v2',
		'Pendingapp':'15',
		'disburded':'$12500',
		'responseTa':'6d12hr',
		'status':'reviwed'
	},
	{
		'name':'LP management tools for perp v2',
		'Pendingapp':'15',
		'disburded':'$12500',
		'responseTa':'6d12hr',
		'status':'reviwed'
	},
	{
		'name':'Unity implementation of metametalang',
		'Pendingapp':'200',
		'disburded':'$1000500',
		'responseTa':'6d12hr',
		'status':'reviwed'
	},
	{
		'name':'LP management tools for perp v2',
		'Pendingapp':'15',
		'disburded':'$12500',
		'responseTa':'6d12hr',
		'status':'reviwed'
	},
	{
		'name':'Unity implementation of metametalang',
		'Pendingapp':'15',
		'disburded':'$12500',
		'responseTa':'6d12hr',
		'status':'reviwed'
	},
]

function DaoDashboard() {

	const { workspace, subgraphClients } = useContext(ApiClientsContext)!
	const [daoStats, setDaoStats] = useState<{
		totalApplicants: number,
		uniqueApplicants: number,
		repeatApplicants: number,
	}>()

	useEffect(() => {
		console.log(workspace)
		console.log(getSupportedChainIdFromWorkspace(workspace)!)
	}, [])

	useEffect(() => {
		if(!workspace || !getSupportedChainIdFromWorkspace(workspace)!) {
			return
		}

		if(daoStats) {
			return
		}

		getAnalyticsData()

	}, [workspace, daoStats])

	const getAnalyticsData = async() => {
		const res = await fetch('http://43.204.147.240:3300/workspace-analytics', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chainId: getSupportedChainIdFromWorkspace(workspace)!,
				workspaceId: workspace!.id
			})
		})

		const data = await res.json()
		console.log('res', data)

		setDaoStats({
			totalApplicants: data.totalApplicants,
			repeatApplicants: data.repeatApplicants,
			uniqueApplicants: data.uniqueApplicants,
		})
	}

	return (

		<>
			<Container
				maxW="100%"
				display="flex"
				px="70px"
				mb="300px"
				height="100%"

			>
				<Container
					flex={1}
					display="flex"
					flexDirection="column"
					maxW="1116px"
					alignItems="stretch"
					pb={8}
					px={10}
					pos="relative"
				 >
					<Flex
						direction="row"
						mt={5}
						align="center">
						<Text
							variant="heading"
							mr="14">
						DAO Stats
						</Text>
						<Spacer />

						<Menu
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
						</Menu>
					</Flex>

					<DaoStatBoard
						totalApplicants={daoStats?.totalApplicants ?? 0}
						uniqueApplicants={daoStats?.uniqueApplicants ?? 0}
						repeatApplicants={daoStats?.repeatApplicants ?? 0}
					/>


					<Flex mt="4">


						<Flex
							display="flex"
							flexDirection="row"
							alignItems="flex-start"
							gap="20px"

						>
							<BarGraph

							/>

							<LineGraph
								app_count={''}
								title={''} />


						</Flex>


					</Flex>

					<Heading
						fontSize="24px"
						fontWeight="700"
						mt="10"
						 >
						Grants (
						{Tabledata.length}
)
					</Heading>

					<Flex
						mt="2"
					>

						<Flex
						 direction="column"
					     width="100%"
						 align="center"
						 borderRadius="8px 8px 0px 0px"
						 borderBottom="1px solid #E8E9E9"
						 background="#FFFFFF"
						 height="56px"
						 boxShadow="0px 0px 8px rgba(18, 34, 36, 0.15)"
						>
							<Header />
							{
								Tabledata.length === 0 ? (

									<>

										<Flex
											mt="15px"
											direction="column"
											w="100%"
											border="1px solid #E8E9E9"
											align="stretch"
											background="#FFFFFF"
										>
											<DoaDashTableEmptyState
											 />
										</Flex>
									</>
								) : (

									<>
										<TableContent
							 data={Tabledata}
										/>

									</>
								)
							}
						</Flex>

					</Flex>


				</Container>
			</Container>

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