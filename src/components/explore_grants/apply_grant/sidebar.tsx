import { Flex, useTheme } from '@chakra-ui/react';
import React from 'react';
import GrantDetails from '../about_grant/grantDetails';

function Sidebar({
  grantSummary,
  grantDetails,
}: {
  grantSummary: string;
  grantDetails: string;
}) {
  const theme = useTheme();
  return (
    <Flex
      bg={theme.colors.backgrounds.floatingSidebar}
      direction="column"
      alignItems="center"
      px={10}
      py={0}
      pos="absolute"
      w="50%"
      h="calc(100% - 80px)"
    >
      <Flex
        px={10}
        pb={7}
        m={10}
        bgColor="white"
        borderRadius={12}
        direction="column"
        w="100%"
        overflowY="scroll"
      >
        <GrantDetails
          grantDetails={grantDetails}
          grantSummary={grantSummary}
        />
      </Flex>
    </Flex>
  );
}

export default Sidebar;
