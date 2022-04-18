import {
  Image, IconButton, Divider, Flex, Text, Button, Tooltip, Box, ModalContent, useDisclosure
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { getFormattedDateFromUnixTimestampWithYear, getTextWithEllipses } from 'src/utils/formattingUtils';
import CopyIcon from '../ui/copy_icon';
import Modal from '../ui/modal';
// import ConfirmationModalContent from './confirmationModalContent';

interface Props {
  workspaceMembers: any;
}

function Payouts({ workspaceMembers }: Props) {
  const payModal = useDisclosure();
  const [payMode, setPayMode] = React.useState<number>(-1);

  const [tableData, setTableData] = React.useState<any>(null);
  const flex = [0.2741, 0.1544, 0.2316, 0.2403, 0.0994];
  const tableHeaders = [
    'Member Address',
    'Last Review On',
    'Outstanding Payout',
    'Actions',
  ];
  const tableDataFlex = [0.2622, 0.1632, 0.2448, 0.2591, 0.0734];

  const payoutTablePlaceholders = [
    {
      address: "0x0c9ccbada1411687f6ffa7df317af35b16b1fe0c",
      date: "24 January 2022",
      outstanding: 5
    },
    {
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      date: "21 December 2021",
      outstanding: 2
    },
    {
      address: "0x4c6ef0b696325ac6bfe5f597bbc269ad1bd76825",
      date: "10 October 2022",
      outstanding: 10
    },
  ]

  useEffect(() => {
    if (!payoutTablePlaceholders) return;
    const tempTableData = payoutTablePlaceholders.map((payoutData: any) => ({
      address: payoutData.address,
      date: payoutData.date,
      outstanding: payoutData.outstanding
    }));
    setTableData(tempTableData);
  }, [payoutTablePlaceholders]);

  const [isPaid, setIsPaid] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(-1);

  const nextScreenTexts = [
    'Pay from connected wallet',
    'Pay from another wallet',
  ];

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
        <Flex direction="row" w="100%" justify="strech" align="center" py={2}>
          {tableHeaders.map((header, index) => (
            <Text flex={flex[index]} variant="tableHeader">
              {header}
            </Text>
          ))}
        </Flex>
        <Flex
          direction="column"
          w="100%"
          border="1px solid #D0D3D3"
          borderRadius={4}
        >
          {tableData
            && tableData.map((data: any, index: number) => (
              <Flex
                direction="row"
                w="100%"
                justify="stretch"
                align="center"
                bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
                py={4}
                px={7}
              >
                <Tooltip label={data.address}>
                  <Flex flex={tableDataFlex[0]}>
                    <Text variant="tableBody">
                      {getTextWithEllipses(data.address, 16)}
                    </Text>
                    <Box mr="7px" />
                    <CopyIcon text={data.address} />
                  </Flex>
                </Tooltip>
                <Text flex={tableDataFlex[1]} variant="tableBody">
                  {data.date}
                </Text>
                <Text flex={tableDataFlex[2]} variant="tableBody">
                  {data.outstanding}
                </Text>
                <Box flex={tableDataFlex[4]}>
                  <Button
                    variant="outline"
                    color="brand.500"
                    fontWeight="500"
                    fontSize="14px"
                    lineHeight="14px"
                    textAlign="center"
                    borderRadius={8}
                    borderColor="brand.500"
                    height="32px"
                    onClick={() => {
                      setPayMode(1);
                      setSelectedRow(index);
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
                    height="32px"
                    onClick={() => {
                      setPayMode(0);
                      setSelectedRow(index);
                    }}
                  >
                    Pay now
                  </Button>
                </Box>
              </Flex>
            ))}
        </Flex>
      </Flex>

      <Modal
        isOpen={payModal.isOpen}
        onClose={payModal.onClose}
        title={`Pay From`}
      >
        {nextScreenTexts.map((text, index) => (
          <>
            <Flex
              direction="row"
              justify="space-between"
              align="center"
              mx={4}
            >
              <Flex direction="row">
                <Button _active={{}} onClick={() => setPayMode(index)} variant="link" my={4}>
                  <Text variant="tableBody" color="#8850EA">
                    {text}
                    {' '}
                  </Text>
                </Button>
                <Image
                  ml={2}
                  display="inline-block"
                  alt="another_wallet"
                  src="/ui_icons/info_brand_light.svg"
                />
              </Flex>
              <IconButton
                aria-label="right_chevron"
                variant="ghost"
                _hover={{}}
                _active={{}}
                w="13px"
                h="6px"
                icon={<Image src="/ui_icons/brand/chevron_right.svg" />}
                onClick={() => setPayMode(index)}
              />
            </Flex>
            <Divider />
          </>
        ))}
      </Modal>
    </Flex>
  );
}

export default Payouts;
