/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState, useContext } from 'react';
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
import { GrantApplicationFieldsSubgraph, GrantApplicationProps, GrantApplicationUpdateSubgraph } from 'src/types/application';
import { getFormattedFullDateFromUnixTimestamp, parseAmount } from 'src/utils/formattingUtils';
import { useContract, useSigner } from 'wagmi';
import config from 'src/constants/config';
import { ApiClientsContext } from 'pages/_app';
import { GrantApplicationUpdate } from '@questbook/service-validator-client';
import InfoToast from 'src/components/ui/infoToast';
import { useRouter } from 'next/router';
import ApplicantDetails from './1_applicantDetails';
import AboutProject from './3_aboutProject';
import AboutTeam from './2_aboutTeam';
import Funding from './4_funding';

import ApplicationRegistryAbi from '../../../../contracts/abi/ApplicationRegistryAbi.json';

function Form({
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
  // grantID,
}: {
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
  // grantID: string;
}) {
  const toast = useToast();
  const router = useRouter();
  const [signer] = useSigner();

  const applicationRegistryContract = useContract({
    addressOrName: config.ApplicationRegistryAddress,
    contractInterface: ApplicationRegistryAbi,
    signerOrProvider: signer.data,
  });

  const apiClientContext = useContext(ApiClientsContext);
  // const { subgraphClient } : any = apiClientContext;
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
    } catch (error) {
      console.log(error);
    }
  }, [formData]);

  const [hasClicked, setHasClicked] = React.useState(false);
  useEffect(() => {
    console.log(hasClicked);
  }, [hasClicked]);
  const toastRef = React.useRef<ToastId>();

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
      if (!onSubmit) {
        return;
      }
      let error = false;
      if (applicantName === '' && grantRequiredFields.includes('applicantName')) {
        setApplicantNameError(true);
        error = true;
      }
      if (applicantEmail === '' && grantRequiredFields.includes('applicantEmail')) {
        setApplicantEmailError(true);
        error = true;
      }
      if ((!teamMembers || teamMembers <= 0) && grantRequiredFields.includes('teamMembers')) {
        setTeamMembersError(true);
        error = true;
      }

      let membersDescriptionError = false;
      const newMembersDescriptionArray = [...membersDescription];
      membersDescription.forEach((member, index) => {
        if (member.description === '' && grantRequiredFields.includes('memberDetails')) {
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

      if (projectDetails === '' && grantRequiredFields.includes('projectDetails')) {
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
      if (fundingBreakdown === '' && grantRequiredFields.includes('fundingBreakdown')) {
        setFundingBreakdownError(true);
        error = true;
      }
      if (error) {
        return;
      }

      setHasClicked(true);
      const links = projectLinks.map((pl) => (pl.link));

      const milestones = projectMilestones.map((pm) => (
        { title: pm.milestone, amount: parseAmount(pm.milestoneReward) }
      ));

      console.log(milestones);

      if (!signer || !signer.data || !apiClientContext) return;
      const data: GrantApplicationUpdateSubgraph = {
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
        .validateGrantApplicationUpdate(data as unknown as GrantApplicationUpdate);
      console.log(ipfsHash);
      const transaction = await applicationRegistryContract.updateApplicationMetadata(
        applicationID,
        ipfsHash,
        projectMilestones.length,
      );
      const transactionData = await transaction.wait();

      console.log(transactionData);
      console.log(transactionData.blockNumber);
      toast({ title: 'Transaction succeeded', status: 'success' });

      setHasClicked(false);
      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
      router.push('/your_applications');

      // await subgraphClient.waitForBlock(transactionData.blockNumber);

      // const { data: { grantApplications } } = (await subgraphClient.client.query(
      //   {

      //     query: gql(getGrantApplication),
      //     variables: {
      //       grantID,
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
      console.log(error);
      toast({
        title: 'Application not indexed',
        status: 'error',
      });
    }
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
            <Text fontSize="16px" lineHeight="24px" fontWeight="700" color="#7B4646">
              Application Rejected
            </Text>
            <Text fontSize="16px" lineHeight="24px" fontWeight="400" color="#7B4646">
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
              {feedback}
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
};
export default Form;
