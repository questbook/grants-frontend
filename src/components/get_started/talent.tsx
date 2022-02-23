import {
  Container, Flex, Button, Link, Text, useTheme, Image,
} from '@chakra-ui/react';
import React from 'react';

function Talent({
  onClick,
}: {
  onClick: () => void;
}) {
  const theme = useTheme();
  return (
    <Container
      h="100vh"
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
            icon: '/illustrations/browse_grants.svg',
            title: 'Browse Grants',
            text: 'Browse grants from DAOs, and protocols.',
          },
          {
            icon: '/illustrations/apply_instantly.svg',
            title: 'Apply instantly',
            text: 'Pitch your ideas, and projects to get a chance of winning grants.',
          },
          {
            icon: '/illustrations/get_funded.svg',
            title: 'Get funded',
            text: 'If selected, you will be rewarded with tokens',
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
        position="absolute"
        bottom={0}
        display="flex"
        justifyContent="center"
        py={3}
      >
        <Text w="100vw" textAlign="center" variant="footer" fontSize="12px">
          Your grant funds are securely stored on our smart contract.
          {' '}
          <Link href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46" isExternal>Learn more</Link>
        </Text>
      </Container>
    </Container>
  );
}

export default Talent;
