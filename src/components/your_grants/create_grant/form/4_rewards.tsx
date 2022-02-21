import {
  Flex,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Datepicker from '../../../ui/forms/datepicker';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import supportedCurrencies from '../../../../constants/supportedCurrencies';

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
}) {
  return (
    <Flex direction="column">

      <Flex alignItems="flex-start">
        <Flex direction="row" w="100%" alignItems="flex-end" justify="space-between" mt={12}>
          <Flex w="65%" direction="column">
            <SingleLineInput
              label="Grant Reward"
              placeholder="100"
              errorText="Required"
              onChange={(e) => {
                console.log(e.target.value);
                if (rewardError) {
                  setRewardError(false);
                }
                setReward(e.target.value);
              }}
              value={reward}
              isError={rewardError}
              type="number"
            />
          </Flex>
          <Flex direction="column" w="30%">
            <Dropdown
              listItemsMinWidth="145px"
              listItems={supportedCurrencies}
              value={rewardCurrency}
              onChange={(data: any) => {
                setRewardCurrency(data.label);
                setRewardCurrencyAddress(data.id);
              }}
            />
          </Flex>
        </Flex>
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
