import {
  Flex, Text, Grid, Button, GridItem, Box, Switch, Image, Divider,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Dropdown from 'src/components/ui/forms/dropdown';
import MultiLineInput from 'src/components/ui/forms/multiLineInput';
import SingleLineInput from 'src/components/ui/forms/singleLineInput';
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
  const [maximumPoints, setMaximumPoints] = useState(5);
  const [rubricRequired, setRubricRequired] = useState(false);
  const [rubrics, setRubrics] = useState<any[]>([
    {
      name: '',
      nameError: false,
      description: '',
      descriptionError: false,
    },
  ]);
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
    let error = false;
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
        rubrics.forEach((r, index) => {
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
      onSubmit({
        fields,
        rubric: {
          isPrivate: false,
          rubric,
        },
      });
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
      <Button mt="auto" variant="primary" onClick={handleOnSubmit}>
        Continue
      </Button>
    </>
  );
}

export default ApplicantDetails;
