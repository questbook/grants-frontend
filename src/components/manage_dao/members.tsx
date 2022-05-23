import {
  Grid, Flex, Text, Button, Tooltip, Box,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import {
  trimAddress,
  getFormattedDateFromUnixTimestampWithYear,
} from 'src/utils/formattingUtils';
import CopyIcon from '../ui/copy_icon';
import Modal from '../ui/modal';
// import ConfirmationModalContent from './confirmationModalContent';
import ModalContent from './modalContent';
import roles from './roles';

interface Props {
  workspaceMembers: any;
}

function Members({ workspaceMembers }: Props) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [tableData, setTableData] = React.useState<any>(null);
  const tableHeaders = [
    'Email',
    'Member Address',
    'Role',
    'Added on',
    'Added by',
    'Actions',
  ];
  const tableDataFlex = [0.2622, 0.1632, 0.2448, 0.2591, 0.0734];

  const handleEmptyEmail = (email?: string) => {
    if (email) return email;
    return '-';
  }

  useEffect(() => {
    console.log(workspaceMembers);

    if (!workspaceMembers) return;
    const tempTableData = workspaceMembers.map((member: any) => ({
      address: member.actorId,
      role: member.accessLevel,
      email: member.email,
      updatedAt: member.updatedAt,
      addedBy: member.addedBy.actorId,
    }));
    setTableData(tempTableData);
  }, [workspaceMembers]);

  const [isEdit, setIsEdit] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(-1);

  // const [revokeModalOpen, setRevokeModalOpen] = React.useState(false);

  React.useEffect(() => {
    console.log(tableData);
  }, [tableData]);

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
        <Button
          variant="primaryCta"
          onClick={() => {
            setIsEdit(false);
            setIsModalOpen(true);
          }}
        >
          Invite New
        </Button>
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start" direction="column">
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
            <Text variant="tableHeader">{header}</Text>
          ))}
        </Grid>
        <Flex
          direction="column"
          w="100%"
          border="1px solid #D0D3D3"
          borderRadius={4}
        >
          {tableData
            && tableData.map((data: any, index: number) => (
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
                {data.email?.length > 16 ? (
                  <Tooltip label={data.email}>
                    <Flex alignSelf="center" alignItems="center">
                      <Text
                        alignSelf="center"
                        textAlign="center"
                        variant="tableBody"
                      >
                        {trimAddress(data.email, 12)}
                      </Text>
                      <Box mr="7px" />
                    </Flex>
                  </Tooltip>
                ) : (
                  <Text
                    alignSelf="center"
                    textAlign="center"
                    variant="tableBody"
                  >
                    {handleEmptyEmail(data.email)}
                  </Text>
                )}
                <Tooltip label={data.address}>
                  <Flex alignItems="center">
                    <Text variant="tableBody">
                      {trimAddress(data.address, 4)}
                    </Text>
                    <Box mr="7px" />
                    <CopyIcon text={data.address} />
                  </Flex>
                </Tooltip>
                <Text variant="tableBody">
                  {roles.find((r) => r.value === data.role)?.label ?? 'Admin'}
                </Text>
                <Text variant="tableBody">
                  {getFormattedDateFromUnixTimestampWithYear(data.updatedAt)}
                </Text>
                <Tooltip label={data.address}>
                  <Flex alignItems="center">
                    <Text variant="tableBody">
                      {trimAddress(data.address, 4)}
                    </Text>
                    <Box mr="7px" />
                    <CopyIcon h="0.75rem" text={data.address} />
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
                    onClick={() => {
                      setIsEdit(true);
                      setIsModalOpen(true);
                      setSelectedRow(index);
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </Grid>
            ))}
        </Flex>
      </Flex>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${isEdit ? 'Edit' : 'Invite'} Member`}
      >
        <ModalContent
          onClose={(
            newMember: {
              address: string;
              email: string;
              role: string;
              updatedAt?: number;
              addedBy?: string;
            },
            shouldRevoke?: boolean,
          ) => {
            if (!shouldRevoke) {
              if (tableData && tableData.length > 0) {
                setTableData([
                  ...tableData.filter(
                    (dt: any) => dt.address.toLowerCase()
                      !== newMember.address.toLowerCase(),
                  ),
                  newMember,
                ]);
              } else {
                setTableData([newMember]);
              }
            } else {
              setTableData([
                ...tableData.filter(
                  (dt: any) => dt.address.toLowerCase() !== newMember.address.toLowerCase(),
                ),
              ]);
            }
            setIsEdit(false);
            setIsModalOpen(false);
          }}
          isEdit={isEdit}
          member={{
            address:
              isEdit && selectedRow !== -1
                ? tableData[selectedRow].address
                : '',
            email:
              isEdit && selectedRow !== -1 ? tableData[selectedRow].email : '',
            role:
              isEdit && selectedRow !== -1 ? tableData[selectedRow].role : '',
          }}
        />
      </Modal>
    </Flex>
  );
}

export default Members;
