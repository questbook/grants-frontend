import {
  Button, Divider, Flex, Text, Box, Image, IconButton, Menu, MenuButton, MenuList, MenuItem,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Grant, useFundsTransfer } from 'src/graphql/queries';
import { getAssetInfo } from 'src/utils/tokenUtils';
import Funding from '../your_grants/manage_grant/tables/funding';
import AddFunds from './add_funds_modal';
import WithdrawFunds from './withdraw_funds_modal';

export type FundForAGrantProps = {
  grant: Grant
};

const TABS = ['Deposits', 'Withdrawals'] as const;

const TABS_MAP = [
  {
    type: 'funds_deposited',
    columns: ['from', 'to', 'amount', 'date', 'action'] as const,
  },
  {
    type: 'funds_withdrawn',
    columns: ['from', 'to', 'initiator', 'amount', 'date', 'action'] as const,
  },
] as const;

function FundForAGrant({ grant }: FundForAGrantProps) {
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isWithdrawFundsModalOpen, setIsWithdrawFundsModalOpen] = useState(false);
  const [selected, setSelected] = React.useState(0);

  const { data } = useFundsTransfer(grant.id);

  const assetInfo = getAssetInfo(grant.reward.asset);

  const switchTab = (to: number) => {
    setSelected(to);
  };

  return (
    <Flex direction="column" w="100%" mt={3} mb={12}>
      <Flex direction="row" justify="space-between" w="100%">
        <Text fontWeight="700" fontSize="18px" lineHeight="26px">{grant.title}</Text>
        <Flex direction="row" justify="start" align="center">
          <Image src={assetInfo?.icon} alt="Ethereum Icon" />
          <Box mr={2} />
          <Text fontWeight="700" fontSize="16px" lineHeight="24px" letterSpacing={0.5}>Funds Available</Text>
          <Box mr={2} />
          <Text fontWeight="700" fontSize="16px" lineHeight="24px" letterSpacing={0.5} color="brand.500">
            {grant.reward.committed}
            {' '}
            {assetInfo?.label}
          </Text>
          <Box mr={5} />
          <Button variant="primaryCta" onClick={() => setIsAddFundsModalOpen(true)}>Add Funds</Button>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="hamburger dot"
              icon={<Image src="/ui_icons/brand/hamburger_dot.svg" />}
              _hover={{}}
              _active={{}}
              variant="ghost"
            />
            <MenuList>
              <MenuItem icon={<Image src="/ui_icons/withdraw_fund.svg" />} _hover={{}} onClick={() => setIsWithdrawFundsModalOpen(true)}>
                Withdraw Funds
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex direction="row" w="full" justify="start" align="stretch" my={4}>
        {TABS.map((tab, index) => (
          <Button
            variant="link"
            ml={index === 0 ? 0 : 12}
            _hover={{
              color: 'black',
            }}
            _focus={{}}
            fontWeight="700"
            fontStyle="normal"
            fontSize="18px"
            lineHeight="26px"
            borderRadius={0}
            color={index === selected ? '#122224' : '#A0A7A7'}
            onClick={() => switchTab(index)}
          >
            {tab}
          </Button>
        ))}
      </Flex>
      <Divider />

      <Funding
        fundTransfers={data.filter((d) => d.type === TABS_MAP[selected].type)}
        assetId={grant.reward.asset}
        columns={[...TABS_MAP[selected].columns]}
      />

      <AddFunds
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
      />
      <WithdrawFunds
        isOpen={isWithdrawFundsModalOpen}
        onClose={() => setIsWithdrawFundsModalOpen(false)}
      />
    </Flex>
  );
}

export default FundForAGrant;
