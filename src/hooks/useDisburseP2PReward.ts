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
import useGrantContract from './contracts/useGrantContract';
import useERC20Contract from './contracts/useERC20Contract';

export default function useDisburseReward(
  data: any,
  grantId: string | undefined,
  applicationId: string | undefined,
  milestoneIndex: number | undefined,
  rewardAssetAddress: string | undefined,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const currentChainId = useChainId();
  const grantContract = useGrantContract(grantId);
  const rewardContract = useERC20Contract(rewardAssetAddress);
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
      // console.log('calling validate');
      try {
        const txn = await rewardContract.approve(grantContract.address, data);
        await txn.wait();
        const updateTxn = await grantContract.disburseRewardP2P(
          applicationId,
          milestoneIndex,
          rewardAssetAddress,
          data,
        );
        const updateTxnData = await updateTxn.wait();

        setTransactionData(updateTxnData);
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
      // console.log(data);
      // console.log(milestoneIndex);
      // console.log(applicationId);
      // console.log(Number.isNaN(milestoneIndex));
      if (Number.isNaN(milestoneIndex)) return;
      if (!data) return;
      if (!applicationId) return;
      if (transactionData) return;
      if (!rewardAssetAddress) return;
      // console.log(66);
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
      // console.log(5);
      if (
        !grantContract
        || grantContract.address
          === '0x0000000000000000000000000000000000000000'
        || !grantContract.signer
        || !grantContract.provider
      ) {
        return;
      }
      if (
        !rewardContract
        || rewardContract.address
          === '0x0000000000000000000000000000000000000000'
        || !rewardContract.signer
        || !rewardContract.provider
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
    rewardContract,
    grantContract,
    validatorApi,
    workspace,
    accountData,
    networkData,
    currentChainId,
    applicationId,
    milestoneIndex,
    rewardAssetAddress,
    data,
  ]);

  return [transactionData, loading, error];
}
