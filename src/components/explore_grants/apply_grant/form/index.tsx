/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useState } from 'react';
import {
  Box, Button, Text, Image, Link, Flex, Container, useToast, ToastId, Center, CircularProgress,
} from '@chakra-ui/react';
import { useContract, useSigner } from 'wagmi';
import { GrantApplicationRequest } from '@questbook/service-validator-client';
import { useRouter } from 'next/router';
import { isValidEmail } from 'src/utils/validationUtils';
import { BigNumber } from 'ethers';
import { parseAmount } from '../../../../utils/formattingUtils';
import { GrantApplicationFieldsSubgraph, GrantApplicationCreateSubgraph } from '../../../../types/application';
import InfoToast from '../../../ui/infoToast';
import ApplicantDetails from './1_applicantDetails';
import AboutProject from './3_aboutProject';
import AboutTeam from './2_aboutTeam';
import Funding from './4_funding';
import config from '../../../../constants/config';
import ApplicationRegistryAbi from '../../../../contracts/abi/ApplicationRegistryAbi.json';
import { ApiClientsContext } from '../../../../../pages/_app';
import {
  ApplicantEmailError, ApplicantNameError, BreakdownError,
  FundingAskError, MemberDescriptionError, MilestoneError, MilestoneRewardError,
  ProjectDetailsError, ProjectGoalError, ProjectLinkError, ProjectNameError, TeamMemberError,
} from './errors/errorTypes';

interface Props {
  // onSubmit: (data: any) => void;
  title: string;
  grantId: string;
  daoLogo: string;
  workspaceId: string;
  rewardAmount: string;
  rewardCurrency: string;
  rewardCurrencyCoin: string;
  grantRequiredFields: string[];
}

