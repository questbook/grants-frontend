import { Flex, ResponsiveValue, Text } from '@chakra-ui/react';
import React from 'react';

function Headers({ is_reviewer }:{ is_reviewer : boolean; }) {
  const tableHeaders = [
    'Applicant Address',
    'Project Name',
    'Funding',
    'Reviewers',
    'Status',
    'Last update on',
    'Actions',
  ];

  const tableHeadersReviewer = [
    'Applicant Address',
    'Sent On',
    'Project Name',
    'Funding Ask',
    'Status',
    'Actions',
  ];
  const tableHeadersflex = [0.231, 0.20, 0.15, 0.16, 0.16, 0.28, 0.116];
  const tableHeadersflexReviewer = [0.231, 0.15, 0.184, 0.116, 0.22, 0.116];

  const tableHeadersAlign = [
    'left',
    'left',
    'left',
    'center',
    'center',
    'center',
    'center',
  ];

  const tableHeadersAlignReviewer = [
    'left',
    'left',
    'left',
    'left',
    'center',
    'center',
  ];
  const Tableduel = is_reviewer ? (tableHeadersReviewer) : (tableHeaders);
  return (
    <Flex direction="row" w="100%" justify="strech" align="center" py={0}>
      {Tableduel.map((header, index) => (
        <Text
          whiteSpace="nowrap"
          textAlign={is_reviewer ? (tableHeadersAlignReviewer[index] as ResponsiveValue<'left' | 'center'>) : ((tableHeadersAlign[index] as ResponsiveValue<'left' | 'center'>))}
          flex={is_reviewer ? (tableHeadersflexReviewer[index]) : (tableHeadersflex[index])}
          variant="tableHeader"
        >
          {header}
        </Text>
      ))}
    </Flex>
  );
}

export default Headers;
