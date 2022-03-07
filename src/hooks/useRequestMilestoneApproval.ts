/* eslint-disable eqeqeq */
import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { useAccount, useNetwork } from 'wagmi';
import { SupportedChainId } from 'src/constants/chains';
import getErrorMessage from 'src/utils/errorUtils';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useApplicationRegistryContract from './contracts/useApplicationRegistryContract';

export default function useRequestMilestoneApproval(
  data: any,
  chainId: SupportedChainId | undefined,
  applicationId: string | undefined,
  milestoneIndex: number | undefined,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi } = apiClients;
  const currentChainId = useChainId();
  const applicationContract = useApplicationRegistryContract(chainId);
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
        const {
          data: { ipfsHash },
        } = await validatorApi.validateApplicationMilestoneUpdate(data);
        if (!ipfsHash) {
          throw new Error('Error validating grant data');
        }

        const updateTxn = await applicationContract.requestMilestoneApproval(
          applicationId,
          Number(milestoneIndex),
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
      // console.log(data);
      // console.log(milestoneIndex);
      // console.log(applicationId);
      // console.log(Number.isNaN(milestoneIndex));
      if (Number.isNaN(milestoneIndex)) return;
      if (!data) return;
      if (!applicationId) return;
      if (transactionData) return;
      if (!chainId) return;
      if (!accountData || !accountData.address) {
        throw new Error('not connected to wallet');
      }
      if (!currentChainId) {
        throw new Error('not connected to valid network');
      }
      if (chainId != currentChainId) {
        throw new Error('connected to wrong network');
      }
      if (!validatorApi) {
        throw new Error('validatorApi or workspaceId is not defined');
      }
      // console.log(5);
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
    chainId,
    accountData,
    networkData,
    currentChainId,
    applicationId,
    milestoneIndex,
    data,
  ]);

  return [transactionData, loading, error];
}
