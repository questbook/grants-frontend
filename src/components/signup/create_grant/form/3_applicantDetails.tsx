import {
  Flex, Text, Grid, Button, GridItem, Box, Switch, Image, Link,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import useEncryption from 'src/hooks/utils/useEncryption';
import useUpdateWorkspacePublicKeys from 'src/hooks/useUpdateWorkspacePublicKeys';
import { WorkspacePublicKeysUpdateRequest } from '@questbook/service-validator-client';
import { useAccount } from 'wagmi';
import Loader from 'src/components/ui/loader';
import Badge from '../../../ui/badge';
import applicantDetailsList from '../../../../constants/applicantDetailsList';
import Tooltip from '../../../ui/tooltip';

interface Props {
  onSubmit: (data: any) => void;
}

function ApplicantDetails({ onSubmit }: Props) {
  const { getPublicEncryptionKey } = useEncryption();
  const applicantDetails = applicantDetailsList.map(
    ({
      title, tooltip, id, inputType, isRequired,
    }, index) => {
      if (index === applicantDetailsList.length - 1) return null;
      if (index === applicantDetailsList.length - 2) return null;
      return {
        title,
        required: isRequired || false,
        id,
        tooltip,
        index,
        inputType,
      };
    },
  ).filter((obj) => obj != null);
  const [detailsRequired, setDetailsRequired] = useState(applicantDetails);
  const [shouldEncrypt, setShouldEncrypt] = useState(false);
  const [keySubmitted, setKeySubmitted] = useState(false);
  const [publicKey, setPublicKey] = React.useState<WorkspacePublicKeysUpdateRequest>({ walletId: '', publicKey: '' });
  const [transactionData, loading] = useUpdateWorkspacePublicKeys(publicKey);
  const [{ data: accountData }] = useAccount();

  useEffect(() => {
    if (transactionData) {
      setKeySubmitted(true);
    }
  }, [transactionData]);
  // const [extraField] = useState(false);

  const [milestoneSelectOptionIsVisible, setMilestoneSelectOptionIsVisible] = React.useState(false);
  const [multipleMilestones, setMultipleMilestones] = useState(false);

  const toggleDetailsRequired = (index: number) => {
    const newDetailsRequired = [...detailsRequired];
    // TODO: create interface for detailsRequired
    (newDetailsRequired[index] as any).required = !(
      newDetailsRequired[index] as any
    ).required;
    setDetailsRequired(newDetailsRequired);
  };

  // const [extraFieldDetails, setExtraFieldDetails] = useState('');
  // const [extraFieldError, setExtraFieldError] = useState(false);

  const handleOnSubmit = () => {
    const error = false;
    // if (extraField && extraFieldDetails.length <= 0) {
    //   setExtraFieldError(true);
    //   error = true;
    // }
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
      if (shouldEncrypt && keySubmitted) {
        fields.applicantEmail = { ...fields.applicantEmail, pii: true };
        fields.memberDetails = { ...fields.memberDetails, pii: true };
      }
      onSubmit({ fields });
    }
  };

  return (
    <>
      <Flex py={12} direction="column">
        <Text variant="heading" fontSize="36px" lineHeight="48px">
          What details should the applicants provide?
        </Text>

        <Grid
          mt={12}
          templateColumns="repeat(2, 1fr)"
          gap={5}
          fontWeight="bold"
        >
          {detailsRequired.map((detail, index) => {
            // if (index === detailsRequired.length - 1) return null;
            // if (index === detailsRequired.length - 2) return null;
            const {
              title, required, id, tooltip,
            } = detail as any;
            if (id === 'isMultipleMilestones') {
              return (
                <GridItem colSpan={1}>
                  <Badge
                    isActive={milestoneSelectOptionIsVisible}
                    onClick={() => {
                      setMilestoneSelectOptionIsVisible(
                        !milestoneSelectOptionIsVisible,
                      );
                      setMultipleMilestones(false);
                    }}
                    label="Milestones"
                    tooltip="Add milestones for the applicant to complete"
                  />
                </GridItem>
              );
            }
            return (
              <GridItem colSpan={1} key={id}>
                <Badge
                  isActive={applicantDetailsList[index].isRequired || required}
                  onClick={() => {
                    if (!applicantDetailsList[index].isRequired) {
                      toggleDetailsRequired(index);
                    }
                  }}
                  label={title}
                  tooltip={tooltip}
                />
              </GridItem>
            );
          })}
        </Grid>

        <Box mt={6} />

        {/* {extraField ? (
          <>
            <SingleLineInput
              label="Field Name"
              placeholder="Sample Field"
              isError={extraFieldError}
              errorText="Required"
              value={extraFieldDetails}
              onChange={(e) => {
                setExtraFieldError(false);
                setExtraFieldDetails(e.target.value);
              }}
              subtext="Letters and spaces are allowed."
            />
            <Box mt={8} />
          </>
        ) : null} */}

        {milestoneSelectOptionIsVisible && (
        <>
          <Flex flex={1} direction="column">
            <Text lineHeight="20px" fontWeight="bold">
              Milestones
            </Text>
          </Flex>
          <Flex mt={1} maxW="420px">
            <Badge
              isActive={!multipleMilestones}
              onClick={() => setMultipleMilestones(false)}
              label="Single Milestone"
              inActiveVariant="solid"
              variant="buttonGroupStart"
            />
            <Badge
              isActive={multipleMilestones}
              onClick={() => setMultipleMilestones(true)}
              label="Multiple Milestones"
              inActiveVariant="solid"
              variant="buttonGroupEnd"
            />
          </Flex>
        </>
        )}
        <Flex mt={8} gap="2">
          <Flex direction="column">
            <Text color="#122224" fontWeight="bold" fontSize="16px" lineHeight="20px">
              Hide applicant personal data (email, and about team)
            </Text>
            <Flex>
              <Text color="#717A7C" fontSize="14px" lineHeight="20px">
                You will be asked for your public encryption key
                <Tooltip
                  icon="/ui_icons/tooltip_questionmark.svg"
                  label="Write about the team members working on the project."
                  placement="bottom-start"
                />
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent="center" gap={2} alignItems="center">
            <Switch
              id="encrypt"
              onChange={
              (e) => {
                setShouldEncrypt(e.target.checked);
              }
             }
            />
            <Text
              fontSize="12px"
              fontWeight="bold"
              lineHeight="16px"
            >
              {`${shouldEncrypt ? 'YES' : 'NO'}`}

            </Text>
          </Flex>
        </Flex>
        {shouldEncrypt && (
          <Flex mt={8} gap="2" direction="column">
            <Flex
              gap="2"
              cursor="pointer"
              onClick={async () => setPublicKey({ walletId: accountData?.address, publicKey: (await getPublicEncryptionKey()) || '' })}
            >
              <Text
                color="brand.500"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="24px"
              >
                Allow access to your public key and encrypt the applicant form to proceed
              </Text>
              <ChevronRightIcon color="brand.500" fontSize="2xl" />
              {loading
              && <Loader />}
            </Flex>
            <Flex alignItems="center" gap={2}>
              <Image mt={1} src="/ui_icons/info.svg" />
              <Text color="#122224" fontWeight="medium" fontSize="14px" lineHeight="20px">
                By doing the above you’ll have to approve this transaction in your wallet.
              </Text>
            </Flex>
            <Link href="todo">
              <Text color="#122224" fontWeight="normal" fontSize="14px" lineHeight="20px" decoration="underline">

                Why is this required?
              </Text>
            </Link>
          </Flex>
        )}

      </Flex>
      <Button mt="auto" variant="primary" onClick={handleOnSubmit} disabled={shouldEncrypt && !keySubmitted}>
        Continue
      </Button>
    </>
  );
}

export default ApplicantDetails;
