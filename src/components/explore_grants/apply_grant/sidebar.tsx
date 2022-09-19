import React from 'react'
import { Flex, useTheme } from '@chakra-ui/react'
import GrantDetails from 'src/components/explore_grants/about_grant/grantDetails'

function Sidebar({
	grantSummary,
	grantDetails,
}: {
  grantSummary: string
  grantDetails: string
}) {
	const theme = useTheme()
	return (
		<Flex
			bg={theme.colors.backgrounds.floatingSidebar}
			direction='column'
			alignItems='center'
			px={10}
			py={0}
			h='100%'
		>
			<Flex
				px={10}
				pb={7}
				m={10}
				bgColor='white'
				borderRadius={12}
				direction='column'
				w='100%'
				maxW='calc(40vw - 64px)'
				overflowY='auto'
				position='sticky'
				maxH='calc(100vh - 150px)'
			>
				<GrantDetails
					grantDetails={grantDetails}
					grantSummary={grantSummary}
				/>
			</Flex>
		</Flex>
	)
}

export default Sidebar
