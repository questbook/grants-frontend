import {
  Flex, Text, Grid, Button, GridItem, Box,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Badge from '../../../ui/badge';
import applicantDetailsList from '../../../../constants/applicantDetailsList';

interface Props {
  onSubmit: (data: any) => void;
}

function ApplicantDetails({ onSubmit }: Props) {
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
      </Flex>
      <Button mt="auto" variant="primary" onClick={handleOnSubmit}>
        Continue
      </Button>
    </>
  );
}

export default ApplicantDetails;
