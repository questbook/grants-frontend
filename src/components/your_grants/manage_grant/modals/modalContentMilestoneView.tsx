import {
  ModalBody, Flex, Text, Button, Box, Heading,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  onClose: () => void;
}

function ModalContent({
  onClose,
}: Props) {
  return (
    <ModalBody>
      <Flex direction="column" justify="start" align="start">
        <Text variant="applicationText">Feature complete and deployed onto testnet.</Text>
        <Heading mt={6} variant="applicationHeading">
          You marked it as done on September 5, 2022.
        </Heading>
        <Heading mt={8} variant="applicationHeading">
          Milestone Summary
        </Heading>
        <Text mt={4} variant="applicationText">
          A tool, script or tutorial to set up monitoring for miner GPU, CPU, & memory.
        </Text>
        <Button w="100%" variant="primary" mt={10} onClick={onClose}>OK</Button>
        <Box mb={4} />
      </Flex>
    </ModalBody>
  );
}

export default ModalContent;
