import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { useAccount, useNetwork } from 'wagmi';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { errorCodes, getMessageFromCode } from 'eth-rpc-errors';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useGrantContract from './contracts/useGrantContract';

export default function useWithdrawFunds(
  finalAmount?: string,
  rewardAddress?: string,
  grantAddress?: string,
  address?: string,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { workspace } = apiClients;
  const grantContract = useGrantContract(grantAddress);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const currentChainId = useChainId();

  useEffect(() => {
    if (finalAmount) {
      setError(undefined);
    } else if (transactionData) {
      setTransactionData(undefined);
    }
  }, [finalAmount, transactionData]);

  useEffect(() => {
    if (error) return;
    if (loading) return;
    // console.log('calling createGrant');

    async function validate() {
      setLoading(true);
      // console.log('calling validate');
      try {
        const transferTxn = await grantContract.withdrawFunds(
          rewardAddress,
          finalAmount,
          address,
        );
        const depositTransactionData = await transferTxn.wait();

        setTransactionData(depositTransactionData);
        setLoading(false);
      } catch (e: any) {
        console.log('Error: ', e);
        const message = e.code === errorCodes.rpc.internal ? e.data.message : getMessageFromCode(e.code, 'Unknown error occurred!');
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
      if (!finalAmount) return;
      if (!rewardAddress) return;
      if (!address) return;
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
      console.log(workspace);
      console.log(currentChainId);
      if (getSupportedChainIdFromWorkspace(workspace) !== currentChainId) {
        throw new Error('connected to wrong network');
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
      console.log('Error: ', e);
      const message = e.code === errorCodes.rpc.internal ? e.data.message : getMessageFromCode(e.code, 'Unknown error occurred!');
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
    grantContract,
    workspace,
    accountData,
    networkData,
    currentChainId,
    rewardAddress,
    address,
    finalAmount,
  ]);

  return [transactionData, loading];
}
