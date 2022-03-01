import {
  Flex, Box, Divider, Text, useTheme, Image,
} from '@chakra-ui/react';
import React from 'react';

function GrantRewards({
  daoName,
  isGrantVerified,
  daoLogo,
  rewardAmount,
  rewardCurrency,
  rewardCurrencyCoin,
  payoutDescription,
}: {
  daoName: string;
  isGrantVerified: boolean;
  daoLogo: string;
  rewardAmount: string;
  rewardCurrency: string;
  rewardCurrencyCoin: string;
  payoutDescription: string;
}) {
  const theme = useTheme();
  return (
    <>
      <Flex direction="row" alignItems="center" my="22px">
        <Text lineHeight="24px" fontSize="18px" fontWeight="400">
          Grant posted by
          {' '}
          <Box
            as="span"
            display="inline-block"
            color={theme.colors.brand[500]}
            fontWeight="bold"
          >
            {daoName}
          </Box>
          {' '}
          {isGrantVerified && (
            <Image
              display="inline-block"
              src="/ui_icons/verified.svg"
              mb="-2px"
            />
          )}
        </Text>
        <Image objectFit="cover" ml="auto" h="54px" w="54px" src={daoLogo} />
      </Flex>

      <Divider />

      <Flex alignItems="center">
        <Flex direction="column">
          <Flex direction="row" alignItems="flex-start" mt="28px">
            <Image mt="2px" src="/sidebar/apply_for_grants.svg" />
            <Flex flex={1} direction="column" ml={3}>
              <Text fontWeight="500">Reward</Text>
              <Text mt="1px" lineHeight="20px" fontSize="14px" fontWeight="400">
                {`${rewardAmount} ${rewardCurrency}`}
              </Text>
            </Flex>
          </Flex>
          <Flex direction="row" alignItems="flex-start" mt="28px">
            <Image mt="2px" src="/sidebar/apply_for_grants.svg" />
            <Flex flex={1} direction="column" ml={3}>
              <Text fontWeight="500">Milestones</Text>
              <Text mt="1px" lineHeight="20px" fontSize="14px" fontWeight="400">
                {payoutDescription}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Image ml="auto" h="45px" w="45px" src={rewardCurrencyCoin} />
      </Flex>
    </>
  );
}

export default GrantRewards;
