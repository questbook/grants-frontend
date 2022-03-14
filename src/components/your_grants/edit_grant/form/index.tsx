/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Text, Image, Link, Flex,
} from '@chakra-ui/react';
import Loader from 'src/components/ui/loader';
import useChainId from 'src/hooks/utils/useChainId';
import { SupportedChainId } from 'src/constants/chains';
import { CHAIN_INFO } from 'src/constants/chainInfo';
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
  hasClicked,
}: {
  refs: any[];
  onSubmit: (data: any) => void;
  formData: any;
  hasClicked: boolean;
}) {
  const maxDescriptionLength = 300;
  const [title, setTitle] = useState(formData.title ?? '');
  const [summary, setSummary] = useState(formData.summary ?? '');

  const [titleError, setTitleError] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  const [details, setDetails] = useState(formData.details ?? '');
  const [detailsError, setDetailsError] = useState(false);

  const applicantDetails = applicantDetailsList.map(
    ({
      title, tooltip, id, inputType, isRequired,
    }, index) => {
      if (index === applicantDetailsList.length - 1) return null;
      if (index === applicantDetailsList.length - 2) return null;
      return {
        title,
        required: formData[id] ?? (isRequired ?? false),
        id,
        tooltip,
        index,
        inputType,
      };
    },
  ).filter((obj) => obj != null);
  const [detailsRequired, setDetailsRequired] = useState(applicantDetails);
  // const [extraField, setExtraField] = useState(
  //   formData.extraField,
  // );
  const [multipleMilestones, setMultipleMilestones] = useState(
    formData.isMultipleMilestones,
  );

  const toggleDetailsRequired = (index: number) => {
    const newDetailsRequired = [...detailsRequired];
    // TODO: create interface for detailsRequired

    // console.log(newDetailsRequired, index);

    (newDetailsRequired[index] as any).required = !(
      newDetailsRequired[index] as any
    ).required;
    setDetailsRequired(newDetailsRequired);
  };

  // const [extraFieldDetails, setExtraFieldDetails] = useState(formData.extra_field ?? '');
  // const [extraFieldError, setExtraFieldError] = useState(false);

  const [reward, setReward] = React.useState(formData.reward ?? '');
  const [rewardError, setRewardError] = React.useState(false);

  const currentChain = useChainId() ?? SupportedChainId.RINKEBY;

  const supportedCurrencies = Object.keys(
    CHAIN_INFO[currentChain].supportedCurrencies,
  ).map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
    .map((currency) => ({ ...currency, id: currency.address }));
  const [rewardCurrency, setRewardCurrency] = React.useState(
    formData.rewardCurrency ?? supportedCurrencies[0].label,
  );
  const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
    formData.rewardCurrencyAddress ?? supportedCurrencies[0].id,
  );

  useEffect(() => {
    // console.log(currentChain);
    if (currentChain) {
      const supportedCurrencies = Object.keys(
        CHAIN_INFO[currentChain].supportedCurrencies,
      ).map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
        .map((currency) => ({ ...currency, id: currency.address }));
      setRewardCurrency(formData.rewardCurrency ?? supportedCurrencies[0].label);
      setRewardCurrencyAddress(formData.rewardCurrencyAddress ?? supportedCurrencies[0].address);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain]);

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
    // if (extraField && extraFieldDetails.length <= 0) {
    //   setExtraFieldError(true);
    //   error = true;
    // }
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
      // if (extraFieldDetails != null && extraFieldDetails.length > 0) {
      //   fields.extraField = {
      //     title: 'Other Information',
      //     inputType: 'short-form',
      //   };
      // }
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

      // console.log(fields);
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

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <Heading mt="18px" title="Edit your grant" />

      <Flex mt="-73px" justifyContent="flex-end">
        <Button
          ref={buttonRef}
          w={hasClicked ? buttonRef.current?.offsetWidth : 'auto'}
          onClick={hasClicked ? () => {} : handleOnSubmit}
          py={hasClicked ? 2 : 0}
          variant="primary"
        >
          {hasClicked ? <Loader /> : 'Save'}
        </Button>
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
        // extraField={extraField}
        // setExtraField={setExtraField}
        // extraFieldDetails={extraFieldDetails}
        // setExtraFieldDetails={setExtraFieldDetails}
        // extraFieldError={extraFieldError}
        // setExtraFieldError={setExtraFieldError}
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
        setRewardCurrencyAddress={setRewardCurrencyAddress}
        date={date}
        setDate={setDate}
        dateError={dateError}
        setDateError={setDateError}
        supportedCurrencies={supportedCurrencies}
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

      <Button onClick={hasClicked ? () => {} : handleOnSubmit} py={hasClicked ? 2 : 0} variant="primary">
        {hasClicked ? <Loader /> : 'Save Changes'}
      </Button>
    </>
  );
}

export default Form;
