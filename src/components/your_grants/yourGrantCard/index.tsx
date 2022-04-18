import React, { useEffect, useState } from 'react';
import {
  Image,
  Text,
  Button,
  Flex,
  Box,
  Divider,
  useToast,
  ToastId,
} from '@chakra-ui/react';
import { SupportedChainId } from 'src/constants/chains';
import useArchiveGrant from 'src/hooks/useArchiveGrant';
import InfoToast from 'src/components/ui/infoToast';
import Modal from 'src/components/ui/modal';
import { Rubric } from 'src/generated/graphql';
import Badge from './badge';
import YourGrantMenu from './menu';
import ChangeAccessibilityModalContent from './changeAccessibilityModalContent';
import RubricDrawer from '../rubricDrawer';

interface YourGrantCardProps {
  grantID: string;
  daoIcon: string;
  grantTitle: string;
  grantDesc: string;
  numOfApplicants: number;
  endTimestamp: number;
  grantAmount: string;
  grantCurrency: string;
  grantCurrencyIcon: string;
  state: 'processing' | 'done';
  onEditClick?: () => void;
  onViewApplicantsClick?: () => void;
  onAddFundsClick?: () => void;
  acceptingApplications: boolean;
  chainId: SupportedChainId | undefined;
  isAdmin: boolean;
  initialRubrics: Rubric;
  workspaceId: string;
}

