import {
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useRef, useState } from 'react';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Form from '../../src/components/your_grants/edit_grant/form';
import Sidebar from '../../src/components/your_grants/edit_grant/sidebar';
import NavbarLayout from '../../src/layout/navbarLayout';

function EditGrant() {
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

  const formData = {
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
    is_multiple_miletones: false,
    reward: '10',
    rewardCurrency: 'USDC',
    date: '2022-02-05',
  };

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
