import {
  ModalBody,
  Flex,
  Image,
  Text,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import Modal from '../../ui/modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function AddFunds({ isOpen, onClose }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Add Funds"
      rightIcon={(
        <Button
          _focus={{}}
          variant="link"
          color="#AA82F0"
          leftIcon={<Image src="/sidebar/discord_icon.svg" />}
        >
          Support 24*7
        </Button>
      )}
      closeOnOverlayClick
    >
      <ModalBody>
        <Flex direction="column" justify="start" align="center">
          <Image h="100px" w="100px" src="/ui_icons/verified_2.svg" />
          <Text
            mt={7}
            textAlign="center"
            fontSize="28px"
            lineHeight="40px"
            fontWeight="700"
          >
            Verified grants = 10x applicants
          </Text>
          <Text variant="applicationText" textAlign="center" mt={2}>
            Add funds to get a verified badge.
          </Text>
          <Text variant="applicationText" textAlign="center" mt={0}>
            Deposit and withdraw funds anytime.
          </Text>
        </Flex>
      </ModalBody>
    </Modal>
  );
}

export default AddFunds;
