import {
  ModalBody, Button, Text, Box, Flex, Image, Link, Center, CircularProgress,
} from '@chakra-ui/react';
import React from 'react';
import { isValidAddress, isValidEmail } from 'src/utils/validationUtils';
import { useDaoContext } from 'src/context/daoContext';
import SingleLineInput from '../ui/forms/singleLineInput';

interface Props {
  onClose: () => void;
}

function ModalContent({
  onClose,
}: Props) {
  const [memberAddress, setMemberAddress] = React.useState('');
  const [memberAddressError, setMemberAddressError] = React.useState(false);

  const [memberEmail, setMemberEmail] = React.useState('');
  const [memberEmailError, setMemberEmailError] = React.useState(false);

  const { addWorkspaceAdmins, addingMember } = useDaoContext();
  const addMember = async () => {
    let hasError = false;

    if (!memberAddress || memberAddress.length === 0 || !isValidAddress(memberAddress)) {
      setMemberAddressError(true);
      hasError = true;
    }

    if (memberEmail && memberEmail.length !== 0 && !isValidEmail(memberEmail)) {
      setMemberEmailError(true);
      hasError = true;
    }

    if (hasError) return;

    await addWorkspaceAdmins({ memberAddress, memberEmail });
    onClose();
  };

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
        value={memberAddress}
        onChange={(e) => {
          if (memberAddressError) {
            setMemberAddressError(false);
          }
          setMemberAddress(e.target.value);
        }}
        isError={memberAddressError}
        errorText="Address required with proper format"
      />
      <Box my={4} />
      <SingleLineInput
        label="Email address (optional)"
        placeholder="name@sample.com"
        subtext=""
        value={memberEmail}
        onChange={(e) => {
          if (memberEmailError) {
            setMemberEmailError(false);
          }
          setMemberEmail(e.target.value);
        }}
        isError={memberEmailError}
        errorText="Required email address in proper format"
        type="email"
      />
      <Flex direction="row" mt={6}>
        <Text textAlign="left" variant="footer" fontSize="12px">
          <Image display="inline-block" src="/ui_icons/info.svg" alt="pro tip" mb="-2px" />
          {' '}
          By pressing Send Invite you&apos;ll have to approve this transaction in your wallet.
          {' '}
          <Link href="https://www.notion.so/questbook/FAQs-206fbcbf55fc482593ef6914f8e04a46" isExternal>Learn more</Link>
          {' '}
          <Image
            display="inline-block"
            src="/ui_icons/link.svg"
            alt="pro tip"
            mb="-1px"
            h="10px"
            w="10px"
          />
        </Text>
      </Flex>
      <Box my={4} />
      {
  addingMember ? (

    <Center>
      <CircularProgress isIndeterminate color="brand.500" size="48px" mt={4} />
    </Center>
  ) : (
    <Button w="100%" variant="primary" onClick={addMember}>Send Invite</Button>

  )
    }
      <Box my={8} />
    </ModalBody>
  );
}

export default ModalContent;
