import {
  ModalBody, Flex, Text, Button, Image, Heading,
} from '@chakra-ui/react';
import React from 'react';
import Loader from 'src/components/ui/loader';

interface Props {
  imagePath: string;
  title: string;
  subtitle: string;
  actionButtonText: string;
  actionButtonOnClick: () => void;
  onClose: () => void;
  loading: boolean;
}

function ModalContent({
  imagePath, title, subtitle, actionButtonText, actionButtonOnClick, onClose, loading,
}: Props) {
  return (
    <ModalBody>
      <Flex direction="column" justify="start" align="center">
        <Image w="131px" h="127px" src={imagePath} />
        <Heading mt={8} textAlign="center" variant="applicationHeading">
          {title}
        </Heading>
        <Text mt={4} textAlign="center" variant="applicationText">
          {subtitle}
        </Text>
        <Flex direction="row" w="100%" justify="space-evenly" mt={10} mb={4}>
          <Button w="45%" variant="resubmit" color="brand.500" _hover={{ background: '#F5F5F5', borderColor: 'brand.500', borderWidth: '2px' }} onClick={onClose}>Cancel</Button>
          <Button
            w="45%"
            variant="primary"
            onClick={() => {
              actionButtonOnClick();
            }}
          >
            {loading ? <Loader /> : actionButtonText}
          </Button>
        </Flex>
      </Flex>
    </ModalBody>
  );
}

export default ModalContent;
