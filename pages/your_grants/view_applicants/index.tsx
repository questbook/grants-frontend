import {
  Container, ToastId, useToast, Flex, Image, Text, Box, Button,
} from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useContext, useEffect, useState,
} from 'react';
import { TableFilters } from 'src/components/your_grants/view_applicants/table/TableFilters';
import {
  useGetApplicantsForAGrantQuery,
  useGetGrantDetailsQuery,
} from 'src/generated/graphql';
import { SupportedChainId } from 'src/constants/chains';
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { getAssetInfo } from 'src/utils/tokenUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { useAccount } from 'wagmi';
import InfoToast from 'src/components/ui/infoToast';
import Modal from 'src/components/ui/modal';
import ChangeAccessibilityModalContent from 'src/components/your_grants/yourGrantCard/changeAccessibilityModalContent';
import useArchiveGrant from 'src/hooks/useArchiveGrant';
import RubricDrawer from 'src/components/your_grants/rubricDrawer';
import { BigNumber } from 'ethers';
import { formatAmount } from '../../../src/utils/formattingUtils';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Table from '../../../src/components/your_grants/view_applicants/table';
import NavbarLayout from '../../../src/layout/navbarLayout';
import { ApiClientsContext } from '../../_app';

const PAGE_SIZE = 500;

function getTotalFundingRecv(_amount_paid: string) {
  let val = BigNumber.from(0);
  val = val.add(_amount_paid);
  return val;
}

