import React, { useContext, useEffect, useRef, useState } from 'react'
import { Flex, useToast } from '@chakra-ui/react'
import { ApiClientsContext } from 'pages/_app'
import { useQuestbookAccount } from 'src/hooks/gasless/useQuestbookAccount'
import NavBar from 'src/v2/components/NavBar'
import Sidebar from 'src/v2/components/Sidebar'
import { useConnect, useNetwork } from 'wagmi'
interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
	const { isDisconnected, isConnected, isError, isIdle, isConnecting, isReconnecting, connect, connectors, data: connectData, status: connectStatus, error } = useConnect()
	const { data: networkData, pendingChainId, activeChain, status: networkStatus } = useNetwork()
	const { data: accountData } = useQuestbookAccount()
	const toast = useToast()

	const [connectWalletModalIsOpen, setConnectWalletModalIsOpen] =
    useState(false)

	const { connected, setConnected } = useContext(ApiClientsContext)!
	const currentPageRef = useRef(null)

	const [renderCount, setRenderCount] = useState(0)

	useEffect(() => {
		console.log('Render Count: ', renderCount)
	}, [renderCount])

	useEffect(() => {
		// @TODO-gasless: FIX HERE
		setConnected(true)
		// if(!connected && isDisconnected) {
		// 	setConnected(false)
		// 	if(renderCount > 0) {
		// 		toast({
		// 			title: 'Disconnected',
		// 			status: 'info',
		// 		})
		// 	}
		// } else if(isConnected) {
		// 	setConnected(true)
		setRenderCount(renderCount + 1)
		// } else if(connected && isDisconnected) {
		// 	connect(connectors[0])
		// 	setConnected(true)
		// 	setRenderCount(renderCount + 1)
		// }

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
				onGetStartedClick={() => setConnectWalletModalIsOpen(true)} />
			<Flex
				w="100vw"
				h="100vh"
				overflow="scroll">
				{connected && <Sidebar />}
				{children}
			</Flex>
		</>
	)
}

NavbarLayout.defaultProps = {
	renderGetStarted: false,
	renderTabs: true,
}
export default NavbarLayout
