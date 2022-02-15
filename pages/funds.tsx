import {
  Flex, Text, Image, Box, Button, Divider,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import moment from 'moment';
import { useAllGrantsForDAO } from 'src/graphql/queries';
import AddFundsModal from '../src/components/funds/add_funds_modal';
import NavbarLayout from '../src/layout/navbarLayout';
import Deposits from '../src/components/funds/deposits';
import Withdrawals from '../src/components/funds/withdrawals';
import FundForAGrant from '../src/components/funds';

function AddFunds() {
  const { data } = useAllGrantsForDAO('0x19');

  return (
    <Flex direction="row" justify="center">
      <Flex w="80%" direction="column" align="start" mt={6}>
        <Text variant="heading">Funds</Text>
        {
          data.map(
            (grant) => <FundForAGrant grant={grant} />,
          )
        }
      </Flex>
    </Flex>
  );
}

AddFunds.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default AddFunds;
