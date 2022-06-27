import React from 'react';
import { Button, Flex } from '@chakra-ui/react';
import router from 'next/router';
import Empty from 'src/components/ui/empty';
import { ApiClientsContext } from 'pages/_app';

function LiveGrantEmptyState() {
  const apiClients = React.useContext(ApiClientsContext)!;
  const { workspace, grantsCount } = apiClients;

  return (
    <Flex direction="row" w="100%">
      <Flex
        direction="column"
        justify="center"
        h="100%"
        align="center"
        mt={10}
        mx="auto"
      >
        <Empty
          src="/illustrations/empty_states/no_live_grant.svg"
          imgHeight="174px"
          imgWidth="146px"
          title="It’s quite silent here!"
          subtitle="Get started by creating your grant and post it in less than 2 minutes."
        />

        <Button
          mt={16}
          onClick={() => {
            console.log('Create a grant!');
            console.log(workspace);
            console.log(workspace?.id);
            if (!workspace?.id) {
              router.push({
                pathname: '/signup',
              });
            } else if (grantsCount === 0) {
              router.push({
                pathname: '/signup',
                query: { create_grant: true },
              });
            } else {
              router.push({
                pathname: '/your_grants/create_grant/',
              });
            }
          }}
          maxW="163px"
          variant="primary"
          mr="12px"
        >
          Create a Grant
        </Button>
      </Flex>
    </Flex>
  );
}

export default LiveGrantEmptyState;
