import { Flex, Container, useTheme } from '@chakra-ui/react';
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
      flex={1}
      bg={theme.colors.backgrounds.floatingSidebar}
      maxW={663}
      direction="column"
      alignItems="stretch"
      px={10}
      py={6}
    >
      <Container
        px={10}
        pb={7}
        bgColor="white"
        borderRadius={12}
      >
        <GrantDetails
          grantDetails={grantDetails}
          grantSummary={grantSummary}
        />
      </Container>
    </Flex>
  );
}

export default Sidebar;
