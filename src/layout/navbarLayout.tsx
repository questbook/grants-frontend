import React, { useContext, useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import logger from 'src/utils/logger'
import NavBar from 'src/v2/components/NavBar'
import Sidebar from 'src/v2/components/Sidebar'

interface Props {
  children: React.ReactNode
  renderNavbar?: boolean
  renderSidebar?: boolean
}

function NavbarLayout({ children, renderNavbar, renderSidebar }: Props) {
	const { connected, setConnected } = useContext(ApiClientsContext)!

	const [renderCount, setRenderCount] = useState(0)

	useEffect(() => {
		logger.info({ renderNavbar, renderSidebar }, 'Render Navbar Layout')
		setConnected(true)
		setRenderCount(renderCount + 1)
	}, [])

	return (
		<Flex
			direction='column'
			w='100%'
			h='100%'
			overscrollBehavior='none'>
			{
				renderNavbar && (
					<NavBar
					/>
				)
			}
			<Flex direction='row'>
				{
					renderSidebar && connected && (
						<Flex
							display={{ base: 'none', lg: 'flex' }}
							w='20%'
							h='calc(100% - 64px)'
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
					zIndex={0}
					w={renderSidebar && connected ? '80%' : '100%'}
					maxH='calc(100% - 64px)'
					overflowY='scroll'
					overscrollBehavior='none'>
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
