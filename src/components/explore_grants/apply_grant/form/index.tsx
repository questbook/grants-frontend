/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Image,
  Link,
  Flex,
  Container,
} from '@chakra-ui/react';
import ApplicantDetails from './1_applicantDetails';
import AboutProject from './3_aboutProject';
import AboutTeam from './2_aboutTeam';
import Funding from './4_funding';

function Form({
  onSubmit,
  rewardAmount,
  rewardCurrency,
  rewardCurrencyCoin,
}: {
  onSubmit: (data: any) => void,
  rewardAmount: string,
  rewardCurrency: string,
  rewardCurrencyCoin: string,
}) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantNameError, setApplicantNameError] = useState(false);

  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantEmailError, setApplicantEmailError] = useState(false);

  const [teamMembers, setTeamMembers] = useState<number | null>(1);
  const [teamMembersError, setTeamMembersError] = useState(false);

  const [membersDescription, setMembersDescription] = useState([{
    description: '',
    isError: false,
  }]);

  const [projectName, setProjectName] = useState('');
  const [projectNameError, setProjectNameError] = useState(false);

  const [projectLinks, setProjectLinks] = useState([{
    link: '',
    isError: false,
  }]);

  const [projectDetails, setProjectDetails] = useState('');
  const [projectDetailsError, setProjectDetailsError] = useState(false);

  const [projectGoal, setProjectGoal] = useState('');
  const [projectGoalError, setProjectGoalError] = useState(false);

  const [projectMilestones, setProjectMilestones] = useState([{
    milestone: '',
    milestoneReward: '',
    milestoneIsError: false,
    milestoneRewardIsError: false,
  }]);

  const [fundingAsk, setFundingAsk] = useState('');
  const [fundingAskError, setFundingAskError] = useState(false);

  const [fundingBreakdown, setFundingBreakdown] = useState('');
  const [fundingBreakdownError, setFundingBreakdownError] = useState(false);

  const handleOnSubmit = () => {
    let error = false;
    if (applicantName === '') {
      setApplicantNameError(true);
      error = true;
    }
    if (applicantEmail === '') {
      setApplicantEmailError(true);
      error = true;
    }
    if (!teamMembers || teamMembers <= 0) {
      setTeamMembersError(true);
      error = true;
    }

    let membersDescriptionError = false;
    const newMembersDescriptionArray = [...membersDescription];
    membersDescription.forEach((member, index) => {
      if (member.description === '') {
        newMembersDescriptionArray[index].isError = true;
        membersDescriptionError = true;
      }
    });

    if (membersDescriptionError) {
      setMembersDescription(newMembersDescriptionArray);
      error = true;
    }

    if (projectName === '') {
      setProjectNameError(true);
      error = true;
    }

    let projectLinksError = false;
    const newProjectLinks = [...projectLinks];
    projectLinks.forEach((project, index) => {
      if (project.link === '') {
        newProjectLinks[index].isError = true;
        projectLinksError = true;
      }
    });

    if (projectLinksError) {
      setProjectLinks(newProjectLinks);
      error = true;
    }

    if (projectDetails === '') {
      setProjectDetailsError(true);
      error = true;
    }
    if (projectGoal === '') {
      setProjectGoalError(true);
      error = true;
    }

    let projectMilestonesError = false;
    const newProjectMilestones = [...projectMilestones];
    projectMilestones.forEach((project, index) => {
      if (project.milestone === '') {
        newProjectMilestones[index].milestoneIsError = true;
        projectMilestonesError = true;
      }
      if (project.milestoneReward === '') {
        newProjectMilestones[index].milestoneRewardIsError = true;
        projectMilestonesError = true;
      }
    });

    if (projectMilestonesError) {
      setProjectMilestones(newProjectMilestones);
      error = true;
    }

    if (fundingAsk === '') {
      setFundingAskError(true);
      error = true;
    }
    if (fundingBreakdown === '') {
      setFundingBreakdownError(true);
      error = true;
    }
    if (error) {
      return;
    }
    onSubmit({ data: true });
  };

  return (
    <Flex mt="30px" flexDirection="column" alignItems="center" w="100%">
      <Image
        h="96px"
        w="96px"
        src="/images/dummy/Polygon Icon.svg"
        alt="Polygon DAO"
      />
      <Text mt={6} variant="heading">
        Storage Provider (SP) Tooling Ideas
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
      <Container
        mt="-12px"
        p={10}
        border="2px solid #E8E9E9"
        borderRadius="12px"
      >
        <ApplicantDetails
          applicantName={applicantName}
          applicantNameError={applicantNameError}
          applicantEmail={applicantEmail}
          applicantEmailError={applicantEmailError}
          setApplicantName={setApplicantName}
          setApplicantNameError={setApplicantNameError}
          setApplicantEmail={setApplicantEmail}
          setApplicantEmailError={setApplicantEmailError}
        />

        <Box mt="43px" />
        <AboutTeam
          teamMembers={teamMembers}
          teamMembersError={teamMembersError}
          setTeamMembers={setTeamMembers}
          setTeamMembersError={setTeamMembersError}
          membersDescription={membersDescription}
          setMembersDescription={setMembersDescription}
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
        />
      </Container>

      <Text mt={10} textAlign="center" variant="footer" fontSize="12px">
        <Image
          display="inline-block"
          src="/ui_icons/protip.svg"
          alt="pro tip"
          mb="-2px"
        />
        {' '}
        Your grant funds are securely stored on our smart contract.
        {' '}
        <Link href="wallet">Learn more</Link>
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

      <Button onClick={handleOnSubmit} mx={10} alignSelf="stretch" variant="primary">
        Submit Application
      </Button>
    </Flex>
  );
}

export default Form;
