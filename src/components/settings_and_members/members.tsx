import {
  Flex, Text, Button,
} from '@chakra-ui/react';
import React from 'react';
import Modal from '../ui/modal';
import ModalContent from './modalContent';

function Members() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const flex = [0.68, 0.32];
  const tableHeaders = ['Member Address', 'Role'];
  const tableData = [
    {
      member_address: '0xb794f5e....74279579268',
      role: 'Admin',
    },
    {
      member_address: '0xb794f5e....74279579268',
      role: 'Admin',
    },
    {
      member_address: '0xb794f5e....74279579268',
      role: 'Admin',
    },
    {
      member_address: '0xb794f5e....74279579268',
      role: 'Admin',
    }];

  return (
    <Flex direction="column" align="start" w="100%">
      <Flex direction="row" w="full" justify="space-between">
        <Text fontStyle="normal" fontWeight="bold" fontSize="18px" lineHeight="26px">Manage Members</Text>
        <Button variant="primaryCta" onClick={() => setIsModalOpen(true)}>Invite New</Button>
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start" direction="column">
        <Flex direction="row" w="100%" justify="strech" align="center" py={2}>
          {tableHeaders.map((header, index) => (<Text flex={flex[index]} variant="tableHeader">{header}</Text>))}
        </Flex>
        <Flex direction="column" w="100%" border="1px solid #D0D3D3" borderRadius={4}>
          {tableData.map((data, index) => (
            <Flex direction="row" w="100%" justify="stretch" align="center" bg={index % 2 === 0 ? '#F7F9F9' : 'white'} py={4}>
              <Text ml={7} flex={flex[0]} variant="tableBody">{data.member_address}</Text>
              <Text flex={flex[1]} variant="tableBody">{data.role}</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Member">
        <ModalContent onClose={() => setIsModalOpen(false)} />
      </Modal>
    </Flex>
  );
}

export default Members;
