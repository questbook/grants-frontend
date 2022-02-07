import {
  Container,
  Progress,
  Image,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';

function Loading() {
  const [timeElapsed, setTimeElapsed] = React.useState(0);
  useEffect(() => {
    setTimeElapsed(0);
    setTimeout(() => {
      setTimeElapsed(1);
    }, 10000);
  }, []);

  return (
    <Container
      minH="calc(100vh - 80px)"
      justifyContent="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={12}
    >
      {timeElapsed < 1 ? (
        <Image
          src="/create_dao/loading.svg"
          mb={16}
          h={126}
          w={121}
        />
      ) : (
        <Image
          src="/create_dao/loading-2.svg"
          mb={16}
          w={432}
          h={193.11}
        />
      )}
      <Text fontSize="24px" fontWeight="26px" variant="heading">
        {timeElapsed < 1 ? (
          'Setting up your Grants DAO ...'
        ) : (
          <>
            Click on the
            {' '}
            <Image
              display="inline-block"
              src="/wallet_icons/metamask.svg"
            />
            {' '}
            icon in your browser.
            {' '}
          </>
        )}
      </Text>
      <Progress mt="45px" h={2} borderRadius={24} w="100%" isIndeterminate colorScheme="brand" />
    </Container>
  );
}

export default Loading;
