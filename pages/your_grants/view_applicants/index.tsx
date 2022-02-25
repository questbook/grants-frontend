import { Container } from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useContext, useEffect, useState,
} from 'react';
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters';
import { useGetApplicantsForAGrantLazyQuery } from 'src/generated/graphql';
import { SupportedChainId } from 'src/constants/chains';
import { formatAmount } from '../../../src/utils/formattingUtils';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Table from '../../../src/components/your_grants/view_applicants/table';
import supportedCurrencies from '../../../src/constants/supportedCurrencies';
import NavbarLayout from '../../../src/layout/navbarLayout';
import { ApiClientsContext } from '../../_app';

const PAGE_SIZE = 500;

function ViewApplicants() {
  const [applicantsData, setApplicantsData] = useState<any>([]);
  const [grantID, setGrantID] = useState<any>('');
  const router = useRouter();
  const {
    setChainId, chainId, subgraphClient,
  } = useContext(ApiClientsContext)!;

  useEffect(() => {
    if (router && router.query) {
      const { chainId: cId } = router.query;
      setChainId(cId as unknown as SupportedChainId);
    }
  }, [router, setChainId]);

  const [getApplicants] = useGetApplicantsForAGrantLazyQuery({ client: subgraphClient?.client });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGrantData = async () => {
    if (!subgraphClient) return null;
    try {
      const { data } = await getApplicants({
        variables: {
          grantID,
          first: PAGE_SIZE,
          skip: 0,
        },
      });
      if (data && data.grantApplications.length) {
        const fetchedApplicantsData = data.grantApplications.map(
          (applicant) => ({
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
            // status: applicationStatuses.indexOf(applicant?.state),
            status: TableFilters[applicant?.state],
          }),
        );
        setApplicantsData(fetchedApplicantsData);
      }
      return true;
    } catch (e) {
      // console.log(e);
      return null;
    }
  };
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
        <Table
          title={applicantsData[0]?.grantTitle ?? 'Grant Title'}
          data={applicantsData}
          onViewApplicantFormClick={
            (commentData: any) => router.push({
              pathname: '/your_grants/view_applicants/applicant_form/',
              query: {
                commentData,
                applicationId: commentData.applicationId,
                chainId,
              },
            })
          }
          // onAcceptApplicationClick={() => router.push({
          //   pathname: '/your_grants/view_applicants/applicant_form/',
          //   query: {
          //     flow: 'approved',
          //   },
          // })}
          // onRejectApplicationClick={() => router.push({
          //   pathname: '/your_grants/view_applicants/applicant_form/',
          //   query: {
          //     flow: 'rejected',
          //   },
          // })}
          onManageApplicationClick={(data: any) => router.push({
            pathname: '/your_grants/view_applicants/manage/',
            query: {
              applicationId: data.applicationId,
              chainId,
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
