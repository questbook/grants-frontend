import {
  Flex, Text, Image, Box, Button, Divider,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import NavbarLayout from '../src/layout/navbarLayout';
import FundForAGrant from '../src/components/funds';
import strings from '../src/constants/strings.json';

function AddFunds() {
  const numOfGrants = 3;

  return (
    <Flex direction="row" justify="center">
      <Flex w="80%" direction="column" align="start" mt={6}>
        <Text variant="heading">{strings.funds.heading}</Text>
        {Array(numOfGrants).fill(0).map((_, __) => (
          <FundForAGrant />
        ))}
      </Flex>
    </Flex>
  );
}

AddFunds.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default AddFunds;
