import React from 'react';
import { Text, Heading, Grid, Flex } from '@chakra-ui/react';

interface Props {
  grants: string;
  applicants: string;
  winners: string;
  time: string;
}

function DaoData({ grants, applicants, winners, time }: Props) {
  return (
    <Grid
    gap="1rem"
    gridTemplateColumns="repeat(4, 1fr)"
    w={{
      base: '100%',
      sm: '85%',
      lg: '70%',
    }}>
      <Flex direction="column">
        <Heading
        color="#122224"
        fontSize="1.2rem"
        lineHeight="1.5rem"
        >{grants}</Heading>
        <Text
          fontSize="0.875rem"
          lineHeight="24px"
          fontWeight="400"
          color="#AAAAAA"
        >
          Grants Disbursed
        </Text>
      </Flex>

      <Flex direction="column">
      <Heading
      color="#122224"
      fontSize="1.2rem"
      lineHeight="1.5rem">{applicants}</Heading>
        <Text
          fontSize="0.875rem"
          lineHeight="24px"
          fontWeight="400"
          color="#AAAAAA"
        >Applicants</Text>
      </Flex>

      <Flex direction="column">
      <Heading
      color="#122224"
      fontSize="1.2rem"
      lineHeight="1.5rem">{winners}</Heading>
        <Text
          fontSize="0.875rem"
          lineHeight="24px"
          fontWeight="400"
          color="#AAAAAA"
        >Winners</Text>
      </Flex>

      <Flex direction="column">
      <Heading
      color="#122224"
      fontSize="1.2rem"
      lineHeight="1.5rem">{time}</Heading>
        <Text
          fontSize="0.875rem"
          lineHeight="24px"
          fontWeight="400"
          color="#AAAAAA"
        >Time to release funds</Text>
      </Flex>
    </Grid>
  );
}

export default DaoData;
