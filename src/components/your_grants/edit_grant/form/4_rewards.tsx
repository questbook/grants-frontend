import {
  Flex,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from '../../../ui/forms/datepicker';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';

function GrantRewardsInput({
  reward,
  setReward,
  rewardError,
  setRewardError,
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
  rewardCurrency: string;
  setRewardCurrency: (rewardCurrency: string) => void;
  setRewardCurrencyAddress: (rewardCurrencyAddress: string) => void;
  date: string;
  setDate: (date: string) => void;
  dateError: boolean;
  setDateError: (dateError: boolean) => void;
  supportedCurrencies: any[];
}) {
  return (
    <Flex direction="column">

      <Flex alignItems="flex-start">
        <Box minW="160px" flex={0}>
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
          />
        </Box>
        <Box mt={5} ml={4} minW="132px" flex={0}>
          <Dropdown
            listItemsMinWidth="132px"
            listItems={supportedCurrencies}
            value={rewardCurrency}
            onChange={(data: any) => {
              setRewardCurrency(data.label);
              setRewardCurrencyAddress(data.id);
            }}
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
