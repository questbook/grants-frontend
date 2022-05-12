import { Container, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useAccount, useConnect } from 'wagmi';
import SignInNavbar from '../components/navbar/notConnected';
import ConnectedNavbar from '../components/navbar/connected';

interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
  const [{ data: connectData }] = useConnect();
  const [{ data: accountData }] = useAccount({ fetchEns: false });
  const toast = useToast();

  const [connected, setConnected] = React.useState(false);
  const currentPageRef = useRef(null);

  useEffect(() => {
    if (connected && !connectData.connected) {
      setConnected(false);
      toast({
        title: 'Disconnected',
        status: 'info',
      });
    } else if (!connected && connectData.connected) {
      setConnected(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectData]);

  return (
    <VStack alignItems="center" maxH="100vh" width="100%" spacing={0} p={0}>
      {accountData && connectData ? (
        <ConnectedNavbar renderTabs={renderTabs ?? true} />
      ) : (
        <SignInNavbar renderGetStarted={renderGetStarted} />
      )}
      {/*
        root of children should also be a container with a max-width,
        this container is to render the scrollbar to extreme right of window
      */}
      <Container ref={currentPageRef} maxW="100vw" p={0} overflow="auto">
        {children}
      </Container>
    </VStack>
  );
}

NavbarLayout.defaultProps = {
  renderGetStarted: false,
  renderTabs: true,
};
export default NavbarLayout;
