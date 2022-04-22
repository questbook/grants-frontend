import {
  Flex,
  Grid,
  GridItem,
  Box,
  Text,
  Switch,
  Image,
  Divider,
} from '@chakra-ui/react';
import React from 'react';
import Dropdown from 'src/components/ui/forms/dropdown';
import MultiLineInput from 'src/components/ui/forms/multiLineInput';
import SingleLineInput from 'src/components/ui/forms/singleLineInput';
import applicantDetailsList from '../../../../constants/applicantDetailsList';
import Badge from '../../../ui/badge';

function ApplicantDetails({
  detailsRequired,
  toggleDetailsRequired,

  // extraField,
  // setExtraField,

  // extraFieldDetails,
  // setExtraFieldDetails,

  // extraFieldError,
  // setExtraFieldError,

  multipleMilestones,
  setMultipleMilestones,

  rubricRequired,
  setRubricRequired,
  rubrics,
  setRubrics,

  setMaximumPoints,
}: {
  detailsRequired: any[];
  toggleDetailsRequired: (index: number) => void;

  // extraField: boolean;
  // setExtraField: (extraField: boolean) => void;

  // extraFieldDetails: string;
  // setExtraFieldDetails: (extraFieldDetails: string) => void;

  // extraFieldError: boolean;
  // setExtraFieldError: (extraFieldError: boolean) => void;

  multipleMilestones: boolean;
  setMultipleMilestones: (multipleMilestones: boolean) => void;

  rubricRequired: boolean;
  setRubricRequired: (rubricRequired: boolean) => void;
  rubrics: any[];
  setRubrics: (rubrics: any[]) => void;

  setMaximumPoints: (maximumPoints: number) => void;
}) {
  const [milestoneSelectOptionIsVisible, setMilestoneSelectOptionIsVisible] = React.useState(false);

  return (
    <Flex py={0} direction="column">
      <Grid templateColumns="repeat(2, 1fr)" gap="18px" fontWeight="bold">
        {detailsRequired.map((detail, index) => {
          const {
            title, required, tooltip, id,
          } = detail as any;
          if (id === 'isMultipleMilestones') {
            return (
              <GridItem key={id} colSpan={1}>
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

      <Flex direction="column" mt={8}>
        <Text
          fontSize="18px"
          fontWeight="700"
          lineHeight="26px"
          letterSpacing={0}
        >
          Applicant Review
        </Text>
        <Flex>
          <Text color="#717A7C" fontSize="14px" lineHeight="20px">
            Once you recieve applications you can assign reviewers to each applicant,
            and setup a evaluation scorecard to get 360° feedback.
          </Text>
        </Flex>
      </Flex>

      <Flex mt={4} gap="2" justifyContent="space-between">
        <Flex direction="column">
          <Text
            color="#122224"
            fontWeight="bold"
            fontSize="16px"
            lineHeight="20px"
          >
            Evaluation rubric
          </Text>
          <Flex>
            <Text color="#717A7C" fontSize="14px" lineHeight="20px">
              Define a set of criteria for reviewers to evaluate the application
              You can add this later too.
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="center" gap={2} alignItems="center">
          <Switch
            id="encrypt"
            onChange={(e) => {
              setRubricRequired(e.target.checked);
              const newRubrics = rubrics.map((rubric) => ({
                ...rubric,
                nameError: false,
                descriptionError: false,
              }));
              setRubrics(newRubrics);
            }}
          />
          <Text fontSize="12px" fontWeight="bold" lineHeight="16px">
            {`${rubricRequired ? 'YES' : 'NO'}`}
          </Text>
        </Flex>
      </Flex>

      {rubrics.map((rubric, index) => (
        <>
          <Flex
            mt={4}
            gap="2"
            alignItems="flex-start"
            opacity={rubricRequired ? 1 : 0.4}
          >
            <Flex direction="column" flex={0.3327}>
              <Text
                mt="18px"
                color="#122224"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="20px"
              >
                Criteria
                {' '}
                {index + 1}
              </Text>
            </Flex>
            <Flex justifyContent="center" gap={2} alignItems="center" flex={0.6673}>
              <SingleLineInput
                value={rubrics[index].name}
                onChange={(e) => {
                  const newRubrics = [...rubrics];
                  newRubrics[index].name = e.target.value;
                  newRubrics[index].nameError = false;
                  setRubrics(newRubrics);
                }}
                placeholder="Name"
                isError={rubrics[index].nameError}
                errorText="Required"
                disabled={!rubricRequired}
              />
            </Flex>
          </Flex>
          <Flex mt={6} gap="2" alignItems="flex-start" opacity={rubricRequired ? 1 : 0.4}>
            <Flex direction="column" flex={0.3327}>
              <Text
                mt="18px"
                color="#122224"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="20px"
              >
                Description
              </Text>
            </Flex>
            <Flex justifyContent="center" gap={2} alignItems="center" flex={0.6673}>
              <MultiLineInput
                value={rubrics[index].description}
                onChange={(e) => {
                  const newRubrics = [...rubrics];
                  newRubrics[index].description = e.target.value;
                  newRubrics[index].descriptionError = false;
                  setRubrics(newRubrics);
                }}
                placeholder="Describe the evaluation criteria"
                isError={rubrics[index].descriptionError}
                errorText="Required"
                disabled={!rubricRequired}
              />
            </Flex>
          </Flex>

          <Flex mt={2} gap="2" justifyContent="flex-end">
            <Box
              onClick={() => {
                if (!rubricRequired) return;
                const newRubrics = [...rubrics];
                newRubrics.splice(index, 1);
                setRubrics(newRubrics);
              }}
              display="flex"
              alignItems="center"
              cursor="pointer"
              opacity={rubricRequired ? 1 : 0.4}
            >
              <Image
                h="16px"
                w="15px"
                src="/ui_icons/delete_red.svg"
                mr="6px"
              />
              <Text fontWeight="500" fontSize="14px" color="#DF5252" lineHeight="20px">
                Delete
              </Text>
            </Box>
          </Flex>
          <Divider mt={4} />
        </>
      ))}

      <Flex mt="19px" gap="2" justifyContent="flex-start">
        <Box
          onClick={() => {
            if (!rubricRequired) return;
            const newRubrics = [...rubrics, {
              name: '',
              nameError: false,
              description: '',
              descriptionError: false,
            }];
            setRubrics(newRubrics);
          }}
          display="flex"
          alignItems="center"
          cursor="pointer"
          opacity={rubricRequired ? 1 : 0.4}
        >
          <Image
            h="16px"
            w="15px"
            src="/ui_icons/plus_circle.svg"
            mr="6px"
          />
          <Text fontWeight="500" fontSize="14px" color="#8850EA" lineHeight="20px">
            Add another criteria
          </Text>
        </Box>
      </Flex>

      <Flex opacity={rubricRequired ? 1 : 0.4} direction="column" mt={6}>
        <Text
          fontSize="18px"
          fontWeight="700"
          lineHeight="26px"
          letterSpacing={0}
        >
          Evaluation Rating
        </Text>
        <Box mt={2} minW="499px" flex={0}>
          <Dropdown
            listItems={[{
              label: '5 point rating',
              id: '5',
            }, {
              label: '3 point rating',
              id: '3',
            }]}
            onChange={rubricRequired ? ({ id }: any) => {
              setMaximumPoints(parseInt(id, 10));
            } : undefined}
            listItemsMinWidth="600px"
          />
        </Box>
      </Flex>
    </Flex>
  );
}

export default ApplicantDetails;
