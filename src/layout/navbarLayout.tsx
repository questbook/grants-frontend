import React, { useContext, useEffect, useRef } from 'react'
import { Container, useToast, VStack } from '@chakra-ui/react'
import { useAccount, useConnect, useNetwork } from 'wagmi'
import ConnectedNavbar from '../components/navbar/connected'
import SignInNavbar from '../components/navbar/notConnected'
import { ApiClientsContext } from 'pages/_app'
interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
	const { isDisconnected, isConnected, isError, isIdle, isConnecting, isReconnecting, connect, connectors, data: connectData, status: connectStatus, error } = useConnect()
	const { data: networkData, pendingChainId, activeChain, status: networkStatus } = useNetwork()
	const { data: accountData, isLoading, isFetching, isFetched, isRefetching, isSuccess, status: accountStatus } = useAccount()
	const toast = useToast()

	const { connected, setConnected } = useContext(ApiClientsContext)!;
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

	useEffect(() => {
		console.log('CONNECTION: ', connected, isConnected, isConnecting, isReconnecting, isDisconnected, isError, isIdle, connectData, connectStatus, error);
	}, [connected, isConnected, isConnecting, isReconnecting, isDisconnected, isError, isIdle, connectStatus, error]);

	useEffect(() => {
		console.log('ACCOUNT: ', accountData, isLoading, isFetching, isFetched, isRefetching, isSuccess, accountStatus);
	}, [accountData, isLoading, isFetching, isFetched, isRefetching, isSuccess, accountStatus]);

	useEffect(() => {
		console.log('USE NETWORK: ', activeChain, networkStatus, pendingChainId, networkData)
	}, [pendingChainId, activeChain, networkStatus, networkData]);

	return (
		<VStack
			alignItems="center"
			maxH="100vh"
			width="100%"
			spacing={0}
			p={0}>
			{
				connected ? (
					<ConnectedNavbar renderTabs={renderTabs!} />
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
