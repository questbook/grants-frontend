import {
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect } from 'react';
import { gql } from '@apollo/client';
import BN from 'bn.js';
import Heading from '../../src/components/ui/heading';
import YourApplicationCard from '../../src/components/your_applications/yourApplicationCard';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getMyApplications } from '../../src/graphql/daoQueries';
import SubgraphClient from '../../src/graphql/subgraph';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';
import { getFormattedDateFromUnixTimestamp } from '../../src/utils/formattingUtils';

function YourApplications() {
  const isGrantVerified = false;
  const isDaoVerified = false;
  const router = useRouter();
  const [applicantID, setApplicantId] = React.useState<any>('');
  const [myApplications, setMyApplications] = React.useState([]);

  const getMyApplicationsData = useCallback(async () => {
    const subgraphClient = new SubgraphClient();
    if (!subgraphClient.client) return null;
    try {
      const { data } = (await subgraphClient.client.query({

        query: gql(getMyApplications),
        variables: {
          applicantID,
        },
      })) as any;
      console.log('myapps', data);
      if (data && data.grantApplications.length) {
        setMyApplications(data.grantApplications);
      }
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, [applicantID]);

  useEffect(() => {
    setApplicantId(router?.query?.applicantID ?? '');
  }, [router]);

  useEffect(() => {
    if (!applicantID) return;
    getMyApplicationsData();
  }, [applicantID, getMyApplicationsData]);
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

        { myApplications.length
          ? myApplications.map((application: any) => (
            (
              <YourApplicationCard
                grantTitle={application.grant.title}
                daoName={application.grant.workspace.title}
                daoIcon={getUrlForIPFSHash(application.grant.workspace.logoIpfsHash)}
                isGrantVerified={(new BN(application.grant.funding)).gt(new BN(0))}
                isDaoVerified={(new BN(application.grant.funding)).gt(new BN(0))}
                status={application.state}
                sentDate={getFormattedDateFromUnixTimestamp(application.createdAtS)}
                onViewGrantClick={() => router.push({
                  pathname: '/explore_grants/about_grant',
                  query: {
                    grantID: application.grant.id,
                    account: true,
                  },
                })}
                onViewApplicationClick={() => router.push({
                  pathname: '/your_applications/grant_application',
                  query: {
                    account: true,
                    applicationID: application.id,
                    viewApplicationType: 'pending',
                  },
                })}
              />
            )
          )) : null}

        <YourApplicationCard
          grantTitle="Storage Provider (SP) Tooling Ideas"
          daoName="Polygon DAO"
          daoIcon="/images/dummy/Polygon Icon.svg"
          isGrantVerified={isGrantVerified}
          isDaoVerified={isDaoVerified}
          status="approved"
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
