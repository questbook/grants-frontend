import { Container, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import Form from '../src/components/signup/create_dao/form';
import Loading from '../src/components/signup/create_dao/loading';
import CreateGrant from '../src/components/signup/create_grant';
import DaoCreated from '../src/components/signup/daoCreated';

import Tooltip from '../src/components/ui/tooltip';
import NavbarLayout from '../src/layout/navbarLayout';

function SignupDao() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [daoCreated, setDaoCreated] = React.useState(false);
  const [creatingGrant, setCreatingGrant] = React.useState(true);

  const [daoData, setDaoData] = React.useState<{
    name: string;
    description: string;
    image?: string;
    network: string;
  } | null>(null);

  const handleFormSubmit = (data: {
    name: string;
    description: string;
    image?: string;
    network: string;
  }) => {
    setDaoData(data);
    setLoading(true);

    // show loading screen for minimum of 3 seconds
    setTimeout(() => {
      setDaoCreated(true);
    }, 3000);
  };

  if (creatingGrant) {
    return <CreateGrant onSubmit={() => router.push('/my_grants')} />;
  }

  if (daoCreated && daoData) {
    return (
      <DaoCreated
        daoName={daoData.name}
        network={daoData.network}
        onCreateGrantClick={() => setCreatingGrant(true)}
        onVisitGrantsClick={() => router.push('/my_grants')}
      />
    );
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <Container
      maxW="100%"
      display="flex"
      px="70px"
      flexDirection="column"
      alignItems="center"
    >
      <Text mt="46px" variant="heading">
        What should we call your Grants DAO?
      </Text>
      <Text mt={7} maxW="676px" textAlign="center">
        A Grants DAO
        <Tooltip
          icon="/ui_icons/tooltip_questionmark_brand.svg"
          label="Crypto wallet is an application or hardware device that allows users to store and retrieve digital assets."
        />
        allows you and your team to manage grants, funds and applicants - all in
        a single neatly arranged space.
      </Text>
      <Form onSubmit={handleFormSubmit} />
    </Container>
  );
}

SignupDao.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderTabs={false}>{page}</NavbarLayout>;
};

export default SignupDao;

/*

{
    "reward": "1",
    "rewardCurrency": "MATIC",
    "date": "2022-02-10",
    "applicant_name": true,
    "applicant_email": false,
    "about_team": true,
    "funding_breakdown": false,
    "project_name": true,
    "project_link": true,
    "project_details": false,
    "project_goals": false,
    "extra_field": "extra info",
    "is_multiple_miletones": true,
    "details": "details",
    "title": "title",
    "summary": "summary"
}

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
*/
