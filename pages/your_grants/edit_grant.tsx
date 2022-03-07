import { Container, ToastId, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useGetGrantDetailsQuery } from 'src/generated/graphql';
import useEditGrant from 'src/hooks/useEditGrant';
import { SupportedChainId } from 'src/constants/chains';
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import InfoToast from '../../src/components/ui/infoToast';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Form from '../../src/components/your_grants/edit_grant/form';
import Sidebar from '../../src/components/your_grants/edit_grant/sidebar';
import NavbarLayout from '../../src/layout/navbarLayout';
import { ApiClientsContext } from '../_app';

function EditGrant() {
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;

  const router = useRouter();

  const grantInfoRef = useRef(null);
  const detailsRef = useRef(null);
  const applicationDetailsRef = useRef(null);
  const grantRewardsRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [grantID, setGrantID] = useState<string>();

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  const [formData, setFormData] = useState<any>(null);

  const [queryParams, setQueryParams] = useState<any>({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
  });

  useEffect(() => {
    if (!workspace) return;

    setQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: { grantID },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantID, workspace]);

  const {
    data,
    error,
    loading: queryLoading,
  } = useGetGrantDetailsQuery(queryParams);

  useEffect(() => {
    if (data && data.grants && data.grants.length > 0) {
      const grant = data.grants[0];
      setFormData({
        title: grant.title,
        summary: grant.summary,
        details: grant.details,
        applicantName:
          grant.fields.find((field: any) => field.id.includes('applicantName')) !== undefined,
        applicantEmail:
          grant.fields.find((field: any) => field.id.includes('applicantEmail')) !== undefined,
        teamMembers:
          grant.fields.find((field: any) => field.id.includes('teamMembers')) !== undefined,
        projectName:
          grant.fields.find((field: any) => field.id.includes('projectName')) !== undefined,
        projectGoals:
          grant.fields.find((field: any) => field.id.includes('projectGoals')) !== undefined,
        projectDetails:
          grant.fields.find((field: any) => field.id.includes('projectDetails')) !== undefined,
        projectLink:
          grant.fields.find((field: any) => field.id.includes('projectLink')) !== undefined,
        isMultipleMilestones:
          grant.fields.find((field: any) => field.id.includes('isMultipleMilestones')) !== undefined,
        fundingBreakdown:
          grant.fields.find((field: any) => field.id.includes('fundingBreakdown')) !== undefined,
        extraField:
          grant.fields.find((field: any) => field.id.includes('extraField'))
          !== undefined,
        reward: grant.reward.committed,
        rewardCurrency:
          CHAIN_INFO[
            getSupportedChainIdFromSupportedNetwork(
              grant.workspace.supportedNetworks[0],
            )
          ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.label ?? 'LOL',
        rewardCurrencyAddress:
          CHAIN_INFO[
            getSupportedChainIdFromSupportedNetwork(
              grant.workspace.supportedNetworks[0],
            )
          ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.address,
        date: grant.deadline,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, queryLoading]);

  const sideBarDetails = [
    ['Grant Intro', 'Grant title, and summary', grantInfoRef],
    [
      'Grant Details',
      'Requirements, expected deliverables, and milestones',
      detailsRef,
    ],
    [
      'Applicant Details',
      'About team, project, and funding breakdown.',
      applicationDetailsRef,
    ],
    [
      'Reward and Deadline',
      'Amount, type of payout & submission deadline',
      grantRewardsRef,
    ],
  ];

  const scroll = (ref: any, step: number) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setCurrentStep(step);
  };

  const [editData, setEditData] = useState<any>();
  const [transactionData, loading] = useEditGrant(editData, grantID);

  useEffect(() => {
    // console.log(transactionData);
    if (transactionData) {
      router.replace({ pathname: '/your_grants', query: { done: 'yes' } });
      toastRef.current = toast({
        position: 'top',
        render: () => (
          <InfoToast
            link={`https://etherscan.io/tx/${transactionData.transactionHash}`}
            close={() => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            }}
          />
        ),
      });
    }
  }, [toast, transactionData, router]);

  useEffect(() => {
    setGrantID(router?.query?.grantId?.toString());
  }, [router]);

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="682px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['Your Grants', 'Edit grant']} />
        {formData && (
          <Form
            hasClicked={loading}
            formData={formData}
            onSubmit={(editdata: any) => {
              // eslint-disable-next-line no-console
              // console.log(data);
              setEditData(editdata);
            }}
            refs={sideBarDetails.map((detail) => detail[2])}
          />
        )}
      </Container>

      <Sidebar
        sidebarDetails={sideBarDetails}
        currentStep={currentStep}
        scrollTo={scroll}
      />
    </Container>
  );
}

EditGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default EditGrant;
