import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { parseAmount } from 'src/utils/formattingUtils';
import { useAccount, useNetwork } from 'wagmi';
import {
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useGrantContract from './contracts/useGrantContract';

export default function useEditGrant(
  data: any,
  grantId?: string,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const grantContract = useGrantContract(grantId);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const currentChainId = useChainId();

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
      try {
        const {
          data: { ipfsHash },
        } = await validatorApi.validateGrantUpdate({
          title: data.title,
          summary: data.summary,
          details: data.details,
          deadline: data.date,
          reward: {
            committed: parseAmount(data.reward),
            asset: data.rewardCurrencyAddress,
          },
          fields: data.fields,
        });
        if (!ipfsHash) {
          throw new Error('Error validating grant data');
        }

        const createGrantTransaction = await grantContract.updateGrant(
          ipfsHash,
        );
        const createGrantTransactionData = await createGrantTransaction.wait();

        setTransactionData(createGrantTransactionData);
        setLoading(false);
      } catch (e: any) {
        console.log(e);
        setError(e.message);
        setLoading(false);
        toastRef.current = toast({
          position: 'top',
          render: () => ErrorToast({
            content: 'User rejected transaction',
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
      if (!validatorApi) {
        throw new Error('validatorApi or workspaceId is not defined');
      }
      if (
        !grantContract
        || grantContract.address
          === '0x0000000000000000000000000000000000000000'
        || !grantContract.signer
        || !grantContract.provider
      ) {
        return;
      }
      validate();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
      toastRef.current = toast({
        position: 'top',
        render: () => ErrorToast({
          content: e.message,
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
    grantContract,
    validatorApi,
    workspace,
    accountData,
    networkData,
    currentChainId,
    data,
  ]);

  return [transactionData, loading];
}
