/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Text, Image, Link, Flex,
} from '@chakra-ui/react';
import Loader from 'src/components/ui/loader';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import useChainId from 'src/hooks/utils/useChainId';
import { DefaultSupportedChainId } from 'src/constants/chains';
import { useAccount } from 'wagmi';
import { WorkspaceUpdateRequest, Token } from '@questbook/service-validator-client';
import useUpdateWorkspacePublicKeys from 'src/hooks/useUpdateWorkspacePublicKeys';
import { ApiClientsContext } from 'pages/_app';
import {
  convertFromRaw, convertToRaw, EditorState,
} from 'draft-js';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import Title from './1_title';
import Details from './2_details';
import ApplicantDetails from './3_applicantDetails';
import GrantRewardsInput from './4_rewards';
import Heading from '../../../ui/heading';
import applicantDetailsList from '../../../../constants/applicantDetailsList';

function Form({
  refs,
  onSubmit,
  hasClicked,
}: {
  refs: any[];
  onSubmit: (data: any) => void;
  hasClicked: boolean;
}) {
  const { workspace } = useContext(ApiClientsContext)!;
  const [{ data: accountData }] = useAccount();
  const maxDescriptionLength = 300;
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');

  const [titleError, setTitleError] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  const [details, setDetails] = useState(EditorState.createWithContent(convertFromRaw({
    entityMap: {},
    blocks: [{
      text: '',
      key: 'foo',
      type: 'unstyled',
      entityRanges: [],
    } as any],
  })));
  const [detailsError, setDetailsError] = useState(false);

  const [shouldEncrypt, setShouldEncrypt] = useState(false);
  const [hasOwnerPublicKey, setHasOwnerPublicKey] = useState(false);
  const [keySubmitted, setKeySubmitted] = useState(false);
  const [publicKey, setPublicKey] = React.useState<WorkspaceUpdateRequest>({
    publicKey: '',
  });
  const [transactionData, loading] = useUpdateWorkspacePublicKeys(publicKey);

  const [admins, setAdmins] = useState<any[]>([]);
  const [maximumPoints, setMaximumPoints] = useState(5);

  // [TODO] : if different grantManagers are required for different grants
  // const [grantManagers, setGrantManagers] = useState<any[]>([accountData?.address]);
  // const toggleGrantManager = (address: string) => {
  //   const newGrantManagers = grantManagers.includes(address)
  //     ? grantManagers.filter((grantManager) => grantManager !== address)
  //     : [...grantManagers, address];
  //   setGrantManagers(newGrantManagers);
  // };

  useEffect(() => {
    if (transactionData) {
      setKeySubmitted(true);
    }
  }, [transactionData]);

  useEffect(() => {
    if (workspace && workspace.members && accountData && accountData.address) {
      const hasPubKey = workspace.members.some(
        (member) => member.actorId.toLowerCase() === accountData?.address.toLowerCase()
          && member.publicKey
          && member.publicKey !== '',
      );
      console.log('Workspace', workspace);
      setHasOwnerPublicKey(hasPubKey);
    }
  }, [accountData, workspace]);

  useEffect(() => {
    if (workspace && workspace.members) {
      const adminAddresses = workspace.members
        .filter((member) => member.publicKey && member.publicKey !== '')
        .map((member) => member.actorId);
      setAdmins(adminAddresses);
    }
  }, [workspace]);

  const applicantDetails = applicantDetailsList
    .map(({
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
    })
    .filter((obj) => obj != null);
  const [detailsRequired, setDetailsRequired] = useState(applicantDetails);
  // const [extraField, setExtraField] = useState(false);

  const [customFieldsOptionIsVisible, setCustomFieldsOptionIsVisible] = React.useState(false);
  const [customFields, setCustomFields] = useState<any[]>([{
    value: '',
    isError: false,
  }]);
  const [multipleMilestones, setMultipleMilestones] = useState(false);

  const toggleDetailsRequired = (index: number) => {
    const newDetailsRequired = [...detailsRequired];
    // TODO: create interface for detailsRequired
    (newDetailsRequired[index] as any).required = !(
      newDetailsRequired[index] as any
    ).required;
    setDetailsRequired(newDetailsRequired);
  };

  const [rubricRequired, setRubricRequired] = useState(false);
  const [rubrics, setRubrics] = useState<any>([
    {
      name: '',
      nameError: false,
      description: '',
      descriptionError: false,
    },
  ]);

  const [shouldEncryptReviews, setShouldEncryptReviews] = useState(false);

  // const [extraFieldDetails, setExtraFieldDetails] = useState('');
  // const [extraFieldError, setExtraFieldError] = useState(false);

  const [reward, setReward] = React.useState('');
  const [rewardToken, setRewardToken] = React.useState<Token>({
    label: '', address: '', decimal: '18', iconHash: '',
  });
  const [rewardError, setRewardError] = React.useState(false);

  const currentChain = useChainId() ?? DefaultSupportedChainId;

  // const [supportCurrencies, setsupportCurrencies] = useState([{}]);

  const supportedCurrencies = Object.keys(
    CHAIN_INFO[currentChain].supportedCurrencies,
  )
    .map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
    .map((currency) => ({ ...currency, id: currency.address }));

  const [rewardCurrency, setRewardCurrency] = React.useState(
    supportedCurrencies[0].label,
  );
  const [rewardCurrencyAddress, setRewardCurrencyAddress] = React.useState(
    supportedCurrencies[0].id,
  );
  /**
 * checks if the workspace already has custom tokens added
 * if custom tokens found, append it to supportedCurrencies
 */
  if (workspace?.tokens) {
    for (let i = 0; i < workspace.tokens.length; i += 1) {
      supportedCurrencies.push(
        {
          id: workspace.tokens[i].address,
          address: workspace.tokens[i].address,
          decimals: workspace.tokens[i].decimal,
          label: workspace.tokens[i].label,
          icon: getUrlForIPFSHash(workspace.tokens[i].iconHash),
        },
      );
    }
  }

  useEffect(() => {
    // console.log(currentChain);
    if (currentChain) {
      const supportedCurrencies = Object.keys(
        CHAIN_INFO[currentChain].supportedCurrencies,
      )
        .map((address) => CHAIN_INFO[currentChain].supportedCurrencies[address])
        .map((currency) => ({ ...currency, id: currency.address }));
      setRewardCurrency(supportedCurrencies[0].label);
      setRewardCurrencyAddress(supportedCurrencies[0].address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain]);

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
    if (!details.getCurrentContent().hasText()) {
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

    if (customFieldsOptionIsVisible) {
      const errorCheckedCustomFields = customFields.map((customField: any) => {
        const errorCheckedCustomField = { ...customField };
        if (customField.value.length <= 0) {
          errorCheckedCustomField.isError = true;
          error = true;
        }
        return errorCheckedCustomField;
      });
      setCustomFields(errorCheckedCustomFields);
    }

    if (rubricRequired) {
      const errorCheckedRubrics = rubrics.map((rubric: any) => {
        const errorCheckedRubric = { ...rubric };
        if (rubric.name.length <= 0) {
          errorCheckedRubric.nameError = true;
          error = true;
        }
        if (rubric.description.length <= 0) {
          errorCheckedRubric.descriptionError = true;
          error = true;
        }
        return errorCheckedRubric;
      });
      setRubrics(errorCheckedRubrics);
    }

    if (!error) {
      const detailsString = JSON.stringify(
        convertToRaw(details.getCurrentContent()),
      );

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

      const rubric = {} as any;

      if (rubricRequired) {
        rubrics.forEach((r: any, index: number) => {
          rubric[index.toString()] = {
            title: r.name,
            details: r.description,
            maximumPoints,
          };
        });
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
      if (shouldEncrypt && (keySubmitted || hasOwnerPublicKey)) {
        if (fields.applicantEmail) {
          fields.applicantEmail = { ...fields.applicantEmail, pii: true };
        }
        if (fields.memberDetails) {
          fields.memberDetails = { ...fields.memberDetails, pii: true };
        }
      }
      if (customFields.length > 0) {
        customFields.forEach((customField: any, index: number) => {
          const santizedCustomFieldValue = customField.value.split(' ').join('\\s');
          fields[`customField${index}-${santizedCustomFieldValue}`] = {
            title: customField.value,
            inputType: 'short-form',
          };
        });
      }
      onSubmit({
        title,
        summary,
        details: detailsString,
        fields,
        reward,
        rewardCurrencyAddress,
        rewardToken,
        date,
        grantManagers: admins,
        rubric: {
          isPrivate: shouldEncryptReviews,
          rubric,
        },
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
        // extraField={extraField}
        // setExtraField={setExtraField}
        // extraFieldDetails={extraFieldDetails}
        // setExtraFieldDetails={setExtraFieldDetails}
        // extraFieldError={extraFieldError}
        // setExtraFieldError={setExtraFieldError}
        customFields={customFields}
        setCustomFields={setCustomFields}
        customFieldsOptionIsVisible={customFieldsOptionIsVisible}
        setCustomFieldsOptionIsVisible={setCustomFieldsOptionIsVisible}
        multipleMilestones={multipleMilestones}
        setMultipleMilestones={setMultipleMilestones}
        rubricRequired={rubricRequired}
        setRubricRequired={setRubricRequired}
        rubrics={rubrics}
        setRubrics={setRubrics}
        setMaximumPoints={setMaximumPoints}
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
        rewardToken={rewardToken}
        setRewardToken={setRewardToken}
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
        shouldEncrypt={shouldEncrypt}
        setShouldEncrypt={setShouldEncrypt}
        loading={loading}
        setPublicKey={setPublicKey}
        hasOwnerPublicKey={hasOwnerPublicKey}
        keySubmitted={keySubmitted}
        shouldEncryptReviews={shouldEncryptReviews}
        setShouldEncryptReviews={setShouldEncryptReviews}
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
        py={hasClicked ? 2 : 0}
        onClick={hasClicked ? () => { } : handleOnSubmit}
        variant="primary"
        disabled={shouldEncrypt && !keySubmitted && !hasOwnerPublicKey}
      >
        {hasClicked ? <Loader /> : 'Create Grant'}
      </Button>
    </>
  );
}

export default Form;
