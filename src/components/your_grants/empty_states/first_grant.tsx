import React from 'react';
import { Flex } from '@chakra-ui/react';
import Empty from 'src/components/ui/empty';

function FirstGrantEmptyState() {
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
          src="/illustrations/empty_states/first_grant.svg"
          imgHeight="174px"
          imgWidth="146px"
          title="Your grant is being published.."
          subtitle="You may visit this page after a while to see the published grant. Once published, the grant will be live and will be open for anyone to apply."
        />

      </Flex>
    </Flex>
  );
}

export default FirstGrantEmptyState;
