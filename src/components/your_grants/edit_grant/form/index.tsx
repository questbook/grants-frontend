/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from 'react';
import {
  Box, Button, Text, Image, Link, Flex,
} from '@chakra-ui/react';
import Title from './1_title';
import Details from './2_details';
import ApplicantDetails from './3_applicantDetails';
import GrantRewardsInput from './4_rewards';
import applicantDetailsList from '../../../../constants/applicantDetailsList';
import Heading from '../../../ui/heading';

function Form({
  refs,
  onSubmit,
  formData,
}: {
  refs: any[];
  onSubmit: (data: any) => void;
  formData: any;
}) {
  const maxDescriptionLength = 300;
  const [title, setTitle] = useState(formData.title ?? '');
  const [summary, setSummary] = useState(formData.summary ?? '');

  const [titleError, setTitleError] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  const [details, setDetails] = useState(formData.details ?? '');
  const [detailsError, setDetailsError] = useState(false);

  const applicantDetails = applicantDetailsList.map(
    ({ title, tooltip, id }, index) => ({
      title,
      required: formData[id] ?? false,
      id,
      tooltip,
      index,
    }),
  );
  const [detailsRequired, setDetailsRequired] = useState(applicantDetails);
  const [extraField, setExtraField] = useState(
    formData.extra_field && formData.extra_field.length > 0,
  );
  const [multipleMilestones, setMultipleMilestones] = useState(
    formData.multiple_milestones,
  );

  const toggleDetailsRequired = (index: number) => {
    const newDetailsRequired = [...detailsRequired];
    // TODO: create interface for detailsRequired
    (newDetailsRequired[index] as any).required = !(
      newDetailsRequired[index] as any
    ).required;
    setDetailsRequired(newDetailsRequired);
  };

  const [extraFieldDetails, setExtraFieldDetails] = useState(formData.extra_field ?? '');
  const [extraFieldError, setExtraFieldError] = useState(false);

  const [reward, setReward] = React.useState(formData.reward ?? '');
  const [rewardError, setRewardError] = React.useState(false);

  const [rewardCurrency, setRewardCurrency] = React.useState(formData.rewardCurrency ?? 'ETH');

  const [date, setDate] = React.useState(formData.date ?? '');
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
        requiredDetails[detail.id] = detail.required;
      });
      onSubmit({
        title,
        summary,
        details,
        ...requiredDetails,
        extra_field:
          extraFieldDetails != null && extraFieldDetails.length > 0 ? extraFieldDetails : '',
        is_multiple_miletones: multipleMilestones,
        reward,
        rewardCurrency,
        date,
      });
    }
  };

  return (
    <>
      <Heading mt="18px" title="Edit your grant" />

      <Flex mt="-73px" justifyContent="flex-end">
        <Button onClick={handleOnSubmit} variant="primary">Save</Button>
      </Flex>

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
      <Box mt="20px" />
      <GrantRewardsInput
        reward={reward}
        setReward={setReward}
        rewardError={rewardError}
        setRewardError={setRewardError}
        rewardCurrency={rewardCurrency}
        setRewardCurrency={setRewardCurrency}
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

      <Button onClick={handleOnSubmit} variant="primary">
        Save Changes
      </Button>
    </>
  );
}

export default Form;
