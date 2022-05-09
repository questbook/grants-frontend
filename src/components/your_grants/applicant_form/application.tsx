/* eslint-disable react/no-unstable-nested-components */
import {
  Flex,
  Divider,
  Button,
  Image,
  Text,
  Heading,
  Box,
  Link,
} from '@chakra-ui/react';
import Linkify from 'react-linkify';
import { ApiClientsContext } from 'pages/_app';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer';
import { GetApplicationDetailsQuery } from 'src/generated/graphql';
import { getFromIPFS } from 'src/utils/ipfsUtils';
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { formatAmount } from '../../../utils/formattingUtils';
import { getAssetInfo } from '../../../utils/tokenUtils';

interface Props {
  applicationData: GetApplicationDetailsQuery['grantApplication'];
  showHiddenData: () => void;
}

function Application({ applicationData, showHiddenData }: Props) {
  const [selected, setSelected] = useState(0);

  const scroll = (ref: any, currentSelection: number) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setSelected(currentSelection);
  };

  const refs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const tabs = ['Project Details', 'Funds Requested', 'About Team', 'Other Information'];
  const [projectTitle, setProjectTitle] = useState('');
  const [projectLink, setProjectLink] = useState<any[]>([]);
  const [projectGoals, setProjectGoals] = useState('');
  const [projectMilestones, setProjectMilestones] = useState<any[]>([]);
  const [fundingAsk, setFundingAsk] = useState('0');
  const [fundingBreakdown, setFundingBreakdown] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [memberDetails, setMemberDetails] = useState<any[]>([]);
  const [customFields, setCustomFields] = useState<any[]>([]);

  const [decodedDetails, setDecodedDetails] = useState('');
  const getDecodedDetails = async (detailsHash: string) => {
    console.log(detailsHash);
    const d = await getFromIPFS(detailsHash);
    setDecodedDetails(d);
  };

  useEffect(() => {
    if (!applicationData) return;
    const getStringField = (fieldName: string) => applicationData?.fields?.find(({ id }) => id.split('.')[1] === fieldName)
      ?.values[0]?.value ?? '';
    setProjectTitle(getStringField('projectName'));
    setProjectLink(
      applicationData?.fields
        ?.find((fld: any) => fld?.id?.split('.')[1] === 'projectLink')
        ?.values.map((val) => ({ link: val.value })) ?? [],
    );

    const projectDetailsTemp = getStringField('projectDetails');
    if (projectDetailsTemp.startsWith('Qm') && projectDetailsTemp.length < 64) {
      getDecodedDetails(projectDetailsTemp);
    } else {
      setDecodedDetails(projectDetailsTemp);
    }

    setProjectGoals(getStringField('projectGoals'));
    setProjectMilestones(applicationData?.milestones ?? []);
    setFundingAsk(getStringField('fundingAsk'));
    setFundingBreakdown(getStringField('fundingBreakdown'));
    setTeamMembers(getStringField('teamMembers'));
    setMemberDetails(
      applicationData?.fields
        ?.find((fld: any) => fld?.id?.split('.')[1] === 'memberDetails')
        ?.values.map((val) => val.value) ?? [],
    );

    if (applicationData.fields.length > 0) {
      setCustomFields(applicationData.fields
        .filter((field: any) => (field.id.split('.')[1].startsWith('customField')))
        .map((field: any) => {
          const i = field.id.indexOf('-');
          return ({
            title: field.id.substring(i + 1).split('\\s').join(' '),
            value: field.values[0].value,
            isError: false,
          });
        }));
    }
  }, [applicationData]);

  const { workspace } = useContext(ApiClientsContext)!;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  return (
    <>
      <Flex mt="8px" direction="column" w="full">
        <Divider />
        <Flex
          direction="row"
          w="full"
          justify="space-evenly"
          h={14}
          align="stretch"
          mb={8}
        >
          {tabs.map(
            (tab, index) => (index < 2
              || (index === 2 && teamMembers)
              || (index === 3 && customFields.length > 0)
            ) && (
            <Button
              variant="ghost"
              h="54px"
              w="full"
              _hover={{
                background: '#F5F5F5',
              }}
              _focus={{}}
              borderRadius={0}
              background={selected === index ? '#E7DAFF' : 'white'}
              color={selected === index ? 'brand.500' : '#122224'}
              borderBottomColor={
                    selected === index ? 'brand.500' : '#E7DAFF'
                  }
              borderBottomWidth={selected === index ? '2px' : '1px'}
              onClick={() => scroll(refs[index], index)}
            >
              {tab}
            </Button>
            ),
          )}
        </Flex>
      </Flex>
      <Flex direction="column" w="full">
        <Flex direction="column" w="full" mt={4}>
          <Box display={projectTitle && projectTitle !== '' ? '' : 'none'}>
            <Heading variant="applicationHeading" ref={refs[0]}>
              Project Title
            </Heading>
            <Text variant="applicationText" mt={2}>
              {projectTitle}
            </Text>
          </Box>
          <Box display={projectLink && projectLink.length ? '' : 'none'}>
            <Heading variant="applicationHeading" mt={10}>
              Project Link
            </Heading>
            {projectLink.map(({ link }) => (
              <Text variant="applicationText" mt={2}>
                <Link href={link} isExternal>
                  {link}
                </Link>
              </Text>
            ))}
          </Box>

          {/* <Box display={projectDetails && projectDetails !== '' ? '' : 'none'}>
            <Heading variant="applicationHeading" mt={10}>
              Project Details
            </Heading>
            <Text variant="applicationText" mt={2} mb={10}>
              {projectDetails}
            </Text>
          </Box> */}

          <Heading variant="applicationHeading" mt={10}>
            Project Details
          </Heading>
          <Linkify
            componentDecorator={(
              decoratedHref: string,
              decoratedText: string,
              key: number,
            ) => (
              <Link key={key} href={decoratedHref} isExternal>
                {decoratedText}
              </Link>
            )}
          >
            <Box mt={2} mb={10} fontWeight="400">
              {decodedDetails ? (
                <TextViewer
                  grantDetails={decodedDetails}
                />
              ) : null}
            </Box>
          </Linkify>

          <Box display={projectGoals && projectGoals !== '' ? '' : 'none'}>
            <Heading variant="applicationHeading">Project Goals</Heading>
            <Text variant="applicationText" mt={2} mb={10}>
              {projectGoals}
            </Text>
          </Box>

          <Box
            display={
              projectMilestones && projectMilestones.length ? '' : 'none'
            }
          >
            <Heading variant="applicationHeading" ref={refs[1]}>
              Project Milestones
            </Heading>
            <Flex direction="column" w="full" mt={3} mb={10}>
              {projectMilestones.map((milestone: any, index: number) => (
                <Box>
                  <Heading variant="applicationHeading" mt={3}>
                    Milestone
                    {' '}
                    {index + 1}
                  </Heading>
                  <Text variant="applicationText" mt={1}>
                    {milestone?.title}
                  </Text>
                  <Flex direction="row" justify="start" mt={3}>
                    <Image
                      src={
                        getAssetInfo(
                          applicationData?.grant?.reward?.asset,
                          chainId,
                        )?.icon
                      }
                    />
                    <Box ml={2} />
                    <Flex direction="column" justify="center" align="start">
                      <Heading variant="applicationHeading">
                        Funding asked
                      </Heading>
                      <Text variant="applicationText">
                        {milestone?.amount && applicationData
                        && formatAmount(
                          milestone?.amount,
                          CHAIN_INFO[
                            getSupportedChainIdFromSupportedNetwork(
                              applicationData.grant.workspace.supportedNetworks[0],
                            )
                          ]?.supportedCurrencies[applicationData.grant.reward.asset.toLowerCase()]
                            ?.decimals ?? 18,
                        )}
                        {' '}
                        {
                          getAssetInfo(
                            applicationData?.grant?.reward?.asset,
                            chainId,
                          )?.label
                        }
                      </Text>
                    </Flex>
                  </Flex>
                  <Box mt={4} />
                </Box>
              ))}
            </Flex>
          </Box>

          <Box display={fundingAsk && fundingAsk !== '' ? '' : 'none'}>
            <Heading variant="applicationHeading">
              Funding & Budget Breakdown
            </Heading>
            <Flex direction="row" justify="start" mt={3} mb={10}>
              <Image
                src={
                  getAssetInfo(applicationData?.grant?.reward?.asset, chainId)
                    ?.icon
                }
              />
              <Box ml={2} />
              <Flex direction="column" justify="center" align="start">
                <Heading variant="applicationHeading">
                  Total funding asked
                </Heading>
                <Text variant="applicationText" color="brand.500">
                  {applicationData
                    && formatAmount(
                      fundingAsk ?? '0',
                      CHAIN_INFO[
                        getSupportedChainIdFromSupportedNetwork(
                          applicationData.grant.workspace.supportedNetworks[0],
                        )
                      ]?.supportedCurrencies[applicationData.grant.reward.asset.toLowerCase()]
                        ?.decimals ?? 18,
                    )}
                  {' '}
                  {
                    getAssetInfo(applicationData?.grant?.reward?.asset, chainId)
                      ?.label
                  }
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Box
            display={fundingBreakdown && fundingBreakdown !== '' ? '' : 'none'}
          >
            <Heading variant="applicationHeading">Funding Breakdown</Heading>
            <Text variant="applicationText" mb={10}>
              {fundingBreakdown}
            </Text>
          </Box>

          <Box display={teamMembers ? '' : 'none'}>
            <Heading variant="applicationHeading" ref={refs[2]}>
              About Team
            </Heading>
            <Heading variant="applicationHeading" mt={4}>
              Team Members -
              {' '}
              <Heading
                variant="applicationHeading"
                color="brand.500"
                display="inline-block"
              >
                {teamMembers}
              </Heading>
            </Heading>
            {memberDetails && memberDetails.length ? (
              memberDetails.map((memberDetail: any, index: number) => (
                <Box>
                  <Heading
                    variant="applicationHeading"
                    color="brand.500"
                    mt={5}
                  >
                    Member
                    {' '}
                    {index + 1}
                  </Heading>
                  <Text variant="applicationText" mt={2}>
                    {memberDetail}
                  </Text>
                </Box>
              ))
            ) : (
              <Box
                backdropBlur="base"
                border="1px"
                borderColor="#D0D3D3"
                rounded="md"
                py="5"
                mt="2"
                display="flex"
                justifyContent="center"
              >
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  maxW="480px"
                >
                  <Image h="77px" w="89px" src="/illustrations/disburse_grants.svg" />
                  <Text textAlign="center" variant="applicationText" mt={2}>
                    Team member details are hidden, and can be viewed only if
                    you have specific access.
                  </Text>
                  <Button
                    onClick={showHiddenData}
                    variant="primary"
                    mt={7}
                    w="269px"
                  >
                    View Details
                  </Button>
                </Flex>
              </Box>
            )}
          </Box>

          <Box mt={12} display={customFields.length > 0 ? '' : 'none'}>
            <Heading variant="applicationHeading" ref={refs[3]}>
              Other Information
            </Heading>

            {customFields.map((customField: any, index: number) => (
              <Box>
                <Heading variant="applicationHeading" mt={3}>
                  {index + 1}
                  {'. '}
                  {customField.title}
                </Heading>
                <Text variant="applicationText" mt={1}>
                  {customField.value}
                </Text>
              </Box>
            ))}
          </Box>
        </Flex>
        <Box my={10} />
      </Flex>
    </>
  );
}

export default Application;
