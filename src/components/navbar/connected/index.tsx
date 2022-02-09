import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import AccountDetails from './accountDetails';
import Tab from './tab';

interface Props {
  networkId: number;
  address: string;
  isOnline: boolean;
  renderTabs: boolean;
  daoName: string;
  daoId: null | string;
}

function Navbar({
  networkId, address, isOnline, renderTabs, daoName, daoId,
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
        daoId ? (
          <Button
            onClick={() => {
              setActiveIndex(-1);
              router.push({
                pathname: '/',
              });
            }}
            m={0}
            h="100%"
            variant="ghost"
            display="flex"
            alignItems="center"
            borderRadius={0}
            background="linear-gradient(263.05deg, #EFF0F0 -7.32%, #FCFCFC 32.62%)"
            px="38px"
          >
            <Image w="32px" h="32px" mr="10px" src="/images/dummy/Polygon Icon.svg" />
            <Text
              color="#414E50"
              fontWeight="500"
              fontSize="16px"
              lineHeight="24px"
            >
              {daoName}
            </Text>
          </Button>
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
            daoId ? (
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

          <Flex h="100%" direction="column">
            <Tab
              label="My Applications"
              icon="/ui_icons/your_applications.svg"
              isActive={activeIndex === 3}
              onClick={() => {
                router.push({
                  pathname: `/${tabPaths[3]}`,
                });
              }}
            />
            {activeIndex === 3 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
          </Flex>

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
