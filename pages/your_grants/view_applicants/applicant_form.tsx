import {
  Container, Flex, Text, Image,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useEffect, useState, useCallback,
  useContext,
} from 'react';
import SubgraphClient from 'src/graphql/subgraph';
import { getApplicationDetails } from 'src/graphql/daoQueries';
import { gql } from '@apollo/client';
import { useAccount, useContract, useSigner } from 'wagmi';
import config from 'src/constants/config';
import ApplicationRegistryAbi from 'src/contracts/abi/ApplicationRegistryAbi.json';
import { ApiClientsContext } from 'pages/_app';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Heading from '../../../src/components/ui/heading';

import Accept from '../../../src/components/your_grants/applicant_form/accept/accept';
import AcceptSidebar from '../../../src/components/your_grants/applicant_form/accept/sidebar';

import Reject from '../../../src/components/your_grants/applicant_form/reject/reject';
import RejectSidebar from '../../../src/components/your_grants/applicant_form/reject/sidebar';

import Resubmit from '../../../src/components/your_grants/applicant_form/resubmit/resubmit';
import ResubmitSidebar from '../../../src/components/your_grants/applicant_form/resubmit/sidebar';

import Application from '../../../src/components/your_grants/applicant_form/application';
import Sidebar from '../../../src/components/your_grants/applicant_form/sidebar';
import NavbarLayout from '../../../src/layout/navbarLayout';

function ApplicantForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [applicationId, setApplicationId] = useState<any>('');
  const [applicationData, setApplicationData] = useState<any>(null);

  const getApplicationData = useCallback(async () => {
    const subgraphClient = new SubgraphClient();
    if (!subgraphClient.client) return null;
    try {
      const { data } = (await subgraphClient.client.query({
        query: gql(getApplicationDetails),
        variables: {
          applicationID: applicationId,
        },
      })) as any;
      console.log(data);
      if (data && data.grantApplication) {
        setApplicationData(data.grantApplication);
      }
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, [applicationId]);

  useEffect(() => {
    setApplicationId(router?.query?.applicationId ?? '');
  }, [router]);

  useEffect(() => {
    if (!applicationId) return;
    getApplicationData();
  }, [applicationId, getApplicationData]);

  useEffect(() => {
    if (router.query.flow === 'approved') {
      setStep(1);
    } else if (router.query.flow === 'rejected') {
      setStep(2);
    }
  }, [router]);
  const [{ data: accountData }] = useAccount();
  const apiClients = useContext(ApiClientsContext);
  const [signerStates] = useSigner();

  const applicationRegContract = useContract({
    addressOrName: config.ApplicationRegistryAddress,
    contractInterface: ApplicationRegistryAbi,
    signerOrProvider: signerStates.data,
  });
  const handleAcceptApplication = async () => {
    if (!apiClients) return;
    const { subgraphClient, workspaceId } = apiClients;
    if (!accountData
      || !accountData.address
      || !workspaceId
      || !applicationData
      || !applicationData.id) {
      return;
    }

    console.log(Number(applicationData?.id), Number(workspaceId));
    const transaction = await applicationRegContract.updateApplicationState(
      Number(applicationData?.id),
      Number(workspaceId),
      2,
      '',
    );
    const transactionData = await transaction.wait();

    console.log(transactionData);
    console.log(transactionData.blockNumber);

    await subgraphClient.waitForBlock(transactionData.blockNumber);

    router.replace('/your_grants');
  };

  function renderContent(currentStep: number) {
    if (currentStep === 1) {
      return (
        <>
          <Accept
            onSubmit={handleAcceptApplication}
            applicationData={applicationData}
          />
          <AcceptSidebar
            applicationData={applicationData}
          />
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <Reject onSubmit={() => router.back()} />
          <RejectSidebar />
        </>
      );
    }
    return (
      <>
        <Resubmit onSubmit={() => router.back()} />
        <ResubmitSidebar />
      </>
    );
  }

  if (step === 0) {
    return (
      <Container flexDirection="column" maxW="100%" display="flex" px="70px">
        <Container
          flex={1}
          display="flex"
          flexDirection="column"
          maxW="1116px"
          alignItems="stretch"
          pb={6}
          // px={10}
        >
          <Breadcrumbs
            path={['Your Grants', 'View Applicants', 'Applicant Form']}
          />
          <Heading mt="18px" title={applicationData?.grant?.title} />
        </Container>

        <Container maxW="100%" display="flex">
          <Container
            flex={1}
            display="flex"
            flexDirection="column"
            maxW="834px"
            alignItems="stretch"
            pb={8}
            px={10}
          >
            {applicationData && applicationData?.state === 'rejected' && (
              <Flex
                alignItems="flex-start"
                bgColor="#FFC0C0"
                border="2px solid #EE7979"
                px="26px"
                py="22px"
                borderRadius="6px"
                my={4}
                mx={10}
                alignSelf="stretch"
              >
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  bgColor="#F7B7B7"
                  border="2px solid #EE7979"
                  borderRadius="40px"
                  p={2}
                  h="40px"
                  w="40px"
                  mt="5px"
                >
                  <Image
                    h="40px"
                    w="40px"
                    src="/ui_icons/result_rejected_application.svg"
                    alt="Rejected"
                  />
                </Flex>
                <Flex ml="23px" direction="column">
                  <Text
                    fontSize="16px"
                    lineHeight="24px"
                    fontWeight="700"
                    color="#7B4646"
                  >
                    Application Rejected
                  </Text>
                  <Text
                    fontSize="16px"
                    lineHeight="24px"
                    fontWeight="400"
                    color="#7B4646"
                  >
                    {applicationData?.feedback}
                  </Text>
                </Flex>
              </Flex>
            )}

            {applicationData && applicationData?.state === 'resubmit' && (
              <Flex
                alignItems="flex-start"
                bgColor="#FEF6D9"
                border="2px solid #EFC094"
                px="26px"
                py="22px"
                borderRadius="6px"
                my={4}
                mx={10}
                alignSelf="stretch"
              >
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  h="36px"
                  w="42px"
                >
                  <Image
                    h="40px"
                    w="40px"
                    src="/ui_icons/alert_triangle.svg"
                    alt="Resubmit"
                  />
                </Flex>
                <Flex ml="23px" direction="column">
                  <Text
                    fontSize="16px"
                    lineHeight="24px"
                    fontWeight="700"
                    color="#7B4646"
                  >
                    Request for Resubmission
                  </Text>
                  <Text
                    fontSize="16px"
                    lineHeight="24px"
                    fontWeight="400"
                    color="#7B4646"
                  >
                    {applicationData?.feedback}
                  </Text>
                </Flex>
              </Flex>
            )}

            <Application applicationData={applicationData} />
          </Container>

          <Sidebar
            applicationData={applicationData}
            onAcceptApplicationClick={() => setStep(1)}
            onRejectApplicationClick={() => setStep(2)}
            onResubmitApplicationClick={() => setStep(3)}
          />
        </Container>
      </Container>
    );
  }

  return (
    <Container flexDirection="column" maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="1116px"
        alignItems="stretch"
        pb={6}
        px={10}
      >
        <Breadcrumbs
          path={['My Grants', 'View Applicants', 'Applicant Form']}
        />
        <Heading mt="18px" title={applicationData?.grant?.title} />
      </Container>

      <Container pb={12} maxW="100%" display="flex">
        {renderContent(step)}
      </Container>
    </Container>
  );
}

ApplicantForm.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ApplicantForm;
