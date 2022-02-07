import React from 'react';
import { Box, Text, useTheme } from '@chakra-ui/react';

function Breadcrumbs({ path }: { path: string[] }) {
  const theme = useTheme();
  return (
    <Text
      mt={5}
      fontWeight="400"
      fontSize="16px"
      lineHeight="24px"
      color="#122224"
      ml="-56px"
    >
      {path.map((node, index) => {
        if (index === path.length - 1) {
          return;
        }
        // eslint-disable-next-line consistent-return
        return (
          <>
            {node}
            {' '}
            /
            {' '}
          </>
        );
      })}
      <Box
        as="span"
        display="inline-block"
        color={theme.colors.brand[500]}
        fontWeight="bold"
      >
        {path[path.length - 1]}
      </Box>
    </Text>
  );
}
export default Breadcrumbs;
