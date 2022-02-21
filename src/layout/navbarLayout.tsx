import {
  Container, useToast, VStack,
} from '@chakra-ui/react';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { useAccount, useConnect, useNetwork } from 'wagmi';
import { useRouter } from 'next/router';
import {
  useGetNumberOfApplicationsLazyQuery,
  useGetNumberOfGrantsLazyQuery,
  useGetWorkspaceMembersLazyQuery,
} from 'src/generated/graphql';
import { MinimalWorkspace } from 'src/types';
import SignInNavbar from '../components/navbar/notConnected';
import ConnectedNavbar from '../components/navbar/connected';
import { ApiClientsContext } from '../../pages/_app';
import { getUrlForIPFSHash } from '../utils/ipfsUtils';

interface Props {
  children: React.ReactNode;
  renderGetStarted?: boolean;
  renderTabs?: boolean;
}

function NavbarLayout({ children, renderGetStarted, renderTabs }: Props) {
  const apiClients = useContext(ApiClientsContext);

  const { asPath } = useRouter();

  const [{ data: connectData }] = useConnect();
  const [{ data: accountData }] = useAccount({ fetchEns: false });
  const [{ data: networkData }] = useNetwork();

  const toast = useToast();

  const [workspaces, setWorkspaces] = React.useState<MinimalWorkspace[]>([]);
  const [selectedWorkspaceIndex, setSelectedWorkspaceIndex] = useState(0);

  const daoName = workspaces[selectedWorkspaceIndex]?.title;
  const daoId = workspaces[selectedWorkspaceIndex]?.id;
  const daoImage = workspaces[selectedWorkspaceIndex]
    ? getUrlForIPFSHash(workspaces[selectedWorkspaceIndex].logoIpfsHash)
    : undefined;

  const [connected, setConnected] = React.useState(false);

  const [numOfGrants, setNumOfGrants] = React.useState(0);
  const [numOfApplications, setNumOfApplications] = React.useState(0);

  const currentPageRef = useRef(null);

  const [getNumberOfApplications] = useGetNumberOfApplicationsLazyQuery({
    client: apiClients?.subgraphClient?.client,
  });

  const [getNumberOfGrants] = useGetNumberOfGrantsLazyQuery({
    client: apiClients?.subgraphClient?.client,
  });

  const [getWorkspaceMembers] = useGetWorkspaceMembersLazyQuery({
    client: apiClients?.subgraphClient?.client,
  });

  const getWorkspaceData = async (userAddress: string) => {
    try {
      const { data } = await getWorkspaceMembers({
        variables: { actorId: userAddress },
      });
      if (data?.workspaceMembers?.length) {
        setWorkspaces(data.workspaceMembers.map((w) => w.workspace));
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
      const { data } = await getNumberOfGrants({
        variables: {
          creatorId: userAddress,
        },
      });
      setNumOfGrants(data?.grants.length || 0);
    } catch (e) {
      toast({
        title: 'Error getting applicant data',
        status: 'error',
      });
    }
  };

  const getApplicantsCount = async (userAddress: string) => {
    try {
      const { data } = await getNumberOfApplications({
        variables: { applicantId: userAddress },
      });
      setNumOfApplications(data?.grantApplications.length || 0);
    } catch (e) {
      toast({
        title: 'Error getting applicant data',
        status: 'error',
      });
    }
  };

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

  useEffect(() => {
    const addr = accountData?.address;
    if (addr) {
      getWorkspaceData(addr);
      getGrantsCount(addr);
      getApplicantsCount(addr);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData?.address]);

  useEffect(() => {
    const id = workspaces[selectedWorkspaceIndex]?.id;
    apiClients?.setWorkspaceId(id);
  }, [selectedWorkspaceIndex, workspaces]);

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
          daoImage={daoImage || ''}
          grantsCount={numOfGrants}
          applicationCount={numOfApplications}
          workspaces={workspaces}
          setSelectedWorkspaceIndex={setSelectedWorkspaceIndex}
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
      {/* <Modal
        isOpen={networkData.chain! && networkData.chain?.id !== 4}
        onClose={() => {}}
        title="Wrong network!"
        showCloseButton={false}
      >
        <Text variant="tableHeader" color="#122224" my={8} mx={10} textAlign="center">
          We only support Rinkeby Network as of now! Extending to
          {' '}
          {networkData.chain?.name}
          {' '}
          soon!
        </Text>
      </Modal> */}

    </VStack>
  );
}

NavbarLayout.defaultProps = {
  renderGetStarted: false,
  renderTabs: true,
};
export default NavbarLayout;
