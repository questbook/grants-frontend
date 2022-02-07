import {
  Flex,
} from '@chakra-ui/react';
import React from 'react';

function FloatingSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex
        // h="calc(100vh - 80px)"
      bg="white"
      border="2px solid #D0D3D3"
      borderRadius={4}
      w={340}
      direction="column"
      alignItems="stretch"
      px="28px"
      py="22px"
    >
      {children}
    </Flex>
  );
}

export default FloatingSidebar;
