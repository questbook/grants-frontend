import React, { useEffect } from 'react';
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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { MinimalWorkspace } from 'src/types';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import AccountDetails from './accountDetails';
import Tab from './tab';

interface Props {
  networkId: number;
  address: string;
  isOnline: boolean;
  renderTabs: boolean;
  daoName: string;
  daoId: null | string;
  daoImage: null | string;
  grantsCount: number;
  applicationCount: number;
  workspaces: MinimalWorkspace[];

  setSelectedWorkspaceIndex: (idx: number) => void
}

function Navbar({
  networkId, address, isOnline, renderTabs,
  daoName, daoId, daoImage, grantsCount, applicationCount, workspaces,
  setSelectedWorkspaceIndex,
}: Props) {
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const router = useRouter();
  const tabPaths = ['your_grants', 'funds', 'settings_and_members', 'your_applications'];

  useEffect(() => {
    const splitPaths = router.asPath.split('/');
    const basePath = splitPaths.length >= 1 ? splitPaths[1] : splitPaths[0];
    setActiveIndex(tabPaths.indexOf(basePath));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

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
      {
        daoId && daoImage ? (
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
              <Flex direction="row" align="center">
                <Image objectFit="cover" w="32px" h="32px" mr="10px" src={daoImage} display="inline-block" />
                <Text
                  color="#414E50"
                  fontWeight="500"
                  fontSize="16px"
                  lineHeight="24px"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {daoName}
                </Text>
                <Image ml={2} src="/ui_icons/dropdown_arrow.svg" alt="options" />
              </Flex>
            </MenuButton>
            <MenuList>
              {workspaces.map((workspace, idx) => (
                <MenuItem
                  key={workspace.id}
                  icon={(
                    <Image
                      boxSize="20px"
                      src={getUrlForIPFSHash(workspace.logoIpfsHash)}
                    />
                  )}
                  onClick={() => {
                    setSelectedWorkspaceIndex(idx);
                  }}
                >
                  {workspace.title}
                </MenuItem>
              ))}
              <MenuItem
                icon={<Image src="/ui_icons/gray/see.svg" />}
                onClick={() => {
                  router.push('/');
                }}
              >
                Browse Grants
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Image
            onClick={() => {
              setActiveIndex(-1);
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
        )
      }

      {renderTabs ? (
        <>
          {
            (daoId || grantsCount) ? (
              <>
                <Box mr="12px" />
                <Flex h="100%" direction="column">
                  <Tab
                    label="Grants"
                    icon={`/ui_icons/${activeIndex === 0 ? 'brand' : 'gray'}/tab_grants.svg`}
                    isActive={activeIndex === 0}
                    onClick={() => {
                      router.push({
                        pathname: `/${tabPaths[0]}`,
                      });
                    }}
                  />
                  {activeIndex === 0 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
                </Flex>
                <Flex h="100%" direction="column">
                  <Tab
                    label="Funds"
                    icon={`/ui_icons/${activeIndex === 1 ? 'brand' : 'gray'}/tab_funds.svg`}
                    isActive={activeIndex === 1}
                    onClick={() => {
                      router.push({
                        pathname: `/${tabPaths[1]}`,
                      });
                    }}
                  />
                  {activeIndex === 1 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
                </Flex>
                <Flex h="100%" direction="column">
                  <Tab
                    label="Settings And Members"
                    icon={`/ui_icons/${activeIndex === 2 ? 'brand' : 'gray'}/tab_settings.svg`}
                    isActive={activeIndex === 2}
                    onClick={() => {
                      router.push({
                        pathname: `/${tabPaths[2]}`,
                      });
                    }}
                  />
                  {activeIndex === 2 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
                </Flex>
              </>
            ) : null
          }

          <Box mr="auto" />

          {(!daoId || applicationCount > 0) && (
          <Flex h="100%" direction="column">
            <Tab
              label="My Applications"
              icon={`/ui_icons/${activeIndex === 3 ? 'brand' : 'gray'}/tab_grants.svg`}
              isActive={activeIndex === 3}
              onClick={() => {
                router.push({
                  pathname: `/${tabPaths[3]}`,
                });
              }}
            />
            {activeIndex === 3 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
          </Flex>
          )}

          <Box mr="8px" />

          <Button
            onClick={() => {
              if (daoId == null) {
                router.push({
                  pathname: '/signup',
                });
              } else {
                router.push({
                  pathname: '/your_grants/create_grant/',
                  // pathname: '/signup',
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

      <AccountDetails
        networkId={networkId}
        isOnline={isOnline}
        address={address}
      />
    </Container>
  );
}

// Navbar.defaultProps = defaultProps;
export default Navbar;
