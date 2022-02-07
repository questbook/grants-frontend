import { Flex, ResponsiveValue, Text } from '@chakra-ui/react';
import React from 'react';

function Headers() {
  const tableHeaders = [
    'Applicant Address',
    'Sent On',
    'Applicant Name',
    'Funding Asked',
    'Status',
    'Actions',
  ];
  const tableHeadersflex = [0.251, 0.15, 0.184, 0.116, 0.2, 0.116];
  const tableHeadersAlign = [
    'left',
    'left',
    'left',
    'left',
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
