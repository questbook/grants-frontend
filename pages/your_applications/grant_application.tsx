import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ethers } from 'ethers';
import {
  GetApplicationDetailsQuery,
  useGetApplicationDetailsQuery,
} from 'src/generated/graphql';
import { ApiClientsContext } from 'pages/_app';
import { SupportedChainId } from 'src/constants/chains';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import { GrantApplicationProps } from '../../src/types/application';
import { getUrlForIPFSHash } from '../../src/utils/ipfsUtils';
import Form from '../../src/components/your_applications/grant_application/form';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import NavbarLayout from '../../src/layout/navbarLayout';
import { getAssetInfo } from '../../src/utils/tokenUtils';

function ViewApplication() {
  const apiClients = useContext(ApiClientsContext)!;
  const { subgraphClients } = apiClients;

  const router = useRouter();
  const [applicationID, setApplicationId] = React.useState<any>('');
  const [application, setApplication] = React.useState<GetApplicationDetailsQuery['grantApplication']>();

  const [formData, setFormData] = useState<GrantApplicationProps | null>(null);
  const [chainId, setChainId] = useState<SupportedChainId>();

  useEffect(() => {
    if (router && router.query) {
      const { chainId: cId, applicationId: aId } = router.query;
      setChainId(cId as unknown as SupportedChainId);
      setApplicationId(aId);
    }
  }, [router]);

  const [queryParams, setQueryParams] = useState<any>({
    client:
      subgraphClients[
        chainId ?? SupportedChainId.RINKEBY
      ].client,
  });

  useEffect(() => {
    if (!applicationID) return;
    if (!chainId) return;

    setQueryParams({
      client:
        subgraphClients[chainId].client,
      variables: {
        applicationID,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, applicationID]);

  const { data, error, loading } = useGetApplicationDetailsQuery(queryParams);

  useEffect(() => {
    if (data) {
      setApplication(data.grantApplication);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading]);

  useEffect(() => {
    if (!application || !application?.fields?.length) return;

    const getStringField = (fieldName: string) => application?.fields?.find(({ id }) => id.split('.')[1] === fieldName)
      ?.value[0] ?? '';

    const fields = application?.fields;
    const fd: GrantApplicationProps = {
      applicantName: getStringField('applicantName'),
      applicantEmail: getStringField('applicantEmail'),
      teamMembers: +(getStringField('teamMembers') || '1'),
      membersDescription:
        fields
          .find((f: any) => f.id.split('.')[1] === 'memberDetails')
          ?.value.map((val: string) => ({ description: val })) ?? [],
      projectName: getStringField('projectName'),
      projectLinks:
        fields
          .find((f: any) => f.id.split('.')[1] === 'projectLink')
          ?.value.map((val: string) => ({ link: val })) ?? [],
      projectDetails: getStringField('projectDetails'),
      projectGoal: getStringField('projectGoals'),
      projectMilestones:
        application.milestones.map((ms: any) => ({
          milestone: ms.title,
          milestoneReward: ethers.utils.formatEther(ms.amount ?? '0'),
        })) ?? [],
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
        <Breadcrumbs path={['My Applications', 'Grant Application']} />
        <Form
          chainId={application ? getSupportedChainIdFromSupportedNetwork(
            application!.grant.workspace.supportedNetworks[0],
          ) : undefined}
          onSubmit={
            application && application?.state !== 'resubmit'
              ? null
              // eslint-disable-next-line @typescript-eslint/no-shadow
              : ({ data }) => {
                router.push({
                  pathname: '/your_applications',
                  query: {
                    applicantID: data[0].applicantId,
                    account: true,
                  },
                });
              }
          }
          rewardAmount={ethers.utils
            .formatEther(application?.grant?.reward?.committed ?? '1')
            .toString()}
          rewardCurrency={
            getAssetInfo(application?.grant?.reward?.asset ?? '', chainId)?.label
          }
          rewardCurrencyCoin={
            getAssetInfo(application?.grant?.reward?.asset ?? '', chainId)?.icon
          }
          formData={formData}
          grantTitle={application?.grant?.title || ''}
          sentDate={
            application?.createdAtS.toString()
              ?? ''
          }
          daoLogo={getUrlForIPFSHash(
            application?.grant?.workspace?.logoIpfsHash || '',
          )}
          state={application?.state || ''}
          feedback={application?.feedbackDao || ''}
          grantRequiredFields={
            application?.fields?.map((field: any) => field.id.split('.')[1])
            ?? []
          }
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
