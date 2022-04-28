import {
  Image,
  IconButton,
  Flex,
  Text,
  Button,
  Grid,
  Tooltip,
  Link,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
} from '@chakra-ui/react';
import React, {useContext} from 'react';
import { trimAddress } from 'src/utils/formattingUtils';

// import config from 'src/constants/config';
import CopyIcon from '../ui/copy_icon';
import Modal from '../ui/modal';
import PayoutModalContent from './payoutModalContent';
import { ApiClientsContext } from '../../../pages/_app';

import router from 'next/router'

function Payouts() {
  const { workspace } = useContext(ApiClientsContext)!;

  const payModal = useDisclosure();
  const [payMode, setPayMode] = React.useState<number>(-1);
  const [selectedData, setSelectedData] = React.useState<any>();
  const [paymentOutside, setPaymentOutside] = React.useState<boolean>(false);

  const [tabIndex, setTabIndex] = React.useState<number>(0);

  const payOptions = ['Pay from connected wallet', 'Pay from another wallet'];

  const tableHeaders = [
    'Member Email',
    'Member Address',
    'Last Review On',
    'Outstanding Payout',
    'Actions',
  ];
  const historyTableHeaders = [
    'Member Email',
    'Member Address',
    'Paid from',
    'Amount',
    'Paid on',
    'Actions',
  ];

  React.useEffect(() => {
    if (!workspace) {
      router.push('/');
    };
  });

  const historyTablePlaceholders = [
    {
      email: 'madahavan@creatos.co',
      reviewerAddress: '0xa2dDFc8a6C1F8868B80F2747D04532a6cDE9804d',
      payerAddress: '0x0c9ccbada1411687f6ffa7df317af35b16b1fe0c',
      txnAddress: '0xc9773e119fb6b4ec6f47d1637fc42ea2116fa6fa6a1577f00ed255a64b4f5956',
      paidDate: '25th April 2022',
      amount: '100 DAI',
    },
    {
      email: 'vitalik@vitalik.co',
      reviewerAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      payerAddress: '0x0c9ccbada1411687f6ffa7df317af35b16b1fe0c',
      txnAddress: '0xc9773e119fb6b4ec6f47d1637fc42ea2116fa6fa6a1577f00ed255a64b4f5956',
      paidDate: '25th April 2022',
      amount: '1 ETH',
    },
    {
      email: 'dhairya@creator.os',
      reviewerAddress: '0x0CC3a9E0d0f958367168e5cdf2d1f35F7c54F875',
      payerAddress: '0x0c9ccbada1411687f6ffa7df317af35b16b1fe0c',
      txnAddress: '0xc9773e119fb6b4ec6f47d1637fc42ea2116fa6fa6a1577f00ed255a64b4f5956',
      paidDate: '25th April 2022',
      amount: '200 USDC',
    },
  ];

  const historyTableData = historyTablePlaceholders.map((paidData: any) => ({
    email: paidData.email,
    reviewerAddress: paidData.reviewerAddress,
    payerAddress: paidData.payerAddress,
    paidDate: paidData.paidDate,
    amount: paidData.amount,
  }));

  React.useEffect(() => {
    if (payMode === -1) {
      setPaymentOutside(false);
    }
  }, [payMode]);

  return (
    <Flex direction="column" align="start" w="100%">
      <Flex direction="row" w="full" justify="space-between">
        <Text
          fontStyle="normal"
          fontWeight="bold"
          fontSize="18px"
          lineHeight="26px"
        >
          Manage Payouts
        </Text>
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start" direction="column">
        <Tabs
          index={tabIndex}
          variant="soft-rounded"
          align="start"
          w="100%"
        >
          <TabList>
            <Tab
              borderColor="#AAAAAA"
              color="#AAAAAA"
              _focus={{
                boxShadow: 'none',
                border: '1px solid',
                borderColor: '#8850EA',
              }}
              _active={{
                boxShadow: 'none',
                border: '1px solid',
                borderColor: '#8850EA',
              }}
              onClick={() => setTabIndex(0)}
            >
              Outstanding
              {' '}
              {!workspace ? 0 : workspace!.members.map((data: any) => data.outstandingReviewIds.length !== 0 && `(${data.outstandingReviewIds.length})`)}
            </Tab>
            <Tab
              borderColor="#AAAAAA"
              color="#AAAAAA"
              _focus={{
                boxShadow: 'none',
                border: '1px solid',
                borderColor: '#8850EA',
              }}
              _active={{
                boxShadow: 'none',
                border: '1px solid',
                borderColor: '#8850EA',
              }}
              onClick={() => setTabIndex(1)}
            >
              History
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid
                gridAutoFlow="column"
                gridTemplateColumns="repeat(5, 1fr)"
                w="100%"
                justifyItems="center"
                alignContent="center"
                py={4}
                px={5}
              >
                {' '}
                {tableHeaders.map((header) => (
                  <Text
                    w="fit-content"
                    variant="tableHeader"
                  >
                    {header}
                  </Text>
                ))}
              </Grid>
              <Flex
                direction="column"
                w="100%"
                border="1px solid #D0D3D3"
                borderRadius={4}
              >
                {!workspace ? null : workspace!.members.map((data: any, index: number) => data.outstandingReviewIds.length !== 0 && (
                    <Flex>
                      <Grid
                        gridAutoFlow="column"
                        gridTemplateColumns="repeat(5, 1fr)"
                        w="100%"
                        justifyItems="center"
                        alignContent="center"
                        bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
                        py={4}
                        px={5}
                      >
                        <Text
                          minW="fit-content"
                          variant="tableBody"
                          justifySelf="left"
                          alignSelf="center"
                        >
                          {' '}
                          {data.email.length > 16 ?

                          <Tooltip label={data.email}>
                            <Flex alignSelf="center" alignItems="center">
                              <Text alignSelf="center" textAlign="center" variant="tableBody">
                                {trimAddress(data.email, 12)}
                              </Text>
                              <Box mr="7px" />
                            </Flex>
                          </Tooltip> : data.email}

                        </Text>
                        <Tooltip label={data.actorId}>
                          <Flex alignItems="center">
                            <Text textAlign="center" variant="tableBody">
                              {trimAddress(data.actorId, 4)}
                            </Text>
                            <Box mr="7px" />
                            <CopyIcon h="0.75rem" text={data.actorId} />
                          </Flex>
                        </Tooltip>
                        <Text
                          minW="fit-content"
                          variant="tableBody"
                          alignSelf="center"
                        >
                          {new Date(data.lastReviewSubmittedAt * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }
                        </Text>
                        <Text                           alignSelf="center"
variant="tableBody">{data.outstandingReviewIds.length}</Text>
                        <Flex direction="row" gap="0.5rem">
                          <Button
                            variant="outline"
                            color="brand.500"
                            fontWeight="500"
                            fontSize="14px"
                            lineHeight="14px"
                            textAlign="center"
                            borderRadius={8}
                            borderColor="brand.500"
                            height="2rem"
                            onClick={() => {
                              payModal.onOpen();
                              setPayMode(2);
                              setSelectedData(data);
                            }}
                          >
                            Mark as done
                          </Button>
                          <Button
                            variant="primary"
                            fontWeight="500"
                            fontSize="14px"
                            lineHeight="14px"
                            textAlign="center"
                            height="2rem"
                            px={3}
                            onClick={() => {
                              payModal.onOpen();
                              setPayMode(-1);
                              setSelectedData(data);
                            }}
                          >
                            Pay now
                          </Button>
                        </Flex>
                      </Grid>

                      <Modal
                        isOpen={payModal.isOpen}
                        onClose={payModal.onClose}
                        title={`${
                          // eslint-disable-next-line no-nested-ternary
                          payMode === -1
                            ? 'Pay From'
                            // eslint-disable-next-line no-nested-ternary
                            : payMode === 0 || (payMode === 1 && !paymentOutside)
                              ? 'Pay Reviewer'
                              // eslint-disable-next-line no-nested-ternary
                              : payMode === 2
                                ? 'Fill Payment Details'
                                // eslint-disable-next-line no-nested-ternary
                                : paymentOutside
                              && payMode === 1
                              && 'Pay from external wallet'
                        }`}
                        leftIcon={
                          payMode !== -1 && (
                            <IconButton
                              mr="1rem"
                              ml="-1rem"
                              aria-label="Back"
                              variant="ghost"
                              _hover={{}}
                              _active={{}}
                              icon={
                                <Image src="/ui_icons/black/chevron_left.svg" />
                              }
                              onClick={() => {
                                setPayMode(-1);
                                setPaymentOutside(false);
                              }}
                              _focus={{ boxShadow: 'none' }}
                            />
                          )
                        }
                      >
                        <Flex direction="column" pb="1rem" mx="2rem">
                          {payMode === -1 && (
                            <Text pt="1rem">
                              Select a wallet to process this transaction
                            </Text>
                          )}
                          {payMode === -1
                            ? payOptions.map((option, ind) => (
                              <Button
                                border="1px solid"
                                borderColor="#6A4CFF"
                                borderRadius="0.5rem"
                                bgColor="rgba(149, 128, 255, 0.1)"
                                onClick={() => {
                                  setPayMode(ind);
                                }}
                                p="1.5rem"
                                h="4.5rem"
                                mt="2rem"
                              >
                                <Flex
                                  w="100%"
                                  justify="space-between"
                                  align="center"
                                >
                                  <Flex>
                                    <Text variant="tableBody" color="#8850EA">
                                      {option}
                                      {' '}
                                    </Text>
                                    <Tooltip
                                      label={`${
                                        ind === 0
                                          ? 'The reward will go through our smart contract directly into the reviewer wallet'
                                          : 'You will have to send the reviewer rewards separately'
                                      }`}
                                      fontSize="md"
                                    >
                                      <Image
                                        ml={2}
                                        display="inline-block"
                                        alt="another_wallet"
                                        src="/ui_icons/info_brand_light.svg"
                                        color="#8850EA"
                                      />
                                    </Tooltip>
                                  </Flex>
                                  <IconButton
                                    aria-label="right_chevron"
                                    variant="ghost"
                                    _hover={{}}
                                    _active={{}}
                                    w="13px"
                                    h="6px"
                                    icon={
                                      <Image src="/ui_icons/brand/chevron_right.svg" />
                                      }
                                    onClick={() => {
                                      setPayMode(ind);
                                    }}
                                  />
                                </Flex>
                              </Button>
                            ))
                            : null}
                        </Flex>

                        <PayoutModalContent
                          payMode={payMode}
                          setPayMode={setPayMode}
                          reviewerAddress={selectedData?.actorId}
                          reviews={selectedData?.outstandingReviewIds.length}
                          onClose={payModal.onClose}
                          paymentOutside={paymentOutside}
                          setPaymentOutside={setPaymentOutside}
                          setTabIndex={setTabIndex}
                        />
                      </Modal>
                    </Flex>
                  ))}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Grid
                gridAutoFlow="column"
                gridTemplateColumns="repeat(5, 1fr)"
                w="100%"
                justifyItems="center"
                alignContent="center"
                py={4}
                px={5}
              >
                {' '}
                {historyTableHeaders.map((header) => (
                  <Text w="fit-content" variant="tableHeader">
                    {header}
                  </Text>
                ))}
              </Grid>
              <Flex
                direction="column"
                w="100%"
                border="1px solid #D0D3D3"
                borderRadius={4}
              >
                {historyTableData.map((data: any, index: number) => (
                  <Flex>
                    {data.reviewerAddress === null ? null : (
                      <Grid
                        gridAutoFlow="column"
                        gridTemplateColumns="repeat(5, 1fr)"
                        w="100%"
                        justifyItems="center"
                        alignContent="center"
                        bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
                        py={4}
                        px={5}
                      >
                        <Text
                          minW="fit-content"
                          variant="tableBody"
                          justifySelf="left"
                        >
                          {' '}
                          {data.email}
                        </Text>
                        <Tooltip label={data.reviewerAddress}>
                          <Flex alignItems="center">
                            <Text textAlign="center" variant="tableBody">
                              {data.reviewerAddress !== ''
                                && trimAddress(data.reviewerAddress, 4)}
                            </Text>
                            <Box mr="7px" />
                            <CopyIcon h="0.75rem" text={data.reviewerAddress} />
                          </Flex>
                        </Tooltip>
                        <Text textAlign="center" variant="tableBody">
                          {data.payererAddress !== ''
                            && trimAddress(data.payerAddress, 4)}
                        </Text>

                        <Text variant="tableBody">{data.amount}</Text>
                        <Text variant="tableBody">{data.paidDate}</Text>

                        <Flex direction="row">
                          <Link
                            href={`https://www.etherscan.io/tx/${data.txnAddress}`}
                            isExternal
                          >
                            View
                            {' '}
                            <Image
                              display="inline-block"
                              h="10px"
                              w="10px"
                              src="/ui_icons/link.svg"
                            />
                          </Link>
                        </Flex>
                      </Grid>
                    )}
                  </Flex>
                ))}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}

export default Payouts;
