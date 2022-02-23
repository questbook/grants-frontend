import {
  Flex,
} from '@chakra-ui/react';
import React from 'react';

function FloatingSidebar({
  children,
  top,
}: {
  children: React.ReactNode;
  top?: number | string;
}) {
  return (
    <Flex
      bg="white"
      border="2px solid #D0D3D3"
      borderRadius={4}
      w={340}
      direction="column"
      alignItems="stretch"
      px="28px"
      py="22px"
      pos="sticky"
      top={top}
    >
      {children}
    </Flex>
  );
}

FloatingSidebar.defaultProps = {
  top: '40px',
};

export default FloatingSidebar;
