import {
  Box, Divider, Drawer, DrawerContent, DrawerOverlay, Flex, Text, Image, Button, Switch, Link,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { SupportedChainId } from 'src/constants/chains';
import useSetRubrics from 'src/hooks/useSetRubrics';
import Dropdown from '../ui/forms/dropdown';
import MultiLineInput from '../ui/forms/multiLineInput';
import SingleLineInput from '../ui/forms/singleLineInput';
import Loader from '../ui/loader';

function RubricDrawer({
  rubricDrawerOpen,
  setRubricDrawerOpen,
  rubrics,
  setRubrics,
  rubricEditAllowed,
  maximumPoints,
  setMaximumPoints,
  grantAddress,
  chainId,
  workspaceId,
  initialIsPrivate,
}: {
  rubricDrawerOpen: boolean;
  setRubricDrawerOpen: (rubricDrawerOpen: boolean) => void;
  rubrics: any[];
  setRubrics: (rubrics: any[]) => void;
  rubricEditAllowed: boolean;
  maximumPoints: number;
  setMaximumPoints: (maximumPoints: number) => void;
  grantAddress: string;
  chainId: SupportedChainId | undefined;
  workspaceId: string;
  initialIsPrivate: boolean;
}) {
  const [shouldEncryptReviews, setShouldEncryptReviews] = React.useState(false);
  useEffect(() => {
    if (initialIsPrivate) {
      setShouldEncryptReviews(true);
    }
  }, [initialIsPrivate]);

  const [editedRubricData, setEditedRubricData] = React.useState<any>();
  const handleOnSubmit = () => {
    let error = false;
    if (rubrics.length > 0) {
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
      const rubric = {} as any;

      if (rubrics.length > 0) {
        rubrics.forEach((r, index) => {
          rubric[index.toString()] = {
            title: r.name,
            details: r.description,
            maximumPoints,
          };
        });
      }

      console.log('rubric', rubric);
      setEditedRubricData({
        rubric: {
          isPrivate: shouldEncryptReviews,
          rubric,
        },
      });
    }
  };

  const [
    data,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transactionLink,
    loading,
  ] = useSetRubrics(editedRubricData, chainId, workspaceId, grantAddress);

  useEffect(() => {
    if (data) {
      setRubricDrawerOpen(false);
    }
  }, [data, setRubricDrawerOpen]);

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
                listItems={maximumPoints === 3 ? [{
                  label: '3 point rating',
                  id: '3',
                }, {
                  label: '5 point rating',
                  id: '5',
                }] : [{
                  label: '5 point rating',
                  id: '5',
                }, {
                  label: '3 point rating',
                  id: '3',
                }]}
                onChange={rubricEditAllowed ? ({ id }: any) => {
                  setMaximumPoints(parseInt(id, 10));
                } : undefined}
                listItemsMinWidth="300px"
              />
            </Box>
          </Flex>

          <Flex mt={8} gap="2" justifyContent="space-between">
            <Flex direction="column" flex={1}>
              <Text
                color="#122224"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="20px"
              >
                Keep applicant reviews private
              </Text>
              <Flex>
                <Text color="#717A7C" fontSize="14px" lineHeight="20px">
                  Private review is only visible to reviewers, DAO members.
                </Text>
              </Flex>
            </Flex>
            <Flex ml="auto" justifyContent="center" gap={2} alignItems="center">
              <Switch
                id="encrypt"
                defaultChecked={initialIsPrivate}
                onChange={(e) => {
                  setShouldEncryptReviews(e.target.checked);
                }}
              />
              <Text fontSize="12px" fontWeight="bold" lineHeight="16px">
                {`${shouldEncryptReviews ? 'YES' : 'NO'}`}
              </Text>
            </Flex>
          </Flex>

          <Text variant="footer" mt={8} mb={7} maxW="400">
            <Image
              display="inline-block"
              h="10px"
              w="10px"
              src="/ui_icons/info_brand.svg"
            />
            {' '}
            By clicking Publish Grant you&apos;ll have to approve this transaction
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

          <Box mt={12}>
            <Button mt="auto" variant="primary" onClick={handleOnSubmit}>
              {!loading ? 'Save' : (
                <Loader />
              )}
            </Button>
          </Box>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
}

export default RubricDrawer;
