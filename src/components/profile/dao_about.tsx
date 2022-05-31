/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Image,
  Text,
  Divider,
  Button,
  Flex,
  Grid,
  Box,
  Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface DaoAboutProps {
  daoAbout?: string;
  daoPartners?: string;
}

function DaoAbout({ daoAbout, daoPartners }: DaoAboutProps) {
  const router = useRouter();

  return (
    <Grid gridTemplateColumns="3fr 1fr" px="1.5rem" w="100%" h="full">
    <Flex
      borderRight="1px solid #E8E9E9"
      p="1.5rem"
    >
      <Text>
        {daoAbout}
      </Text>
    </Flex>
    <Flex
    p="1.5rem"
    >
      <Text>
        ASD
      </Text>
    </Flex>
    </Grid>
  );
}

export default DaoAbout;
