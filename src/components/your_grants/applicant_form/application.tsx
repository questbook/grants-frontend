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
import { ApiClientsContext } from 'pages/_app';
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { GetApplicationDetailsQuery } from 'src/generated/graphql';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
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

  const refs = [useRef(null), useRef(null), useRef(null)];
  const tabs = ['Project Details', 'Funds Requested', 'About Team'];
  const [projectTitle, setProjectTitle] = useState('');
  const [projectLink, setProjectLink] = useState<any[]>([]);
  const [projectDetails, setProjectDetails] = useState('');
  const [projectGoals, setProjectGoals] = useState('');
  const [projectMilestones, setProjectMilestones] = useState<any[]>([]);
  const [fundingAsk, setFundingAsk] = useState('0');
  const [fundingBreakdown, setFundingBreakdown] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [memberDetails, setMemberDetails] = useState<any[]>([]);

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
    setProjectDetails(getStringField('projectDetails'));
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
            (tab, index) => (index < 2 || (index === 2 && teamMembers)) && (
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

          <Box display={projectDetails && projectDetails !== '' ? '' : 'none'}>
            <Heading variant="applicationHeading" mt={10}>
              Project Details
            </Heading>
            <Text variant="applicationText" mt={2} mb={10}>
              {projectDetails}
            </Text>
          </Box>

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
                        {milestone?.amount && formatAmount(milestone?.amount)}
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
                  {formatAmount(fundingAsk ?? '0')}
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
                rounded="md"
                py="3.5"
                mt="2"
              >
                <Flex
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text variant="applicationText" mt={2}>
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
        </Flex>
        <Box my={10} />
      </Flex>
    </>
  );
}

export default Application;
