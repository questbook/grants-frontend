import { Container, useToast, VStack } from '@chakra-ui/react';
import React, {
  useContext, useEffect, useRef,
} from 'react';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import SignInNavbar from '../components/navbar/notConnected';
import ConnectedNavbar from '../components/navbar/connected';
import { ApiClientsContext } from '../../pages/_app';
import { getWorkspacesQuery } from '../graphql/workspaceQueries';

interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient.client;
  const [daoName, setDaoName] = React.useState('');
  const [daoId, setDaoId] = React.useState<string | null>(null);

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
        status: 'info',
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

  const getWorkspaceData = async (userAddress: string) => {
    if (!subgraphClient) return;
    try {
      const { data } = await subgraphClient
        .query({
          query: gql(getWorkspacesQuery),
          variables: {
            ownerId: userAddress,
          },
        }) as any;
      // console.log(data);
      if (data.workspaces.length > 0) {
        setDaoId(data.workspaces[0].id);
        setDaoName(data.workspaces[0].title);
      } else {
        setDaoId(null);
        setDaoName('');
      }
    } catch (e) {
      toast({
        title: 'Error getting workspace data',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    getWorkspaceData(accountData?.address ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData]);

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
          daoName={daoName}
          daoId={daoId}
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
