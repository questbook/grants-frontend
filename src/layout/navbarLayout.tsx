import { Container, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import SignInNavbar from '../components/navbar/notConnected';
import ConnectedNavbar from '../components/navbar/connected';

interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
  const toast = useToast();
  const [connected, setConnected] = React.useState(false);

  const currentPageRef = useRef(null);
  const { asPath } = useRouter();

  const [{ data: connectData }] = useConnect();
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });
  const [{ data: networkData }] = useNetwork();

  useEffect(() => {
    if (connected && !connectData.connected) {
      setConnected(false);
      toast({
        title: 'Disconnected',
      });
    } else if (!connected && connectData.connected) {
      setConnected(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectData]);

  // useEffect(() => {
  //   console.log(accountData);
  // }, [accountData]);

  // useEffect(() => {
  //   console.log(networkData, loading, error);
  // }, [networkData]);

  useEffect(() => {
    if (asPath && asPath.length > 0) {
      const { current } = currentPageRef;
      if (!current) return;
      (current as HTMLElement).scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [asPath]);

  return (
    <VStack alignItems="center" maxH="100vh" width="100%" spacing={0} p={0}>
      {accountData && connectData ? (
        <ConnectedNavbar
          networkId={networkData.chain?.id ?? -1}
          address={accountData.address}
          isOnline={connectData.connected}
          renderTabs={renderTabs ?? true}
        />
      ) : (
        <SignInNavbar renderGetStarted={renderGetStarted} />
      )}
      {/*
        root of children should also be a container with a max-width,
        this container is to render the scrollbar to extreme right of window
      */}
      <Container ref={currentPageRef} maxW="100vw" p={0} overflow="scroll">
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
