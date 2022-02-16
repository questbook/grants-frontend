import {
  Flex, Text, Box, Button, Image, Link,
} from '@chakra-ui/react';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import supportedCurrencies from '../../../../constants/supportedCurrencies';
import Datepicker from '../../../ui/forms/datepicker';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';

interface Props {
  onSubmit: (data: any) => void;
}

function GrantRewardsInput({ onSubmit }: Props) {
  const [reward, setReward] = React.useState('');
  const [rewardError, setRewardError] = React.useState(false);

  const [rewardCurrency, setRewardCurrency] = React.useState(
    supportedCurrencies[0].label,
  );
  const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
    supportedCurrencies[0].id,
  );

  const [date, setDate] = React.useState('');
  const [dateError, setDateError] = React.useState(false);

  const handleOnSubmit = () => {
    let error = false;
    if (reward.length <= 0) {
      setRewardError(true);
      error = true;
    }
    if (date.length <= 0) {
      setDateError(true);
      error = true;
    }

    if (!error) {
      onSubmit({ reward, rewardCurrencyAddress, date });
    }
  };
  return (
    <>
      <Flex py={12} direction="column">
        <Text variant="heading" fontSize="36px" lineHeight="48px">
          What&apos;s the reward and deadline for the grant?
        </Text>

        {/* <Flex alignItems="flex-start" mt={12}>
          <Box flex={0}>
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
          <Box mt={5} ml={4} minW="145px" flex={0}>
            <Dropdown
              listItemsMinWidth="145px"
              listItems={supportedCurrencies}
              value={rewardCurrency}
              onChange={(data: any) => {
                setRewardCurrency(data.label);
                setRewardCurrencyAddress(data.id);
              }}
            />
          </Box>
        </Flex> */}

        <Flex direction="row" w="100%" alignItems="flex-end" justify="space-between" mt={12}>
          <Flex w="65%" direction="column">
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

        <Text variant="footer" mt={8} mb={7} maxW="400">
          <Image
            display="inline-block"
            h="10px"
            w="10px"
            src="/ui_icons/info_brand.svg"
          />
          {' '}
          By pressing Publish Grant you&apos;ll have to approve this transaction
          in your wallet.
          {' '}
          <Link href="wallet">Learn more</Link>
          {' '}
          <Image
            display="inline-block"
            h="10px"
            w="10px"
            src="/ui_icons/link.svg"
          />
        </Text>
      </Flex>
      <Button mt="auto" variant="primary" onClick={handleOnSubmit}>
        Continue
      </Button>
    </>
  );
}

export default GrantRewardsInput;
