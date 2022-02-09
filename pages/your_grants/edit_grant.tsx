import { gql } from '@apollo/client';
import {
  Container, useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useContext, useEffect, useRef, useState,
} from 'react';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Form from '../../src/components/your_grants/edit_grant/form';
import Sidebar from '../../src/components/your_grants/edit_grant/sidebar';
import { DAI } from '../../src/constants/assetDetails';
import { getGrantDetails } from '../../src/graphql/daoQueries';
import NavbarLayout from '../../src/layout/navbarLayout';
import { ApiClientsContext } from '../_app';

function EditGrant() {
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient.client;
  const router = useRouter();

  const grantInfoRef = useRef(null);
  const detailsRef = useRef(null);
  const applicationDetailsRef = useRef(null);
  const grantRewardsRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);

  const scroll = (ref: any, step: number) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setCurrentStep(step);
  };

  const sideBarDetails = [
    ['Grant Intro', 'Grant title, and summary', grantInfoRef],
    [
      'Grant Details',
      'Requirements, expected deliverables, and milestones',
      detailsRef,
    ],
    [
      'Applicant Details',
      'About team, project, and funding breakdown.',
      applicationDetailsRef,
    ],
    [
      'Reward and Deadline',
      'Amount, type of payout & submission deadline',
      grantRewardsRef,
    ],
  ];

  const defaultFormData = {
    title: 'title',
    summary: 'summary',
    details: 'details',
    applicant_name: true,
    applicant_email: false,
    about_team: false,
    funding_breakdown: false,
    project_name: false,
    project_link: false,
    project_details: true,
    project_goals: false,
    extra_field: 'ko',
    is_multiple_milestones: false,
    reward: '10',
    rewardCurrency: 'USDC',
    date: '2022-02-05',
  };

  const toast = useToast();
  const [formData, setFormData] = useState(defaultFormData);
  const getGrantData = async () => {
    if (!subgraphClient) return;
    try {
      const { data } = await subgraphClient
        .query({
          query: gql(getGrantDetails),
          variables: {
            // TODO: Need to change this here!
            grantID: '0x05f4b7a7f0e7c0a7d716fa0fcbf7e3d69a9e80b4',
          },
        }) as any;
      // console.log(data);
      if (data.grants.length > 0) {
        const grant = data.grants[0];
        setFormData({
          title: grant.title,
          summary: grant.summary,
          details: grant.details,
          applicant_name: grant.fields.contains('applicant_name'),
          applicant_email: grant.fields.contains('applicant_email'),
          about_team: grant.fields.contains('about_team'),
          funding_breakdown: grant.fields.contains('funding_breakdown'),
          project_name: grant.fields.contains('project_name'),
          project_link: grant.fields.contains('project_link'),
          project_details: grant.fields.contains('project_details'),
          project_goals: grant.fields.contains('project_goals'),
          extra_field: grant.fields.extra_field,
          is_multiple_milestones: false, // TODO: Needs modification
          reward: grant.reward.committed,
          rewardCurrency: grant.reward.asset === DAI ? 'DAI' : 'WETH',
          date: grant.deadline,
        });
      } else {
        toast({
          title: 'Displaying dummy data',
          status: 'info',
        });
        setFormData(defaultFormData);
      }
    } catch (e) {
      toast({
        title: 'Error getting workspace data',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    getGrantData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="682px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['Your Grants', 'Edit grant']} />
        <Form
          formData={formData}
          onSubmit={(data: any) => {
            // eslint-disable-next-line no-console
            console.log(data);
            router.replace('/your_grants');
          }}
          refs={sideBarDetails.map((detail) => detail[2])}
        />
      </Container>

      <Sidebar
        sidebarDetails={sideBarDetails}
        currentStep={currentStep}
        scrollTo={scroll}
      />
    </Container>
  );
}

EditGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default EditGrant;
