import {
  Container, VStack, Text, Image, Flex,
} from '@chakra-ui/react';
import React from 'react';

function TipsList({
  tips,
}: {
  tips: {}[]
}) {
  return (
    <Container m={0} px="96px" py="77px" flex="0.4" bgColor="#9FE5F3">
      <Flex flexDirection="column" alignItems="flex-start" w="360px" mx="auto">
        <Image
          h="158px"
          w="128px"
          src="/images/pink_flying_comp.svg"
          alt="pink_flying_comp"
        />
        <Text color="#2E6672" fontWeight="600" fontSize="28px" mt={12}>
          Tips to write a good grant
        </Text>
        <VStack mt={9} spacing={7}>
          {tips.map((tip) => (
            <Flex alignItems="flex-start">
              <Image mt={1} src="/ui_icons/tip_checkmark.svg" alt="tip" />
              <Text color="#2E6672" fontWeight="400" fontSize="16px" ml="10px">
                {tip}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Flex>
    </Container>
  );
}

export default TipsList;
