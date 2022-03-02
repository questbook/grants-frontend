import {
  Flex, Text, Box, Button, Image, Link,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import Loader from 'src/components/ui/loader';

import { SupportedChainId } from 'src/constants/chains';
import useChainId from 'src/hooks/utils/useChainId';
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

  const currentChain = useChainId() ?? SupportedChainId.RINKEBY;

  const supportedCurrencies = Object.keys(
    CHAIN_INFO[currentChain].supportedCurrencies,
  ).map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
    .map((currency) => ({ ...currency, id: currency.address }));
  const [rewardCurrency, setRewardCurrency] = React.useState(
    supportedCurrencies[0].label,
  );
  const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
    supportedCurrencies[0].address,
  );

  useEffect(() => {
    console.log(currentChain);
    if (currentChain) {
      const currencies = Object.keys(
        CHAIN_INFO[currentChain].supportedCurrencies,
      ).map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
        .map((currency) => ({ ...currency, id: currency.address }));
      setRewardCurrency(currencies[0].label);
      setRewardCurrencyAddress(currencies[0].address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain]);

  useEffect(() => {
    console.log(rewardCurrencyAddress);
  }, [rewardCurrencyAddress]);

  const [date, setDate] = React.useState('');
  const [dateError, setDateError] = React.useState(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

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

    console.log(reward);
    console.log(rewardCurrencyAddress);

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
                console.log(data);
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
          <Link
            href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46"
            isExternal
          >
            Learn more
          </Link>
          {' '}
          <Image
            display="inline-block"
            h="10px"
            w="10px"
            src="/ui_icons/link.svg"
          />
        </Text>
      </Flex>
      <Button
        ref={buttonRef}
        mt="auto"
        variant="primary"
        onClick={hasClicked ? () => {} : handleOnSubmit}
        py={hasClicked ? 2 : 0}
        w={hasClicked ? buttonRef.current?.offsetWidth : 'auto'}
      >
        {hasClicked ? <Loader /> : 'Continue'}
      </Button>
    </>
  );
}

export default GrantRewardsInput;
