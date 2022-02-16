import {
  ModalBody, Flex, Text, Button, Box, Image, Heading,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  onClose: () => void;
}

function ModalContent({
  onClose,
}: Props) {
//   const [details, setDetails] = useState('');
//   const [detailsError, setDetailsError] = useState(false);

  return (
    <ModalBody>
      <Flex direction="column" justify="start" align="center">
        <Image w="127px" h="147px" src="/illustrations/done.svg" />
        <Heading mt={8} textAlign="center" variant="applicationHeading">
          You have marked the Milestone 1 as done.
        </Heading>
        <Text mt={4} textAlign="center" variant="applicationText">
          You will shortly receive a confirmation and reward if any from the grant publisher.
        </Text>
        <Button w="100%" variant="primary" mt={10} onClick={onClose}>OK</Button>
        <Box mb={4} />
      </Flex>
    </ModalBody>
  );
}

export default ModalContent;
