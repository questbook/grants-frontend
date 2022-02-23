import { Container, ToastId, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { useGetGrantDetailsLazyQuery } from 'src/generated/graphql';
import InfoToast from '../../src/components/ui/infoToast';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Form from '../../src/components/your_grants/edit_grant/form';
import Sidebar from '../../src/components/your_grants/edit_grant/sidebar';
import GrantABI from '../../src/contracts/abi/GrantAbi.json';
import supportedCurrencies from '../../src/constants/supportedCurrencies';
import NavbarLayout from '../../src/layout/navbarLayout';
import { formatAmount, parseAmount } from '../../src/utils/formattingUtils';
import { ApiClientsContext } from '../_app';

function EditGrant() {
  const apiClients = useContext(ApiClientsContext);

  const router = useRouter();

  const grantInfoRef = useRef(null);
  const detailsRef = useRef(null);
  const applicationDetailsRef = useRef(null);
  const grantRewardsRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [grantID, setGrantID] = useState<any>('');

  const [{ data: accountData }] = useAccount();
  const [signerStates] = useSigner();

  const grantContract = useContract({
    addressOrName: grantID.length > 0 ? grantID : '0x0000000000000000000000000000000000000000',
    contractInterface: GrantABI,
    signerOrProvider: signerStates.data,
  });

  const [hasClicked, setHasClicked] = React.useState(false);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  const [formData, setFormData] = useState<any>(null);

  const [getGrantDetails] = useGetGrantDetailsLazyQuery({
    client: apiClients?.subgraphClient?.client,
  });

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

  const getGrantData = async () => {
    if (!apiClients) return;
    const { subgraphClient } = apiClients;
    if (!subgraphClient) return;
    try {
      const { data } = await getGrantDetails({ variables: { grantID } });
      if (data) {
        const grant = data.grants[0];
        setFormData({
          title: grant.title,
          summary: grant.summary,
          details: grant.details,
          applicantName: grant.fields.find((field: any) => field.id.includes('applicantName')) !== undefined,
          applicantEmail: grant.fields.find((field: any) => field.id.includes('applicantEmail')) !== undefined,
          teamMembers: grant.fields.find((field: any) => field.id.includes('teamMembers')) !== undefined,
          projectName: grant.fields.find((field: any) => field.id.includes('projectName')) !== undefined,
          projectGoals: grant.fields.find((field: any) => field.id.includes('projectGoals')) !== undefined,
          projectDetails: grant.fields.find((field: any) => field.id.includes('projectDetails')) !== undefined,
          projectLink: grant.fields.find((field: any) => field.id.includes('projectLink')) !== undefined,
          isMultipleMilestones: grant.fields.find((field: any) => field.id.includes('isMultipleMilestones')) !== undefined,
          fundingBreakdown: grant.fields.find((field: any) => field.id.includes('fundingBreakdown')) !== undefined,
          extraField: grant.fields.find((field: any) => field.id.includes('extraField')) !== undefined,
          reward: formatAmount(grant.reward.committed),
          rewardCurrency: supportedCurrencies.find(
            (currency) => currency.id.toLowerCase() === grant.reward.asset.toLowerCase(),
          )!.label,
          rewardCurrencyAddress: supportedCurrencies.find(
            (currency) => currency.id.toLowerCase() === grant.reward.asset.toLowerCase(),
          )!.id,
          date: grant.deadline,
        });
      }
    } catch (e: any) {
      toast({
        title: 'Error getting workspace data',
        description: e.message,
        status: 'error',
      });
    }
  };

  const scroll = (ref: any, step: number) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setCurrentStep(step);
  };

  const closeToast = () => {
    if (toastRef.current) {
      toast.close(toastRef.current);
    }
  };

  const showToast = ({ link } : { link: string }) => {
    toastRef.current = toast({
      position: 'top',
      render: () => (
        <InfoToast
          link={link}
          close={closeToast}
        />
      ),
    });
  };

  const handleGrantSubmit = async (data: any) => {
    if (!apiClients) return;
    const { validatorApi, workspaceId } = apiClients;
    if (!accountData || !accountData.address || !workspaceId) {
      return;
    }

    try {
      setHasClicked(true);
      // eslint-disable-next-line react-hooks/rules-of-hooks

      const {
        data: { ipfsHash },
      } = await validatorApi.validateGrantUpdate({
        title: data.title,
        summary: data.summary,
        details: data.details,
        deadline: data.date,
        reward: {
          committed: parseAmount(data.reward),
          asset: data.rewardCurrencyAddress,
        },
        fields: data.fields,
      });

      // console.log(ipfsHash);

      const transaction = await grantContract.updateGrant(
        ipfsHash,
      );
      const transactionData = await transaction.wait();
      setHasClicked(false);
      router.replace({ pathname: '/your_grants', query: { done: 'yes' } });

      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
      // await subgraphClient.waitForBlock(transactionData.blockNumber);

    // router.replace('/your_grants');
    } catch (error) {
      setHasClicked(false);
      // console.log(error);
      toast({
        title: 'Application update not indexed',
        status: 'error',
      });
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
        maxW="682px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={['Your Grants', 'Edit grant']} />
        {formData && (
          <Form
            hasClicked={hasClicked}
            formData={formData}
            onSubmit={(data: any) => {
            // eslint-disable-next-line no-console
              // console.log(data);
              handleGrantSubmit(data);
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
