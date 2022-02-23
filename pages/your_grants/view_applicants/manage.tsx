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
import { useRouter } from 'next/router';
import React, {
  useContext, useEffect, useMemo, useState,
} from 'react';
import { useAccount, useSigner, useContract } from 'wagmi';
import { BigNumber } from 'ethers';
import { ApplicationMilestone, useGetApplicationDetailsQuery, useGetFundSentForApplicationQuery } from 'src/generated/graphql';
import useApplicationMilestones from 'src/utils/queryUtil';
import config from '../../../src/constants/config';
import ApplicationRegistryAbi from '../../../src/contracts/abi/ApplicationRegistryAbi.json';
import InfoToast from '../../../src/components/ui/infoToast';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Heading from '../../../src/components/ui/heading';
import Modal from '../../../src/components/ui/modal';
import ModalContent from '../../../src/components/your_grants/manage_grant/modals/modalContentGrantComplete';
import Sidebar from '../../../src/components/your_grants/manage_grant/sidebar';
import Funding from '../../../src/components/your_grants/manage_grant/tables/funding';
import Milestones from '../../../src/components/your_grants/manage_grant/tables/milestones';
import NavbarLayout from '../../../src/layout/navbarLayout';
import { getAssetInfo } from '../../../src/utils/tokenUtils';
import { ApiClientsContext } from '../../_app';
import { formatAmount, getFormattedDateFromUnixTimestampWithYear } from '../../../src/utils/formattingUtils';
import SendFundModalContent from '../../../src/components/your_grants/manage_grant/modals/sendFundModalContent';

function getTotalFundingRecv(milestones: ApplicationMilestone[]) {
  let val = BigNumber.from(0);
  milestones.forEach((milestone) => {
    val = val.add(milestone.amountPaid);
  });
  return val;
}

function getTotalFundingAsked(milestones: ApplicationMilestone[]) {
  let val = BigNumber.from(0);
  milestones.forEach((milestone) => {
    val = val.add(milestone.amount);
  });
  return val;
}

