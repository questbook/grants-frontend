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
import { GrantDeadlineError, GrantRewardError } from './errors/errorTypes';
import { getGrantDeadlineErrorText, getGrantRewardErrorText } from './errors/errorTexts';

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
  rewardError: GrantRewardError;
  setRewardError: (rewardError: GrantRewardError) => void;
  rewardCurrency: string;
  setRewardCurrency: (rewardCurrency: string) => void;
  setRewardCurrencyAddress: (rewardCurrencyAddress: string) => void;
  date: string;
  setDate: (date: string) => void;
  dateError: GrantDeadlineError;
  setDateError: (dateError: GrantDeadlineError) => void;
}) {
  return (
    <Flex direction="column">

      <Flex direction="row" mt={12}>
        <Box minW="160px" flex={1}>
          <SingleLineInput
            label="Grant Reward"
            placeholder="100"
            value={reward}
            onChange={(e) => {
              if (rewardError !== GrantRewardError.NoError) {
                setRewardError(GrantRewardError.NoError);
              }
              setReward(e.target.value);
            }}
            isError={rewardError !== GrantRewardError.NoError}
            errorText={getGrantRewardErrorText(rewardError)}
            type="number"
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
          if (dateError !== GrantDeadlineError.NoError) {
            setDateError(GrantDeadlineError.NoError);
          }
          setDate(e.target.value);
        }}
        value={date}
        isError={dateError !== GrantDeadlineError.NoError}
        errorText={getGrantDeadlineErrorText(dateError)}
        label="Grant Deadline"
      />

    </Flex>
  );
}

export default GrantRewardsInput;
