import { Container } from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useContext, useEffect, useState,
} from 'react';
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters';
import { useGetApplicantsForAGrantQuery } from 'src/generated/graphql';
import { SupportedChainId } from 'src/constants/chains';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { getAssetInfo } from 'src/utils/tokenUtils';
import { formatAmount } from '../../../src/utils/formattingUtils';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Table from '../../../src/components/your_grants/view_applicants/table';
import NavbarLayout from '../../../src/layout/navbarLayout';
import { ApiClientsContext } from '../../_app';

const PAGE_SIZE = 500;

function ViewApplicants() {
  const [applicantsData, setApplicantsData] = useState<any>([]);
  const [grantID, setGrantID] = useState<any>('');
  const router = useRouter();
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;

  useEffect(() => {
    if (router && router.query) {
      const { grantId: gId } = router.query;
      setGrantID(gId);
    }
  }, [router]);

  const [queryParams, setQueryParams] = useState<any>({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
  });

  useEffect(() => {
    if (!workspace) return;
    if (!grantID) return;

    setQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: {
        grantID,
        first: PAGE_SIZE,
        skip: 0,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, grantID]);

  const { data, error, loading } = useGetApplicantsForAGrantQuery(queryParams);
  useEffect(() => {
    if (data && data.grantApplications.length) {
      const fetchedApplicantsData = data.grantApplications.map((applicant) => {
        const getFieldString = (name: string) => applicant.fields.find((field) => field?.id?.includes(`.${name}`))?.values[0]?.value;
        return {
          grantTitle: applicant?.grant?.title,
          applicationId: applicant.id,
          applicant_address: applicant.applicantId,
          sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
          applicant_name: getFieldString('applicantName'),
          funding_asked: {
            amount: formatAmount(
              getFieldString('fundingAsk') ?? '0',
            ),
            symbol: getAssetInfo(
              applicant?.grant?.reward?.asset?.toLowerCase(),
              getSupportedChainIdFromWorkspace(workspace),
            ).label,
            icon: getAssetInfo(
              applicant?.grant?.reward?.asset?.toLowerCase(),
              getSupportedChainIdFromWorkspace(workspace),
            ).icon,
          },
          // status: applicationStatuses.indexOf(applicant?.state),
          status: TableFilters[applicant?.state],
        };
      });
      setApplicantsData(fetchedApplicantsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading]);

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
          onViewApplicantFormClick={(commentData: any) => router.push({
            pathname: '/your_grants/view_applicants/applicant_form/',
            query: {
              commentData,
              applicationId: commentData.applicationId,
            },
          })}
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
          // eslint-disable-next-line @typescript-eslint/no-shadow
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
