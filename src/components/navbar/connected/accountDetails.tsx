import React from 'react';
import {
  Button, VStack, Image, Text, Flex, Menu, MenuButton, MenuList, MenuItem,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import useGetSelectedNetwork from 'src/hooks/useGetSelectedNetwork';
import { truncateStringFromMiddle } from 'src/utils/formattingUtils';

export interface Props {
  networkId: number;
  isOnline: boolean;
  address: string;
}

function AccountDetails({ isOnline, address }: Props) {
  const [,disconnect] = useAccount();
  const router = useRouter();

  const chainId = useGetSelectedNetwork();

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
        rightIcon={<Image mr={2} src="/ui_icons/dropdown_arrow.svg" alt="options" />}
      >
        <Flex direction="row" align="center" justify="center">
          <Image
            h={8}
            w={8}
            src={
           chainId ? CHAIN_INFO[chainId].icon : '/wallet_icons/unknown.png'
        }
            alt="current network"
          />
          <VStack spacing={0} ml={3} mr={5} mt={1} alignItems="flex-start">
            <Flex mb="-6px" alignItems="center">
              <Image
                mt="-3px"
                mr={1}
                src="/ui_icons/online.svg"
                visibility={isOnline && chainId ? 'visible' : 'hidden'}
                alt="wallet connected"
              />
              <Text fontSize="9px" lineHeight="14px" fontWeight="500" color="#122224">
                {chainId ? CHAIN_INFO[chainId].name : ''}
              </Text>
            </Flex>

            <Flex>
              <Text color="#122224" fontWeight="700" fontSize="16px" lineHeight="24px">
                {/* {formattedAddress} */}
                {truncateStringFromMiddle(address)}
              </Text>
            </Flex>
          </VStack>
        </Flex>

      </MenuButton>
      <MenuList>
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
