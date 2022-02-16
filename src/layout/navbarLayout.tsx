import { Container, useToast, VStack } from '@chakra-ui/react';
import React, {
  useContext, useEffect, useRef,
} from 'react';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { getNumberOfApplicationsQuery, getNumberOfGrantsQuery } from 'src/graphql/daoQueries';
import SignInNavbar from '../components/navbar/notConnected';
import ConnectedNavbar from '../components/navbar/connected';
import { ApiClientsContext } from '../../pages/_app';
import { getWorkspacesQuery } from '../graphql/workspaceQueries';
import { getUrlForIPFSHash } from '../utils/ipfsUtils';

interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
  const apiClients = useContext(ApiClientsContext);
  const [daoName, setDaoName] = React.useState('');
  const [daoId, setDaoId] = React.useState<string | null>(null);
  const [daoImage, setDaoImage] = React.useState<string | null>(null);

  const toast = useToast();
  const [connected, setConnected] = React.useState(false);

  const currentPageRef = useRef(null);
  const { asPath } = useRouter();

  const [{ data: connectData }] = useConnect();
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });
  const [{ data: networkData }] = useNetwork();

  const [numOfGrants, setNumOfGrants] = React.useState(0);
  const [numOfApplications, setNumOfApplications] = React.useState(0);

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
    if (!apiClients) return;

    const { subgraphClient, setWorkspaceId } = apiClients;
    if (!subgraphClient) return;
    try {
      const { data } = await subgraphClient.client
        .query({
          query: gql(getWorkspacesQuery),
          variables: {
            ownerId: userAddress,
          },
        }) as any;
      // console.log(data);
      if (data.workspaces.length > 0) {
        const workspace = data.workspaces[0];
        setDaoId(workspace.id);
        setDaoName(workspace.title);
        setDaoImage(getUrlForIPFSHash(workspace.logoIpfsHash));
        setWorkspaceId(workspace.id);
      } else {
        setDaoId(null);
        setDaoName('');
        setDaoImage(null);
      }
    } catch (e) {
      toast({
        title: 'Error getting workspace data',
        status: 'error',
      });
    }
  };

  const getGrantsCount = async (userAddress: string) => {
    if (!apiClients) return;

    const { subgraphClient } = apiClients;
    if (!subgraphClient) return;
    try {
      const { data } = await subgraphClient.client
        .query({
          query: gql(getNumberOfGrantsQuery),
          variables: {
            creatorId: userAddress,
          },
        }) as any;
      // console.log(data);
      setNumOfGrants(data.grants.length);
    } catch (e) {
      toast({
        title: 'Error getting applicant data',
        status: 'error',
      });
    }
  };

  const getApplicantsCount = async (userAddress: string) => {
    if (!apiClients) return;

    const { subgraphClient } = apiClients;
    if (!subgraphClient) return;
    try {
      const { data } = await subgraphClient.client
        .query({
          query: gql(getNumberOfApplicationsQuery),
          variables: {
            applicantId: userAddress,
          },
        }) as any;
      // console.log(data);
      setNumOfApplications(data.grantApplications.length);
    } catch (e) {
      toast({
        title: 'Error getting applicant data',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    getWorkspaceData(accountData?.address ?? '');
    getGrantsCount(accountData?.address ?? '');
    getApplicantsCount(accountData?.address ?? '');
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
          daoImage={daoImage}
          grantsCount={numOfGrants}
          applicationCount={numOfApplications}
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
