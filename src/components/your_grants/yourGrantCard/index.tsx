import React, { useState } from 'react';
import {
  Image,
  Text,
  Button,
  Flex,
  Box,
  Divider,
  useToast,
  ToastId,
  Drawer,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
import { SupportedChainId } from 'src/constants/chains';
import useArchiveGrant from 'src/hooks/useArchiveGrant';
import InfoToast from 'src/components/ui/infoToast';
import Modal from 'src/components/ui/modal';
import SingleLineInput from 'src/components/ui/forms/singleLineInput';
import MultiLineInput from 'src/components/ui/forms/multiLineInput';
import Dropdown from 'src/components/ui/forms/dropdown';
import Badge from './badge';
import YourGrantMenu from './menu';
import ChangeAccessibilityModalContent from './changeAccessibilityModalContent';

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

  const [rubrikDrawerOpen, setRubrikDrawerOpen] = React.useState(false);
  const [rubrikEditAllowed] = React.useState(true);
  const [rubriks, setRubriks] = useState<any[]>([
    {
      name: '',
      nameError: false,
      description: '',
      descriptionError: false,
    },
  ]);

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
                setRubrikDrawerOpen={setRubrikDrawerOpen}
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

      <Drawer
        isOpen={rubrikDrawerOpen}
        placement="right"
        onClose={() => setRubrikDrawerOpen(false)}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent p={8} overflow="scroll">
          <>
            {rubriks.map((rubrik, index) => (
              <>
                <Flex
                  mt={4}
                  gap="2"
                  alignItems="flex-start"
                  opacity={rubrikEditAllowed ? 1 : 0.4}
                >
                  <Flex direction="column" flex={0.3327}>
                    <Text
                      mt="18px"
                      color="#122224"
                      fontWeight="bold"
                      fontSize="16px"
                      lineHeight="20px"
                    >
                      Criteria
                      {' '}
                      {index + 1}
                    </Text>
                  </Flex>
                  <Flex justifyContent="center" gap={2} alignItems="center" flex={0.6673}>
                    <SingleLineInput
                      value={rubriks[index].name}
                      onChange={(e) => {
                        const newRubriks = [...rubriks];
                        newRubriks[index].name = e.target.value;
                        newRubriks[index].nameError = false;
                        setRubriks(newRubriks);
                      }}
                      placeholder="Name"
                      isError={rubriks[index].nameError}
                      errorText="Required"
                      disabled={!rubrikEditAllowed}
                    />
                  </Flex>
                </Flex>
                <Flex mt={6} gap="2" alignItems="flex-start" opacity={rubrikEditAllowed ? 1 : 0.4}>
                  <Flex direction="column" flex={0.3327}>
                    <Text
                      mt="18px"
                      color="#122224"
                      fontWeight="bold"
                      fontSize="16px"
                      lineHeight="20px"
                    >
                      Description
                    </Text>
                  </Flex>
                  <Flex justifyContent="center" gap={2} alignItems="center" flex={0.6673}>
                    <MultiLineInput
                      value={rubriks[index].description}
                      onChange={(e) => {
                        const newRubriks = [...rubriks];
                        newRubriks[index].description = e.target.value;
                        newRubriks[index].descriptionError = false;
                        setRubriks(newRubriks);
                      }}
                      placeholder="Describe the evaluation criteria"
                      isError={rubriks[index].descriptionError}
                      errorText="Required"
                      disabled={!rubrikEditAllowed}
                    />
                  </Flex>
                </Flex>

                <Flex mt={2} gap="2" justifyContent="flex-end">
                  <Box
                    onClick={() => {
                      if (!rubrikEditAllowed) return;
                      const newRubriks = [...rubriks];
                      newRubriks.splice(index, 1);
                      setRubriks(newRubriks);
                    }}
                    display="flex"
                    alignItems="center"
                    cursor="pointer"
                    opacity={rubrikEditAllowed ? 1 : 0.4}
                  >
                    <Image
                      h="16px"
                      w="15px"
                      src="/ui_icons/delete_red.svg"
                      mr="6px"
                    />
                    <Text fontWeight="500" fontSize="14px" color="#DF5252" lineHeight="20px">
                      Delete
                    </Text>
                  </Box>
                </Flex>
                <Divider mt={4} />
              </>
            ))}

            <Flex mt="19px" gap="2" justifyContent="flex-start">
              <Box
                onClick={() => {
                  if (!rubrikEditAllowed) return;
                  const newRubriks = [...rubriks, {
                    name: '',
                    nameError: false,
                    description: '',
                    descriptionError: false,
                  }];
                  setRubriks(newRubriks);
                }}
                display="flex"
                alignItems="center"
                cursor="pointer"
                opacity={rubrikEditAllowed ? 1 : 0.4}
              >
                <Image
                  h="16px"
                  w="15px"
                  src="/ui_icons/plus_circle.svg"
                  mr="6px"
                />
                <Text fontWeight="500" fontSize="14px" color="#8850EA" lineHeight="20px">
                  Add another criteria
                </Text>
              </Box>
            </Flex>

            <Flex opacity={rubrikEditAllowed ? 1 : 0.4} direction="column" mt={6}>
              <Text
                fontSize="18px"
                fontWeight="700"
                lineHeight="26px"
                letterSpacing={0}
              >
                Evaluation Rating
              </Text>
              <Box mt={2} minW="399px" flex={0}>
                <Dropdown
                  listItems={[{
                    label: '3 point rating',
                    id: '3',
                  }, {
                    label: '5 point rating',
                    id: '5',
                  }]}
                  onChange={rubrikEditAllowed ? ({ id }: any) => {
                    console.log(id);
                  } : undefined}
                  listItemsMinWidth="300px"
                />
              </Box>
            </Flex>
            <Button mt="auto" variant="primary" onClick={() => {}}>
              Save
            </Button>
          </>
        </DrawerContent>
      </Drawer>
    </>
  );
}

YourGrantCard.defaultProps = {
  onEditClick: () => {},
  onViewApplicantsClick: () => {},
  onAddFundsClick: () => {},
};
export default YourGrantCard;
