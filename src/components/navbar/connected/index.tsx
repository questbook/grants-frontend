import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from '@chakra-ui/react';
import router from 'next/router';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import useActiveTabIndex from 'src/hooks/utils/useActiveTabIndex';
import {
  useGetNumberOfApplicationsLazyQuery,
  useGetNumberOfGrantsLazyQuery,
  useGetWorkspaceMembersLazyQuery,
} from 'src/generated/graphql';
import { ApiClientsContext } from 'pages/_app';
import { useAccount } from 'wagmi';
import { MinimalWorkspace } from 'src/types';
import Tab from './tab';
import AccountDetails from './accountDetails';

function Navbar({ renderTabs }: { renderTabs: boolean }) {
  const toast = useToast();
  const [{ data: accountData }] = useAccount();
  const tabPaths = [
    'your_grants',
    'funds',
    'settings_and_members',
    'your_applications',
  ];
  const activeIndex = useActiveTabIndex(tabPaths);

  const [workspaces, setWorkspaces] = React.useState<MinimalWorkspace[]>([]);
  const [grantsCount, setGrantsCount] = React.useState(0);
  const [applicationCount, setApplicationCount] = React.useState(0);

  const apiClients = useContext(ApiClientsContext)!;
  const { workspace, setWorkspace, subgraphClients } = apiClients;
  const [isAdmin, setIsAdmin] = React.useState(false);

  // eslint-disable-next-line max-len
  const getNumberOfApplicationsClients = Object.keys(subgraphClients)!.map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (key) => useGetNumberOfApplicationsLazyQuery({
      client: subgraphClients[key].client,
    }),
  );

  const getNumberOfGrantsClients = Object.keys(subgraphClients)!.map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (key) => useGetNumberOfGrantsLazyQuery({ client: subgraphClients[key].client }),
  );

  useEffect(() => {
    if (!accountData?.address) return;
    if (!workspace) return;

    const getNumberOfApplications = async () => {
      try {
        const promises = getNumberOfApplicationsClients.map(
          // eslint-disable-next-line no-async-promise-executor
          (query) => new Promise(async (resolve) => {
            const { data } = await query[0]({
              variables: { applicantId: accountData?.address },
            });
            if (data && data.grantApplications.length > 0) {
              resolve(data.grantApplications.length);
            } else {
              resolve(0);
            }
          }),
        );
        Promise.all(promises).then((value: any[]) => {
          setApplicationCount(value.reduce((a, b) => a + b, 0));
        });
      } catch (e) {
        toast({
          title: 'Error getting application count',
          status: 'error',
        });
      }
    };

    const getNumberOfGrants = async () => {
      try {
        const promises = getNumberOfGrantsClients.map(
          // eslint-disable-next-line no-async-promise-executor
          (query) => new Promise(async (resolve) => {
            const { data } = await query[0]({
              variables: { workspaceId: workspace?.id },
            });
            if (data && data.grants.length > 0) {
              resolve(data.grants.length);
            } else {
              resolve(0);
            }
          }),
        );
        Promise.all(promises).then((value: any[]) => {
          setGrantsCount(value.reduce((a, b) => a + b, 0));
        });
      } catch (e) {
        toast({
          title: 'Error getting grants count',
          status: 'error',
        });
      }
    };

    getNumberOfApplications();
    getNumberOfGrants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accountData?.address,
    workspace?.id,
  ]);

  const getAllWorkspaces = Object.keys(subgraphClients)!.map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (key) => useGetWorkspaceMembersLazyQuery({ client: subgraphClients[key].client }),
  );
  useEffect(() => {
    if (workspace && workspace.members && workspace.members.length > 0) {
      const tempMember = workspace.members.find(
        (m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
      );
      setIsAdmin(tempMember?.accessLevel === 'admin' || tempMember?.accessLevel === 'owner');
    }
  }, [accountData?.address, workspace]);

  useEffect(() => {
    if (!accountData?.address) return;
    if (!getAllWorkspaces) return;
    // if (!set) return;

    const getWorkspaceData = async (userAddress: string) => {
      try {
        const promises = getAllWorkspaces.map(
          // eslint-disable-next-line no-async-promise-executor
          (allWorkspaces) => new Promise(async (resolve) => {
            // console.log('calling grants');
            const { data } = await allWorkspaces[0]({
              variables: { actorId: userAddress },
            });
            if (data && data.workspaceMembers.length > 0) {
              resolve(data.workspaceMembers.map((w) => w.workspace));
            } else {
              resolve([]);
            }
          }),
        );
        Promise.all(promises).then((values: any[]) => {
          const allWorkspacesData = [].concat(...values) as MinimalWorkspace[];
          // setGrants([...grants, ...allGrantsData]);
          // setCurrentPage(currentPage + 1);
          console.log('all workspaces', allWorkspacesData);
          setWorkspaces([...workspaces, ...allWorkspacesData]);

          const i = allWorkspacesData.findIndex(
            (w) => w.id === localStorage.getItem('currentWorkspaceId') ?? 'undefined',
          );
          setWorkspace(allWorkspacesData[i === -1 ? 0 : i]);
        });
      } catch (e) {
        // console.log(e);
        toast({
          title: 'Error getting workspace data',
          status: 'error',
        });
      }
    };
    getWorkspaceData(accountData?.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [isDiscover, setIsDiscover] = useState<boolean>(false);

  return (
    <Container
      zIndex={1}
      variant="header-container"
      maxW="100vw"
      pr={8}
      pl={0}
      alignItems="center"
      minH="80px"
    >
      {workspace ? (
        <Menu>
          <MenuButton
            as={Button}
            m={0}
            h="100%"
            variant="ghost"
            display="flex"
            alignItems="center"
            borderRadius={0}
            background="linear-gradient(263.05deg, #EFF0F0 -7.32%, #FCFCFC 32.62%)"
            px="38px"
          >
            <Flex direction="row" align="center" gap="8px">
            {isDiscover ? <Image src="/ui_icons/gray/see.svg"/> :     <Image
                  objectFit="cover"
                  w="32px"
                  h="32px"
                  src={getUrlForIPFSHash(workspace.logoIpfsHash)}
                  display="inline-block"
                />}
              <Text
                color="#414E50"
                fontWeight="500"
                fontSize="16px"
                lineHeight="24px"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {isDiscover ? "Discover Grants" : workspace.title}
              </Text>
              <Image ml={2} src="/ui_icons/dropdown_arrow.svg" alt="options" />
            </Flex>
          </MenuButton>

          <MenuList maxH="80vh" overflowY="auto">
            {workspaces.map((userWorkspace) => (
              <MenuItem
                key={`${userWorkspace.id}-${userWorkspace.supportedNetworks[0]}`}
                icon={(
                  <Image
                    boxSize="20px"
                    src={getUrlForIPFSHash(userWorkspace.logoIpfsHash)}
                  />
                )}
                onClick={() => {
                  setWorkspace(userWorkspace);
                  setIsDiscover(false);
                }}
              >
                {userWorkspace.title}
              </MenuItem>
            ))}
            <MenuItem
              icon={<Image src="/ui_icons/gray/see.svg" />}
              onClick={() => {
                router.push('/');
                setIsDiscover(true);
              }}
            >
              Discover Grants
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Image
          onClick={() => {
            router.push({
              pathname: '/',
            });
          }}
          h={9}
          w={8}
          src="/questbook_logo.svg"
          alt="Questbook"
          cursor="pointer"
          ml={8}
        />
      )}

      {renderTabs ? (
        <>
          {workspace?.id || grantsCount ? (
            <>
              <Box mr="12px" />
              <Flex h="100%" direction="column">
                <Tab
                  label="Grants"
                  icon={`/ui_icons/${
                    activeIndex === 0 ? 'brand' : 'gray'
                  }/tab_grants.svg`}
                  isActive={activeIndex === 0}
                  onClick={() => {
                    router.push({
                      pathname: `/${tabPaths[0]}`,
                    });
                  }}
                />
                {activeIndex === 0 ? (
                  <Box w="100%" h="2px" bgColor="#8850EA" />
                ) : null}
              </Flex>
              <Flex h="100%" direction="column" display={isAdmin ? '' : 'none'}>
                <Tab
                  label="Funds"
                  icon={`/ui_icons/${
                    activeIndex === 1 ? 'brand' : 'gray'
                  }/tab_funds.svg`}
                  isActive={activeIndex === 1}
                  onClick={() => {
                    router.push({
                      pathname: `/${tabPaths[1]}`,
                    });
                  }}
                />
                {activeIndex === 1 ? (
                  <Box w="100%" h="2px" bgColor="#8850EA" />
                ) : null}
              </Flex>
              <Flex h="100%" direction="column" display={isAdmin ? '' : 'none'}>
                <Tab
                  label="Settings And Members"
                  icon={`/ui_icons/${
                    activeIndex === 2 ? 'brand' : 'gray'
                  }/tab_settings.svg`}
                  isActive={activeIndex === 2}
                  onClick={() => {
                    router.push({
                      pathname: `/${tabPaths[2]}`,
                    });
                  }}
                />
                {activeIndex === 2 ? (
                  <Box w="100%" h="2px" bgColor="#8850EA" />
                ) : null}
              </Flex>
            </>
          ) : null}

          <Box mr="auto" />

          {(!workspace?.id || applicationCount > 0) && (
            <Flex h="100%" direction="column">
              <Tab
                label="My Applications"
                icon={`/ui_icons/${
                  activeIndex === 3 ? 'brand' : 'gray'
                }/tab_grants.svg`}
                isActive={activeIndex === 3}
                onClick={() => {
                  router.push({
                    pathname: `/${tabPaths[3]}`,
                  });
                }}
              />
              {activeIndex === 3 ? (
                <Box w="100%" h="2px" bgColor="#8850EA" />
              ) : null}
            </Flex>
          )}

          <Box mr="8px" />

          <Button
            display={isAdmin ? undefined : 'none'}
            onClick={() => {
              if (workspace?.id == null) {
                router.push({
                  pathname: '/signup',
                });
              } else {
                router.push({
                  pathname: '/your_grants/create_grant/',
                });
              }
            }}
            maxW="163px"
            variant="primary"
            mr="12px"
          >
            Create a Grant
          </Button>
        </>
      ) : (
        <Box mr="auto" />
      )}

      <AccountDetails />
    </Container>
  );
}

// Navbar.defaultProps = defaultProps;
export default Navbar;
