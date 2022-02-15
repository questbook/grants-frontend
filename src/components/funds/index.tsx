import { Button, Divider, Flex, Text, Box, Image, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import React from 'react';
import AddFunds from './add_funds_modal';
import Deposits from './deposits';
import Withdrawals from './withdrawals';
import WithdrawFunds from './withdraw_funds_modal';

function FundForAGrant() {
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = React.useState(false);
  const [isWithdrawFundsModalOpen, setIsWithdrawFundsModalOpen] = React.useState(false);
  const tabs = ['Deposits', 'Withdrawals'];
  const [selected, setSelected] = React.useState(0);

  const switchTab = (to: number) => {
    setSelected(to);
  };

  return (
    <Flex direction="column" w="100%" mt={3} mb={12}>
      <Flex direction="row" justify="space-between" w="100%">
        <Text fontWeight="700" fontSize="18px" lineHeight="26px">Storage Provider (SP) Tooling Ideas</Text>
        <Flex direction="row" justify="start" align="center">
          <Image src="/images/dummy/Ethereum Icon.svg" alt="Ethereum Icon" />
          <Box mr={2} />
          <Text fontWeight="700" fontSize="16px" lineHeight="24px" letterSpacing={0.5}>Funds Available</Text>
          <Box mr={2} />
          <Text fontWeight="700" fontSize="16px" lineHeight="24px" letterSpacing={0.5} color="brand.500">40 ETH</Text>
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
        {tabs.map((tab, index) => (
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
      {selected === 0 ? <Deposits /> : <Withdrawals />}
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
