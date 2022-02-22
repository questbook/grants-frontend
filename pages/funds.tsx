import { Flex, Text } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';
import Empty from 'src/components/ui/empty';
import { useRouter } from 'next/router';
import { useAllGrantsForDAO } from '../src/graphql/queries';
import NavbarLayout from '../src/layout/navbarLayout';
import FundForAGrant from '../src/components/funds';
import { ApiClientsContext } from './_app';

function AddFunds() {
  const workspaceId = useContext(ApiClientsContext)?.workspaceId;
  const { data } = useAllGrantsForDAO(workspaceId!);
  const router = useRouter();
  return (
    <Flex direction="row" justify="center">
      <Flex w="80%" direction="column" align="start" mt={6}>
        <Text variant="heading">Funds</Text>
        {
          data.length > 0 && data.map(
            (grant) => <FundForAGrant grant={grant} />,
          )
        }
        {data.length === 0 && (
          <Flex direction="column" align="center" w="100%" h="100%" mt={14}>
            <Empty
              src={`/illustrations/empty_states/${router.query.done ? 'first_grant.svg' : 'no_grants.svg'}`}
              imgHeight="174px"
              imgWidth="146px"
              title={router.query.done
                ? 'Your grant is being published..'
                : 'It’s quite silent here!'}
              subtitle={router.query.done
                ? 'You may visit this page after a while to see the published grant. Once published, the grant will be live and will be open for anyone to apply.'
                : 'Get started by creating your grant and post it in less than 2 minutes.'}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

AddFunds.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default AddFunds;
