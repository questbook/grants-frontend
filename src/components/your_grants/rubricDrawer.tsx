import {
  Box, Divider, Drawer, DrawerContent, DrawerOverlay, Flex, Text, Image, Button,
} from '@chakra-ui/react';
import React from 'react';
import Dropdown from '../ui/forms/dropdown';
import MultiLineInput from '../ui/forms/multiLineInput';
import SingleLineInput from '../ui/forms/singleLineInput';

function RubricDrawer({
  rubricDrawerOpen,
  setRubricDrawerOpen,
  rubrics,
  setRubrics,
  rubricEditAllowed,
}: {
  rubricDrawerOpen: boolean;
  setRubricDrawerOpen: (rubricDrawerOpen: boolean) => void;
  rubrics: any[];
  setRubrics: (rubrics: any[]) => void;
  rubricEditAllowed: boolean;
}) {
  return (
    <Drawer
      isOpen={rubricDrawerOpen}
      placement="right"
      onClose={() => setRubricDrawerOpen(false)}
      size="lg"
    >
      <DrawerOverlay />
      <DrawerContent>

        <Flex direction="column" overflow="scroll" p={8}>
          {rubrics.map((rubric, index) => (
            <>
              <Flex
                mt={4}
                gap="2"
                alignItems="flex-start"
                opacity={rubricEditAllowed ? 1 : 0.4}
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
                    disabled={!rubricEditAllowed}
                  />
                </Flex>
              </Flex>
              <Flex mt={6} gap="2" alignItems="flex-start" opacity={rubricEditAllowed ? 1 : 0.4}>
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
                    disabled={!rubricEditAllowed}
                  />
                </Flex>
              </Flex>

              <Flex mt={2} gap="2" justifyContent="flex-end">
                <Box
                  onClick={() => {
                    if (!rubricEditAllowed) return;
                    const newRubrics = [...rubrics];
                    newRubrics.splice(index, 1);
                    setRubrics(newRubrics);
                  }}
                  display="flex"
                  alignItems="center"
                  cursor="pointer"
                  opacity={rubricEditAllowed ? 1 : 0.4}
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
                if (!rubricEditAllowed) return;
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
              opacity={rubricEditAllowed ? 1 : 0.4}
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

          <Flex opacity={rubricEditAllowed ? 1 : 0.4} direction="column" mt={6}>
            <Text
              fontSize="18px"
              fontWeight="700"
              lineHeight="26px"
              letterSpacing={0}
            >
              Evaluation Rating
            </Text>
            <Box mt={2} minW="399px" flex={0}>
              <Dropdown
                listItems={[{
                  label: '3 point rating',
                  id: '3',
                }, {
                  label: '5 point rating',
                  id: '5',
                }]}
                onChange={rubricEditAllowed ? ({ id }: any) => {
                  console.log(id);
                } : undefined}
                listItemsMinWidth="300px"
              />
            </Box>
          </Flex>
          <Box mt={12}>
            <Button mt="auto" variant="primary" onClick={() => {}}>
              Save
            </Button>
          </Box>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
}

export default RubricDrawer;
