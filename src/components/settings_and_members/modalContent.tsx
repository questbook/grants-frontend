import {
  ModalBody, Button, Text, Box, useToast, Flex, Image, Link, ToastId,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { isValidAddress, isValidEmail } from 'src/utils/validationUtils';
import useAddMember from 'src/hooks/useAddMember';
import SingleLineInput from '../ui/forms/singleLineInput';
import Loader from '../ui/loader';
import InfoToast from '../ui/infoToast';
import Badge from '../ui/badge';
import roles from './roles';
import MemberProps from './memberProps';

interface Props {
  onClose: (member: MemberProps, shouldRevoke?: boolean) => void;
  isEdit: boolean,
  member?: MemberProps;
  setRevokeModalOpen: (v: boolean) => void;
}

function ModalContent({
  onClose, isEdit, member, setRevokeModalOpen,
}: Props) {
  const [memberAddress, setMemberAddress] = React.useState(member?.address || '');
  const [memberAddressError, setMemberAddressError] = React.useState(false);

  const [memberEmail, setMemberEmail] = React.useState(member?.email || '');
  const [memberEmailError, setMemberEmailError] = React.useState(false);
  const toast = useToast();

  const [memberData, setMemberData] = React.useState<any>();
  const [txnData, txnLink, loading] = useAddMember(memberData);

  const [role, setRole] = React.useState<string>(member?.role || roles[0].value);
  // const [isReviewer, setIsReviewer] = React.useState(member?.role === 'Reviewer');

  const toastRef = React.useRef<ToastId>();
  useEffect(() => {
    // console.log(depositTransactionData);
    if (txnData) {
      const newMemberAddress = memberData.memberAddress[0];
      const newMemberEmail = memberData.memberEmail[0];
      setMemberData(undefined);
      onClose({
        address: newMemberAddress,
        email: newMemberEmail,
        role: roles.find((r) => r.value === role)?.value ?? '',
      });
      toastRef.current = toast({
        position: 'top',
        render: () => (
          <InfoToast
            link={txnLink}
            close={() => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            }}
          />
        ),
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

    if (!memberEmail || memberEmail.length || !isValidEmail(memberEmail)) {
      setMemberEmailError(true);
      hasError = true;
    }

    if (hasError) return;

    setMemberData({
      memberAddress: [memberAddress],
      memberEmail: [memberEmail ?? ''],
      memberRole: [role],
    });
  };

  return (
    <ModalBody>
      <Text>
        {isEdit
          ? 'You can either change the access given to this member or choose to revoke access. '
          : 'Enter the wallet address of the member you would like to invite.'}
      </Text>
      <Box my={8} />
      <SingleLineInput
        label="Address *"
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
      <Box my="31px" />
      <SingleLineInput
        label="Email address *"
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
      <Box my="31px" />
      <Flex flex={1} direction="column">
        <Text lineHeight="20px" fontWeight="bold">
          Role *
        </Text>
      </Flex>
      <Flex mt={1} maxW="420px">
        {roles.map((r) => (
          <>
            <Badge
              isActive={r.value === role}
              onClick={() => setRole(r.value)}
              label={r.label}
              inActiveVariant="solid"
              tooltip={r.tooltip}
            />
            {r.index < roles.length - 1 && <Box mr={4} />}
          </>
        ))}
      </Flex>
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
      <Flex direction="row" justify="stretch">
        {isEdit && (
        <Button
          w="48%"
          variant="link"
          color="brand.500"
          onClick={() => {
            onClose({
              address: memberAddress,
              email: memberEmail,
              role,
            }, true);
            setRevokeModalOpen(true);
          }}
        >
          Revoke Access
          {' '}
          <Image ml={2} src="/ui_icons/revoke_access.svg" display="inline-block" />
        </Button>
        )}
        {isEdit && <Box mx="auto" />}
        <Button
          w={isEdit ? '48%' : '100%'}
          py={loading ? 2 : 0}
          variant="primary"
          onClick={loading ? () => {} : () => handleSubmit()}
        >
          {loading ? <Loader /> : 'Send Invite'}
        </Button>
      </Flex>
      <Box my={8} />
    </ModalBody>
  );
}

ModalContent.defaultProps = {
  member: {},
};

export default ModalContent;
