import {
  Container, VStack, Text, Image, Flex,
} from '@chakra-ui/react';
import React from 'react';

function TipsList({
  tips, icon,
}: {
  tips: {}[], icon: string,
}) {
  return (
    <Container m={0} px="55px" py="77px" flex="0.4" bgColor="#9FE5F3">
      <Flex flexDirection="column" alignItems="flex-start" w="360px" mx="auto">
        <Image
          boxSize="155px"
          src={icon}
          alt="pink_flying_comp"
        />
        <Text color="#122224" fontWeight="600" fontSize="28px" lineHeight="40px" letterSpacing="-1px" mt={12}>
          Tips to write a good grant
        </Text>
        <VStack mt={9} spacing={7}>
          {tips.map((tip) => (
            <Flex key={`tips-${tip}`} alignItems="flex-start">
              <Image mt={1} src="/ui_icons/tip_checkmark.svg" alt="tip" />
              <Text color="#122224" fontWeight="400" fontSize="16px" ml="10px">
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
