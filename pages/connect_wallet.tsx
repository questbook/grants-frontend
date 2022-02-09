import {
  Container,
  useToast,
  Text,
  Flex,
  Box,
  VStack,
  Image,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect } from 'react';
import { useConnect } from 'wagmi';
import ModalContent from '../src/components/connect_wallet/modalContent';
import WalletSelectButton from '../src/components/connect_wallet/walletSelectButton';
import Modal from '../src/components/ui/modal';
import SecondaryDropdown from '../src/components/ui/secondaryDropdown';
import Tooltip from '../src/components/ui/tooltip';
import NavbarLayout from '../src/layout/navbarLayout';
import supportedNetworks from '../src/constants/supportedNetworks.json';

function ConnectWallet() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedNetworkId, setSelectedNetworkId] = React.useState(1);
  const router = useRouter();

  const [{ data: connectData, loading: connectLoading }] = useConnect();

  useEffect(() => {
    if (!connectLoading && connectData && connectData.connected) {
      if (router.query.flow === 'getting_started/dao') {
        router.replace('/signup/');
      } else if (router.query.flow === 'getting_started/developer') {
        router.push({ pathname: '/', query: { account: true } });
      } else if (router.query.flow === '/') {
        router.push({
          pathname: '/explore_grants/about_grant',
          query: { account: true },
        });
      } else {
        router.push({ pathname: '/', query: { account: true } });
      }
    }
  }, [connectLoading, connectData, router]);

  const [{ data, error }, connect] = useConnect();
  const toast = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: error?.name,
        description: error?.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  }, [toast, error]);

  return (
    <Container
      maxW="100%"
      display="flex"
      px="70px"
      flexDirection="column"
      alignItems="center"
    >
      <Text mt="46px" variant="heading">
        Let&apos;s setup your account on Questbook
      </Text>
      <Text mt={7} textAlign="center">
        Use your existing crypto wallet
        <Tooltip label="Crypto wallet is an application or hardware device that allows users to store and retrieve digital assets." />
        or create a new one to start using Questbook
      </Text>

      <Flex alignItems="baseline" mt={7}>
        <Text fontWeight="400" color="#3E4969" mr={4}>
          Current Network
        </Text>
        <SecondaryDropdown
          // listElements={['Ethereum', 'Solana', 'Harmony', 'Bitcoin']}
          // isOpen={isMenuOpen}
          // setIsOpen={setIsMenuOpen}
          listItemsMinWidth="280px"
          listItems={Object.keys(supportedNetworks).map((networkId: any) => ({
            id: networkId,
            label: supportedNetworks[
              networkId.toString() as keyof typeof supportedNetworks
            ].name,
            icon: supportedNetworks[
              networkId.toString() as keyof typeof supportedNetworks
            ].icon,
          }))}
          // value={rewardCurrency}
          onChange={(id: number) => {
            setSelectedNetworkId(id);
          }}
        />
        <Box mr={3} />
        <Tooltip
          h="14px"
          w="14px"
          label="Crypto wallet is an application or hardware device that allows users to store and retrieve digital assets."
        />
      </Flex>

      <Box mt={7} />

      <VStack
        spacing={5}
        width="100%"
        maxW="496px"
        flexDirection="column"
        mt={7}
      >
        {supportedNetworks[
          selectedNetworkId.toString() as keyof typeof supportedNetworks
        ].wallets.map(({ name, icon, id }) => (
          <WalletSelectButton
            key={id}
            name={name}
            icon={icon}
            onClick={() => {
              const connector = data.connectors.find((x) => x.id === id);
              if (connector) {
                connect(connector);
              }
            }}
          />
        ))}
      </VStack>

      <Text variant="footer" mt="24px">
        <Image
          display="inline-block"
          src="/ui_icons/protip.svg"
          alt="pro tip"
          mb="-2px"
        />
        {' '}
        Preferably connect a wallet with access to funds to reward grantees
        easily.
      </Text>

      <Text variant="footer" my="36px">
        By connecting your wallet, you accept Questbook&apos;s
        {' '}
        <Link href="toc">Terms of Service</Link>
      </Text>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Unlock Wallet"
      >
        <ModalContent onClose={() => setIsModalOpen(false)} />
      </Modal>
    </Container>
  );
}

ConnectWallet.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
export default ConnectWallet;