function ViewApplicants() {
  const [applicantsData, setApplicantsData] = useState<any>([]);
  const [daoId, setDaoId] = useState('');
  const [grantID, setGrantID] = useState<any>(null);
  const [acceptingApplications, setAcceptingApplications] = useState(true);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [isReviewer, setIsReviewer] = React.useState<boolean>(false);

  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });
  const router = useRouter();
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;

  const [rubricDrawerOpen, setRubricDrawerOpen] = useState(false);
  const [maximumPoints, setMaximumPoints] = React.useState(5);
  const [rubricEditAllowed] = useState(true);
  const [rubrics, setRubrics] = useState<any[]>([
    {
      name: '',
      nameError: false,
      description: '',
      descriptionError: false,
    },
  ]);

  useEffect(() => {
    if (router && router.query) {
      const { grantId: gId } = router.query;
      setGrantID(gId);
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
    if (!grantID) return;

    setQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: {
        grantID,
        first: PAGE_SIZE,
        skip: 0,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, grantID]);

  useEffect(() => {
    if (
      workspace
      && workspace.members
      && workspace.members.length > 0
      && accountData
      && accountData.address
    ) {
      const tempMember = workspace.members.find(
        (m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
      );
      console.log(tempMember);
      setIsAdmin(
        tempMember?.accessLevel === 'admin'
          || tempMember?.accessLevel === 'owner',
      );

      setIsReviewer(tempMember?.accessLevel === 'reviewer');
    }
  }, [accountData, workspace]);

  const { data, error, loading } = useGetApplicantsForAGrantQuery(queryParams);

  useEffect(() => {
    if (data && data.grantApplications.length) {
      const fetchedApplicantsData = data.grantApplications.map((applicant) => {
        const getFieldString = (name: string) => applicant.fields.find((field) => field?.id?.includes(`.${name}`))?.values[0]?.value;
        return {
          grantTitle: applicant?.grant?.title,
          applicationId: applicant.id,
          applicant_address: applicant.applicantId,
          sent_on: moment.unix(applicant.createdAtS).format('DD MMM YYYY'),
          updated_on: moment.unix(applicant.updatedAtS).format('DD MMM YYYY'),
          // applicant_name: getFieldString('applicantName'),
          project_name: getFieldString('projectName'),
          funding_asked: {
            // amount: formatAmount(
            //   getFieldString('fundingAsk') ?? '0',
            // ),
            amount:
              applicant && getFieldString('fundingAsk') ? formatAmount(
                getFieldString('fundingAsk')!,
                CHAIN_INFO[
                  getSupportedChainIdFromSupportedNetwork(
                    applicant.grant.workspace.supportedNetworks[0],
                  )
                ]?.supportedCurrencies[applicant.grant.reward.asset.toLowerCase()]
                  ?.decimals ?? 18,
              ) : '1',
            symbol: getAssetInfo(
              applicant?.grant?.reward?.asset?.toLowerCase(),
              getSupportedChainIdFromWorkspace(workspace),
            ).label,
            icon: getAssetInfo(
              applicant?.grant?.reward?.asset?.toLowerCase(),
              getSupportedChainIdFromWorkspace(workspace),
            ).icon,
          },
          // status: applicationStatuses.indexOf(applicant?.state),
          status: TableFilters[applicant?.state],
          reviewers: applicant.reviewers,
          amount_paid: formatAmount(
            getTotalFundingRecv(
              applicant?.milestones[0].amountPaid,
            ).toString(),
            18,
          ),
        };
      });

      console.log('fetch', fetchedApplicantsData);

      setApplicantsData(fetchedApplicantsData);
      setDaoId(data.grantApplications[0].grant.workspace.id);
      setAcceptingApplications(data.grantApplications[0].grant.acceptingApplications);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading]);

  const { data: grantData } = useGetGrantDetailsQuery(queryParams);
  useEffect(() => {
    console.log('grantData', grantData);
    const initialRubrics = grantData?.grants[0].rubric;
    const newRubrics = [] as any[];
    console.log('initialRubrics', initialRubrics);
    initialRubrics?.items.forEach((initalRubric) => {
      newRubrics.push({
        name: initalRubric.title,
        nameError: false,
        description: initalRubric.details,
        descriptionError: false,
      });
    });
    if (newRubrics.length === 0) return;
    setRubrics(newRubrics);
    if (initialRubrics?.items[0].maximumPoints) {
      setMaximumPoints(initialRubrics.items[0].maximumPoints);
    }
  }, [grantData]);

  useEffect(() => {
    setShouldShowButton(daoId === workspace?.id);
  }, [workspace, accountData, daoId]);

  const [isAcceptingApplications, setIsAcceptingApplications] = React.useState<
  [boolean, number]
  >([acceptingApplications, 0]);

  useEffect(() => {
    setIsAcceptingApplications([acceptingApplications, 0]);
  }, [acceptingApplications]);

  const [transactionData, txnLink, archiveGrantLoading, archiveGrantError] = useArchiveGrant(
    isAcceptingApplications[0],
    isAcceptingApplications[1],
    grantID,
  );

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // console.log(transactionData);
    if (transactionData) {
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
      setIsModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, transactionData]);

  React.useEffect(() => {
    setIsAcceptingApplications([acceptingApplications, 0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archiveGrantError]);

  React.useEffect(() => {
    console.log('Is Accepting Applications: ', isAcceptingApplications);
  }, [isAcceptingApplications]);

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="1116px"
        alignItems="stretch"
        pb={8}
        px={10}
        pos="relative"
      >
        <Breadcrumbs path={['My Grants', 'View Applicants']} />

        {isAdmin && (
        <Box pos="absolute" right="40px" top="48px">
          <Button variant="primary" onClick={() => setRubricDrawerOpen(true)}>
            {(grantData?.grants[0].rubric?.items.length ?? 0) > 0 ?? false ? 'Edit Evaluation Rubric' : 'Setup Evaluation Rubric'}
          </Button>
        </Box>
        )}

        <RubricDrawer
          rubricDrawerOpen={rubricDrawerOpen}
          setRubricDrawerOpen={setRubricDrawerOpen}
          rubricEditAllowed={rubricEditAllowed}
          rubrics={rubrics}
          setRubrics={setRubrics}
          maximumPoints={maximumPoints}
          setMaximumPoints={setMaximumPoints}
          chainId={getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY}
          grantAddress={grantID}
          workspaceId={workspace?.id ?? ''}
          initialIsPrivate={grantData?.grants[0].rubric?.isPrivate ?? false}
        />
        <Table
          title={applicantsData[0]?.grantTitle ?? 'Grant Title'}
          isReviewer={isReviewer}
          data={applicantsData}
          onViewApplicantFormClick={(commentData: any) => router.push({
            pathname: '/your_grants/view_applicants/applicant_form/',
            query: {
              commentData,
              applicationId: commentData.applicationId,
            },
          })}
          // eslint-disable-next-line @typescript-eslint/no-shadow
          onManageApplicationClick={(data: any) => router.push({
            pathname: '/your_grants/view_applicants/manage/',
            query: {
              applicationId: data.applicationId,
            },
          })}
          archiveGrantComponent={!acceptingApplications && (
            <Flex
              maxW="100%"
              bg="#F3F4F4"
              direction="row"
              align="center"
              px={8}
              py={6}
              mt={6}
              border="1px solid #E8E9E9"
              borderRadius="6px"
            >
              <Image src="/toast/warning.svg" w="42px" h="36px" />
              <Flex direction="column" ml={6}>
                <Text variant="tableHeader" color="#414E50">
                  {shouldShowButton && accountData?.address ? 'Grant is archived and cannot be discovered on the Home page.' : 'Grant is archived and closed for new applications.'}
                </Text>
                <Text variant="tableBody" color="#717A7C" fontWeight="400" mt={2}>
                  New applicants cannot apply to an archived grant.
                </Text>
              </Flex>
              <Box mr="auto" />
              {accountData?.address && shouldShowButton && (
                <Button
                  ref={buttonRef}
                  w={archiveGrantLoading ? buttonRef?.current?.offsetWidth : 'auto'}
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Publish grant
                </Button>
              )}
            </Flex>
          )}
        />
      </Container>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title=""
      >
        <ChangeAccessibilityModalContent
          onClose={() => setIsModalOpen(false)}
          imagePath="/illustrations/publish_grant.svg"
          title="Are you sure you want to publish this grant?"
          subtitle="The grant will be live, and applicants can apply for this grant."
          actionButtonText="Publish grant"
          actionButtonOnClick={() => {
            console.log('Doing it!');
            console.log('Is Accepting Applications (Button click): ', isAcceptingApplications);
            setIsAcceptingApplications([
              !isAcceptingApplications[0],
              isAcceptingApplications[1] + 1,
            ]);
          }}
          loading={archiveGrantLoading}
        />
      </Modal>
    </Container>
  );
}

ViewApplicants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
