import {
  Flex, Text, Button,
} from '@chakra-ui/react';
import React from 'react';
import Modal from '../ui/modal';
import ModalContent from './modalContent';

function Members() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <Flex direction="column" align="start" w="100%">
      <Flex direction="row" w="full" justify="space-between">
        <Text fontStyle="normal" fontWeight="bold" fontSize="18px" lineHeight="26px">Manage Members</Text>
        <Button variant="primaryCta" onClick={() => setIsModalOpen(true)}>Invite New</Button>
      </Flex>
      <Flex w="100%" mt={8} alignItems="flex-start" direction="column">
        <Flex direction="row" w="100%" justify="strech" align="center" px={10} py={6}>
          <Text flex={2} variant="tableHeader">Member Address</Text>
          <Text flex={1} variant="tableHeader">Role</Text>
        </Flex>
        <Flex direction="column" w="100%" border="1px solid #D0D3D3" borderRadius={4}>
          <Flex direction="row" w="100%" justify="stretch" align="center" bg="#F7F9F9" px={8} py={4}>
            <Text flex={2} variant="tableBody">0xb794f5e....74279579268 (You)</Text>
            <Text flex={1} variant="tableBody">Admin</Text>
          </Flex>
          <Flex direction="row" w="100%" justify="stretch" align="center" px={8} py={4}>
            <Text flex={2} variant="tableBody">0xb794f5e....74279579268</Text>
            <Text flex={1} variant="tableBody">Admin</Text>
          </Flex>
        </Flex>
      </Flex>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Member">
        <ModalContent onClose={() => setIsModalOpen(false)} />
      </Modal>
    </Flex>
  );
}

export default Members;
