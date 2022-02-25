import {
  Flex, Grid, GridItem, Box, Text,
} from '@chakra-ui/react';
import React from 'react';
import applicantDetailsList from '../../../../constants/applicantDetailsList';
import Badge from '../../../ui/badge';
import SingleLineInput from '../../../ui/forms/singleLineInput';
import { ExtraFieldError } from './errors/errorTypes';

function ApplicantDetails({
  detailsRequired,
  toggleDetailsRequired,

  extraField,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setExtraField,

  extraFieldDetails,
  setExtraFieldDetails,

  extraFieldError,
  setExtraFieldError,

  multipleMilestones,
  setMultipleMilestones,
}: {
  detailsRequired: any[];
  toggleDetailsRequired: (index: number) => void;

  extraField: boolean;
  setExtraField: (extraField: boolean) => void;

  extraFieldDetails: string;
  setExtraFieldDetails: (extraFieldDetails: string) => void;

  extraFieldError: ExtraFieldError;
  setExtraFieldError: (extraFieldError: ExtraFieldError) => void;

  multipleMilestones: boolean;
  setMultipleMilestones: (multipleMilestones: boolean) => void;
}) {
  const [milestoneSelectOptionIsVisible,
    setMilestoneSelectOptionIsVisible] = React.useState(multipleMilestones ?? false);
  return (
    <Flex py={0} direction="column">
      <Grid templateColumns="repeat(2, 1fr)" gap="18px" fontWeight="bold">
        {detailsRequired.map((detail, index) => {
          const {
            title, required, id, tooltip,
          } = detail as any;
          return (
            <GridItem key={id} colSpan={1}>
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
      </Grid>

      <Box mt={6} />

      {extraField ? (
        <>
          <SingleLineInput
            label="Field Name"
            placeholder="Sample Field"
            isError={extraFieldError !== ExtraFieldError.NoError}
            errorText="Required"
            value={extraFieldDetails}
            onChange={(e) => {
              if (extraFieldError === ExtraFieldError.NoError) {
                setExtraFieldError(ExtraFieldError.NoError);
              }
              setExtraFieldDetails(e.target.value);
            }}
            subtext="Letters and spaces are allowed."
          />
          <Box mt={8} />
        </>
      ) : null}

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
  );
}

export default ApplicantDetails;
