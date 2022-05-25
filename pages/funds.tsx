import React, { ReactElement, useContext, useEffect } from 'react'
import { Button, Flex } from '@chakra-ui/react'
import ArchivedGrantEmptyState from 'src/components/funds/empty_states/archived_grant'
import LiveGrantEmptyState from 'src/components/funds/empty_states/live_grants'
import Heading from 'src/components/ui/heading'
import { SupportedChainId } from 'src/constants/chains'
import { useGetAllGrantsForADaoQuery } from 'src/generated/graphql'
import {
	getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils'
import FundForAGrant from '../src/components/funds'
import NavbarLayout from '../src/layout/navbarLayout'
import { ApiClientsContext } from './_app'

function AddFunds() {
	const { workspace, subgraphClients } = useContext(ApiClientsContext)!

	const tabs = [
		{ index: 0, acceptingApplications: true, label: 'Live Grants' },
		{ index: 1, acceptingApplications: false, label: 'Archived' },
	]
	const [selectedTab, setSelectedTab] = React.useState(0)

	useEffect(() => {
		setSelectedTab(parseInt(localStorage.getItem('fundsTabSelected') ?? '0', 10))
	}, [])

	const { data } = useGetAllGrantsForADaoQuery({
		client:
      subgraphClients[
      	getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
		variables: {
			workspaceId: workspace?.id ?? '',
			acceptingApplications: tabs[selectedTab].acceptingApplications,
		},
	})

	const grants = data?.grants || []

	return (
		<Flex
			direction="row"
			justify="center">
			<Flex
				w="80%"
				direction="column"
				align="start"
				mt={6}
				h="100%">
				{/* <Text variant="heading">Funds</Text> */}
				<Heading title="Funds" />
				<Flex
					direction="row"
					mt={4}
					mb={4}>
					{
						tabs.map((tab) => (
							<Button
								padding="8px 24px"
								borderRadius="52px"
								minH="40px"
								bg={selectedTab === tab.index ? 'brand.500' : 'white'}
								color={selectedTab === tab.index ? 'white' : 'black'}
								onClick={
									() => {
										setSelectedTab(tab.index)
										localStorage.setItem(
											'fundsTabSelected',
											tab.index.toString(),
										)
									}
								}
								_hover={{}}
								fontWeight="700"
								fontSize="16px"
								lineHeight="24px"
								mr={3}
								border={selectedTab === tab.index ? 'none' : '1px solid #A0A7A7'}
								key={tab.index}
							>
								{tab.label}
							</Button>
						))
					}
				</Flex>
				{
					grants.map((grant) => (
						<FundForAGrant
							key={grant.id}
							grant={grant} />
					))
				}
				{/* {grants.length === 0 && (
          <Flex direction="column" align="center" w="100%" h="100%" mt={14}>
            <Empty
              src="/illustrations/empty_states/no_grants.svg"
              imgHeight="174px"
              imgWidth="146px"
              title="It's quite silent here!"
              subtitle="Get started by creating your grant and post it in less than 2 minutes."
            />
          </Flex>
        )} */}
				{
					grants.length === 0
            && (selectedTab === 0 ? (
            	<LiveGrantEmptyState />
            ) : (
            	<ArchivedGrantEmptyState />
            ))
				}
			</Flex>
		</Flex>
	)
}

AddFunds.getLayout = function(page: ReactElement) {
	return (
		<NavbarLayout>
			{page}
		</NavbarLayout>
	)
}

export default AddFunds
