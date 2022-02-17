import { gql } from '@apollo/client';
import {
  Container,
  Flex,
  Image,
  Box,
  Text,
  Link,
  Button,
  useToast,
  ToastId,
} from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useAccount, useSigner, useContract } from 'wagmi';
import config from 'src/constants/config';
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json';
import InfoToast from 'src/components/ui/infoToast';
import {
  ApplicationMilestone,
  useApplicationMilestones,
  useFundDisbursed,
} from '../../../src/graphql/queries';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Heading from '../../../src/components/ui/heading';
import Modal from '../../../src/components/ui/modal';
import ModalContent from '../../../src/components/your_grants/manage_grant/modals/modalContentGrantComplete';
import Sidebar from '../../../src/components/your_grants/manage_grant/sidebar';
import Funding from '../../../src/components/your_grants/manage_grant/tables/funding';
import Milestones from '../../../src/components/your_grants/manage_grant/tables/milestones';
import { getApplicationDetails } from '../../../src/graphql/daoQueries';
import NavbarLayout from '../../../src/layout/navbarLayout';
import { getAssetInfo } from '../../../src/utils/tokenUtils';
import { ApiClientsContext } from '../../_app';

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
  return milestones.reduce(
    (value, milestone) => value + +milestone.amountPaid,
    0,
  );
}

function getTotalFundingAsked(milestones: ApplicationMilestone[]) {
  return milestones.reduce((value, milestone) => value + +milestone.amount, 0);
}

