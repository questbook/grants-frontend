import React from 'react';
import { Text, Heading, Grid, Flex } from '@chakra-ui/react';

interface Props {
  disbursed: Array<number>;
  applicants: Array<number>;
  winners: Array<number>;
  time: string;
}

function DaoData({ disbursed, applicants, winners, time }: Props) {

  console.log(disbursed)

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
        >${disbursed.reduce((sum, a) => sum + a, 0).toFixed(0)}</Heading>
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
      lineHeight="1.5rem">{applicants.reduce((sum, a) => sum + a, 0)}</Heading>
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
      lineHeight="1.5rem">{winners.length}</Heading>
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
