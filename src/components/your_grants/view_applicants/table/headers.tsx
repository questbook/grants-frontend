import { Flex, ResponsiveValue, Text } from '@chakra-ui/react';
import React from 'react';

function Headers() {
  const tableHeaders = [
    'Applicant Address',
    'Project Name',
    'Funding',
    'Reviewers',
    'Status',
    'Last update on',
    'Actions',
  ];
  const tableHeadersflex = [0.231, 0.15, 0.20, 0.116, 0.22, 0.21, 0.116];
  const tableHeadersAlign = [
    'left',
    'left',
    'left',
    'left',
    'center',
    'center',
    'center',
  ];
  return (
    <Flex direction="row" w="100%" justify="strech" align="center" py={0}>
      {tableHeaders.map((header, index) => (
        <Text
          whiteSpace="nowrap"
          textAlign={tableHeadersAlign[index] as ResponsiveValue<'left' | 'center'>}
          flex={tableHeadersflex[index]}
          variant="tableHeader"
        >
          {header}
        </Text>
      ))}
    </Flex>
  );
}

export default Headers;
