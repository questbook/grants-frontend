import {
  ModalBody, Button, Text, Box, useToast, Flex, Image, Link,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { isValidAddress, isValidEmail } from 'src/utils/validationUtils';
import useAddMember from 'src/hooks/useAddMember';
import SingleLineInput from '../ui/forms/singleLineInput';
import Loader from '../ui/loader';

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
  const toast = useToast();

  const [memberData, setMemberData] = React.useState<any>();
  const [txnData, loading] = useAddMember(memberData);

  useEffect(() => {
    // console.log(depositTransactionData);
    if (txnData) {
      setMemberData(undefined);
      onClose();
      toast({
        title: 'Member added',
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast, txnData]);

  const handleSubmit = async () => {
    let hasError = false;

    if (!memberAddress || memberAddress.length === 0 || !isValidAddress(memberAddress)) {
      setMemberAddressError(true);
      hasError = true;
    }

    if (!memberEmail || memberEmail.length === 0 || !isValidEmail(memberEmail)) {
      setMemberEmailError(true);
      hasError = true;
    }

    if (hasError) return;

    setMemberData({
      memberAddress: [memberAddress],
      memberEmail: [memberEmail ?? ''],
    });
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
      <Button w="100%" py={loading ? 2 : 0} variant="primary" onClick={loading ? () => {} : () => handleSubmit()}>{loading ? <Loader /> : 'Send Invite'}</Button>
      <Box my={8} />
    </ModalBody>
  );
}

export default ModalContent;
