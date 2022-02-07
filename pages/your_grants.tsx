import { Container } from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import NavbarLayout from '../src/layout/navbarLayout';

function YourGrants() {
  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="834px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        Your Grants
      </Container>
    </Container>
  );
}

YourGrants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderGetStarted>{page}</NavbarLayout>;
};
export default YourGrants;
