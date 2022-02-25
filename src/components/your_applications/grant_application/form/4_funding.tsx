import {
  Box, Flex, Text, Image,
} from '@chakra-ui/react';
import React from 'react';
import Dropdown from '../../../ui/forms/dropdown';
import MultiLineInput from '../../../ui/forms/multiLineInput';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import Tooltip from '../../../ui/tooltip';
import { getBreakdownErrorText, getFundingAskErrorText } from './errors/errorTexts';
import { BreakdownError, FundingAskError } from './errors/errorTypes';

function Funding({
  fundingAsk,
  setFundingAsk,
  fundingAskError,
  setFundingAskError,

  fundingBreakdown,
  setFundingBreakdown,
  fundingBreakdownError,
  setFundingBreakdownError,

  rewardAmount,
  rewardCurrency,
  rewardCurrencyCoin,

  readOnly,
  grantRequiredFields,
}: {
  fundingAsk: string;
  setFundingAsk: (fundingAsk: string) => void;
  fundingAskError: FundingAskError;
  setFundingAskError: (fundingAskError: FundingAskError) => void;

  fundingBreakdown: string;
  setFundingBreakdown: (fundingBreakdown: string) => void;
  fundingBreakdownError: BreakdownError;
  setFundingBreakdownError: (fundingBreakdownError: BreakdownError) => void;

  rewardAmount: string;
  rewardCurrency: string;
  rewardCurrencyCoin: string;

  readOnly?: boolean;
  grantRequiredFields: string[];
}) {
  return (
    <>
      <Text fontWeight="700" fontSize="16px" lineHeight="20px" color="#8850EA">
        Funding & Budget Breakdown
        <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="How much funding in total would you need and explain how you would spend the money if your application is accepted."
          placement="bottom-start"
        />
      </Text>

      <Box mt={8} />

      <Flex direction="row" alignItems="flex-start" mt="24px">
        <Image
          ml="auto"
          h="45px"
          w="45px"
          src={rewardCurrencyCoin}
        />
        <Flex flex={1} direction="column" ml={3}>
          <Text fontWeight="500">Grant Reward</Text>
          <Text mt="1px" lineHeight="20px" fontSize="14px" fontWeight="400">
            {`${rewardAmount} ${rewardCurrency}`}
            {' '}
          </Text>
        </Flex>
      </Flex>

      <Box mt={8} />

      <Flex alignItems="flex-start" display={grantRequiredFields.includes('fundingBreakdown') ? 'flex' : 'none'}>
        <Box minW="160px" flex={1}>
          <SingleLineInput
            label="Funding Ask"
            placeholder="100"
            value={fundingAsk}
            onChange={(e) => {
              console.log(e.target.value);
              if (fundingAskError !== FundingAskError.NoError) {
                setFundingAskError(FundingAskError.NoError);
              }
              setFundingAsk(e.target.value);
            }}
            isError={fundingAskError !== FundingAskError.NoError}
            errorText={getFundingAskErrorText(fundingAskError)}
            type="number"
            disabled={readOnly}
          />
        </Box>
        <Box mt={5} ml={4} minW="132px" flex={0}>
          <Dropdown
            listItemsMinWidth="132px"
            listItems={[
              {
                icon: rewardCurrencyCoin,
                label: rewardCurrency,
              },
            ]}
          />
        </Box>
      </Flex>

      <Box mt={8} />

      <MultiLineInput
        placeholder="Write about how you plan to use the funds for your project - hiring, marketing etc."
        label="Funding Breakdown"
        maxLength={1000}
        value={fundingBreakdown}
        onChange={(e) => {
          if (fundingBreakdownError !== BreakdownError.NoError) {
            setFundingBreakdownError(BreakdownError.NoError);
          }
          setFundingBreakdown(e.target.value);
        }}
        isError={fundingBreakdownError !== BreakdownError.NoError}
        errorText={getBreakdownErrorText(fundingBreakdownError)}
        disabled={readOnly}
        tooltip="Write about how you planning use funds for your project - hiring, marketing etc."
        visible={grantRequiredFields.includes('fundingBreakdown')}
      />

    </>
  );
}

Funding.defaultProps = {
  readOnly: false,
};
export default Funding;
