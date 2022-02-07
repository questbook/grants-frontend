import {
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import Heading from '../../src/components/ui/heading';
import YourApplicationCard from '../../src/components/your_applications/yourApplicationCard';
import NavbarLayout from '../../src/layout/navbarLayout';

function YourApplications() {
  const isGrantVerified = false;
  const isDaoVerified = false;
  const router = useRouter();
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
        <Heading title="Your Applications" />

        <YourApplicationCard
          grantTitle="Storage Provider (SP) Tooling Ideas"
          daoName="Polygon DAO"
          daoIcon="/images/dummy/Polygon Icon.svg"
          isGrantVerified={isGrantVerified}
          isDaoVerified={isDaoVerified}
          status="pending"
          sentDate="07 Aug"
          onViewGrantClick={() => router.push({
            pathname: '/explore_grants/about_grant',
            query: {
              account: true,
            },
          })}
          onViewApplicationClick={() => router.push({
            pathname: '/your_applications/grant_application',
            query: {
              account: true,
              viewApplicationType: 'pending',
            },
          })}
        />

        <YourApplicationCard
          grantTitle="Storage Provider (SP) Tooling Ideas"
          daoName="Polygon DAO"
          daoIcon="/images/dummy/Polygon Icon.svg"
          isGrantVerified={isGrantVerified}
          isDaoVerified={isDaoVerified}
          status="accepted"
          sentDate="07 Aug"
          resultDate="07 Aug"
          onViewGrantClick={() => router.push({
            pathname: '/explore_grants/about_grant',
            query: {
              account: true,
            },
          })}
          onManageGrantClick={() => router.push({
            pathname: '/your_applications/manage_grant',
            query: {
              account: true,
              viewApplicationType: 'accepted',
            },
          })}
        />

        <YourApplicationCard
          grantTitle="Storage Provider (SP) Tooling Ideas"
          daoName="Polygon DAO"
          daoIcon="/images/dummy/Polygon Icon.svg"
          isGrantVerified={isGrantVerified}
          isDaoVerified={isDaoVerified}
          status="rejected"
          sentDate="07 Aug"
          resultDate="07 Aug"
          onViewGrantClick={() => router.push({
            pathname: '/explore_grants/about_grant',
            query: {
              account: true,
            },
          })}
          onViewApplicationClick={() => router.push({
            pathname: '/your_applications/grant_application',
            query: {
              account: true,
              viewApplicationType: 'rejected',
            },
          })}
        />

        <YourApplicationCard
          grantTitle="Storage Provider (SP) Tooling Ideas"
          daoName="Polygon DAO"
          daoIcon="/images/dummy/Polygon Icon.svg"
          isGrantVerified={isGrantVerified}
          isDaoVerified={isDaoVerified}
          status="resubmit"
          sentDate="07 Aug"
          resultDate="07 Aug"
          onViewGrantClick={() => router.push({
            pathname: '/explore_grants/about_grant',
            query: {
              account: true,
            },
          })}
          onViewApplicationClick={() => router.push({
            pathname: '/your_applications/grant_application',
            query: {
              account: true,
              viewApplicationType: 'resubmit',
            },
          })}
        />
      </Container>
    </Container>
  );
}

YourApplications.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default YourApplications;
