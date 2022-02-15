import { Flex, Text } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';
import { useAllGrantsForDAO } from '../src/graphql/queries';
import NavbarLayout from '../src/layout/navbarLayout';
import FundForAGrant from '../src/components/funds';
import { ApiClientsContext } from './_app';

function AddFunds() {
  const workspaceId = useContext(ApiClientsContext)?.workspaceId;
  const { data } = useAllGrantsForDAO(workspaceId);

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
