import {
  Container, Flex, Button, Link, Text, useTheme, Image,
} from '@chakra-ui/react';
import React from 'react';

function Dao({
  onClick,
}: {
  onClick: () => void;
}) {
  const theme = useTheme();
  return (
    <Container
      maxW="100%"
      display="flex"
      px="70px"
      flexDirection="column"
      alignItems="center"
    >
      <Text mt="46px" variant="heading">
        Here&apos;s what you can do on Questbook
      </Text>
      <Flex mt="88px">
        {[
          {
            icon: '/illustrations/create_grant.svg',
            title: 'Create a Grant',
            text: 'In 2 minutes setup a simple, streamlined and transparent grant',
          },
          {
            icon: '/illustrations/attract_applications.svg',
            title: 'Attract applicants',
            text: 'Projects are pitched by applicants with detailed forms.',
          },
          {
            icon: '/illustrations/disburse_grants.svg',
            title: 'Disburse grants',
            text: 'Track project milestones, and reward grantees.',
          },
        ].map(({ icon, title, text }, index) => (
          <Container
            display="flex"
            flexDirection="column"
            alignItems="center"
            maxW="300px"
            ml={index === 0 ? 0 : '70px'}
          >
            <Image h="158px" w="128px" src={icon} />
            <Text
              mt={9}
              fontFamily="Spartan, sans-serif"
              fontSize="20px"
              lineHeight="25px"
              fontWeight="700"
              textAlign="center"
            >
              {title}
            </Text>
            <Text mt={3} fontWeight="400" textAlign="center">
              {text}
            </Text>
          </Container>
        ))}
      </Flex>

      <Button
        onClick={() => onClick()}
        variant="primary"
        my={16}
      >
        Continue
      </Button>

      <Container
        bgColor={theme.colors.backgrounds.card}
        p={0}
        maxW="100vw"
        w="auto"
        m={0}
        position="sticky"
        bottom={0}
        display="flex"
        justifyContent="center"
        py={3}
      >
        <Text w="100vw" textAlign="center" variant="footer" fontSize="12px">
          Your grant funds are securely stored on our smart contract.
          {' '}
          <Link href="learn more">
            Learn more
            <Image
              mx={1}
              src="/ui_icons/link.svg"
              alt="open link"
              display="inline-block"
            />
          </Link>
        </Text>
      </Container>
    </Container>
  );
}

export default Dao;
