import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Image,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import AccountDetails from './accountDetails';
import Tab from './tab';

interface Props {
  networkId: number;
  address: string;
  isOnline: boolean;
  renderTabs: boolean
}

function Navbar({
  networkId, address, isOnline, renderTabs,
}: Props) {
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const router = useRouter();
  return (
    <Container
      zIndex={1}
      variant="header-container"
      maxW="100vw"
      px={8}
      alignItems="center"
      minH="80px"
    >
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
      />

      {renderTabs ? (
        <>
          <Box mr="12px" />
          <Flex h="100%" direction="column">
            <Tab
              label="Grants"
              icon="/ui_icons/your_applications.svg"
              isActive={activeIndex === 0}
              onClick={() => {
                setActiveIndex(0);
                router.push({
                  pathname: '/your_grants',
                });
              }}
            />
            {activeIndex === 0 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
          </Flex>
          <Flex h="100%" direction="column">
            <Tab
              label="Funds"
              icon="/ui_icons/your_applications.svg"
              isActive={activeIndex === 1}
              onClick={() => {
                setActiveIndex(1);
                router.push({
                  pathname: '/funds',
                });
              }}
            />
            {activeIndex === 1 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
          </Flex>
          <Flex h="100%" direction="column">
            <Tab
              label="Settings And Members"
              icon="/ui_icons/your_applications.svg"
              isActive={activeIndex === 2}
              onClick={() => {
                setActiveIndex(2);
                router.push({
                  pathname: '/settings_and_members/',
                });
              }}
            />
            {activeIndex === 2 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
          </Flex>

          <Box mr="auto" />

          <Flex h="100%" direction="column">
            <Tab
              label="My Applications"
              icon="/ui_icons/your_applications.svg"
              isActive={activeIndex === 3}
              onClick={() => {
                setActiveIndex(3);
                router.push({
                  pathname: '/your_applications',
                });
              }}
            />
            {activeIndex === 3 ? <Box w="100%" h="2px" bgColor="#8850EA" /> : null}
          </Flex>

          <Box mr="8px" />

          <Button
            onClick={() => router.push({
              pathname: '/your_grants/create_grant/',
              query: {
                account: true,
              },
            })}
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
