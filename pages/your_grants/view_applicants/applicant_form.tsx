import {
  Flex,
  Text,
  Image,
  useToast,
  ToastId,
  Divider,
  ModalBody,
  Box,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useEffect, useState, useContext,
} from 'react';
import {
  GetApplicationDetailsQuery,
  useGetApplicationDetailsQuery,
} from 'src/generated/graphql';
import { SupportedChainId } from 'src/constants/chains';
import useUpdateApplicationState from 'src/hooks/useUpdateApplicationState';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import useApplicationEncryption from 'src/hooks/useApplicationEncryption';
import Modal from 'src/components/ui/modal';
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
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;
  const { decryptApplicationPII } = useApplicationEncryption();

  const toastRef = React.useRef<ToastId>();

  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [applicationId, setApplicationId] = useState<any>('');
  const [applicationData, setApplicationData] = useState<GetApplicationDetailsQuery['grantApplication']>(null);
  const [submitClicked, setSubmitClicked] = useState(false);

  const [resubmitComment, setResubmitComment] = useState('');
  const [resubmitCommentError, setResubmitCommentError] = useState(false);

  const [rejectionComment, setRejectionComment] = useState('');
  const [rejectionCommentError, setRejectionCommentError] = useState(false);

  useEffect(() => {
    if (router && router.query) {
      const { applicationId: aId } = router.query;
      setApplicationId(aId);
    }
  }, [router]);

  const [queryParams, setQueryParams] = useState<any>({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
  });

  useEffect(() => {
    if (!workspace) return;
    if (!applicationId) return;

    setQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: {
        applicationID: applicationId,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, applicationId]);

  const {
    data,
    error: queryError,
    loading: queryLoading,
  } = useGetApplicationDetailsQuery(queryParams);
  useEffect(() => {
    if (data && data.grantApplication) {
      console.log('grantApplication------>', data.grantApplication);
      setApplicationData(data.grantApplication);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, queryError, queryLoading]);

  useEffect(() => {
    if (router.query.flow === 'approved') {
      setStep(1);
    } else if (router.query.flow === 'rejected') {
      setStep(2);
    }
  }, [router]);

  const [state, setState] = useState<any>(null);
  const [txn, txnLink, loading, error] = useUpdateApplicationState(
    state === 1 ? resubmitComment : rejectionComment,
    applicationData?.id,
    state,
    submitClicked,
    setSubmitClicked,
  );

  useEffect(() => {
    if (txn) {
      setState(undefined);
      toastRef.current = toast({
        position: 'top',
        render: () => (
          <InfoToast
            link={txnLink}
            close={() => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            }}
          />
        ),
      });
      router.replace({
        pathname: '/your_grants/view_applicants',
        query: {
          grantId: applicationData?.grant?.id,
        },
      });
    } else if (error) {
      setState(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastRef, toast, router, applicationData, txn, error]);

  const [hiddenModalOpen, setHiddenModalOpen] = useState(false);

  const showHiddenData = async () => {
    if (applicationData) {
      setHiddenModalOpen(true);
      const decryptedApplicationData = await decryptApplicationPII(
        applicationData,
      );
      if (decryptedApplicationData) {
        setApplicationData(decryptedApplicationData);
      }
    }
  };

  const handleApplicationStateUpdate = async (st: number) => {
    // console.log('unsetting state');
    setState(undefined);
    if (st === 1 && resubmitComment === '') {
      setResubmitCommentError(true);
      return;
    }

    if (st === 3 && rejectionComment === '') {
      setRejectionCommentError(true);
      return;
    }

    // console.log('setting state');
    setSubmitClicked(true);
    setState(st);
  };

  function renderModal() {
    return (
      <Modal
        isOpen={hiddenModalOpen}
        onClose={() => setHiddenModalOpen(false)}
        title="View Details with your Wallet"
        modalWidth={566}
      >
        <ModalBody px={10}>
          <Flex direction="column">
            <Flex mt="36px">
              <Text fontWeight="bold" fontSize="18px">
                How does this work?
              </Text>
            </Flex>
            <Flex mt="28px" alignItems="center">
              <Box
                bg="#8850EA"
                color="#fff"
                h={10}
                w={10}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="50%"
                mr="19px"
              >
                1
              </Box>
              <Text>Open your wallet</Text>
            </Flex>
            <Flex alignItems="center" mt="35px" mb="40px">
              <Box
                bg="#8850EA"
                color="#fff"
                h={10}
                w={10}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="50%"
                mr="19px"
              >
                2
              </Box>
              <Text>Click on ‘Decrypt’ to view the details.</Text>
            </Flex>

            <Button mb={10} variant="primary" onClick={() => setHiddenModalOpen(false)}>
              ok
            </Button>
          </Flex>
        </ModalBody>
      </Modal>
    );
  }

  function renderContent(currentStep: number) {
    if (currentStep === 1) {
      return (
        <>
          <Accept
            // onSubmit={handleAcceptApplication}
            onSubmit={() => handleApplicationStateUpdate(2)}
            applicationData={applicationData}
            hasClicked={loading}
          />
          <AcceptSidebar
            applicationData={applicationData}
            showHiddenData={showHiddenData}
          />
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <Reject
            onSubmit={() => handleApplicationStateUpdate(3)}
            hasClicked={loading}
            comment={rejectionComment}
            setComment={setRejectionComment}
            commentError={rejectionCommentError}
            setCommentError={setRejectionCommentError}
          />
          <RejectSidebar
            applicationData={applicationData}
            showHiddenData={showHiddenData}
          />
        </>
      );
    }
    return (
      <>
        <Resubmit
          onSubmit={() => handleApplicationStateUpdate(1)}
          hasClicked={loading}
          comment={resubmitComment}
          setComment={setResubmitComment}
          commentError={resubmitCommentError}
          setCommentError={setResubmitCommentError}
        />
        <ResubmitSidebar
          applicationData={applicationData}
          showHiddenData={showHiddenData}
        />
      </>
    );
  }

  if (step === 0) {
    return (
      <>
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
              <Heading mt="18px" title={applicationData?.grant?.title || ''} />
            </Flex>

            <Flex direction="row" w="100%" justify="space-between">
              <Flex direction="column" w="65%" align="start">
                <Flex direction="column" alignItems="stretch" pb={8} w="100%">
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
                    <Application
                      applicationData={applicationData}
                      showHiddenData={showHiddenData}
                    />
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                direction="column"
                mt={2}
                w={340}
                alignItems="stretch"
                pos="sticky"
                top="36px"
              >
                <Sidebar
                  showHiddenData={showHiddenData}
                  applicationData={applicationData}
                  onAcceptApplicationClick={() => setStep(1)}
                  onRejectApplicationClick={() => setStep(2)}
                  onResubmitApplicationClick={() => setStep(3)}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <Flex direction="column" mx={200}>
        <Flex direction="column" mx={10} w="100%">
          <Breadcrumbs
            path={['My Grants', 'View Applicants', 'Applicant Form']}
          />
          <Text mt={4} mb={4} variant="heading">
            {applicationData?.grant?.title}
          </Text>
          <Divider mb={5} />
          <Flex maxW="100%" direction="row" justify="space-between">
            {renderContent(step)}
          </Flex>
        </Flex>
      </Flex>
      {renderModal()}
    </>
  );
}

ApplicantForm.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ApplicantForm;
