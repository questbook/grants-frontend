import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import SidebarList from 'src/components/browse_grants/sidebar/sidebarList'
import SidebarComponent from 'src/components/ui/sidebar/sidebar'
import config from 'src/constants/config.json'

function Sidebar() {
	return (
		<SidebarComponent
			links={
				[
					{
						href: config.supportLink,
						label: 'Support 24*7',
						iconUrl: '/sidebar/discord_icon.svg',
					},
					{
						href: 'https://www.notion.so/questbook/Contracts-7cea3bdfb6be47e68f165b4a719c662f',
						label: 'On Chain Contract',
						iconUrl: '/sidebar/onchain_icon.svg',
					},
				]
			}
		>
			<Flex
				flex={1}
				w='full'
				direction='column'
				py={7}
				px={10}
				// overflow="scroll"
			>
				<Text
					fontSize='28px'
					lineHeight='35.5px'>
					What is
					<br />
					<Text
						as='span'
						display='inline-block'
						fontWeight='700'>
						Questbook?
					</Text>
				</Text>

				<Box mt={8}>
					<SidebarList
						listHeading='Protocols & DAOs'
						listElements={
							[
								{
									src: '/sidebar/create_grants.svg',
									text: 'Create Grants',
								},
								{
									src: '/sidebar/attract_applicants.svg',
									text: 'Attract Applicants',
								},
								{
									src: '/sidebar/review_application.svg',
									text: 'Review Application',
								},
								{
									src: '/sidebar/deploy_funds.svg',
									text: 'Deploy funds',
								},
							]
						}
						linkText='See our guide'
						linkHref='https://www.notion.so/questbook/Grant-DAO-Wiki-e844026ab4344b67b447a7aa390ae053'
					/>
				</Box>

				<Box mt={8}>
					<SidebarList
						listHeading='Buidlers'
						listElements={
							[
								{
									src: '/sidebar/explore_grants.svg',
									text: 'Explore Grants',
								},
								{
									src: '/sidebar/apply_for_grants.svg',
									text: 'Apply for grants',
								},
								{
									src: '/sidebar/win_grants.svg',
									text: 'Win Grants',
								},
							]
						}
						linkText='See our guide'
						linkHref='https://www.notion.so/questbook/Talent-Wiki-2927326de319415f87264a139621bbae'
					/>
				</Box>
			</Flex>
		</SidebarComponent>
	)
}

export default Sidebar
