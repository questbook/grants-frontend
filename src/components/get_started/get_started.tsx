import {
  Container, Flex, Button, Link, Text, useTheme, Image,
} from '@chakra-ui/react';
import React from 'react';
import { highlightWordsInString } from '../../utils/formattingUtils';
import strings from '../../constants/strings.json';

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
      <Text mt="46px" variant="heading" textAlign="center">
        {strings.get_started.heading}
      </Text>
      <Text mt="42px" variant="heading" textAlign="center">
        {strings.get_started.subheading}
      </Text>
      <Flex mt={20} justify="space-evenly" w="80%">
        {[
          {
            icon: '/illustrations/developer_illustration.svg',
            text: highlightWordsInString(
              strings.get_started.talent.text,
              strings.get_started.talent.highlight,
              theme.colors.brand[500],
            ),
            onClick: () => onTalentClick(),
          },
          {
            icon: '/illustrations/dao_illustration.svg',
            text: highlightWordsInString(
              strings.get_started.dao.text,
              strings.get_started.dao.highlight,
              theme.colors.brand[500],
            ),
            onClick: () => onDaoClick(),
          },
        ].map(({ icon, text, onClick }, index) => (
          <Flex direction="column" justify="start" align="center" mx={4}>
            <Image h="153px" w="202px" src={icon} />
            <Text mt={10} fontWeight="400" textAlign="center">
              {text}
            </Text>
            <Button onClick={onClick} mt={10} variant="primary">
              {strings.get_started.button_text}
            </Button>
          </Flex>
        ))}
      </Flex>

      <Text variant="footer" mt="51px" mb="35px">
        <Link href="connect_wallet">{strings.get_started.footer.link}</Link>
        {' '}
        {strings.get_started.footer.text}
      </Text>
    </Container>
  );
}

export default GetStarted;
