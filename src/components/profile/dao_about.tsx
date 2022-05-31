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
  daoPartners?: any;
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
    direction="column"
    >
      <Text
      fontSize="1.5rem"
      lineHeight="2rem"
      fontWeight="700"
      color="#122224"
      >
        Partners
      </Text>
      {daoPartners.length >= 1 &&
        daoPartners.map((partner: any) => (
            <Grid
              gridTemplateColumns="1fr 1fr 1fr"
              alignItems="center"
              justifyContent="space-between"
            >
            <Image
              h="3rem"
              w="3rem"
              borderRadius="full"
              src="/illustrations/done.svg"
            />
            <Text
            fontSize="1rem"
            lineHeight="1.5rem"
            fontWeight="700"
            color="#191919"
            >
              {partner.name}
            </Text>
            {partner.link &&
            <Link
              href={partner.link}
            >
            <Image
              h="0.75rem"
              w="0.75rem"
              src="/ui_icons/link.svg"
            />
            </Link>}
            </Grid>
        ))
      }
    </Flex>
    </Grid>
  );
}

export default DaoAbout;
