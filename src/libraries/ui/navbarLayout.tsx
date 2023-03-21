import React, { useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import NavBar from 'src/libraries/ui/NavBar'
import logger from 'src/libraries/utils/logger'

type NavbarConfig = {
	bg?: string
	showLogo?: boolean
	showSearchBar?: boolean
	showInviteProposals?: boolean
	showAddMembers?: boolean
	showDomains?: boolean
	showStats?: boolean
	showOpenDashboard?: boolean
}

type Props = {
	children: React.ReactNode

	//Navbar configs
	renderNavbar?: boolean
	navbarConfig?: NavbarConfig
	requestProposal?: boolean
	//Sidebar configs
	dashboard?: boolean
	openSignIn?: boolean
}
function NavbarLayout({ openSignIn, children, renderNavbar, navbarConfig, requestProposal, dashboard }: Props) {
	const [renderCount, setRenderCount] = useState(0)

	useEffect(() => {
		logger.info({ renderNavbar }, 'Render Navbar Layout')
		setRenderCount(renderCount + 1)
	}, [])
	return (
		<Flex
			direction='column'
			w='100%'
			h='100vh'
			overscrollBehavior='none'>
			{
				renderNavbar && (
					<NavBar
						{...navbarConfig}
						requestProposal={requestProposal}
						dashboard={dashboard}
						openSignIn={openSignIn}
					/>
				)
			}
			<Flex
				direction='row'
				maxH='calc(100vh - 64px)'
				bg='gray.100'>
				<Flex
					className='body'
					zIndex={0}
					w='100%'
					overflowY='auto'
					overscrollBehavior='none'
					justifyContent='center'>
					{children}
				</Flex>
			</Flex>
		</Flex>
	)
}

NavbarLayout.defaultProps = {
	renderNavbar: true,
	renderSidebar: true,
}

export default NavbarLayout
