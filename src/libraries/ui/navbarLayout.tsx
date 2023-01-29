import React, { useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import NavBar from 'src/libraries/ui/NavBar'
import logger from 'src/utils/logger'
import Sidebar from 'src/v2/components/Sidebar'

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
	renderSidebar?: boolean
}

function NavbarLayout({ children, renderNavbar, navbarConfig, renderSidebar, requestProposal }: Props) {
	const [renderCount, setRenderCount] = useState(0)

	useEffect(() => {
		logger.info({ renderNavbar, renderSidebar }, 'Render Navbar Layout')
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
					/>
				)
			}
			<Flex
				direction='row'
				maxH='calc(100vh - 64px)'
				bg='gray.1'>
				{
					renderSidebar && (
						<Flex
							display={{ base: 'none', lg: 'flex' }}
							w='20%'
							pos='sticky'
							top='64px'
							left={0}
							bottom={0}
						>
							<Sidebar />
						</Flex>
					)
				}
				<Flex
					className='body'
					zIndex={0}
					w={renderSidebar ? '80%' : '100%'}
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
