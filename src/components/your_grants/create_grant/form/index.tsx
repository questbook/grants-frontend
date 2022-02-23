/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from 'react';
import {
  Box, Button, Text, Image, Link, Flex, CircularProgress, Center,
} from '@chakra-ui/react';
import Title from './1_title';
import Details from './2_details';
import ApplicantDetails from './3_applicantDetails';
import GrantRewardsInput from './4_rewards';
import Heading from '../../../ui/heading';
import applicantDetailsList from '../../../../constants/applicantDetailsList';
import supportedCurrencies from '../../../../constants/supportedCurrencies';

function Form({
  refs,
  onSubmit,
  hasClicked,
}: {
  refs: any[];
  onSubmit: (data: any) => void;
  hasClicked: boolean;
}) {
  const maxDescriptionLength = 300;
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const [titleError, setTitleError] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  const [details, setDetails] = useState('');
  const [detailsError, setDetailsError] = useState(false);

  const applicantDetails = applicantDetailsList.map(
    ({
      title, tooltip, id, inputType, isRequired,
    }, index) => {
      if (index === applicantDetailsList.length - 1) return null;
      if (index === applicantDetailsList.length - 2) return null;
      return {
        title,
        required: isRequired ?? false,
        id,
        tooltip,
        index,
        inputType,
      };
    },
  ).filter((obj) => obj != null);
  const [detailsRequired, setDetailsRequired] = useState(applicantDetails);
  const [extraField, setExtraField] = useState(false);
  const [multipleMilestones, setMultipleMilestones] = useState(false);

  const toggleDetailsRequired = (index: number) => {
    const newDetailsRequired = [...detailsRequired];
    // TODO: create interface for detailsRequired
    (newDetailsRequired[index] as any).required = !(
      newDetailsRequired[index] as any
    ).required;
    setDetailsRequired(newDetailsRequired);
  };

  const [extraFieldDetails, setExtraFieldDetails] = useState('');
  const [extraFieldError, setExtraFieldError] = useState(false);

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
    if (title.length <= 0) {
      setTitleError(true);
      error = true;
    }
    if (summary.length <= 0) {
      setSummaryError(true);
      error = true;
    }
    if (details.length <= 0) {
      setDetailsError(true);
      error = true;
    }
    if (extraField && extraFieldDetails.length <= 0) {
      setExtraFieldError(true);
      error = true;
    }
    if (reward.length <= 0) {
      setRewardError(true);
      error = true;
    }
    if (date.length <= 0) {
      setDateError(true);
      error = true;
    }

    if (!error) {
      const requiredDetails = {} as any;
      detailsRequired.forEach((detail) => {
        if (detail && detail.required) {
          requiredDetails[detail.id] = {
            title: detail.title,
            inputType: detail.inputType,
          };
        }
      });
      const fields = { ...requiredDetails };
      if (extraFieldDetails != null && extraFieldDetails.length > 0) {
        fields.extraField = {
          title: 'Other Information',
          inputType: 'short-form',
        };
      }
      if (multipleMilestones) {
        fields.isMultipleMilestones = {
          title: 'Milestones',
          inputType: 'array',
        };
      }
      if (fields.teamMembers) {
        fields.memberDetails = {
          title: 'Member Details',
          inputType: 'array',
        };
      }
      if (fields.fundingBreakdown) {
        fields.fundingAsk = {
          title: 'Funding Ask',
          inputType: 'short-form',
        };
      }
      onSubmit({
        title,
        summary,
        details,
        fields,
        reward,
        rewardCurrencyAddress,
        date,
      });
    }
  };

  return (
    <>
      <Heading mt="18px" title="Create a grant" />
      <Text
        ref={refs[0]}
        fontSize="18px"
        fontWeight="700"
        lineHeight="26px"
        letterSpacing={0}
        mt="30px"
      >
        Grant Intro
      </Text>
      <Box mt="20px" />
      <Title
        title={title}
        setTitle={setTitle}
        titleError={titleError}
        setTitleError={setTitleError}
        summary={summary}
        setSummary={setSummary}
        summaryError={summaryError}
        setSummaryError={setSummaryError}
        maxDescriptionLength={maxDescriptionLength}
      />

      <Text
        ref={refs[1]}
        fontSize="18px"
        fontWeight="700"
        lineHeight="26px"
        letterSpacing={0}
        mt={4}
      >
        Grant Details
      </Text>
      <Box mt="20px" />
      <Details
        details={details}
        setDetails={setDetails}
        detailsError={detailsError}
        setDetailsError={setDetailsError}
      />

      <Text
        ref={refs[2]}
        fontSize="18px"
        fontWeight="700"
        lineHeight="26px"
        letterSpacing={0}
        mt="40px"
      >
        Applicant Details
      </Text>
      <Box mt="20px" />
      <ApplicantDetails
        detailsRequired={detailsRequired}
        toggleDetailsRequired={toggleDetailsRequired}
        extraField={extraField}
        setExtraField={setExtraField}
        extraFieldDetails={extraFieldDetails}
        setExtraFieldDetails={setExtraFieldDetails}
        extraFieldError={extraFieldError}
        setExtraFieldError={setExtraFieldError}
        multipleMilestones={multipleMilestones}
        setMultipleMilestones={setMultipleMilestones}
      />

      <Text
        ref={refs[3]}
        fontSize="18px"
        fontWeight="700"
        lineHeight="26px"
        letterSpacing={0}
        mt="40px"
      >
        Reward and Deadline
      </Text>
      <GrantRewardsInput
        reward={reward}
        setReward={setReward}
        rewardError={rewardError}
        setRewardError={setRewardError}
        rewardCurrency={rewardCurrency}
        setRewardCurrency={setRewardCurrency}
        setRewardCurrencyAddress={setRewardCurrencyAddress}
        date={date}
        setDate={setDate}
        dateError={dateError}
        setDateError={setDateError}
      />

      <Flex alignItems="flex-start" mt={8} mb={10} maxW="400">
        <Image
          display="inline-block"
          h="10px"
          w="10px"
          src="/ui_icons/info_brand.svg"
          mt={1}
          mr={2}
        />
        {' '}
        <Text variant="footer">
          By pressing Publish Grant you&apos;ll have to approve this transaction
          in your wallet.
          {' '}
          <Link href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46" isExternal>Learn more</Link>
          {' '}
          <Image
            display="inline-block"
            h="10px"
            w="10px"
            src="/ui_icons/link.svg"
          />
        </Text>
      </Flex>

      {hasClicked
        ? (
          <Center>
            <CircularProgress isIndeterminate color="brand.500" size="48px" mt={4} />
          </Center>
        ) : (
          <Button onClick={handleOnSubmit} variant="primary">
            Create Grant
          </Button>
        )}
    </>
  );
}

export default Form;