function ManageGrant() {
  const path = ['My Grants', 'View Application', 'Manage'];

  const [selected, setSelected] = React.useState(0);
  const [isGrantCompleteModelOpen, setIsGrantCompleteModalOpen] = React.useState(false);
  const [isSendFundModalOpen, setIsSendFundModalOpen] = useState(false);

  const [applicationID, setApplicationID] = useState<any>();
  const router = useRouter();
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient;
  const [{ data: accountData }] = useAccount({ fetchEns: false });

  const {
    data: { milestones, rewardAsset, fundingAsk },
    refetch: refetchMilestones,
  } = useApplicationMilestones(applicationID);

  const {
    data: appDetailsResult,
    refetch: refetchApplicationDetails,
  } = useGetApplicationDetailsQuery({
    client: subgraphClient?.client,
    variables: {
      applicationID,
    },
  });

  const { data: fundsDisbursed } = useGetFundSentForApplicationQuery({
    client: subgraphClient?.client,
    variables: {
      applicationId: applicationID,
    },
  });

  const applicationData = appDetailsResult?.grantApplication;
  const applicantEmail = useMemo(
    () => applicationData?.fields.find((field: any) => field.id.includes('applicantEmail'))?.value[0],
    [applicationData],
  );

  const fundingIcon = getAssetInfo(rewardAsset)?.icon;
  const assetInfo = getAssetInfo(rewardAsset);

  useEffect(() => {
    setApplicationID(router?.query?.applicationId ?? '');
    refetchApplicationDetails();
  }, [router, accountData, refetchApplicationDetails]);

  const tabs = [
    {
      title: milestones.length.toString(),
      subtitle: milestones.length === 1 ? 'Milestone' : 'Milestones',
      content: (
        <Milestones
          refetch={refetchMilestones}
          milestones={milestones}
          rewardAssetId={rewardAsset}
          sendFundOpen={() => setIsSendFundModalOpen(true)}
        />
      ),
    },
    {
      icon: fundingIcon,
      title: formatAmount(getTotalFundingRecv(milestones).toString()),
      subtitle: 'Funding Sent',
      content: (
        <Funding
          fundTransfers={fundsDisbursed?.fundsTransfers || []}
          assetId={rewardAsset}
          columns={['milestoneTitle', 'date', 'from', 'action']}
          assetDecimals={18}
          grantId={applicationData?.grant?.id || ''}
          type="funding_sent"
        />
      ),
    },
    {
      icon: fundingIcon,
      title:
        (fundingAsk ? formatAmount(fundingAsk.toString()) : null)
        || formatAmount(getTotalFundingAsked(milestones).toString()),
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

  const showToast = ({ link }: { link: string }) => {
    toastRef.current = toast({
      position: 'top',
      render: () => <InfoToast link={link} close={closeToast} />,
    });
  };
  const markApplicationComplete = async (comment: string) => {
    try {
      if (!apiClients) return;
      const { validatorApi, workspaceId } = apiClients;
      if (
        !accountData
        || !accountData.address
        || !workspaceId
        || !applicationData
        || !applicationData.id
      ) {
        return;
      }

      setHasClicked(true);
      const {
        data: { ipfsHash },
      } = await validatorApi.validateGrantApplicationUpdate({
        feedback: comment,
      });
      // console.log(ipfsHash);
      // console.log(Number(applicationData?.id), Number(workspaceId));
      const transaction = await applicationRegContract.completeApplication(
        Number(applicationData?.id),
        Number(workspaceId),
        ipfsHash,
      );
      const transactionData = await transaction.wait();
      setHasClicked(false);
      setIsGrantCompleteModalOpen(false);
      showToast({
        link: `https://etherscan.io/tx/${transactionData.transactionHash}`,
      });
      // toast({ title: 'Transaction succeeded', status: 'success' });
    } catch (error) {
      setHasClicked(false);

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
          title={applicationData?.grant?.title || ''}
          dontRenderDivider
        />
        <Flex mt="3px" direction="row" justify="start" align="baseline">
          <Text key="address" variant="applicationText">
            By
            {' '}
            <Box as="span" fontWeight="700" display="inline-block">
              {`${applicationData?.applicantId?.substring(0, 6)}...`}
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
            {applicantEmail}
          </Text>
          <Box mr={6} />
          <Text key="date_text" fontWeight="400">
            <Image
              alt="date_icon"
              display="inline-block"
              src="/ui_icons/date_icon.svg"
              mr={2}
            />
            {getFormattedDateFromUnixTimestampWithYear(applicationData?.createdAtS)}
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
            href={`/your_grants/view_applicants/applicant_form/?applicationId=${applicationData?.id}`}
            isExternal
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

        {applicationData?.state === 'completed' && (
          <Text variant="applicationText" color="#717A7C" mt={6}>
            Grant marked as complete on
            {' '}
            <Text variant="applicationText" display="inline-block">
              {getFormattedDateFromUnixTimestampWithYear(applicationData?.updatedAtS)}
            </Text>
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
              background={index !== selected
                ? 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F4 100%)'
                : 'white'}
              _focus={{}}
              borderRadius={index !== selected ? 0 : '8px 8px 0px 0px'}
              borderRightWidth={(index !== tabs.length - 1 && index + 1 !== selected)
                  || index === selected
                ? '2px'
                : '0px'}
              borderLeftWidth={index !== selected ? 0 : '2px'}
              borderTopWidth={index !== selected ? 0 : '2px'}
              borderBottomWidth={index !== selected ? '2px' : 0}
              borderBottomRightRadius="-2px"
              onClick={() => {
                if (tabs[index].content) { setSelected(index); }
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
          {applicationData?.state !== 'completed' && selected === 0 && (
            <Button
              variant="primary"
              onClick={() => setIsGrantCompleteModalOpen(true)}
            >
              Mark Application as closed
            </Button>
          )}
        </Flex>
      </Container>
      {applicationData?.state !== 'completed' && (
        <Sidebar
          milestones={milestones}
          assetInfo={assetInfo}
          grant={applicationData?.grant}
          applicationId={applicationID}
        />
      )}

      <Modal
        isOpen={isGrantCompleteModelOpen}
        onClose={() => setIsGrantCompleteModalOpen(false)}
        title="Mark Application as closed"
        modalWidth={512}
      >
        <ModalContent
          hasClicked={hasClicked}
          onClose={(details: any) => markApplicationComplete(details)}
        />
      </Modal>

      {applicationData && applicationData.grant && (
      <Modal
        isOpen={isSendFundModalOpen}
        onClose={() => setIsSendFundModalOpen(false)}
        title="Send Funds"
        rightIcon={(
          <Button
            _focus={{}}
            variant="link"
            color="#AA82F0"
            leftIcon={<Image src="/sidebar/discord_icon.svg" />}
          >
            Support 24*7
          </Button>
          )}
      >
        <SendFundModalContent
          milestones={milestones}
          rewardAsset={{
            address: applicationData.grant.reward.asset,
            committed: BigNumber.from(applicationData.grant.reward.committed),
            label: assetInfo?.label,
            icon: assetInfo?.icon,
          }}
          contractFunding={applicationData.grant.funding}
          onClose={() => setIsSendFundModalOpen(false)}
          grantId={applicationData.grant.id}
          applicationId={applicationID}
        />
      </Modal>
      )}
    </Container>
  );
}

ManageGrant.getLayout = function getLayout(page: React.ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
export default ManageGrant;
