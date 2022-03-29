import React from 'react';
import { Flex, Button } from '@chakra-ui/react';
import Empty from 'src/components/ui/empty';
import router from 'next/router';

function LiveGrantEmptyState() {
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
            router.push({
              pathname: '/your_grants/create_grant/',
            });
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
