import { Flex, Text } from '@chakra-ui/react';
import React, { ReactElement, useContext, useEffect } from 'react';
import Empty from 'src/components/ui/empty';
import { useGetAllGrantsForADaoQuery } from 'src/generated/graphql';
import { useRouter } from 'next/router';
import { SupportedChainId } from 'src/constants/chains';
import NavbarLayout from '../src/layout/navbarLayout';
import FundForAGrant from '../src/components/funds';
import { ApiClientsContext } from './_app';

function AddFunds() {
  const {
    workspace, setWorkspaceId, setChainId, subgraphClient,
  } = useContext(ApiClientsContext)!;
  const router = useRouter();
  const { data } = useGetAllGrantsForADaoQuery({
    client: subgraphClient.client,
    variables: {
      workspaceId: workspace?.id ?? '',
    },
  });

  useEffect(() => {
    if (router && router.query) {
      const { workspaceId: wId, chainId: cId } = router.query;
      setWorkspaceId(wId as string);
      setChainId(cId as unknown as SupportedChainId);
    }
  }, [router, setChainId, setWorkspaceId]);

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
        {grants.length === 0 && (
          <Flex direction="column" align="center" w="100%" h="100%" mt={14}>
            <Empty
              src="/illustrations/empty_states/no_grants.svg"
              imgHeight="174px"
              imgWidth="146px"
              title="It's quite silent here!"
              subtitle="Get started by creating your grant and post it in less than 2 minutes."
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
