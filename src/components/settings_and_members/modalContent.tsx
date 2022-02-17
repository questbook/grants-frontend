import {
  ModalBody, Button, Text, Box, useToast,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useContract, useSigner } from 'wagmi';
import SingleLineInput from '../ui/forms/singleLineInput';
import config from '../../constants/config';
import WorkspaceRegistryABI from '../../contracts/abi/WorkspaceRegistryAbi.json';
import { ApiClientsContext } from '../../../pages/_app';

interface Props {
  onClose: () => void;
}

function ModalContent({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
}: Props) {
  const [memberAddress, setMemberAddress] = React.useState('');
  const [memberEmail, setMemberEmail] = React.useState('');
  const [signerStates] = useSigner();
  const toast = useToast();
  const workspaceFactoryContract = useContract({
    addressOrName: config.WorkspaceRegistryAddress,
    contractInterface: WorkspaceRegistryABI,
    signerOrProvider: signerStates.data,
  });
  const workspaceId = useContext(ApiClientsContext)?.workspaceId;

  const addMember = async () => {
    if (!memberAddress || memberAddress.length === 0) return;

    toast({
      title: 'Adding member',
      status: 'info',
      duration: 9000,
      isClosable: true,
    });
    try {
      const txn = await workspaceFactoryContract.addWorkspaceAdmins(workspaceId, [memberAddress], [memberEmail ?? '']);
      await txn.wait();
      toast({
        title: 'Member added',
        status: 'info',
        duration: 9000,
        isClosable: true,
      });
    } catch (e: any) {
      toast({
        title: e.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
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
          setMemberAddress(e.target.value);
        }}
        isError={false}
      />
      <Box my={4} />
      <SingleLineInput
        label="Email address (optional)"
        placeholder="name@sample.com"
        subtext=""
        value={memberEmail}
        onChange={(e) => {
          setMemberEmail(e.target.value);
        }}
        isError={false}
      />
      <Box my={8} />
      <Button w="100%" variant="primary" onClick={addMember}>Send Invite</Button>
      <Box my={8} />
    </ModalBody>
  );
}

export default ModalContent;