function ManageGrant() {
  const path = ['My Grants', 'View Application', 'Manage'];

  const [applicationData, setApplicationData] = useState<any>({
    grantTitle: '',
    applicantAddress: '',
    applicantEmail: '',
    applicationDate: '',
    grant: null,
    id: '',
  });

  const [selected, setSelected] = React.useState(0);
  const [isGrantCompleteModelOpen, setIsGrantCompleteModalOpen] = React.useState(false);

  const [applicationID, setApplicationID] = useState<any>('');
  const router = useRouter();
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient;
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });

  const {
    data: { milestones, rewardAsset, fundingAsk },
  } = useApplicationMilestones(applicationID);
  const { data: fundsDisbursed } = useFundDisbursed(applicationID);
  const fundingIcon = getAssetInfo(rewardAsset)?.icon;
  const assetInfo = getAssetInfo(rewardAsset);

  const getGrantData = async () => {
    if (!subgraphClient || !accountData?.address) return;
    try {
      const { data } = (await subgraphClient.client.query({
        query: gql(getApplicationDetails),
        variables: {
          applicationID,
        },
      })) as any;
      console.log(data);
      if (data && data.grantApplication) {
        const application = data.grantApplication;
        console.log(application);
        setApplicationData({
          title: application.grant.title,
          applicantAddress: application.applicantId,
          applicantEmail: application.fields.find((field: any) => field.id.includes('applicantEmail'))?.value[0],
          applicationDate: moment(moment.unix(application.createdAtS)).format('D MMMM YYYY'),
          grant: application.grant,
          id: application.id,
          state: application.state,
          updatedDate: moment(moment.unix(application.updatedAtS)).format('MMM D, YYYY'),
        });
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    setApplicationID(router?.query?.applicationId ?? '');
  }, [router, accountData]);

  useEffect(() => {
    if (!subgraphClient || !accountData?.address) return;
    if (!applicationID || applicationID.length < 1) return;
    getGrantData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationID, accountData?.address]);

  const tabs = [
    {
      title: milestones.length.toString(),
      subtitle: milestones.length === 1 ? 'Milestone' : 'Milestones',
      content: (
        <Milestones milestones={milestones} rewardAssetId={rewardAsset} />
      ),
    },
    {
      icon: fundingIcon,
      title: getTotalFundingRecv(milestones).toString(),
      subtitle: 'Funding Sent',
      content: (
        <Funding
          fundTransfers={fundsDisbursed}
          assetId={rewardAsset}
          columns={['milestoneTitle', 'date', 'from', 'action']}
          assetDecimals={18}
          grantId={applicationData.grant?.id}
        />
      ),
    },
    {
      icon: fundingIcon,
      title: (fundingAsk || getTotalFundingAsked(milestones)).toString(),
      subtitle: 'Funding Requested',
      content: undefined, // <Funding fundTransfers={fundsDisbursed} assetId={rewardAsset} />,
    },
  ];

  const apiClients = useContext(ApiClientsContext);
  const [signerStates] = useSigner();
  const applicationRegContract = useContract({
    addressOrName: config.ApplicationRegistryAddress,
    contractInterface: ApplicationRegistryAbi,
    signerOrProvider: signerStates.data,
  });
  const [hasClicked, setHasClicked] = React.useState(false);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

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
  const markApplicationComplete = async (comment: string) => {
    try {
      if (!apiClients) return;
      const { validatorApi, workspaceId } = apiClients;
      console.log('acdataa---------', applicationData);
      if (!accountData
      || !accountData.address
      || !workspaceId
      || !applicationData
      || !applicationData.id) {
        console.log('compleeeeeee');
        return;
      }

      setHasClicked(true);
      const {
        data: { ipfsHash },
      } = await validatorApi.validateGrantApplicationUpdate({
        feedback: comment,
      });
      console.log(ipfsHash);
      console.log(Number(applicationData?.id), Number(workspaceId));
      const transaction = await applicationRegContract.completeApplication(
        Number(applicationData?.id),
        Number(workspaceId),
        ipfsHash,
      );
      const transactionData = await transaction.wait();

      console.log(transactionData);
      console.log(transactionData.blockNumber);

      setHasClicked(false);
      setIsGrantCompleteModalOpen(false);
      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
      // toast({ title: 'Transaction succeeded', status: 'success' });
    } catch (error) {
      setHasClicked(false);
      console.log(error);
      toast({
        title: 'Application update not indexed',
        status: 'error',
      });
    }
  };

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
        <Breadcrumbs path={path} />
        <Heading
          mt="12px"
          title={applicationData.grantTitle}
          dontRenderDivider
        />
        <Flex mt="3px" direction="row" justify="start" align="baseline">
          <Text key="address" variant="applicationText">
            By
            {' '}
            <Box as="span" fontWeight="700" display="inline-block">
              {`${applicationData.applicantAddress.substring(0, 6)}...`}
            </Box>
          </Text>
          <Box mr={6} />
          <Text key="mail_text" fontWeight="400">
            <Image
              display="inline-block"
              alt="mail_icon"
              src="/ui_icons/mail_icon.svg"
              mr={2}
            />
            {applicationData.applicantEmail}
          </Text>
          <Box mr={6} />
          <Text key="date_text" fontWeight="400">
            <Image
              alt="date_icon"
              display="inline-block"
              src="/ui_icons/date_icon.svg"
              mr={2}
            />
            {applicationData.applicationDate}
          </Text>
          <Box mr={6} />
          <Link
            key="link"
            variant="link"
            fontSize="14px"
            lineHeight="24px"
            fontWeight="500"
            fontStyle="normal"
            color="#414E50"
            href="view_grant"
          >
            View Application
            {' '}
            <Image
              display="inline-block"
              h={3}
              w={3}
              src="/ui_icons/link.svg"
            />
          </Link>
        </Flex>

        {applicationData.state === 'completed' && (
        <Text variant="applicationText" color="#717A7C" mt={6}>
          Grant marked as complete on
          {' '}
          <Text variant="applicationText" display="inline-block">{applicationData.updatedDate}</Text>
        </Text>
        )}

        <Flex mt="29px" direction="row" w="full" align="center">
          {tabs.map((tab, index) => (
            <Button
              // eslint-disable-next-line react/no-array-index-key
              key={`tab-${tab.title}-${index}`}
              variant="ghost"
              h="110px"
              w="full"
              _hover={{
                background: '#F5F5F5',
              }}
              background={
                index !== selected
                  ? 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F4 100%)'
                  : 'white'
              }
              _focus={{}}
              borderRadius={index !== selected ? 0 : '8px 8px 0px 0px'}
              borderRightWidth={
                (index !== tabs.length - 1 && index + 1 !== selected)
                || index === selected
                  ? '2px'
                  : '0px'
              }
              borderLeftWidth={index !== selected ? 0 : '2px'}
              borderTopWidth={index !== selected ? 0 : '2px'}
              borderBottomWidth={index !== selected ? '2px' : 0}
              borderBottomRightRadius="-2px"
              onClick={() => {
                if (tabs[index].content) setSelected(index);
              }}
            >
              <Flex direction="column" justify="center" align="center" w="100%">
                <Flex direction="row" justify="center" align="center">
                  {tab.icon && (
                    <Image h="26px" w="26px" src={tab.icon} alt={tab.icon} />
                  )}
                  <Box mx={1} />
                  <Text fontWeight="700" fontSize="26px" lineHeight="40px">
                    {tab.title}
                  </Text>
                </Flex>
                <Text variant="applicationText" color="#717A7C">
                  {tab.subtitle}
                </Text>
              </Flex>
            </Button>
          ))}
        </Flex>

        {tabs[selected].content}

        <Flex direction="row" justify="center" mt={8}>

          {applicationData.state !== 'completed' && (
          <Button
            variant="primary"
            onClick={() => setIsGrantCompleteModalOpen(true)}
          >
            Mark Grant as Complete
          </Button>
          )}

        </Flex>
      </Container>
      {applicationData.state !== 'completed' && (
      <Sidebar
        milestones={milestones}
        assetInfo={assetInfo}
        grant={applicationData.grant}
        applicationId={applicationID}
      />
      )}

      <Modal
        isOpen={isGrantCompleteModelOpen}
        onClose={() => setIsGrantCompleteModalOpen(false)}
        title="Mark Grant as Complete"
      >
        <ModalContent
          hasClicked={hasClicked}
          onClose={(details) => markApplicationComplete(details)}
        />
      </Modal>
    </Container>
  );
}

ManageGrant.getLayout = function getLayout(page: React.ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
export default ManageGrant;