function YourGrantCard({
  grantID,
  daoIcon,
  grantTitle,
  grantDesc,
  numOfApplicants,
  endTimestamp,
  grantAmount,
  grantCurrency,
  grantCurrencyIcon,
  state,
  onEditClick,
  onViewApplicantsClick,
  onAddFundsClick,
  chainId,
  acceptingApplications,
  isAdmin,
  initialRubrics,
  workspaceId,
}: YourGrantCardProps) {
  const [isAcceptingApplications, setIsAcceptingApplications] = React.useState<
  [boolean, number]
  >([acceptingApplications, 0]);

  const [transactionData, txnLink, loading, error] = useArchiveGrant(
    isAcceptingApplications[0],
    isAcceptingApplications[1],
    grantID,
  );

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false);
  const [isPublishGrantModalOpen, setIsPublishGrantModalOpen] = React.useState(false);

  const [rubricDrawerOpen, setRubricDrawerOpen] = React.useState(false);
  const [rubricEditAllowed] = React.useState(true);
  const [maximumPoints, setMaximumPoints] = React.useState(5);
  const [rubrics, setRubrics] = useState<any[]>([
    {
      name: '',
      nameError: false,
      description: '',
      descriptionError: false,
    },
  ]);

  useEffect(() => {
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
  }, [initialRubrics]);

  React.useEffect(() => {
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
      setIsArchiveModalOpen(false);
      setIsPublishGrantModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, transactionData]);

  React.useEffect(() => {
    setIsAcceptingApplications([acceptingApplications, 0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  React.useEffect(() => {
    console.log('isAcceptingApplications: ', isAcceptingApplications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAcceptingApplications]);

  return (
    <>
      <Flex py={6} w="100%">
        <Image objectFit="cover" h="54px" w="54px" src={daoIcon} />
        <Flex flex={1} direction="column" ml={6}>
          <Flex direction="row">
            <Flex direction="column">
              <Text lineHeight="24px" fontSize="18px" fontWeight="700">
                {grantTitle}
              </Text>
              <Text lineHeight="24px" color="#122224" fontWeight="400">
                {grantDesc}
              </Text>
            </Flex>
            <Box mr="auto" />
          </Flex>

          <Box mt={6} />

          <Badge
            numOfApplicants={numOfApplicants}
            endTimestamp={endTimestamp}
          />

          <Flex
            direction={{ base: 'column', md: 'row' }}
            mt={8}
            alignItems="center"
          >
            <Flex direction="row" align="center" w="full">
              <Image src={grantCurrencyIcon} />
              <Text ml={2} fontWeight="700" color="#3F06A0">
                {grantAmount}
                {' '}
                {grantCurrency}
              </Text>

              <Box mr="auto" />

              <YourGrantMenu
                chainId={chainId}
                grantID={grantID}
                onArchiveGrantClick={() => {
                  setIsArchiveModalOpen(true);
                }}
                isArchived={!acceptingApplications}
                numOfApplicants={numOfApplicants}
                onViewApplicantsClick={onViewApplicantsClick}
                onEditClick={onEditClick}
                isAdmin={isAdmin}
                setRubricDrawerOpen={setRubricDrawerOpen}
                initialRubricAvailable={initialRubrics.items.length > 0}
              />
              {acceptingApplications && isAdmin && (
                <Button
                  mr={2}
                  ml={5}
                  isDisabled={state === 'processing'}
                  variant={state === 'processing' ? 'primaryCta' : 'outline'}
                  color="brand.500"
                  borderColor="brand.500"
                  h="32px"
                  onClick={onAddFundsClick ?? (() => {})}
                >
                  Add funds
                </Button>
              )}
              {acceptingApplications && (
                <Button
                  ml={2}
                  isDisabled={state === 'processing'}
                  variant="primaryCta"
                  onClick={() => {
                    if (numOfApplicants <= 0 && onEditClick) {
                      onEditClick();
                    } else if (onViewApplicantsClick) {
                      onViewApplicantsClick();
                    }
                  }}
                  display={isAdmin || numOfApplicants > 0 ? undefined : 'none'}
                >
                  {numOfApplicants > 0 ? 'View applicants' : 'Edit grant'}
                </Button>
              )}
              {!acceptingApplications && isAdmin && (
                <Button
                  ml={5}
                  isDisabled={state === 'processing'}
                  variant="primaryCta"
                  onClick={() => {
                    setIsPublishGrantModalOpen(true);
                  }}
                  ref={buttonRef}
                  w={loading ? buttonRef.current?.offsetWidth : 'auto'}
                >
                  Publish grant
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Divider w="auto" />
      <Modal
        isOpen={
          acceptingApplications ? isArchiveModalOpen : isPublishGrantModalOpen
        }
        onClose={() => (acceptingApplications
          ? setIsArchiveModalOpen(false)
          : setIsPublishGrantModalOpen(false))}
        title=""
      >
        <ChangeAccessibilityModalContent
          onClose={() => (acceptingApplications
            ? setIsArchiveModalOpen(false)
            : setIsPublishGrantModalOpen(false))}
          imagePath={`/illustrations/${acceptingApplications ? 'archive' : 'publish'}_grant.svg`}
          title={acceptingApplications ? 'Are you sure you want to archive this grant?' : 'Are you sure you want to publish this grant?'}
          subtitle={acceptingApplications ? 'The grant will no longer be visible to anyone. You will not receive any new applications for it.' : 'The grant will be live, and applicants can apply for this grant.'}
          actionButtonText={acceptingApplications ? 'Archive Grant' : 'Publish Grant'}
          actionButtonOnClick={() => {
            setIsAcceptingApplications([
              !isAcceptingApplications[0],
              isAcceptingApplications[1] + 1,
            ]);
          }}
          loading={loading}
        />
      </Modal>

      <RubricDrawer
        rubricDrawerOpen={rubricDrawerOpen}
        setRubricDrawerOpen={setRubricDrawerOpen}
        rubricEditAllowed={rubricEditAllowed}
        rubrics={rubrics}
        setRubrics={setRubrics}
        maximumPoints={maximumPoints}
        setMaximumPoints={setMaximumPoints}
        chainId={chainId}
        grantAddress={grantID}
        workspaceId={workspaceId}
      />
    </>
  );
}

YourGrantCard.defaultProps = {
  onEditClick: () => {},
  onViewApplicantsClick: () => {},
  onAddFundsClick: () => {},
};
export default YourGrantCard;
