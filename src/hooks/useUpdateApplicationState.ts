import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { useAccount, useNetwork } from 'wagmi';
import {
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import getErrorMessage from 'src/utils/errorUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useApplicationRegistryContract from './contracts/useApplicationRegistryContract';

export default function useUpdateApplicationState(
  data: string,
  applicationId: string | undefined,
  state: number | undefined,
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
    if (state) {
      setError(undefined);
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    if (error) return;
    if (loading) return;

    async function validate() {
      setLoading(true);
      // console.log('calling validate');
      // console.log('DATA: ', data);
      try {
        const {
          data: { ipfsHash },
        } = await validatorApi.validateGrantApplicationUpdate({
          feedback: data.length === 0 ? '  ' : data,
        });
        if (!ipfsHash) {
          throw new Error('Error validating grant data');
        }

        const updateTxn = await applicationContract.updateApplicationState(
          Number(applicationId),
          Number(workspace!.id),
          state,
          ipfsHash,
        );
        const updateTxnData = await updateTxn.wait();

        setTransactionData(updateTxnData);
        setLoading(false);
      } catch (e: any) {
        const message = getErrorMessage(e);
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
      if (!state) return;
      if (state !== 2) {
        if (!data) return;
      }
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
      const message = getErrorMessage(e);
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
    state,
    data,
  ]);

  return [
    transactionData,
    currentChainId
      ? `${CHAIN_INFO[currentChainId]
        .explorer.transactionHash}${transactionData?.transactionHash}`
      : '',
    loading,
    error,
  ];
}
