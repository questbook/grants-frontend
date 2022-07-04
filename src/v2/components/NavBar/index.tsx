import { useContext } from 'react';
import { Container, Flex, Image, Text } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import ConnectWallet from './ConnectWallet';
import GetStarted from './GetStarted';
import { useRouter } from 'next/router';
import useChainId from 'src/hooks/utils/useChainId';
import { CHAIN_INFO, SHOW_TEST_NETS } from 'src/constants/chains';
import AccountDetails from './AccountDetails';

interface Props {
  onGetStartedClick: () => void;
}

function NavBar({ onGetStartedClick }: Props) {
  const { connected } = useContext(ApiClientsContext)!;
  const router = useRouter();
  const chainId = useChainId();

  return (
    <Container zIndex={1} variant="header-container" maxW="100vw" px={8}>
      <Image
        onClick={() =>
          router.push({
            pathname: '/',
          })
        }
        mr="auto"
        src="/ui_icons/qb.svg"
        alt="Questbook"
        cursor="pointer"
      />
      {connected && (
        <Flex align="center" justify="center" borderRadius="2px" bg="#F0F0F7" px={2.5} py={2.5}>
             <Image src='/ui_icons/ellipse.svg' boxSize="8px" mr={2} display="inline-block"/>
             <Text fontSize="14px" lineHeight="20px" fontWeight="500" color="#122224">
          {chainId
            ? CHAIN_INFO[chainId].isTestNetwork && !SHOW_TEST_NETS
              ? 'Unsupported Network'
              : CHAIN_INFO[chainId].name
            : 'Unsupported Network'}
        </Text>
        </Flex>
       
      )}
      {connected && <AccountDetails />}
      {!connected && <GetStarted onGetStartedClick={onGetStartedClick} />}
      {!connected && <ConnectWallet />}
    </Container>
  );
}

export default NavBar;
