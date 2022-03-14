import {
  VStack, Text, Image, Flex,
} from '@chakra-ui/react';
import React from 'react';

function TipsList({
  tipsHeading,
  tips, icon,
}: {
  tipsHeading: string, tips: {}[], icon: string,
}) {
  return (
    <Flex w="35%" bgColor="#7FDAEC" px={12} direction="column" justify="center" align="start">
      <Image
        boxSize="155px"
        src={icon}
        alt="pink_flying_comp"
      />
      <Text color="#122224" fontWeight="600" fontSize="28px" lineHeight="40px" letterSpacing="-1px" mt={12}>
        {tipsHeading}
      </Text>
      <Flex direction="column" mt={9}>
        {tips.map((tip) => (
          <Flex key={`tips-${tip}`} align="start" mb={7}>
            <Image mt={1} src="/ui_icons/tip_checkmark.svg" alt="tip" />
            <Text color="#122224" fontWeight="400" fontSize="16px" ml="10px">
              {tip}
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default TipsList;
