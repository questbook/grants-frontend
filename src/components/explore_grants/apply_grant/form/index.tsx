/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import {
  Box, Button, Text, Image, Link, Flex, Container, useToast, ToastId,
} from '@chakra-ui/react';
import { useAccount, useSigner } from 'wagmi';
import { useRouter } from 'next/router';
import { isValidEmail } from 'src/utils/validationUtils';
import Loader from 'src/components/ui/loader';
import useSubmitApplication from 'src/hooks/useSubmitApplication';
import { SupportedChainId } from 'src/constants/chains';
import { GrantApplicationRequest } from '@questbook/service-validator-client';
import useApplicationEncryption from 'src/hooks/useApplicationEncryption';
import { convertToRaw, EditorState } from 'draft-js';
import VerifiedBadge from 'src/components/ui/verified_badge';
import { parseAmount } from '../../../../utils/formattingUtils';
import { GrantApplicationFieldsSubgraph } from '../../../../types/application';
import InfoToast from '../../../ui/infoToast';
import ApplicantDetails from './1_applicantDetails';
import AboutProject from './3_aboutProject';
import AboutTeam from './2_aboutTeam';
import Funding from './4_funding';

interface Props {
  // onSubmit: (data: any) => void;
  chainId: SupportedChainId | undefined;
  title: string;
  grantId: string;
  daoLogo: string;
  workspaceId: string;
  isGrantVerified: boolean;
  funding: string;
  rewardAmount: string;
  rewardCurrency: string;
  rewardCurrencyCoin: string;
  rewardCurrencyAddress: string | undefined;
  grantRequiredFields: string[];
  piiFields: string[];
  members: any[];
  acceptingApplications: boolean;
  shouldShowButton: boolean;
}

// eslint-disable-next-line max-len
function Form({
  // onSubmit,
  chainId,
  title,
  grantId,
  daoLogo,
  workspaceId,
  isGrantVerified,
  funding,
  rewardAmount,
  rewardCurrency,
  rewardCurrencyCoin,
  rewardCurrencyAddress,
  grantRequiredFields,
  piiFields,
  members,
  acceptingApplications,
  shouldShowButton,
}: Props) {
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });

  const { encryptApplicationPII } = useApplicationEncryption();
  const [signer] = useSigner();
  const [applicantName, setApplicantName] = useState('');
  const [applicantNameError, setApplicantNameError] = useState(false);

  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantEmailError, setApplicantEmailError] = useState(false);

  const [teamMembers, setTeamMembers] = useState<number | null>(1);
  const [teamMembersError, setTeamMembersError] = useState(false);

  const [membersDescription, setMembersDescription] = useState([
    {
      description: '',
      isError: false,
    },
  ]);

  const [projectName, setProjectName] = useState('');
  const [projectNameError, setProjectNameError] = useState(false);

  const [projectLinks, setProjectLinks] = useState([
    {
      link: '',
      isError: false,
    },
  ]);

  const [projectDetails, setProjectDetails] = useState(() => EditorState.createEmpty());
  const [projectDetailsError, setProjectDetailsError] = useState(false);

  const [projectGoal, setProjectGoal] = useState('');
  const [projectGoalError, setProjectGoalError] = useState(false);

  const [projectMilestones, setProjectMilestones] = useState([
    {
      milestone: '',
      milestoneReward: '',
      milestoneIsError: false,
      milestoneRewardIsError: false,
    },
  ]);

  const [fundingAsk, setFundingAsk] = useState('');
  const [fundingAskError, setFundingAskError] = useState(false);

  const [fundingBreakdown, setFundingBreakdown] = useState('');
  const [fundingBreakdownError, setFundingBreakdownError] = useState(false);

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const router = useRouter();

  const [formData, setFormData] = React.useState<GrantApplicationRequest>();
  const [
    txnData,
    txnLink,
    loading,
  ] = useSubmitApplication(formData!, chainId, grantId, workspaceId);

  useEffect(() => {
    if (txnData) {
      toastRef.current = toast({
        position: 'top',
        render: () => (
          <InfoToast
            link={txnLink}
            close={() => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            }}
          />
        ),
      });
      router.replace({
        pathname: '/your_applications',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, router, txnData]);

  const handleOnSubmit = async () => {
    let error = false;
    if (applicantName === '' && grantRequiredFields.includes('applicantName')) {
      setApplicantNameError(true);
      error = true;
    }
    if ((applicantEmail === '' || !isValidEmail(applicantEmail)) && grantRequiredFields.includes('applicantEmail')) {
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

    if (!projectDetails.getCurrentContent().hasText()) {
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
    const projectDetailsString = JSON.stringify(
      convertToRaw(projectDetails.getCurrentContent()),
    );
    const links = projectLinks.map((pl) => (pl.link));

    if (!signer || !signer.data) return;

    const data: GrantApplicationRequest = {
      grantId,
      applicantId: await signer?.data?.getAddress(),
      fields: {
        applicantName: [{ value: applicantName }],
        applicantEmail: [{ value: applicantEmail }],
        projectName: [{ value: projectName }],
        projectDetails: [{ value: projectDetailsString }],
        fundingAsk: [{ value: parseAmount(fundingAsk, rewardCurrencyAddress) }],
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
          amount: parseAmount(pm.milestoneReward, rewardCurrencyAddress),
        }
      )),
    };
    Object.keys(data.fields).forEach((field) => {
      if (!grantRequiredFields.includes(field)) {
        delete data.fields[field as keyof GrantApplicationFieldsSubgraph];
      }
    });
    let encryptedData;
    if (piiFields.length > 0 && members) {
      encryptedData = await encryptApplicationPII(data, piiFields, members);

      // console.log('encryptedData -----', encryptedData);
    }
    setFormData(encryptedData || data);
  };

  return (
    <Flex my="30px" flexDirection="column" alignItems="center" w="100%" px="44px">
      {!acceptingApplications && (
      <Flex
        w="100%"
        bg="#F3F4F4"
        direction="row"
        align="center"
        px={8}
        py={6}
        mt={6}
        mb={8}
        border="1px solid #E8E9E9"
        borderRadius="6px"
      >
        <Image src="/toast/warning.svg" w="42px" h="36px" />
        <Flex direction="column" ml={6}>
          <Text variant="tableHeader" color="#414E50">
            {shouldShowButton && accountData?.address ? 'Grant is archived and cannot be discovered on the Home page.' : 'Grant is archived and closed for new applications.'}
          </Text>
          <Text variant="tableBody" color="#717A7C" fontWeight="400" mt={2}>
            New applicants cannot apply to an archived grant.
          </Text>
        </Flex>
      </Flex>
      )}
      <Image objectFit="cover" h="96px" w="96px" src={daoLogo} alt="Polygon DAO" />
      <Text mt={6} variant="heading">
        {title}
        {isGrantVerified
          && <VerifiedBadge grantAmount={funding} grantCurrency={rewardCurrency} lineHeight="44px" />}
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

      {acceptingApplications && (
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
      )}

      <Box mt={5} />

      {acceptingApplications && (
      <Button onClick={loading ? () => {} : handleOnSubmit} mx={10} alignSelf="stretch" variant="primary" py={loading ? 2 : 0}>
        {loading ? <Loader /> : 'Submit Application'}
      </Button>
      )}
    </Flex>
  );
}

export default Form;
