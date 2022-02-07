import {
  ModalBody, Flex, Text, Button, Box,
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
      <Flex direction="column" justify="start" align="stretch">
        <Text textAlign="center" variant="applicationText">
          Add a brief summary of what was achieved in the grant,
          appreciation for the team and links to show the proof of work.
        </Text>
        <Flex mt={8} w="100%">
          <MultiLineInput
            label="Grant Completion Summary"
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
        <Button w="100%" variant="primary" mt={6} onClick={onClose}>
          Mark Grant as Done
        </Button>
        <Box mb={4} />
      </Flex>
    </ModalBody>
  );
}

export default ModalContent;
