import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { useAccount, useNetwork } from 'wagmi';
import {
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import { errorCodes, getMessageFromCode } from 'eth-rpc-errors';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useWorkspaceRegistryContract from './contracts/useWorkspaceRegistryContract';

export default function useAddMember(
  data: any,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { workspace } = apiClients;

  const currentChainId = useChainId();
  const workspaceRegistryContract = useWorkspaceRegistryContract(currentChainId);

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setError(undefined);
    }
  }, [data]);

  useEffect(() => {
    if (error) return;
    if (loading) return;
    // console.log('calling createGrant');

    async function validate() {
      setLoading(true);
      // console.log('calling validate');
      console.log(data);
      try {
        const updateTransaction = await workspaceRegistryContract.addWorkspaceAdmins(
          workspace!.id,
          data.memberAddress,
          data.memberEmail,
        );
        const updateTransactionData = await updateTransaction.wait();

        setTransactionData(updateTransactionData);
        setLoading(false);
      } catch (e: any) {
        console.log('Error: ', e);
        const message = e.code === errorCodes.rpc.internal ? e.data.message : getMessageFromCode(e.code, e.message);
        console.log('Error message: ', message);
        setError(message);
        setLoading(false);
        toastRef.current = toast({
          position: 'top',
          render: () => ErrorToast({
            content: message,
            close: () => {
              if (toastRef.current) {
                toast.close(toastRef.current);
              }
            },
          }),
        });
      }
    }
    try {
      if (!data) return;
      if (transactionData) return;
      if (!accountData || !accountData.address) {
        throw new Error('not connected to wallet');
      }
      if (!currentChainId) {
        throw new Error('not connected to valid network');
      }
      if (!workspace) {
        throw new Error('not connected to workspace');
      }
      if (getSupportedChainIdFromWorkspace(workspace) !== currentChainId) {
        throw new Error('connected to wrong network');
      }
      if (
        !workspaceRegistryContract
        || workspaceRegistryContract.address
          === '0x0000000000000000000000000000000000000000'
        || !workspaceRegistryContract.signer
        || !workspaceRegistryContract.provider
      ) {
        return;
      }
      validate();
    } catch (e: any) {
      console.log('Error: ', e);
      const message = e.code === errorCodes.rpc.internal ? e.data.message : getMessageFromCode(e.code, e.message);
      console.log('Error message: ', message);
      setError(message);
      setLoading(false);
      toastRef.current = toast({
        position: 'top',
        render: () => ErrorToast({
          content: message,
          close: () => {
            if (toastRef.current) {
              toast.close(toastRef.current);
            }
          },
        }),
      });
    }
  }, [
    error,
    loading,
    toast,
    transactionData,
    workspaceRegistryContract,
    workspace,
    accountData,
    networkData,
    currentChainId,
    data,
  ]);

  return [transactionData, loading];
}
