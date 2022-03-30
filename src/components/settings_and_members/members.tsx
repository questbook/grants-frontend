import {
  Flex, Text, Button, Tooltip, Box,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { getTextWithEllipses } from 'src/utils/formattingUtils';
import CopyIcon from '../ui/copy_icon';
import Modal from '../ui/modal';
import ModalContent from './modalContent';

interface Props {
  workspaceMembers: any;
}

function Members({ workspaceMembers }: Props) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tableData, setTableData] = React.useState<any>(null);
  const flex = [0.2741, 0.1544, 0.2316, 0.2403, 0.0994];
  const tableHeaders = [
    'Member Address',
    'Role',
    'Added on',
    'Added by',
    'Actions',
  ];
  const tableDataFlex = [0.2622, 0.1632, 0.2448, 0.2591, 0.0734];

  useEffect(() => {
    if (!workspaceMembers) return;
    const tempTableData = workspaceMembers.map((member: any) => ({
      memberAddress: member.actorId,
      role: 'Admin',
    }));
    setTableData(tempTableData);
  }, [workspaceMembers]);

  return (
    <Flex direction="column" align="start" w="100%">
      <Flex direction="row" w="full" justify="space-between">
        <Text
          fontStyle="normal"
          fontWeight="bold"
          fontSize="18px"
          lineHeight="26px"
        >
          Manage Members
        </Text>
        <Button variant="primaryCta" onClick={() => setIsModalOpen(true)}>
          Invite New
        </Button>
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
                <Tooltip label={data.memberAddress}>
                  <Flex flex={tableDataFlex[0]}>
                    <Text variant="tableBody">
                      {getTextWithEllipses(data.memberAddress, 16)}
                    </Text>
                    <Box mr="7px" />
                    <CopyIcon text={data.memberAddress} />
                  </Flex>
                </Tooltip>
                <Text flex={tableDataFlex[1]} variant="tableBody">
                  {data.role}
                </Text>
                <Text flex={tableDataFlex[2]} variant="tableBody">
                  24 January, 2021
                </Text>
                <Tooltip label={data.memberAddress}>
                  <Flex flex={tableDataFlex[3]}>
                    <Text variant="tableBody">
                      {getTextWithEllipses(data.memberAddress, 16)}
                    </Text>
                    <Box mr="7px" />
                    <CopyIcon text={data.memberAddress} />
                  </Flex>
                </Tooltip>
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
                  >
                    Edit
                  </Button>
                </Box>
              </Flex>
            ))}
        </Flex>
      </Flex>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite Member"
      >
        <ModalContent
          onClose={(newMember: { memberAddress: string; role: string }) => {
            if (tableData && tableData.length > 0) {
              setTableData([...tableData, newMember]);
            } else {
              setTableData([newMember]);
            }
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </Flex>
  );
}

export default Members;
