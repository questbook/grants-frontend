import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { useAccount, useNetwork } from 'wagmi';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { BigNumber } from 'ethers';
import getErrorMessage from 'src/utils/errorUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useApplicationReviewRegistryContract from './contracts/useApplicationReviewRegistryContract';

export default function useMarkReviewPaymentDone(
  workspaceId: string,
  reviewIds: string[],
  totalAmount: BigNumber,
  reviewerAddress?: string,
  reviewCurrencyAddress?: string,
  transactionHash?: string
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { workspace } = apiClients;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  const applicationReviewerContract = useApplicationReviewRegistryContract(chainId);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const currentChainId = useChainId();

  useEffect(() => {
    if (totalAmount) {
      setError(undefined);
      setIncorrectNetwork(false);
      error
    } else if (transactionData) {
      setTransactionData(undefined);
      setIncorrectNetwork(false);
    }
  }, [totalAmount, transactionData]);

  useEffect(() => {
    if (incorrectNetwork) {
      setIncorrectNetwork(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationReviewerContract]);

  useEffect(() => {
    if (!totalAmount) return;
    if (!transactionHash) return;
    if (!reviewerAddress) return;
    if (!reviewCurrencyAddress) return;
    if (incorrectNetwork) return;
    if (error) return;
    if (loading) return;

    async function markAsDone() {
      setLoading(true);
      try {
        const updateTxn = await applicationReviewerContract.markPaymentDone(
          workspaceId,
          reviewerAddress,
          reviewCurrencyAddress,
          totalAmount,
          transactionHash,
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
      if (!workspaceId) return;
      if (transactionData) return;
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
      if (
        !applicationReviewerContract
        || applicationReviewerContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationReviewerContract.signer
        || !applicationReviewerContract.provider
      ) {
        return;
      }

      markAsDone();
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
    workspace,
    accountData,
    networkData,
    currentChainId,
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
  ];
}
