import { Container, VStack, Text } from '@chakra-ui/react';
import React from 'react';

function HeroTip() {
  return (
    <Container m={0} px="96px" py="96px" flex="0.4" bgColor="#9FE5F3">
      <VStack w="360px" spacing="56px" mx="auto">
        <Text
          color="#2E6672"
          fontWeight="bold"
          fontSize="72px"
          lineHeight="1.25"
        >
          Lets create your first grant.
        </Text>
        <Text color="#2E6672" fontWeight="bold" fontSize="16px">
          Tell us more about your grant so we can help you get the best
          applicants.
        </Text>
      </VStack>
    </Container>
  );
}

export default HeroTip;
