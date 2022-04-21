import {
  Flex,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'src/components/ui/modal';
import NewERC20Modal from 'src/components/ui/newERC20TokenModal';
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
  console.log('SupportedCurrencies', supportedCurrencies);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const addERC = true;
  return (
    <Flex direction="column">

      <Flex direction="row" mt={12}>
        <Box minW="160px" flex={1}>
          <SingleLineInput
            label="Grant Reward"
            placeholder="100"
            value={reward}
            onChange={(e) => {
              if (rewardError) {
                setRewardError(false);
              }
              setReward(e.target.value);
            }}
            isError={rewardError}
            errorText="Required"
            type="number"
          />
        </Box>
        <NewERC20Modal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        <Box mt={5} ml={4} minW="132px" flex={0}>
          <Dropdown
            listItemsMinWidth="132px"
            listItems={supportedCurrencies}
            value={rewardCurrency}
            // eslint-disable-next-line react/no-unstable-nested-components
            onChange={(data: any) => {
              if (data === 'addERCToken') {
                setIsModalOpen(true);
              }
              setRewardCurrency(data.label);
              setRewardCurrencyAddress(data.id);
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
