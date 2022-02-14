import {
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { ethers } from 'ethers';
import Form from '../../src/components/your_applications/grant_application/form';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import NavbarLayout from '../../src/layout/navbarLayout';
import SubgraphClient from '../../src/graphql/subgraph';
import { getApplicationDetails } from '../../src/graphql/daoQueries';
import { getAssetInfo } from '../../src/utils/tokenUtils';
import { GrantApplicationProps } from '../../src/types/application';

function ViewApplication() {
  const rewardAmount = '60';
  const rewardCurrency = 'ETH';
  const rewardCurrencyCoin = '/network_icons/eth_mainnet.svg';

  const router = useRouter();
  const [applicationID, setApplicationId] = React.useState<any>('');
  const [application, setApplication] = React.useState<any>([]);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const [rejectedComment, setRejectedComment] = useState('');
  const [resubmitComment, setResubmitComment] = useState('');
  const [formData, setFormData] = useState<GrantApplicationProps | null>(null);

  useEffect(() => {
    if (router.query.viewApplicationType === 'resubmit') {
      setIsReadOnly(false);
      setResubmitComment('This requires a resubmission');
    }
    if (router.query.viewApplicationType === 'rejected') {
      setRejectedComment('This is bad news');
    }
  }, [router.query.viewApplicationType]);

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
    const fields = application?.fields;

    const fd: GrantApplicationProps = {
      applicantName: fields.find((f:any) => f.id.split('.')[0] === 'applicantName')?.value[0] ?? '',
      applicantEmail: fields.find((f:any) => f.id.split('.')[0] === 'applicantEmail')?.value[0] ?? '',
      teamMembers: fields.find((f:any) => f.id.split('.')[0] === 'teamMembers')?.value[0] ?? '',
      membersDescription: fields.find((f:any) => f.id.split('.')[0] === 'memberDetails')?.value.map((val:string) => ({ description: val })) ?? [],
      projectName: fields.find((f:any) => f.id.split('.')[0] === 'projectName')?.value[0] ?? '',
      projectLinks: fields.find((f:any) => f.id.split('.')[0] === 'projectLink')?.value.map((val:string) => ({ link: val })) ?? [],
      projectDetails: fields.find((f:any) => f.id.split('.')[0] === 'projectDetails')?.value[0] ?? '',
      projectGoal: fields.find((f:any) => f.id.split('.')[0] === 'projectGoals')?.value[0] ?? '',
      projectMilestones: application.milestones
        .map((ms:any) => ({ milestone: ms.title, milestoneReward: ms.amount })) ?? [],
      fundingAsk: fields.find((f:any) => f.id.split('.')[0] === 'fundingAsk')?.value[0] ?? '',
      fundingBreakdown: fields.find((f:any) => f.id.split('.')[0] === 'fundingBreakdown')?.value[0] ?? '',
    };
    setFormData(fd);
  }, [application]);

  // const formData = {
  //   applicantName: 'Dhairya',
  //   applicantEmail: 'dhairya@email.com',
  //   teamMembers: 1,
  //   membersDescription: [
  //     {
  //       description: 'Crazy guy',
  //     },
  //   ],

  //   projectName: 'Project Icarus',
  //   projectLinks: [
  //     {
  //       link: 'github',
  //     },
  //   ],
  //   projectDetails: 'This is a project',
  //   projectGoal: '100',

  //   projectMilestones: [
  //     {
  //       milestone: 'Milestone 1',
  //       milestoneReward: '10',
  //     },
  //   ],

  //   fundingAsk: '100',
  //   fundingBreakdown: 'lol',
  // };

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
          rewardAmount={ethers.utils.formatEther(application?.grant?.reward?.committed ?? '1').toString()}
          rewardCurrency={getAssetInfo(application?.grant?.reward?.asset)?.label}
          rewardCurrencyCoin={getAssetInfo(application?.grant?.reward?.asset)?.icon}
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
