import { Flex, Text } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';
import { useGetAllGrantsForADaoQuery } from 'src/generated/graphql';
import NavbarLayout from '../src/layout/navbarLayout';
import FundForAGrant from '../src/components/funds';
import { ApiClientsContext } from './_app';
// import strings from '../src/constants/strings.json';

function AddFunds() {
  const { workspaceId, subgraphClient } = useContext(ApiClientsContext)!;
  const { data } = useGetAllGrantsForADaoQuery({
    client: subgraphClient.client,
    variables: {
      workspaceId: workspaceId!,
    },
  });

  const grants = data?.grants || [];

  return (
    <Flex direction="row" justify="center">
      <Flex w="80%" direction="column" align="start" mt={6}>
        <Text variant="heading">Funds</Text>
        {
          grants.map(
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
