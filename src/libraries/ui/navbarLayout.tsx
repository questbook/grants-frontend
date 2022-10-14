import React, { useContext, useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import NavBar from 'src/libraries/ui/NavBar'
import { ApiClientsContext } from 'src/pages/_app'
import logger from 'src/utils/logger'
import Sidebar from 'src/v2/components/Sidebar'

interface Props {
  children: React.ReactNode
  renderNavbar?: boolean
	renderSidebar?: boolean
	renderSearchBar?: boolean
}

function NavbarLayout({ children, renderNavbar, renderSidebar, renderSearchBar }: Props) {
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
					<NavBar showSearchBar={renderSearchBar ?? false} />
				)
			}
			<Flex
				direction='row'
				maxH='calc(100vh - 64px)'
				bg='#F5F5F5'>
				{
					renderSidebar && connected && (
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
					zIndex={0}
					w={renderSidebar && connected ? '80%' : '100%'}
					overflowY='auto'
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
