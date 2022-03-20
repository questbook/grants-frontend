import {
  Button,
  Divider,
  Flex,
  Text,
  Box,
  Image,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React, { useState, useEffect, useContext } from 'react';
import { getAssetInfo } from 'src/utils/tokenUtils';
import ERC20ABI from 'src/contracts/abi/ERC20.json';
import { useContract, useSigner } from 'wagmi';
import { ethers } from 'ethers';
import { BigNumber } from '@ethersproject/bignumber';
import { useGetFundingQuery } from 'src/generated/graphql';
import { ApiClientsContext } from 'pages/_app';
import { Grant } from 'src/types';
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { SupportedChainId } from 'src/constants/chains';
import WithdrawFunds from './withdraw_funds_modal';
import AddFunds from './add_funds_modal';
import Funding from '../your_grants/manage_grant/tables/funding';

export type FundForAGrantProps = {
  grant: Grant;
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
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isWithdrawFundsModalOpen, setIsWithdrawFundsModalOpen] = useState(false);
  const [selected, setSelected] = React.useState(0);
  const [fundingAssetDecimals, setFundingAssetDecimals] = React.useState(18);
  const [signerStates] = useSigner();
  const rewardAssetContract = useContract({
    addressOrName: grant.reward.asset,
    contractInterface: ERC20ABI,
    signerOrProvider: signerStates.data,
  });

  const { data } = useGetFundingQuery({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
    variables: { grantId: grant.id },
  });

  // useEffect(() => {
  //   console.log('data', data);
  // }, [data]);

  const assetInfo = getAssetInfo(grant.reward.asset, getSupportedChainIdFromWorkspace(workspace));

  const switchTab = (to: number) => {
    setSelected(to);
  };

  useEffect(() => {
    // eslint-disable-next-line wrap-iife
    // eslint-disable-next-line func-names
    (async function () {
      try {
        if (!rewardAssetContract.provider) return;
        const assetDecimal = await rewardAssetContract.decimals();
        console.log('decinma', assetDecimal);
        setFundingAssetDecimals(assetDecimal);
      } catch (e) {
        // console.error(e);
      }
    }());
  }, [grant, rewardAssetContract]);

  return (
    <Flex direction="column" w="100%" mt={3} mb={12}>
      <Flex direction="row" justify="space-between" w="100%">
        <Text fontWeight="700" fontSize="18px" lineHeight="26px">
          {grant.title}
        </Text>
        <Flex direction="row" justify="start" align="center">
          <Image src={assetInfo?.icon} alt="Ethereum Icon" />
          <Box mr={2} />
          <Text
            fontWeight="700"
            fontSize="16px"
            lineHeight="24px"
            letterSpacing={0.5}
          >
            Funds Available
          </Text>
          <Box mr={2} />
          <Text
            fontWeight="700"
            fontSize="16px"
            lineHeight="24px"
            letterSpacing={0.5}
            color="brand.500"
          >
            {ethers.utils.formatUnits(grant.funding, fundingAssetDecimals)}
            {' '}
            {assetInfo?.label}
          </Text>
          <Box mr={5} />
          <Button
            variant="primaryCta"
            onClick={() => setIsAddFundsModalOpen(true)}
          >
            Add Funds
          </Button>
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
              <MenuItem
                icon={<Image src="/ui_icons/withdraw_fund.svg" />}
                _hover={{}}
                onClick={() => setIsWithdrawFundsModalOpen(true)}
              >
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
        fundTransfers={
          data?.fundsTransfers?.filter(
            (d) => d.type === TABS_MAP[selected].type,
          ) || []
        }
        assetId={grant.reward.asset}
        columns={[...TABS_MAP[selected].columns]}
        assetDecimals={fundingAssetDecimals}
        grantId={grant.id}
        type={TABS_MAP[selected].type}
        chainId={getSupportedChainIdFromSupportedNetwork(grant.workspace.supportedNetworks[0])}
      />

      {/* Modals */}
      <AddFunds
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        grantAddress={grant.id}
        rewardAsset={{
          address: grant.reward.asset,
          committed: BigNumber.from(grant.reward.committed),
          label: assetInfo?.label,
          icon: assetInfo?.icon,
        }}
      />
      <WithdrawFunds
        isOpen={isWithdrawFundsModalOpen}
        onClose={() => setIsWithdrawFundsModalOpen(false)}
        grantAddress={grant.id}
        rewardAsset={{
          address: grant.reward.asset,
          committed: BigNumber.from(grant.reward.committed),
          label: assetInfo?.label,
          icon: assetInfo?.icon,
        }}
      />
    </Flex>
  );
}

export default FundForAGrant;
