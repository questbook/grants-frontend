import {
  Flex, Text, Image, useToast, ToastId, Divider,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useEffect, useState, useCallback,
  useContext,
} from 'react';
import { useAccount, useContract, useSigner } from 'wagmi';
import { useGetApplicationDetailsLazyQuery } from 'src/generated/graphql';
import config from '../../../src/constants/config';
import ApplicationRegistryAbi from '../../../src/contracts/abi/ApplicationRegistryAbi.json';
import { ApiClientsContext } from '../../_app';
import InfoToast from '../../../src/components/ui/infoToast';
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
  const apiClients = useContext(ApiClientsContext);

  const [{ data: accountData }] = useAccount();
  const [signerStates] = useSigner();

  const applicationRegContract = useContract({
    addressOrName: config.ApplicationRegistryAddress,
    contractInterface: ApplicationRegistryAbi,
    signerOrProvider: signerStates.data,
  });

  const [hasClicked, setHasClicked] = React.useState(false);
  const toastRef = React.useRef<ToastId>();

  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [applicationId, setApplicationId] = useState<any>('');
  const [applicationData, setApplicationData] = useState<any>(null);

  const [resubmitComment, setResubmitComment] = useState('');
  const [resubmitCommentError, setResubmitCommentError] = useState(false);

  const [rejectionComment, setRejectionComment] = useState('');
  const [rejectionCommentError, setRejectionCommentError] = useState(false);
  const [getApplicationDetails] = useGetApplicationDetailsLazyQuery({
    client: apiClients?.subgraphClient?.client,
  });

  const getApplicationData = useCallback(async () => {
    try {
      const { data } = await getApplicationDetails({
        variables: {
          applicationID: applicationId,
        },
      });
      // console.log(data);
      if (data && data.grantApplication) {
        setApplicationData(data.grantApplication);
      }
      return true;
    } catch (e) {
      // console.log(e);
      return null;
    }
  }, [applicationId, getApplicationDetails]);

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

  const handleApplicationStateUpdate = async (state: number) => {
    try {
      if (!apiClients) return;
      const { validatorApi, workspaceId } = apiClients;
      if (!accountData
      || !accountData.address
      || !workspaceId
      || !applicationData
      || !applicationData.id) {
        return;
      }

      if (state === 1 && resubmitComment === '') {
        setResubmitCommentError(true);
        return;
      }

      if (state === 3 && rejectionComment === '') {
        setRejectionCommentError(true);
        return;
      }

      setHasClicked(true);
      const {
        data: { ipfsHash },
      } = await validatorApi.validateGrantApplicationUpdate({
        feedback: rejectionComment,
      });
      // console.log(ipfsHash);
      // console.log(Number(applicationData?.id), Number(workspaceId));
      const transaction = await applicationRegContract.updateApplicationState(
        Number(applicationData?.id),
        Number(workspaceId),
        state,
        ipfsHash,
      );
      const transactionData = await transaction.wait();

      // console.log(transactionData);
      // console.log(transactionData.blockNumber);
      // toast({ title: 'Transaction succeeded', status: 'success' });

      setHasClicked(false);
      router.replace({
        pathname: '/your_grants/view_applicants',
        query: {
          grantID: applicationData?.grant?.id,
        },
      });

      showToast({ link: `https://etherscan.io/tx/${transactionData.transactionHash}` });
      // await subgraphClient.waitForBlock(transactionData.blockNumber);
    } catch (error) {
      setHasClicked(false);
      // console.log(error);
      toast({
        title: 'Application update not indexed',
        status: 'error',
      });
    }
  };

  function renderContent(currentStep: number) {
    if (currentStep === 1) {
      return (
        <>
          <Accept
            // onSubmit={handleAcceptApplication}
            onSubmit={() => handleApplicationStateUpdate(2)}
            applicationData={applicationData}
            hasClicked={hasClicked}
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
          <Reject
            onSubmit={() => handleApplicationStateUpdate(3)}
            hasClicked={hasClicked}
            comment={rejectionComment}
            setComment={setRejectionComment}
            commentError={rejectionCommentError}
            setCommentError={setRejectionCommentError}
          />
          <RejectSidebar
            applicationData={applicationData}
          />
        </>
      );
    }
    return (
      <>
        <Resubmit
          onSubmit={() => handleApplicationStateUpdate(1)}
          hasClicked={hasClicked}
          comment={resubmitComment}
          setComment={setResubmitComment}
          commentError={resubmitCommentError}
          setCommentError={setResubmitCommentError}
        />
        <ResubmitSidebar
          applicationData={applicationData}
        />
      </>
    );
  }

  if (step === 0) {
    return (
      <Flex direction="row" w="72%" mx="auto">
        <Flex direction="column" w="100%" m={0} p={0} h="100%">
          <Flex
            direction="column"
            alignItems="stretch"
            pb={6}
            px={0}
            w="100%"
          >
            <Breadcrumbs
              path={['Your Grants', 'View Applicants', 'Applicant Form']}
            />
            <Heading mt="18px" title={applicationData?.grant?.title} />
          </Flex>

          <Flex direction="row" w="100%" justify="space-between">
            <Flex direction="column" w="65%" align="start">
              <Flex
                direction="column"
                alignItems="stretch"
                pb={8}
                w="100%"
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
                      {applicationData?.feedbackDao}
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
                      {applicationData?.feedbackDao}
                    </Text>
                  </Flex>
                </Flex>
                )}

                <Flex direction="column">
                  <Application applicationData={applicationData} />
                </Flex>

              </Flex>
            </Flex>
            <Flex direction="column" mt={2}>
              <Sidebar
                applicationData={applicationData}
                onAcceptApplicationClick={() => setStep(1)}
                onRejectApplicationClick={() => setStep(2)}
                onResubmitApplicationClick={() => setStep(3)}
              />
            </Flex>
          </Flex>
        </Flex>

      </Flex>
    );
  }

  return (
    <Flex direction="column" mx={200}>
      <Flex direction="column" mx={10} w="100%">
        <Breadcrumbs
          path={['My Grants', 'View Applicants', 'Applicant Form']}
        />
        <Text mt={4} mb={4} variant="heading">{applicationData?.grant?.title}</Text>
        <Divider mb={5} />
        <Flex maxW="100%" direction="row" justify="space-between">
          {renderContent(step)}
        </Flex>
      </Flex>

    </Flex>
  );
}

ApplicantForm.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ApplicantForm;
