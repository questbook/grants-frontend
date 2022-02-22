import {
  Flex, Text, Box, Button, Image, Link, Center, CircularProgress,
} from '@chakra-ui/react';
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import supportedCurrencies from '../../../../constants/supportedCurrencies';
import Datepicker from '../../../ui/forms/datepicker';
import Dropdown from '../../../ui/forms/dropdown';
import SingleLineInput from '../../../ui/forms/singleLineInput';

interface Props {
  onSubmit: (data: any) => void;
  hasClicked: boolean;
}

function GrantRewardsInput({ onSubmit, hasClicked }: Props) {
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
      {hasClicked ? (
        <Center>
          <CircularProgress isIndeterminate color="brand.500" size="48px" mt={4} />
        </Center>
      ) : (
        <Button mt="auto" variant="primary" onClick={handleOnSubmit}>
          Continue
        </Button>
      )}
    </>
  );
}

export default GrantRewardsInput;
