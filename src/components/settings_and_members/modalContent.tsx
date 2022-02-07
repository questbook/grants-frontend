import {
  ModalBody, Button, Text, Box,
} from '@chakra-ui/react';
import React from 'react';
import SingleLineInput from '../ui/forms/singleLineInput';

interface Props {
  onClose: () => void;
}

function ModalContent({
  onClose,
}: Props) {
  return (
    <ModalBody>
      <Text>
        Enter the address of the member you would like to invite.
        Please note: The invited user have will access to your workspace
        - can create grants, invite members, and add funds.
      </Text>
      <Box my={8} />
      <SingleLineInput
        label="Address"
        placeholder="0xb794f5e74279579268"
        subtext=""
        value={undefined}
        onChange={() => {}}
        isError={false}
      />
      <Box my={4} />
      <SingleLineInput
        label="Email address (optional)"
        placeholder="name@sample.com"
        subtext=""
        value={undefined}
        onChange={() => {}}
        isError={false}
      />
      <Box my={8} />
      <Button w="100%" variant="primary" onClick={onClose}>Send Invite</Button>
      <Box my={8} />
    </ModalBody>
  );
}

export default ModalContent;
