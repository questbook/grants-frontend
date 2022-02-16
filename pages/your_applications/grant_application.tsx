import {
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { gql } from '@apollo/client';
import { ethers } from 'ethers';
import { GrantApplicationProps } from 'src/types/application';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import { formatAmount } from 'src/utils/formattingUtils';
import Form from '../../src/components/your_applications/grant_application/form';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import NavbarLayout from '../../src/layout/navbarLayout';
import SubgraphClient from '../../src/graphql/subgraph';
import { getApplicationDetails } from '../../src/graphql/daoQueries';
import { getAssetInfo } from '../../src/utils/tokenUtils';

function ViewApplication() {
  const router = useRouter();
  const [applicationID, setApplicationId] = React.useState<any>('');
  const [application, setApplication] = React.useState<any>([]);

  const [formData, setFormData] = useState<GrantApplicationProps | null>(null);

  const getApplicationDetailsData = useCallback(async () => {
    const subgraphClient = new SubgraphClient();
    if (!subgraphClient.client) return null;
    try {
      const { data } = (await subgraphClient.client.query({

        query: gql(getApplicationDetails),
        variables: {
          applicationID,
        },
      })) as any;
      console.log(data);
      if (data && data.grantApplication) {
        setApplication(data.grantApplication);
      }
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, [applicationID]);

  useEffect(() => {
    setApplicationId(router?.query?.applicationID ?? '');
  }, [router]);

  useEffect(() => {
    if (!applicationID) return;
    getApplicationDetailsData();
  }, [applicationID, getApplicationDetailsData]);

  useEffect(() => {
    if (!application || !application?.fields?.length) return;
    console.log('application', application);
    const fields = application?.fields;
    console.log(fields);
    const fd: GrantApplicationProps = {
      applicantName: fields.find((f:any) => f.id.split('.')[1] === 'applicantName')?.value[0] ?? '',
      applicantEmail: fields.find((f:any) => f.id.split('.')[1] === 'applicantEmail')?.value[0] ?? '',
      teamMembers: Number(fields.find((f:any) => f.id.split('.')[1] === 'teamMembers')?.value[0]) ?? 1,
      membersDescription: fields.find((f:any) => f.id.split('.')[1] === 'memberDetails')?.value.map((val:string) => ({ description: val })) ?? [],
      projectName: fields.find((f:any) => f.id.split('.')[1] === 'projectName')?.value[0] ?? '',
      projectLinks: fields.find((f:any) => f.id.split('.')[1] === 'projectLink')?.value.map((val:string) => ({ link: val })) ?? [],
      projectDetails: fields.find((f:any) => f.id.split('.')[1] === 'projectDetails')?.value[0] ?? '',
      projectGoal: fields.find((f:any) => f.id.split('.')[1] === 'projectGoals')?.value[0] ?? '',
      projectMilestones: application.milestones
        .map((ms:any) => ({ milestone: ms.title, milestoneReward: formatAmount(ms.amount ?? '0') })) ?? [],
      fundingAsk: formatAmount(fields.find((f:any) => f.id.split('.')[1] === 'fundingAsk')?.value[0] ?? '0'),
      fundingBreakdown: fields.find((f:any) => f.id.split('.')[1] === 'fundingBreakdown')?.value[0] ?? '',
    };
    console.log('fd', fd);
    setFormData(fd);
  }, [application]);

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
          onSubmit={application && application?.state !== 'resubmit' ? null : ({ data }) => {
            router.push({
              pathname: '/your_applications',
              query: {
                applicantID: data[0].applicantId,
                account: true,
              },
            });
          }}
          rewardAmount={ethers.utils.formatEther(application?.grant?.reward?.committed ?? '1').toString()}
          rewardCurrency={getAssetInfo(application?.grant?.reward?.asset)?.label}
          rewardCurrencyCoin={getAssetInfo(application?.grant?.reward?.asset)?.icon}
          formData={formData}
          grantTitle={application?.grant?.title}
          sentDate={application?.createdAtS}
          daoLogo={getUrlForIPFSHash(application?.grant?.workspace?.logoIpfsHash)}
          state={application?.state}
          feedback={application?.feedback}
          grantRequiredFields={application?.fields?.map((field:any) => field.id.split('.')[1]) ?? []}
          applicationID={applicationID}
          grantID={application?.grant?.id}
        />
      </Container>
    </Container>
  );
}

ViewApplication.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ViewApplication;
