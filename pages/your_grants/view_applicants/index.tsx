import { gql } from '@apollo/client';
import { Container } from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useContext, useEffect, useState,
} from 'react';
import { formatAmount } from '../../../src/utils/formattingUtils';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Heading from '../../../src/components/ui/heading';
import Table from '../../../src/components/your_grants/view_applicants/table';
import supportedCurrencies from '../../../src/constants/supportedCurrencies';
import { getApplicantsForAGrant } from '../../../src/graphql/daoQueries';
import NavbarLayout from '../../../src/layout/navbarLayout';
import { ApiClientsContext } from '../../_app';

function ViewApplicants() {
  const [applicantsData, setApplicantsData] = useState<any>([]);
  const [grantID, setGrantID] = useState<any>('');
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient;
  const applicationStatuses = [
    'approved',
    'rejected',
    'resubmit',
    'submitted',
    'completed',
  ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGrantData = async () => {
    if (!subgraphClient) return null;
    try {
      const { data } = (await subgraphClient.client.query({
        query: gql(getApplicantsForAGrant),
        variables: {
          grantID, // : '0xcf624e32a53fec9ea5908f22d43a78a943931063',
          first: 999,
          skip: 0,
        },
      })) as any;
      if (data && data.grantApplications.length) {
        const fetchedApplicantsData = data.grantApplications.map(
          (applicant: any) => ({
            grantTitle: applicant?.grant?.title,
            applicationId: applicant.id,
            applicant_address: applicant.applicantId,
            sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
            applicant_name: applicant.fields.find((field: any) => field?.id?.includes('applicantName'))?.value[0],
            funding_asked: {
              amount: formatAmount(applicant?.fields?.find((field: any) => field?.id?.includes('fundingAsk'))?.value[0] ?? '0'),
              symbol: supportedCurrencies.find(
                (currency) => currency.id.toLowerCase()
                  === applicant?.grant?.reward?.asset?.toLowerCase(),
              )?.label,
              icon: supportedCurrencies.find(
                (currency) => currency?.id?.toLowerCase()
                  === applicant?.grant?.reward?.asset?.toLowerCase(),
              )?.icon,
            },
            status: applicationStatuses.indexOf(applicant?.state),
          }),
        );
        // console.log('fetchedd', fetchedApplicantsData);
        setApplicantsData(fetchedApplicantsData);
      }
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  };
  const router = useRouter();
  useEffect(() => {
    setGrantID(router?.query?.grantID ?? '');
  }, [router]);

  useEffect(() => {
    if (!grantID) return;
    getGrantData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantID]);

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="1116px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['My Grants', 'View Applicants']} />
        <Heading
          title={applicantsData[0]?.grantTitle ?? 'Grant Title'}
          dontRenderDivider
        />
        <Table
          data={applicantsData}
          onViewApplicantFormClick={
            (commentData: any) => router.push({
              pathname: '/your_grants/view_applicants/applicant_form/',
              query: {
                commentData,
                applicationId: commentData.applicationId,
              },
            })
          }
          onAcceptApplicationClick={() => router.push({
            pathname: '/your_grants/view_applicants/applicant_form/',
            query: {
              flow: 'approved',
            },
          })}
          onRejectApplicationClick={() => router.push({
            pathname: '/your_grants/view_applicants/applicant_form/',
            query: {
              flow: 'rejected',
            },
          })}
          onManageApplicationClick={(data: any) => router.push({
            pathname: '/your_grants/view_applicants/manage/',
            query: {
              applicationId: data.applicationId,
            },
          })}
        />
      </Container>
    </Container>
  );
}

ViewApplicants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ViewApplicants;
