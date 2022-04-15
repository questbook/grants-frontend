import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  ToastId,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ApiClientsContext } from 'pages/_app';
import React, {
  ReactElement, useContext, useEffect, useRef,
} from 'react';
import InfoToast from 'src/components/ui/infoToast';
import { GrantsContext } from 'src/hooks/stores/useGrantsStore';
import useIntersection from 'src/hooks/utils/useIntersection';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { useNetwork } from 'wagmi';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Form from '../../src/components/your_grants/create_grant/form';
import NavbarLayout from '../../src/layout/navbarLayout';

function CreateGrant() {
  const apiClients = useContext(ApiClientsContext)!;
  const { workspace } = apiClients;
  const [, switchNetwork] = useNetwork();
  const router = useRouter();

  const grantInfoRef = useRef(null);
  const detailsRef = useRef(null);
  const applicationDetailsRef = useRef(null);
  const grantRewardsRef = useRef(null);

  const grantInfoInViewport = useIntersection(grantInfoRef, '0px');
  const detailsInfoInViewport = useIntersection(detailsRef, '0px');
  const applicationDetailsInViewport = useIntersection(
    applicationDetailsRef,
    '0px',
  );
  const grantRewardsInViewport = useIntersection(grantRewardsRef, '0px');

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  const scroll = (ref: any) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    // setCurrentStep(step);
  };

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
      'Grant reward & submission deadline',
      grantRewardsRef,
    ],
  ];

  // const [transactionData, blockExplorerLink, loading] = useCreateGrant(formData);

  const {
    createGrantHandler,
    loading,
    setTransactionData,
    transactionData, transactionType, transactionLink,
  } = useContext(GrantsContext);

  function createGrant(data: any) {
    createGrantHandler(data);
  }
  useEffect(() => {
    if (workspace && switchNetwork) {
      const chainId = getSupportedChainIdFromWorkspace(workspace);
      switchNetwork(chainId!);
    }
  }, [switchNetwork, workspace]);

  useEffect(() => {
    // console.log(transactionData);
    if (transactionType === 'create' && transactionData) {
      router.replace({ pathname: '/your_grants', query: { done: 'yes' } });
      toastRef.current = toast({
        position: 'top',
        render: () => (
          <InfoToast
            link={transactionLink}
            close={() => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            }}
          />
        ),
      });
      setTransactionData('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, transactionData, transactionLink, transactionType, router]);

  const getColor = (index: number, color2: string, color1: string) => {
    if (index === 3) {
      return grantRewardsInViewport
        && !grantInfoInViewport
        && !detailsInfoInViewport
        && !applicationDetailsInViewport
        ? color1
        : color2;
    }
    if (index === 2) {
      return applicationDetailsInViewport
        && !detailsInfoInViewport
        && !grantInfoInViewport
        ? color1
        : color2;
    }
    if (index === 1) {
      return detailsInfoInViewport && !grantInfoInViewport ? color1 : color2;
    }
    return grantInfoInViewport ? color1 : color2;
  };

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
        <Breadcrumbs path={['My Grants', 'Create grant']} />
        <Form
          onSubmit={(data: any) => createGrant(data)}
          refs={sideBarDetails.map((detail) => detail[2])}
          hasClicked={loading}
        />
      </Container>

      <Box>
        <Flex
          // h="calc(100vh - 80px)"
          // bg={theme.colors.backgrounds.floatingSidebar}
          position="sticky"
          top={10}
          borderLeft="2px solid #E8E9E9"
          maxW={340}
          direction="column"
          alignItems="stretch"
          boxSizing="border-box"
        >
          {sideBarDetails.map(([title, description, ref], index) => (
            <Flex key={`sidebar-${title}`} direction="row" align="start">
              <Box
                // bg={currentStep < index ? '#E8E9E9' : 'brand.500'}
                bg={getColor(index, '#E8E9E9', 'brand.500')}
                h="20px"
                w="20px"
                minW="20px"
                color={getColor(index, 'black', 'white')}
                textAlign="center"
                display="flex"
                alignItems="center"
                justifyContent="center"
                lineHeight="0"
                fontSize="12px"
                fontWeight="700"
                ml="-1px"
              >
                {index + 1}
              </Box>
              <Flex direction="column" align="start" ml={7}>
                <Button
                  variant="link"
                  color={getColor(index, 'black', 'brand.500')}
                  textAlign="left"
                  onClick={() => scroll(ref)}
                >
                  <Text
                    fontSize="18px"
                    fontWeight="700"
                    lineHeight="26px"
                    letterSpacing={0}
                    textAlign="left"
                  >
                    {title}
                  </Text>
                </Button>
                <Text
                  mt="6px"
                  color={getColor(index, '#717A7C', '#122224')}
                  fontSize="14px"
                  fontWeight="400"
                  lineHeight="20px"
                >
                  {description}
                </Text>
                <Box mb={7} />
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Container>
  );
}

CreateGrant.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default CreateGrant;
