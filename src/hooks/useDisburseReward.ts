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
import useGrantContract from './contracts/useGrantContract';

export default function useDisburseReward(
  data: any,
  grantId: string | undefined,
  applicationId: string | undefined,
  milestoneIndex: number | undefined,
  rewardAssetAddress: string | undefined,
  submitClicked: boolean,
  setSubmitClicked: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const currentChainId = useChainId();
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  const grantContract = useGrantContract(grantId);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setError(undefined);
      setLoading(false);
      setIncorrectNetwork(false);
    }
  }, [data]);

  useEffect(() => {
    if (submitClicked) {
      setIncorrectNetwork(false);
      setSubmitClicked(false);
    }
  }, [setSubmitClicked, submitClicked]);

  useEffect(() => {
    if (incorrectNetwork) {
      setIncorrectNetwork(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantContract]);

  useEffect(() => {
    console.log('useDisburseReward', incorrectNetwork, error, loading);
    if (incorrectNetwork) return;
    if (error) return;
    if (loading) return;

    async function validate() {
      setLoading(true);
      console.log('calling validate');
      try {
        const updateTxn = await grantContract.disburseReward(
          applicationId,
          milestoneIndex,
          rewardAssetAddress,
          data,
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
      if (!rewardAssetAddress) return;
      // console.log(66);
      if (!accountData || !accountData.address) {
        throw new Error('not connected to wallet');
      }
      if (!workspace) {
        throw new Error('not connected to workspace');
      }
      if (!currentChainId) {
        if (switchNetwork && chainId) {
          switchNetwork(chainId);
        }
        setIncorrectNetwork(true);
        setLoading(false);
        return;
      }
      if (chainId !== currentChainId) {
        if (switchNetwork && chainId) {
          switchNetwork(chainId);
        }
        setIncorrectNetwork(true);
        setLoading(false);
        return;
      }
      if (!validatorApi) {
        throw new Error('validatorApi or workspaceId is not defined');
      }
      console.log(5);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    applicationId,
    milestoneIndex,
    rewardAssetAddress,
    data,
    chainId,
    incorrectNetwork,
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
