/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Text,
  Image,
  Link,
  Flex,
  Container,
} from '@chakra-ui/react';
import { GrantApplicationProps } from 'src/types/application';
import { getFormattedFullDateFromUnixTimestamp } from 'src/utils/formattingUtils';
import ApplicantDetails from './1_applicantDetails';
import AboutProject from './3_aboutProject';
import AboutTeam from './2_aboutTeam';
import Funding from './4_funding';

function Form({
  onSubmit,
  rewardAmount,
  rewardCurrency,
  rewardCurrencyCoin,
  resubmitComment,
  rejectedComment,
  formData,
  grantTitle,
  sentDate,
  daoLogo,
}: {
  onSubmit: null | ((data: any) => void);
  rewardAmount: string;
  rewardCurrency: string;
  rewardCurrencyCoin: string;
  resubmitComment?: string;
  rejectedComment?: string;
  formData: GrantApplicationProps | null;
  grantTitle: string;
  sentDate: string;
  daoLogo: string;
}) {
  const [applicantName, setApplicantName] = useState('');
  const [applicantNameError, setApplicantNameError] = useState(false);

  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantEmailError, setApplicantEmailError] = useState(false);

  const [teamMembers, setTeamMembers] = useState(1);
  const [teamMembersError, setTeamMembersError] = useState(false);

  const [membersDescription, setMembersDescription] = useState<any[]>([]);

  const [projectName, setProjectName] = useState('');
  const [projectNameError, setProjectNameError] = useState(false);

  const [projectLinks, setProjectLinks] = useState<any[]>([]);

  const [projectDetails, setProjectDetails] = useState('');
  const [projectDetailsError, setProjectDetailsError] = useState(false);

  const [projectGoal, setProjectGoal] = useState('');
  const [projectGoalError, setProjectGoalError] = useState(false);

  const [projectMilestones, setProjectMilestones] = useState<any[]>([]);

  const [fundingAsk, setFundingAsk] = useState('');
  const [fundingAskError, setFundingAskError] = useState(false);

  const [fundingBreakdown, setFundingBreakdown] = useState('');
  const [fundingBreakdownError, setFundingBreakdownError] = useState(false);

  useEffect(() => {
    if (formData) {
      setApplicantName(formData.applicantName);
      setApplicantEmail(formData.applicantEmail);
      setTeamMembers(formData.teamMembers);
      setMembersDescription(formData?.membersDescription.map((member: any) => ({
        description: member.description ?? '',
        isError: false,
      })));
      setProjectName(formData.projectName);
      setProjectLinks(formData?.projectLinks.map((link: any) => ({
        link: link.link ?? '',
        isError: false,
      })));
      setProjectDetails(formData.projectDetails);
      setProjectGoal(formData.projectGoal);
      setProjectMilestones(formData?.projectMilestones.map((milestone: any) => ({
        milestone: milestone.milestone ?? '',
        milestoneReward: milestone.milestoneReward ?? '',
        milestoneIsError: false,
        milestoneRewardIsError: false,
      })));

      setFundingAsk(formData.fundingAsk);
      setFundingBreakdown(formData.fundingBreakdown);
    }
  }, [formData]);

  const handleOnSubmit = () => {
    if (!onSubmit) {
      return;
    }
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
    membersDescription.forEach((member: any, index: number) => {
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
    projectLinks.forEach((project: any, index: number) => {
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
    projectMilestones.forEach((project: any, index: number) => {
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
        src={daoLogo}
        alt="Polygon DAO"
      />
      <Text mt={6} variant="heading">
        {grantTitle}
      </Text>

      <Text mt="10px" fontSize="16px" lineHeight="24px" fontWeight="500" color="#717A7C">
        <Image mb="-2px" src="/ui_icons/calendar.svg" w="16px" h="18px" display="inline-block" />
        {' '}
        Sent on
        {' '}
        {getFormattedFullDateFromUnixTimestamp(Number(sentDate))}
      </Text>

      {rejectedComment && (
        <Flex
          alignItems="flex-start"
          bgColor="#FFC0C0"
          border="2px solid #EE7979"
          px="26px"
          py="22px"
          borderRadius="6px"
          mt={4}
          mx={10}
          alignSelf="stretch"
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            bgColor="#F7B7B7"
            border="2px solid #EE7979"
            borderRadius="40px"
            p={2}
            h="40px"
            w="40px"
            mt="5px"
          >
            <Image
              h="40px"
              w="40px"
              src="/ui_icons/result_rejected_application.svg"
              alt="Rejected"
            />
          </Flex>
          <Flex ml="23px" direction="column">
            <Text fontSize="16px" lineHeight="24px" fontWeight="700" color="#7B4646">
              Application Rejected
            </Text>
            <Text fontSize="16px" lineHeight="24px" fontWeight="400" color="#7B4646">
              {rejectedComment}
            </Text>
          </Flex>
        </Flex>
      )}

      {resubmitComment && (
        <Flex
          alignItems="flex-start"
          bgColor="#FEF6D9"
          border="2px solid #EFC094"
          px="26px"
          py="22px"
          borderRadius="6px"
          mt={4}
          mx={10}
          alignSelf="stretch"
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            h="36px"
            w="42px"
          >
            <Image
              h="40px"
              w="40px"
              src="/ui_icons/alert_triangle.svg"
              alt="Resubmit"
            />
          </Flex>
          <Flex ml="23px" direction="column">
            <Text fontSize="16px" lineHeight="24px" fontWeight="700" color="#7B4646">
              Resubmit your Application
            </Text>
            <Text fontSize="16px" lineHeight="24px" fontWeight="400" color="#7B4646">
              {resubmitComment}
            </Text>
          </Flex>
        </Flex>
      )}

      {onSubmit ? (
        <>
          <Box mt={8} />
          <Button
            onClick={handleOnSubmit}
            mx={10}
            alignSelf="stretch"
            variant="primary"
          >
            Resubmit Application
          </Button>
          <Box mt={4} />
        </>
      ) : null}

      <Text
        zIndex="1"
        px={9}
        bgColor="white"
        mt="21px"
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
          readOnly={onSubmit === null}
        />

        <Box mt="43px" />
        <AboutTeam
          teamMembers={teamMembers}
          teamMembersError={teamMembersError}
          setTeamMembers={setTeamMembers}
          setTeamMembersError={setTeamMembersError}
          membersDescription={membersDescription}
          setMembersDescription={setMembersDescription}
          readOnly={onSubmit === null}
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
          readOnly={onSubmit === null}
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
          readOnly={onSubmit === null}
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

      {onSubmit ? (
        <Button
          onClick={handleOnSubmit}
          mx={10}
          alignSelf="stretch"
          variant="primary"
        >
          Resubmit Application
        </Button>
      ) : null}
    </Flex>
  );
}

Form.defaultProps = {
  resubmitComment: '',
  rejectedComment: '',
};
export default Form;
