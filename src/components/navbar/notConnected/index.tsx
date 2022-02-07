import React from 'react';
import { Container, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import GetStarted from './getStarted';
import ConnectWallet from './connectWallet';

interface Props {
  renderGetStarted?: boolean;
}
const defaultProps = { renderGetStarted: false };

function Navbar({ renderGetStarted }: Props) {
  const router = useRouter();
  return (
    <Container zIndex={1} variant="header-container" maxW="100vw" px={8} py={6}>
      <Image
        onClick={() => router.push({
          pathname: '/',
        })}
        h={9}
        w={8}
        mr="auto"
        src="/questbook_logo.svg"
        alt="Questbook"
        cursor="pointer"
      />
      {renderGetStarted ? <GetStarted /> : null}
      <ConnectWallet />
    </Container>
  );
}

Navbar.defaultProps = defaultProps;
export default Navbar;
