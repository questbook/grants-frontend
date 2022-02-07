import {
  Container, Flex, Text, Image,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useEffect, useState } from 'react';
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

const milestones = [
  {
    number: 1,
    description: 'Feature complete and deployed onto testnet',
    amount: 20,
    symbol: 'ETH',
    icon: '/images/dummy/Ethereum Icon.svg',
  },
  {
    number: 2,
    description: 'Feature complete and deployed onto testnet',
    amount: 40,
    symbol: 'ETH',
    icon: '/images/dummy/Ethereum Icon.svg',
  },
];

function ApplicantForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [resubmissionComment] = useState('Resubmission comment');
  const [rejectionComment] = useState('Rejected');

  useEffect(() => {
    if (router.query.flow === 'accepted') {
      setStep(1);
    } else if (router.query.flow === 'rejected') {
      setStep(2);
    }
  }, [router]);

  function renderContent(currentStep: number) {
    if (currentStep === 1) {
      return (
        <>
          <Accept onSubmit={() => router.back()} milestones={milestones} />
          <AcceptSidebar />
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
          px={10}
        >
          <Breadcrumbs
            path={['Your Grants', 'View Applicants', 'Applicant Form']}
          />
          <Heading mt="18px" title="Storage Provider (SP) Tooling Ideas" />
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
            {rejectionComment && rejectionComment.length > 0 && (
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
                    {rejectionComment}
                  </Text>
                </Flex>
              </Flex>
            )}

            {resubmissionComment && resubmissionComment.length > 0 && (
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
                    Resubmit your Application
                  </Text>
                  <Text
                    fontSize="16px"
                    lineHeight="24px"
                    fontWeight="400"
                    color="#7B4646"
                  >
                    {resubmissionComment}
                  </Text>
                </Flex>
              </Flex>
            )}

            <Application />
          </Container>

          <Sidebar
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
        <Heading mt="18px" title="Storage Provider (SP) Tooling Ideas" />
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
