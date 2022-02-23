import {
  Container,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useContext, useEffect, useState,
} from 'react';
import { ethers } from 'ethers';
import { GetApplicationDetailsQuery, useGetApplicationDetailsLazyQuery } from 'src/generated/graphql';
import { ApiClientsContext } from 'pages/_app';
import { GrantApplicationProps } from '../../src/types/application';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';
import Form from '../../src/components/your_applications/grant_application/form';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getAssetInfo } from '../../src/utils/tokenUtils';

function ViewApplication() {
  const { subgraphClient } = useContext(ApiClientsContext)!;

  const router = useRouter();
  const [applicationID, setApplicationId] = React.useState<any>('');
  const [application, setApplication] = React.useState<GetApplicationDetailsQuery['grantApplication']>();

  const [formData, setFormData] = useState<GrantApplicationProps | null>(null);

  const [getApplicationDetails] = useGetApplicationDetailsLazyQuery({
    client: subgraphClient.client,
  });

  const getApplicationDetailsData = useCallback(async () => {
    try {
      const { data } = await getApplicationDetails({
        variables: { applicationID },
      });

      if (data) {
        setApplication(data.grantApplication);
      }
      return true;
    } catch (e) {
      // console.log(e);
      return null;
    }
  }, [applicationID, getApplicationDetails]);

  useEffect(() => {
    setApplicationId(router?.query?.applicationID ?? '');
  }, [router]);

  useEffect(() => {
    if (!applicationID) return;
    getApplicationDetailsData();
  }, [applicationID, getApplicationDetailsData]);

  useEffect(() => {
    if (!application || !application?.fields?.length) return;

    const getStringField = (fieldName: string) => application?.fields?.find(({ id }) => id.split('.')[1] === fieldName)?.value[0] ?? '';

    const fields = application?.fields;
    const fd: GrantApplicationProps = {
      applicantName: getStringField('applicantName'),
      applicantEmail: getStringField('applicantEmail'),
      teamMembers: +(getStringField('teamMembers') || '1'),
      membersDescription: fields.find((f:any) => f.id.split('.')[1] === 'memberDetails')?.value.map((val:string) => ({ description: val })) ?? [],
      projectName: getStringField('projectName'),
      projectLinks: fields.find((f:any) => f.id.split('.')[1] === 'projectLink')?.value.map((val:string) => ({ link: val })) ?? [],
      projectDetails: getStringField('projectDetails'),
      projectGoal: getStringField('projectGoals'),
      projectMilestones: application.milestones
        .map((ms:any) => ({ milestone: ms.title, milestoneReward: ethers.utils.formatEther(ms.amount ?? '0') })) ?? [],
      fundingAsk: ethers.utils.formatEther(getStringField('fundingAsk') ?? '0'),
      fundingBreakdown: getStringField('fundingBreakdown'),
    };
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
          grantTitle={application?.grant?.title || ''}
          sentDate={application?.createdAtS ? new Date(application.createdAtS * 1000).toJSON() : ''}
          daoLogo={getUrlForIPFSHash(application?.grant?.workspace?.logoIpfsHash || '')}
          state={application?.state || ''}
          feedback={application?.feedbackDao || ''}
          grantRequiredFields={application?.fields?.map((field:any) => field.id.split('.')[1]) ?? []}
          applicationID={applicationID}
        />
      </Container>
    </Container>
  );
}

ViewApplication.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ViewApplication;
