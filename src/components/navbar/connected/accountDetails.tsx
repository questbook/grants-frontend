import React from 'react';
import {
  Button, VStack, Image, Text, Flex,
} from '@chakra-ui/react';
import supportedNetworks from '../../../constants/supportedNetworks.json';

export interface Props {
  networkId: number;
  isOnline: boolean;
  address: string;
}

function AccountDetails({ networkId, isOnline, address }: Props) {
  const formattedAddress = `${address.substring(0, 4)}......${address.substring(address.length - 4)}`;
  const supportedChainIds = Object.keys(supportedNetworks);
  const networkSupported = supportedChainIds.includes(networkId.toString());
  return (
    <Button h={12} variant="solid" size="xl" px={2} py={1} borderRadius={8}>
      <Image
        h={8}
        w={8}
        src={
          supportedNetworks[
            networkSupported
              ? networkId.toString() as keyof typeof supportedNetworks
              : 1
          ].icon
        }
        alt="current network"
      />
      <VStack spacing={0} ml={3} mr={5} mt={1} alignItems="flex-start">
        <Flex mb="-6px" alignItems="center">
          <Image
            mt="-3px"
            mr={1}
            src="/ui_icons/online.svg"
            visibility={isOnline ? 'visible' : 'hidden'}
            alt="wallet connected"
          />
          <Text fontSize="9px" lineHeight="14px" fontWeight="500" color="#122224">
            {
              networkSupported
                ? supportedNetworks[
                  networkId.toString() as keyof typeof supportedNetworks
                ].name
                : 'Unsupported Network'
            }
          </Text>
        </Flex>

        <Flex>
          <Text color="#122224" fontWeight="700" fontSize="16px" lineHeight="24px">
            {formattedAddress}
          </Text>
        </Flex>
      </VStack>

      <Image mr={2} src="/ui_icons/dropdown_arrow.svg" alt="options" />
    </Button>
  );
}

export default AccountDetails;
