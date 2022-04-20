import {
  Flex, ModalBody, Text, Box, Image,
} from '@chakra-ui/react';
import React from 'react';
import Modal from './modal';

interface Props {
  hiddenModalOpen: boolean;
  setHiddenModalOpen: (hiddenModalOpen: boolean) => void;
}

function AllowAccessToPublicKeyModal({
  hiddenModalOpen,
  setHiddenModalOpen,
}: Props) {
  return (
    <Modal
      isOpen={hiddenModalOpen}
      onClose={() => setHiddenModalOpen(false)}
      title=""
      modalWidth={719}
    >
      <ModalBody px={10}>
        <Flex direction="column">
          <Flex mt="36px">
            <Text fontWeight="bold" fontSize="18px">
              How does this work?
            </Text>
          </Flex>
          <Flex mt="28px" alignItems="center">
            <Box
              bg="#8850EA"
              color="#fff"
              h={10}
              w={10}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="50%"
              mr="19px"
              flexShrink={[0]}
            >
              1
            </Box>
            <Text>
              Once you give access to your public key, you will be able to view
              the applicant personal info (email, and about team).
            </Text>
          </Flex>
          <Flex alignItems="center" mt="35px">
            <Box
              bg="#8850EA"
              color="#fff"
              h={10}
              w={10}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="50%"
              mr="19px"
              flexShrink={[0]}
            >
              2
            </Box>
            <Text>After clicking “Continue”  open your wallet and click ‘Provide’.</Text>
          </Flex>
          <Flex alignItems="center" mt="35px" mb="40px">
            <Box
              bg="#8850EA"
              color="#fff"
              h={10}
              w={10}
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="50%"
              mr="19px"
              flexShrink={[0]}
            >
              3
            </Box>
            <Text>Click “Confirm” to confirm the transaction.</Text>
          </Flex>
          <Text mt={8} variant="footer" fontSize="14px" fontWeight="medium" lineHeight="20px">
            <Image
              display="inline-block"
              src="/ui_icons/info.svg"
              alt="pro tip"
              mb="-2px"
            />
            {' '}
            By pressing Continue you&apos;ll have to approve this transaction in your wallet.
          </Text>
        </Flex>
      </ModalBody>
    </Modal>
  );
}

export default AllowAccessToPublicKeyModal;
