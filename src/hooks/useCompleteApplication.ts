import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { useAccount, useNetwork } from 'wagmi';
import {
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import { getMessageFromCode } from 'eth-rpc-errors';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useApplicationRegistryContract from './contracts/useApplicationRegistryContract';

export default function useCompleteApplication(
  data: any,
  applicationId: string | undefined,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const currentChainId = useChainId();
  const applicationContract = useApplicationRegistryContract(currentChainId);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setError(undefined);
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (error) return;
    if (loading) return;

    async function validate() {
      setLoading(true);
      console.log('calling validate');
      try {
        const {
          data: { ipfsHash },
        } = await validatorApi.validateApplicationMilestoneUpdate(data);
        if (!ipfsHash) {
          throw new Error('Error validating grant data');
        }

        const updateTxn = await applicationContract.completeApplication(
          Number(applicationId),
          Number(workspace!.id),
          ipfsHash,
        );
        const updateTxnData = await updateTxn.wait();

        setTransactionData(updateTxnData);
        setLoading(false);
      } catch (e: any) {
        console.log('Error: ', e);
        const message = getMessageFromCode(e.code, 'Unknown error occurred!');
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
      if (!applicationId) return;
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
      if (!validatorApi) {
        throw new Error('validatorApi or workspaceId is not defined');
      }
      if (
        !applicationContract
        || applicationContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationContract.signer
        || !applicationContract.provider
      ) {
        return;
      }
      validate();
    } catch (e: any) {
      console.log('Error: ', e);
      const message = getMessageFromCode(e.code, 'Unknown error occurred!');
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
    applicationContract,
    validatorApi,
    workspace,
    accountData,
    networkData,
    currentChainId,
    applicationId,
    data,
  ]);

  return [transactionData, loading, error];
}
