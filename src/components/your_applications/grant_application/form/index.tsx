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
  useToast,
  ToastId,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { isValidEmail } from 'src/utils/validationUtils';
import useResubmitApplication from 'src/hooks/useResubmitApplication';
import Loader from 'src/components/ui/loader';
import { SupportedChainId } from 'src/constants/chains';
import { GrantApplicationRequest, GrantApplicationUpdate } from '@questbook/service-validator-client';
import useApplicationEncryption from 'src/hooks/useApplicationEncryption';
import {
  GrantApplicationFieldsSubgraph,
  GrantApplicationProps,
} from '../../../../types/application';
import {
  getFormattedFullDateFromUnixTimestamp,
  parseAmount,
} from '../../../../utils/formattingUtils';
import InfoToast from '../../../ui/infoToast';
import ApplicantDetails from './1_applicantDetails';
import AboutProject from './3_aboutProject';
import AboutTeam from './2_aboutTeam';
import Funding from './4_funding';

function Form({
  chainId,
  onSubmit,
  rewardAmount,
  rewardCurrency,
  rewardCurrencyCoin,
  formData,
  grantTitle,
  sentDate,
  daoLogo,
  state,
  feedback,
  grantRequiredFields,
  applicationID,
  workspace,
  piiFields,
}: // grantID,
{
  chainId: SupportedChainId | undefined;
  onSubmit: null | ((data: any) => void);
  rewardAmount: string;
  rewardCurrency: string;
  rewardCurrencyCoin: string;
  formData: GrantApplicationProps | null;
  grantTitle: string;
  sentDate: string;
  daoLogo: string;
  state: string;
  feedback: string;
  grantRequiredFields: string[];
  applicationID: string;
  workspace: any;
  piiFields: string[];
  // grantID: string;
}) {
  const { encryptApplicationPII } = useApplicationEncryption();
  const toast = useToast();
  const router = useRouter();
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
    try {
      if (formData) {
        setApplicantName(formData.applicantName);
        setApplicantEmail(formData.applicantEmail);
        setTeamMembers(formData.teamMembers);
        setMembersDescription(
          formData?.membersDescription.map((member: any) => ({
            description: member.description ?? '',
            isError: false,
          })),
        );
        setProjectName(formData.projectName);
        setProjectLinks(
          formData?.projectLinks.map((link: any) => ({
            link: link.link ?? '',
            isError: false,
          })),
        );
        setProjectDetails(formData.projectDetails);
        setProjectGoal(formData.projectGoal);
        setProjectMilestones(
          formData?.projectMilestones.map((milestone: any) => ({
            milestone: milestone.milestone ?? '',
            milestoneReward: milestone.milestoneReward ?? '',
            milestoneIsError: false,
            milestoneRewardIsError: false,
          })),
        );

        setFundingAsk(formData.fundingAsk);
        setFundingBreakdown(formData.fundingBreakdown);
      }
    } catch (error) {
      // console.log(error);
    }
  }, [formData]);

  const toastRef = React.useRef<ToastId>();

  const [updateData, setUpdateData] = React.useState<any>();
  const [txnData, loading] = useResubmitApplication(
    updateData,
    chainId,
    applicationID,
  );

  useEffect(() => {
    if (txnData) {
      toastRef.current = toast({
        position: 'top',
        render: () => (
          <InfoToast
            link={`https://etherscan.io/tx/${txnData.transactionHash}`}
            close={() => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            }}
          />
        ),
      });
      router.push({
        pathname: '/your_applications',
      });
    }
  }, [toast, router, txnData]);

  const handleOnSubmit = async () => {
    console.log(onSubmit);
    if (!onSubmit) {
      return;
    }
    let error = false;
    if (applicantName === '' && grantRequiredFields.includes('applicantName')) {
      setApplicantNameError(true);
      error = true;
    }
    if (
      (applicantEmail === '' || !isValidEmail(applicantEmail))
      && grantRequiredFields.includes('applicantEmail')
    ) {
      setApplicantEmailError(true);
      error = true;
    }
    if (
      (!teamMembers || teamMembers <= 0)
      && grantRequiredFields.includes('teamMembers')
    ) {
      setTeamMembersError(true);
      error = true;
    }

    let membersDescriptionError = false;
    const newMembersDescriptionArray = [...membersDescription];
    membersDescription.forEach((member, index) => {
      if (
        member.description === ''
        && grantRequiredFields.includes('memberDetails')
      ) {
        newMembersDescriptionArray[index].isError = true;
        membersDescriptionError = true;
      }
    });

    if (membersDescriptionError) {
      setMembersDescription(newMembersDescriptionArray);
      error = true;
    }

    if (projectName === '' && grantRequiredFields.includes('projectName')) {
      setProjectNameError(true);
      error = true;
    }

    let projectLinksError = false;
    const newProjectLinks = [...projectLinks];
    projectLinks.forEach((project, index) => {
      if (project.link === '' && grantRequiredFields.includes('projectLink')) {
        newProjectLinks[index].isError = true;
        projectLinksError = true;
      }
    });

    if (projectLinksError) {
      setProjectLinks(newProjectLinks);
      error = true;
    }

    if (
      projectDetails === ''
      && grantRequiredFields.includes('projectDetails')
    ) {
      setProjectDetailsError(true);
      error = true;
    }
    if (projectGoal === '' && grantRequiredFields.includes('projectGoals')) {
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

    if (fundingAsk === '' && grantRequiredFields.includes('fundingAsk')) {
      setFundingAskError(true);
      error = true;
    }
    if (
      fundingBreakdown === ''
      && grantRequiredFields.includes('fundingBreakdown')
    ) {
      setFundingBreakdownError(true);
      error = true;
    }
    if (error) {
      return;
    }

    const links = projectLinks.map((pl) => pl.link);

    const data: GrantApplicationUpdate = {
      fields: {
        applicantName: [{ value: applicantName }],
        applicantEmail: [{ value: applicantEmail }],
        projectName: [{ value: projectName }],
        projectDetails: [{ value: projectDetails }],
        fundingAsk: [{ value: parseAmount(fundingAsk) }],
        fundingBreakdown: [{ value: fundingBreakdown }],
        teamMembers: [{ value: Number(teamMembers).toString() }],
        memberDetails: membersDescription.map((md) => ({ value: md.description })),
        projectLink: links.map((value) => ({ value })),
        projectGoals: [{ value: projectGoal }],
        isMultipleMilestones: [{ value: grantRequiredFields.includes('isMultipleMilestones').toString() }],
      },
      milestones: projectMilestones.map((pm) => (
        {
          title: pm.milestone,
          amount: parseAmount(pm.milestoneReward),
        }
      )),
    };

    Object.keys(data.fields!).forEach((field) => {
      if (!grantRequiredFields.includes(field)) {
        delete data.fields![field as keyof GrantApplicationFieldsSubgraph];
      }
    });

    if (!workspace || !workspace.members) return;
    let encryptedData;

    if (piiFields.length > 0) {
      encryptedData = await encryptApplicationPII(
        data as GrantApplicationRequest,
        piiFields,
        workspace.members,
      );

      console.log('encryptedData -----', encryptedData);
    }

    setUpdateData(encryptedData || data);
  };

  return (
    <Flex mt="30px" flexDirection="column" alignItems="center" w="100%">
      <Image objectFit="cover" h="96px" w="96px" src={daoLogo} alt="Polygon DAO" />
      <Text mt={6} variant="heading">
        {grantTitle}
      </Text>

      <Text
        mt="10px"
        fontSize="16px"
        lineHeight="24px"
        fontWeight="500"
        color="#717A7C"
      >
        <Image
          mb="-2px"
          src="/ui_icons/calendar.svg"
          w="16px"
          h="18px"
          display="inline-block"
        />
        {' '}
        Sent on
        {' '}
        {getFormattedFullDateFromUnixTimestamp(Number(sentDate))}
      </Text>

      {state === 'rejected' && (
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
            <Text
              fontSize="16px"
              lineHeight="24px"
              fontWeight="700"
              color="#7B4646"
            >
              Application Rejected
            </Text>
            <Text
              fontSize="16px"
              lineHeight="24px"
              fontWeight="400"
              color="#7B4646"
            >
              {feedback}
            </Text>
          </Flex>
        </Flex>
      )}

      {state === 'resubmit' && (
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
          <Flex alignItems="center" justifyContent="center" h="36px" w="42px">
            <Image
              h="40px"
              w="40px"
              src="/ui_icons/alert_triangle.svg"
              alt="Resubmit"
            />
          </Flex>
          <Flex ml="23px" direction="column">
            <Text
              fontSize="16px"
              lineHeight="24px"
              fontWeight="700"
              color="#7B4646"
            >
              Resubmit your Application
            </Text>
            <Text
              fontSize="16px"
              lineHeight="24px"
              fontWeight="400"
              color="#7B4646"
            >
              {feedback}
            </Text>
          </Flex>
        </Flex>
      )}

      {onSubmit ? (
        <Button
          onClick={loading ? () => {} : handleOnSubmit}
          py={loading ? 2 : 0}
          mt={8}
          mb={4}
          mx={10}
          alignSelf="stretch"
          variant="primary"
        >
          {loading ? <Loader /> : 'Resubmit Application'}
        </Button>
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
          readOnly={onSubmit === null}
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
          readOnly={onSubmit === null}
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
          readOnly={onSubmit === null}
          grantRequiredFields={grantRequiredFields}
        />
      </Container>

      {onSubmit && (
        <Text mt={10} textAlign="center" variant="footer" fontSize="12px">
          <Image
            display="inline-block"
            src="/ui_icons/info.svg"
            alt="pro tip"
            mb="-2px"
          />
          {' '}
          By pressing Submit Application you&apos;ll have to approve this
          transaction in your wallet.
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
            src="/ui_icons/link.svg"
            alt="pro tip"
            mb="-1px"
            h="10px"
            w="10px"
          />
        </Text>
      )}

      <Box mt={5} />

      {onSubmit ? (
        <Button
          onClick={loading ? () => {} : handleOnSubmit}
          py={loading ? 2 : 0}
          mt={8}
          mb={4}
          mx={10}
          alignSelf="stretch"
          variant="primary"
        >
          {loading ? <Loader /> : 'Resubmit Application'}
        </Button>
      ) : null}
    </Flex>
  );
}

Form.defaultProps = {};
export default Form;