// eslint-disable-next-line max-len
function Form({
  // onSubmit,
  title,
  grantId,
  daoLogo,
  workspaceId,
  rewardAmount,
  rewardCurrency,
  rewardCurrencyCoin,
  grantRequiredFields,
}: Props) {
  const [signer] = useSigner();
  const applicationRegistryContract = useContract({
    addressOrName: config.ApplicationRegistryAddress,
    contractInterface: ApplicationRegistryAbi,
    signerOrProvider: signer.data,
  });

  const apiClientContext = useContext(ApiClientsContext);
  const [applicantName, setApplicantName] = useState('');
  const [applicantNameError, setApplicantNameError] = useState(ApplicantNameError.NoError);

  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantEmailError, setApplicantEmailError] = useState(ApplicantEmailError.NoError);

  const [teamMembers, setTeamMembers] = useState<number | null>(1);
  const [teamMembersError, setTeamMembersError] = useState(TeamMemberError.NoError);

  const [membersDescription, setMembersDescription] = useState([
    {
      description: '',
      isError: MemberDescriptionError.NoError,
    },
  ]);

  const [projectName, setProjectName] = useState('');
  const [projectNameError, setProjectNameError] = useState(ProjectNameError.NoError);

  const [projectLinks, setProjectLinks] = useState([
    {
      link: '',
      isError: ProjectLinkError.NoError,
    },
  ]);

  const [projectDetails, setProjectDetails] = useState('');
  const [projectDetailsError, setProjectDetailsError] = useState(ProjectDetailsError.NoError);

  const [projectGoal, setProjectGoal] = useState('');
  const [projectGoalError, setProjectGoalError] = useState(ProjectGoalError.NoError);

  const [projectMilestones, setProjectMilestones] = useState([
    {
      milestone: '',
      milestoneReward: '',
      milestoneIsError: MilestoneError.NoError,
      milestoneRewardIsError: MilestoneRewardError.NoError,
    },
  ]);

  const [fundingAsk, setFundingAsk] = useState('');
  const [fundingAskError, setFundingAskError] = useState(FundingAskError.NoError);

  const [fundingBreakdown, setFundingBreakdown] = useState('');
  const [fundingBreakdownError, setFundingBreakdownError] = useState(BreakdownError.NoError);

  const [hasClicked, setHasClicked] = React.useState(false);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const router = useRouter();

  const closeToast = () => {
    if (toastRef.current) {
      toast.close(toastRef.current);
    }
  };

  const showToast = ({ link } : { link: string }) => {
    toastRef.current = toast({
      position: 'top',
      render: () => (
        <InfoToast
          link={link}
          close={closeToast}
        />
      ),
    });
  };

  const handleOnSubmit = async () => {
    try {
      let error = false;
      if (applicantName === '' && grantRequiredFields.includes('applicantName')) {
        setApplicantNameError(ApplicantNameError.InvalidValue);
        error = true;
      }
      if ((applicantEmail === '' || !isValidEmail(applicantEmail)) && grantRequiredFields.includes('applicantEmail')) {
        setApplicantEmailError(applicantEmail === ''
          ? ApplicantEmailError.InvalidValue : ApplicantEmailError.InvalidFormat);
        error = true;
      }
      if ((!teamMembers || teamMembers <= 0) && grantRequiredFields.includes('teamMembers')) {
        setTeamMembersError(TeamMemberError.InvalidValue);
        error = true;
      }

      let membersDescriptionError = false;
      const newMembersDescriptionArray = [...membersDescription];
      membersDescription.forEach((member, index) => {
        if (member.description === '' && grantRequiredFields.includes('memberDetails')) {
          newMembersDescriptionArray[index].isError = MemberDescriptionError.InvalidValue;
          membersDescriptionError = true;
        }
      });

      if (membersDescriptionError) {
        setMembersDescription(newMembersDescriptionArray);
        error = true;
      }

      if (projectName === '' && grantRequiredFields.includes('projectName')) {
        setProjectNameError(ProjectNameError.InvalidValue);
        error = true;
      }

      let projectLinksError = false;
      const newProjectLinks = [...projectLinks];
      projectLinks.forEach((project, index) => {
        if (project.link === '' && grantRequiredFields.includes('projectLink')) {
          newProjectLinks[index].isError = ProjectLinkError.InvalidValue;
          projectLinksError = true;
        }
      });

      if (projectLinksError) {
        setProjectLinks(newProjectLinks);
        error = true;
      }

      if (projectDetails === '' && grantRequiredFields.includes('projectDetails')) {
        setProjectDetailsError(ProjectDetailsError.InvalidValue);
        error = true;
      }
      if (projectGoal === '' && grantRequiredFields.includes('projectGoals')) {
        setProjectGoalError(ProjectGoalError.InvalidValue);
        error = true;
      }

      let projectMilestonesError = false;
      const newProjectMilestones = [...projectMilestones];
      projectMilestones.forEach((project, index) => {
        if (project.milestone === '') {
          newProjectMilestones[index].milestoneIsError = MilestoneError.InvalidValue;
          projectMilestonesError = true;
        }
        if (project.milestoneReward === '' || BigNumber.from(project.milestoneReward).lte(0)) {
          newProjectMilestones[index].milestoneRewardIsError = MilestoneRewardError.InvalidValue;
          projectMilestonesError = true;
        }
      });

      if (projectMilestonesError) {
        setProjectMilestones(newProjectMilestones);
        error = true;
      }

      if (fundingAsk === '' && grantRequiredFields.includes('fundingAsk')) {
        setFundingAskError(FundingAskError.InvalidValue);
        error = true;
      }
      if (fundingBreakdown === '' && grantRequiredFields.includes('fundingBreakdown')) {
        setFundingBreakdownError(BreakdownError.InvalidValue);
        error = true;
      }
      if (error) {
        return;
      }
      const links = projectLinks.map((pl) => (pl.link));

      const milestones = projectMilestones.map((pm) => (
        { title: pm.milestone, amount: parseAmount(pm.milestoneReward) }
      ));

      if (!signer || !signer.data || !apiClientContext) return;
      setHasClicked(true);
      const data: GrantApplicationCreateSubgraph = {
        grantId,
        applicantId: await signer?.data?.getAddress(),
        fields: {
          applicantName: [applicantName],
          applicantEmail: [applicantEmail],
          projectName: [projectName],
          projectDetails: [projectDetails],
          fundingAsk: [parseAmount(fundingAsk)],
          fundingBreakdown: [fundingBreakdown],
          teamMembers: [Number(teamMembers).toString()],
          memberDetails: membersDescription.map((md) => (md.description)),
          projectLink: links,
          projectGoals: [projectGoal],
          isMultipleMilestones: [grantRequiredFields.includes('isMultipleMilestones').toString()],
        },
        milestones,

      };
      Object.keys(data.fields).forEach((field) => {
        if (!grantRequiredFields.includes(field)) {
          delete data.fields[field as keyof GrantApplicationFieldsSubgraph];
        }
      });
      const { data: { ipfsHash } } = await apiClientContext
        .validatorApi
        .validateGrantApplicationCreate(data as unknown as GrantApplicationRequest);

      const transaction = await applicationRegistryContract.submitApplication(
        grantId,
        Number(workspaceId).toString(),
        ipfsHash,
        projectMilestones.length,
      );
      const transactionData = await transaction.wait();
      // toast({ title: 'Transaction succeeded', status: 'success' });

      setHasClicked(false);
      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
      router.replace({
        pathname: '/your_applications',
      });
      // await subgraphClient.waitForBlock(transactionData.blockNumber);

      // const { data: { grantApplications } } = (await subgraphClient.client.query(
      //   {

      //     query: gql(getGrantApplication),
      //     variables: {
      //       grantID: grantId,
      //       applicantID: await signer?.data?.getAddress(),
      //     },
      //   },
      // )) as any;
      // console.log(grantApplications);
      // if (!(grantApplications.length > 0)) {
      //   throw new Error('Application not indexed');
      // }

      // onSubmit({ data: grantApplications });
    } catch (error) {
      setHasClicked(false);
      // console.log(error);
      toast({
        title: 'Application not indexed',
        status: 'error',
      });
    }
  };

  return (
    <Flex my="30px" flexDirection="column" alignItems="center" w="100%" px="44px">
      <Image h="96px" w="96px" src={daoLogo} alt="Polygon DAO" />
      <Text mt={6} variant="heading">
        {title}
      </Text>
      <Text
        zIndex="1"
        px={9}
        bgColor="white"
        mt="33px"
        lineHeight="26px"
        fontSize="18px"
        fontWeight="500"
      >
        Your Application Form
      </Text>
      <Container mt="-12px" p={10} border="2px solid #E8E9E9" borderRadius="12px">
        <ApplicantDetails
          applicantName={applicantName}
          applicantNameError={applicantNameError}
          applicantEmail={applicantEmail}
          applicantEmailError={applicantEmailError}
          setApplicantName={setApplicantName}
          setApplicantNameError={setApplicantNameError}
          setApplicantEmail={setApplicantEmail}
          setApplicantEmailError={setApplicantEmailError}
          grantRequiredFields={grantRequiredFields}
        />

        <Box mt="43px" />
        <AboutTeam
          teamMembers={teamMembers}
          teamMembersError={teamMembersError}
          setTeamMembers={setTeamMembers}
          setTeamMembersError={setTeamMembersError}
          membersDescription={membersDescription}
          setMembersDescription={setMembersDescription}
          grantRequiredFields={grantRequiredFields}
        />

        <Box mt="19px" />
        <AboutProject
          projectName={projectName}
          setProjectName={setProjectName}
          projectNameError={projectNameError}
          setProjectNameError={setProjectNameError}
          projectLinks={projectLinks}
          setProjectLinks={setProjectLinks}
          projectDetails={projectDetails}
          setProjectDetails={setProjectDetails}
          projectDetailsError={projectDetailsError}
          setProjectDetailsError={setProjectDetailsError}
          projectGoal={projectGoal}
          setProjectGoal={setProjectGoal}
          projectGoalError={projectGoalError}
          setProjectGoalError={setProjectGoalError}
          projectMilestones={projectMilestones}
          setProjectMilestones={setProjectMilestones}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
          grantRequiredFields={grantRequiredFields}
        />

        <Box mt="43px" />
        <Funding
          fundingAsk={fundingAsk}
          setFundingAsk={setFundingAsk}
          fundingAskError={fundingAskError}
          setFundingAskError={setFundingAskError}
          fundingBreakdown={fundingBreakdown}
          setFundingBreakdown={setFundingBreakdown}
          fundingBreakdownError={fundingBreakdownError}
          setFundingBreakdownError={setFundingBreakdownError}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
          grantRequiredFields={grantRequiredFields}
        />
      </Container>

      <Text mt={10} textAlign="center" variant="footer" fontSize="12px">
        <Image display="inline-block" src="/ui_icons/info.svg" alt="pro tip" mb="-2px" />
        {' '}
        By pressing Submit Application you&apos;ll have to approve this transaction in your wallet.
        {' '}
        <Link href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46" isExternal>Learn more</Link>
        {' '}
        <Image
          display="inline-block"
          src="/ui_icons/link.svg"
          alt="pro tip"
          mb="-1px"
          h="10px"
          w="10px"
        />
      </Text>

      <Box mt={5} />

      {hasClicked ? (
        <Center>
          <CircularProgress isIndeterminate color="brand.500" size="48px" mt={4} />
        </Center>
      ) : (
        <Button onClick={handleOnSubmit} mx={10} alignSelf="stretch" variant="primary">
          Submit Application
        </Button>
      )}
    </Flex>
  );
}

export default Form;
