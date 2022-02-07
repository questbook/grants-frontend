import { Flex, useTheme } from '@chakra-ui/react';
import React from 'react';

function FloatingSidebar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <Flex
      // h="calc(100vh - 80px)"
      bg={theme.colors.backgrounds.floatingSidebar}
      border="1px solid #E8E9E9"
      borderRadius={12}
      maxW={340}
      direction="column"
      alignItems="stretch"
      px={10}
      py={5}
    >
      {children}
    </Flex>
  );
}

export default FloatingSidebar;
