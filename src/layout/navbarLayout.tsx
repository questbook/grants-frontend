import React, { useEffect, useRef } from 'react'
import { Container, useToast, VStack } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import ConnectedNavbar from '../components/navbar/connected'
import SignInNavbar from '../components/navbar/notConnected'
interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
	const { isDisconnected, isConnected, isError, isIdle, isConnecting, isReconnecting, connect, connectors } = useConnect()
	const toast = useToast()

	const [connected, setConnected] = React.useState(false)
	const currentPageRef = useRef(null)

	useEffect(() => {
		if(!connected && isDisconnected) {
			setConnected(false)
			toast({
				title: 'Disconnected',
				status: 'info',
			})
		} else if(isConnected) {
			setConnected(true)
		} else if(connected && isDisconnected) {
			connect(connectors[0])
			setConnected(true)
		}

	}, [isConnected, isDisconnected])

	return (
		<VStack
			alignItems="center"
			maxH="100vh"
			width="100%"
			spacing={0}
			p={0}>
			{
				connected ? (
					<ConnectedNavbar
						renderTabs={renderTabs!}
						connected={connected}
						setConnected={setConnected} />
				) : (
					<SignInNavbar renderGetStarted={renderGetStarted} />
				)
			}
			{/*
        root of children should also be a container with a max-width,
        this container is to render the scrollbar to extreme right of window
      */}
			<Container
				ref={currentPageRef}
				maxW="100vw"
				p={0}
				overflow="auto">
				{children}
			</Container>
		</VStack>
	)
}

NavbarLayout.defaultProps = {
	renderGetStarted: false,
	renderTabs: true,
}
export default NavbarLayout
