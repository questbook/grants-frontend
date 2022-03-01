import React from 'react';
import {
  Button,
  VStack,
  Image,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import useChainId from 'src/hooks/utils/useChainId';

export interface Props {
  networkId: number;
  isOnline: boolean;
  address: string;
}

function AccountDetails() {
  const isOnline = true;
  const [{ data: accountData }, disconnect] = useAccount();
  const router = useRouter();

  const formatAddress = (address: string) => `${address.substring(0, 4)}......${address.substring(address.length - 4)}`;
  const chainId = useChainId();

  return (
    <Menu>
      <MenuButton
        as={Button}
        h={12}
        variant="solid"
        size="xl"
        px={2}
        py={1}
        borderRadius={8}
        rightIcon={
          <Image mr={2} src="/ui_icons/dropdown_arrow.svg" alt="options" />
        }
      >
        <Flex direction="row" align="center" justify="center">
          {chainId ? (
            <Image
              h={8}
              w={8}
              src={CHAIN_INFO[chainId].icon}
              alt="current network"
            />
          ) : null}
          <VStack spacing={0} ml={3} mr={5} mt={1} alignItems="flex-start">
            <Flex mb="-6px" alignItems="center">
              <Image
                mt="-3px"
                mr={1}
                src="/ui_icons/online.svg"
                visibility={isOnline ? 'visible' : 'hidden'}
                alt="wallet connected"
              />
              <Text
                fontSize="9px"
                lineHeight="14px"
                fontWeight="500"
                color="#122224"
              >
                {chainId
                  ? CHAIN_INFO[chainId].name
                  : 'Unsupported Network'}
              </Text>
            </Flex>

            <Flex>
              <Text
                color="#122224"
                fontWeight="700"
                fontSize="16px"
                lineHeight="24px"
              >
                {formatAddress(accountData?.address ?? '')}
              </Text>
            </Flex>
          </VStack>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem
          isDisabled
        >
          Signed in with
          {' '}
          {data?.connector?.name}
        </MenuItem>
        <MenuItem
          onClick={() => {
            disconnect();
            router.replace('/');
          }}
          icon={<Image src="/ui_icons/logout.svg" />}
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default AccountDetails;
