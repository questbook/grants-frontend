import {
  Container, Flex, Button, Link, Text, useTheme, Image,
} from '@chakra-ui/react';
import React from 'react';
import { highlightWordsInString } from '../../utils/formattingUtils';

function GetStarted({
  onTalentClick,
  onDaoClick,
}: {
  onTalentClick: () => void;
  onDaoClick: () => void;
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
        Hey. 👋 Welcome to Questbook
      </Text>
      <Text mt="42px" variant="heading">
        What&apos;s your main objective on Questbook?
      </Text>
      <Flex mt={10}>
        {[
          {
            icon: '/illustrations/developer_illustration.svg',
            text: highlightWordsInString(
              'Are you a developer or someone who is looking for grants to build projects?',
              ['developer', 'looking for grants'],
              theme.colors.brand[500],
            ),
            onClick: () => onTalentClick(),
          },
          {
            icon: '/illustrations/dao_illustration.svg',
            text: highlightWordsInString(
              'Are you a DAO or someone who is looking to fund ideas with your grants?',
              ['DAO', 'looking to fund ideas'],
              theme.colors.brand[500],
            ),
            onClick: () => onDaoClick(),
          },
        ].map(({ icon, text, onClick }, index) => (
          <Container
            display="flex"
            flexDirection="column"
            alignItems="center"
            bg={theme.colors.backgrounds.card}
            p={12}
            borderRadius={12}
            maxW="496px"
            ml={index === 0 ? 0 : 10}
          >
            <Image h="153px" w="202px" src={icon} />
            <Text mt={6} fontWeight="400" textAlign="center">
              {text}
            </Text>
            <Button onClick={onClick} mt={8} variant="primary">
              Continue
            </Button>
          </Container>
        ))}
      </Flex>

      <Text variant="footer" mt="51px" mb="35px">
        If you have signed in to Questbook before,
        {' '}
        <Link href="connect_wallet">connect your wallet </Link>
        to access your account .
      </Text>
    </Container>
  );
}

export default GetStarted;
