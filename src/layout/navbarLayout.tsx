import { Container, VStack } from '@chakra-ui/react';
import React from 'react';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import SignInNavbar from '../components/navbar/notConnected';
import ConnectedNavbar from '../components/navbar/connected';

interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
  // const router = useRouter();
  // const supportedChainIds = Object.keys(supportedNetworks);

  const [{ data: connectData }] = useConnect();
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });
  const [{ data: networkData }] = useNetwork();

  return (
    <VStack alignItems="center" maxH="100vh" width="100%" spacing={0} p={0}>
      {accountData && networkData && connectData ? (
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
      <Container maxW="100vw" p={0} overflow="scroll">
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
