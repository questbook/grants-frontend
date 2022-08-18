import React, { useContext, useEffect, useState } from 'react'
import { Flex, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { ApiClientsContext } from 'pages/_app'
import ConnectWalletModal from 'src/v2/components/ConnectWalletModal'
import NavBar from 'src/v2/components/NavBar'
import Sidebar from 'src/v2/components/Sidebar'
import { useConnect } from 'wagmi'

interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
	const { isDisconnected, isConnected, connect, connectors } = useConnect()
	const toast = useToast()
	const router = useRouter()
	const [connectWalletModalIsOpen, setConnectWalletModalIsOpen] =
    useState(false)

	const { connected, setConnected } = useContext(ApiClientsContext)!

	const [renderCount, setRenderCount] = useState(0)

	useEffect(() => {
		if(!connected && isDisconnected) {
			setConnected(false)
			if(renderCount > 0) {
				toast({
					title: 'Disconnected',
					status: 'info',
				})
			}
		} else if(isConnected) {
			setConnected(true)
			setRenderCount(renderCount + 1)
		} else if(connected && isDisconnected) {
			connect(connectors[0])
			setConnected(true)
			setRenderCount(renderCount + 1)
		}
	}, [isConnected, isDisconnected])

	return (
		<>
			{/* {
				connected ? (
					<ConnectedNavbar renderTabs={renderTabs!} />
				) : (
					<SignInNavbar
						renderGetStarted={renderGetStarted}
						onGetStartedClick={() => setConnectWalletModalIsOpen(true)}
					/>
				)
			} */}
			<NavBar
				onGetStartedClick={true}
				onGetStartedBtnClicked={false}
				setGetStartedClicked={() => {}}
			/>
			<Flex
				w="100vw"
				h="100vh"
				overflow="scroll">
				<Flex
					display={{ base: 'none', lg: 'flex' }}
					w="20%"
					pos="sticky"
					top={0}
				>
					<Sidebar />
				</Flex>

				{/* <Sidebar /> */}
				{children}
			</Flex>
			<ConnectWalletModal
				isOpen={connectWalletModalIsOpen}
				onClose={() => setConnectWalletModalIsOpen(false)}
				redirect={() => router.push({ pathname: '/onboarding' })}
			/>
		</>
	)
}

NavbarLayout.defaultProps = {
	renderGetStarted: false,
	renderTabs: true,
}
export default NavbarLayout
