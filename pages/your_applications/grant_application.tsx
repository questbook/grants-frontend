import {
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
import Form from '../../src/components/your_applications/grant_application/form';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import NavbarLayout from '../../src/layout/navbarLayout';

function ViewApplication() {
  const rewardAmount = '60';
  const rewardCurrency = 'ETH';
  const rewardCurrencyCoin = '/network_icons/eth_mainnet.svg';

  const router = useRouter();
  const [isReadOnly, setIsReadOnly] = useState(true);

  const [rejectedComment, setRejectedComment] = useState('');
  const [resubmitComment, setResubmitComment] = useState('');

  useEffect(() => {
    if (router.query.viewApplicationType === 'resubmit') {
      setIsReadOnly(false);
      setResubmitComment('This requires a resubmission');
    }
    if (router.query.viewApplicationType === 'rejected') {
      setRejectedComment('This is bad news');
    }
  }, [router.query.viewApplicationType]);

  const formData = {
    applicantName: 'Dhairya',
    applicantEmail: 'dhairya@email.com',
    teamMembers: 1,
    membersDescription: [
      {
        description: 'Crazy guy',
      },
    ],

    projectName: 'Project Icarus',
    projectLinks: [
      {
        link: 'github',
      },
    ],
    projectDetails: 'This is a project',
    projectGoal: '100',

    projectMilestones: [
      {
        milestone: 'Milestone 1',
        milestoneReward: '10',
      },
    ],

    fundingAsk: '100',
    fundingBreakdown: 'lol',
  };

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="834px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['Your Applications', 'Grant Application']} />
        <Form
          onSubmit={isReadOnly ? null : () => {
            router.back();
          }}
          rewardAmount={rewardAmount}
          rewardCurrency={rewardCurrency}
          rewardCurrencyCoin={rewardCurrencyCoin}
          rejectedComment={rejectedComment}
          resubmitComment={resubmitComment}
          formData={formData}
        />
      </Container>
    </Container>
  );
}

ViewApplication.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ViewApplication;
