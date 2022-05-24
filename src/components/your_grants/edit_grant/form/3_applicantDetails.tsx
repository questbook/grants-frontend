import {
  Flex, Grid, GridItem, Box, Text, Image,
} from '@chakra-ui/react';
import React from 'react';
import SingleLineInput from 'src/components/ui/forms/singleLineInput';
import applicantDetailsList from '../../../../constants/applicantDetailsList';
import Badge from '../../../ui/badge';

function ApplicantDetails({
  detailsRequired,
  toggleDetailsRequired,

  customFields,
  setCustomFields,
  customFieldsOptionIsVisible,
  setCustomFieldsOptionIsVisible,

  multipleMilestones,
  setMultipleMilestones,

  defaultMilestoneFields,
  setDefaultMilestoneFields,

  defaultMilestoneFieldsOptionIsVisible,
}: {
  detailsRequired: any[];
  toggleDetailsRequired: (index: number) => void;

  customFields: any[];
  setCustomFields: (customFields: any[]) => void;
  customFieldsOptionIsVisible: boolean;
  setCustomFieldsOptionIsVisible: (customFieldsOptionIsVisible: boolean) => void;

  multipleMilestones: boolean;
  setMultipleMilestones: (multipleMilestones: boolean) => void;

  defaultMilestoneFields: any[];
  setDefaultMilestoneFields: (defaultMilestoneFields: any[]) => void;

  defaultMilestoneFieldsOptionIsVisible: boolean;
}) {
  const [milestoneSelectOptionIsVisible,
    setMilestoneSelectOptionIsVisible] = React.useState((multipleMilestones ?? false)
     || (defaultMilestoneFieldsOptionIsVisible ?? false));
  return (
    <Flex py={0} direction="column">
      <Grid templateColumns="repeat(2, 1fr)" gap="18px" fontWeight="bold">
        {detailsRequired.map((detail, index) => {
          const {
            title, required, id, tooltip,
          } = detail as any;
          if (id === 'customFields') {
            return (
              <GridItem key={id} colSpan={1}>
                <Badge
                  isActive={customFieldsOptionIsVisible}
                  onClick={() => {
                    setCustomFieldsOptionIsVisible(
                      !customFieldsOptionIsVisible,
                    );
                  }}
                  label="Other Information"
                  tooltip="Get additional details in your application form."
                />
              </GridItem>
            );
          }
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
                    setDefaultMilestoneFields([]);
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

      {customFieldsOptionIsVisible && (
        <>
          {customFields.map((customField, index) => (
            <>
              {index > 0 && (
                <Flex mt={2} mb="-21px" gap="2" justifyContent="flex-end">
                  <Box
                    onClick={() => {
                      const newCustomFields = [...customFields];
                      newCustomFields.splice(index, 1);
                      setCustomFields(newCustomFields);
                    }}
                    display="flex"
                    alignItems="center"
                    cursor="pointer"
                    zIndex={1}
                  >
                    <Image
                      h="12px"
                      w="12px"
                      src="/ui_icons/delete_red.svg"
                      mr="6px"
                      mt="-2px"
                    />
                    <Text fontWeight="500" fontSize="14px" color="#DF5252" lineHeight="20px">
                      Delete
                    </Text>
                  </Box>
                </Flex>
              )}
              <SingleLineInput
                label={`Question ${index + 1}`}
                value={customField.value}
                onChange={(e) => {
                  const newCustomFields = [...customFields];
                  newCustomFields[index].value = e.target.value;
                  newCustomFields[index].isError = false;
                  setCustomFields(newCustomFields);
                }}
                placeholder="Field Label"
                isError={customField.isError}
                errorText="Required"
                maxLength={30}
              />
              <Box mt={2} />
            </>
          ))}
          <Flex mt={2} gap="2" justifyContent="flex-start">
            <Box
              onClick={() => {
                const newCustomFields = [...customFields, {
                  value: '',
                  isError: false,
                }];
                setCustomFields(newCustomFields);
              }}
              display="flex"
              alignItems="center"
              cursor="pointer"
            >
              <Image
                h="16px"
                w="15px"
                src="/ui_icons/plus_circle.svg"
                mr="6px"
              />
              <Text fontWeight="500" fontSize="14px" color="#8850EA" lineHeight="20px">
                Add another question
              </Text>
            </Box>
          </Flex>
          <Box mt={6} />
        </>
      )}

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
              onClick={() => {
                const newDefaultMilestoneFields = [...defaultMilestoneFields];
                newDefaultMilestoneFields.splice(1);
                setDefaultMilestoneFields(newDefaultMilestoneFields);
                setMultipleMilestones(false);
              }}
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

          <Box mb={8} />
          {defaultMilestoneFields.map((defaultMilestoneField, index) => (
            <>
              <Flex mt={2} mb="-21px" gap="2" justifyContent="flex-end">
                <Box
                  onClick={() => {
                    const newDefaultMilestoneFields = [...defaultMilestoneFields];
                    newDefaultMilestoneFields.splice(index, 1);
                    setDefaultMilestoneFields(newDefaultMilestoneFields);
                  }}
                  display="flex"
                  alignItems="center"
                  cursor="pointer"
                  zIndex={1}
                >
                  <Image
                    h="12px"
                    w="12px"
                    src="/ui_icons/delete_red.svg"
                    mr="6px"
                    mt="-2px"
                  />
                  <Text fontWeight="500" fontSize="14px" color="#DF5252" lineHeight="20px">
                    Delete
                  </Text>
                </Box>
              </Flex>
              <SingleLineInput
                label={`Milestone ${index + 1}`}
                value={defaultMilestoneField.value}
                onChange={(e) => {
                  const newDefaultMilestoneFields = [...defaultMilestoneFields];
                  newDefaultMilestoneFields[index].value = e.target.value;
                  newDefaultMilestoneFields[index].isError = false;
                  setDefaultMilestoneFields(newDefaultMilestoneFields);
                }}
                placeholder="Field Label"
                isError={defaultMilestoneField.isError}
                errorText="Required"
                maxLength={250}
              />
              <Box mt={1} />
            </>
          ))}
          {(multipleMilestones || (!multipleMilestones && defaultMilestoneFields.length === 0)) && (
            <Flex mt="-4px" gap="2" justifyContent="flex-start">
              <Box
                onClick={() => {
                  const newDefaultMilestoneFields = [...defaultMilestoneFields, {
                    value: '',
                    isError: false,
                  }];
                  setDefaultMilestoneFields(newDefaultMilestoneFields);
                }}
                display="flex"
                alignItems="center"
                cursor="pointer"
              >
                <Image
                  h="16px"
                  w="15px"
                  src="/ui_icons/plus_circle.svg"
                  mr="6px"
                />
                <Text fontWeight="500" fontSize="14px" color="#8850EA" lineHeight="20px">
                  Add a milestone
                </Text>
              </Box>
            </Flex>
          )}
          <Box mt={6} />
        </>
      )}
    </Flex>
  );
}

export default ApplicantDetails;
