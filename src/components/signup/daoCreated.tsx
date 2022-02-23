/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Container, Flex, Box, Button, Link, Text, Image,
} from '@chakra-ui/react';
import React from 'react';
import supportedNetworks from '../../constants/supportedNetworks.json';

function DaoCreated({
  network,
  daoName,
  onCreateGrantClick,
  onVisitGrantsClick: onVisitMyGrantsClick,
}: {
  network: string;
  daoName: string;
  onCreateGrantClick: () => void;
  onVisitGrantsClick: () => void;
}) {
  return (
    <Container maxW="1024px" py={10}>
      <Flex direction="column" alignItems="center" mx="auto">
        <Image
          h="160px"
          w="156px"
          src="/illustrations/dao_created.svg"
          alt="dao_created"
        />
        <Text
          variant="heading"
          fontSize="45px"
          lineHeight="65px"
          fontWeight="500"
          textAlign="center"
          mt={9}
        >
          Yay! Your Grants DAO is successfully created.
        </Text>

        <Text fontSize="12px" lineHeight="20px" fontWeight="400">
          <Image
            mb="-2px"
            h="12px"
            w="12px"
            src="/ui_icons/info.svg"
            alt="info"
            display="inline-block"
          />
          {' '}
          Your Grants DAO is created on-chain on
          {' '}
          <Box as="span" fontWeight="700" display="inline-block">
            {supportedNetworks[network as keyof typeof supportedNetworks].name}
            {' '}
            {' '}
            network.
          </Box>
          {' '}
          <Link
            style={{ textDecoration: 'underline' }}
            href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
            isExternal
            variant="black"
          >
            Learn more
          </Link>
        </Text>

        <Text mt={10} fontSize="28px" lineHeight="24px" fontWeight="500">
          Grants DAO Name:
          {' '}
          <Link fontWeight="700" href="#">
            {daoName}
            <Image
              mx={1}
              src="/ui_icons/link.svg"
              alt="open link"
              display="inline-block"
            />
          </Link>
        </Text>

        <Text
          color="#122224"
          fontWeight="400"
          mt={12}
          px={8}
          textAlign="center"
        >
          Let&apos;s create your first grant on Questbook
        </Text>

        <Button
          onClick={() => onCreateGrantClick()}
          mt={8}
          variant="primary"
        >
          Create a Grant
        </Button>

        <Text
          mt={3}
          cursor="pointer"
          fontWeight="400"
          fontSize="16px"
          lineHeight="24px"
          color="#717A7C"
          onClick={() => onVisitMyGrantsClick()}
        >
          No, I will do it later.
        </Text>
      </Flex>
    </Container>
  );
}

export default DaoCreated;
