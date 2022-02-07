import {
  ModalBody, Flex, Text, Button, Box, Image,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import MultiLineInput from '../../../ui/forms/multiLineInput';

interface Props {
  onClose: () => void;
}

function ModalContent({ onClose }: Props) {
  const [details, setDetails] = useState('');
  const [detailsError, setDetailsError] = useState(false);

  return (
    <ModalBody maxW="521px">
      <Flex direction="column" justify="start" align="center">
        <Text textAlign="center" variant="applicationText">
          Add a brief summary of what was achieved in the milestone, timelines
          and links to show your proof of work.
        </Text>
        <Text mt={8} textAlign="center" variant="applicationText">
          The grant reviewer can see your summary.
        </Text>
        <Flex mt={6} w="100%">
          <MultiLineInput
            label="Milestone Details"
            placeholder="A tool, script or tutorial to set up monitoring for miner GPU, CPU, & memory."
            value={details}
            isError={detailsError}
            onChange={(e) => {
              if (detailsError) {
                setDetailsError(false);
              }
              setDetails(e.target.value);
            }}
            errorText="Required"
            maxLength={300}
          />
        </Flex>
        <Flex direction="row" w="100%" align="start" mt={2}>
          <Image mt={1} src="/ui_icons/info.svg" />
          <Box mr={2} />
          <Text variant="footer">
            By pressing Mark as done you’ll have to approve this transaction in
            your wallet.
            {' '}
            <Button
              variant="link"
              color="brand.500"
              rightIcon={
                <Image ml={1} src="/ui_icons/link.svg" display="inline-block" />
              }
            >
              <Text variant="footer" color="brand.500">
                Learn More
              </Text>
            </Button>
          </Text>
        </Flex>
        <Button w="100%" variant="primary" mt={8} onClick={onClose}>
          Mark as Done
        </Button>
        <Box mb={4} />
      </Flex>
    </ModalBody>
  );
}

export default ModalContent;
