import {
  Flex,
  Box,
} from '@chakra-ui/react';
import { Token } from '@questbook/service-validator-client';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import CustomTokenModal from 'src/components/ui/submitCustomTokenModal';
import Datepicker from '../../../ui/forms/datepicker';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';

function GrantRewardsInput({
  reward,
  setReward,
  rewardError,
  setRewardError,
  setRewardToken,
  rewardCurrency,
  setRewardCurrency,
  setRewardCurrencyAddress,
  date,
  setDate,
  dateError,
  setDateError,
  supportedCurrencies,
}: {
  reward: string;
  setReward: (rewards: string) => void;
  rewardError: boolean;
  setRewardError: (rewardError: boolean) => void;
  setRewardToken: (rewardToken: Token) => void;
  rewardCurrency: string;
  setRewardCurrency: (rewardCurrency: string) => void;
  setRewardCurrencyAddress: (rewardCurrencyAddress: string) => void;
  date: string;
  setDate: (date: string) => void;
  dateError: boolean;
  setDateError: (dateError: boolean) => void;
  supportedCurrencies: any[];
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [supportedCurrenciesList, setSupportedCurrenciesList] = React.useState(supportedCurrencies);
  const [isJustAddedToken, setIsJustAddedToken] = React.useState<boolean>(false);
  const addERC = true;
  return (
    <Flex direction="column">

      <Flex direction="row" mt={12}>
        <Box minW="160px" flex={1}>
          <SingleLineInput
            label="Grant Reward"
            placeholder="100"
            errorText="Required"
            onChange={(e) => {
              if (rewardError) {
                setRewardError(false);
              }
              setReward(e.target.value);
            }}
            value={reward}
            isError={rewardError}
            type="number"
          />
        </Box>
        <CustomTokenModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setRewardCurrency={setRewardCurrency}
          setRewardCurrencyAddress={setRewardCurrencyAddress}
          setRewardToken={setRewardToken}
          supportedCurrenciesList={supportedCurrenciesList}
          setSupportedCurrenciesList={setSupportedCurrenciesList}
          setIsJustAddedToken={setIsJustAddedToken}
        />
        <Box mt={5} ml={4} minW="132px" flex={0}>
          <Dropdown
            listItemsMinWidth="132px"
            listItems={supportedCurrenciesList}
            value={rewardCurrency}
            onChange={(data: any) => {
              console.log('tokenDATA', data);
              if (data === 'addERCToken') {
                setIsModalOpen(true);
              }
              setRewardCurrency(data.label);
              setRewardCurrencyAddress(data.id);
              if (data !== 'addERCToken' && !isJustAddedToken && data.icon.lastIndexOf('ui_icons') === -1) {
                console.log('custom token', data);
                setRewardToken({
                  iconHash: data.icon.substring(data.icon.lastIndexOf('=') + 1),
                  address: data.address,
                  label: data.label,
                  decimal: data.decimals.toString(),
                });
              }
            }}
            addERC={addERC}
          />
        </Box>
      </Flex>

      <Box mt={12} />

      <Datepicker
        onChange={(e) => {
          if (dateError) {
            setDateError(false);
          }
          setDate(e.target.value);
        }}
        value={date}
        isError={dateError}
        errorText="Required"
        label="Grant Deadline"
      />

    </Flex>
  );
}

export default GrantRewardsInput;
