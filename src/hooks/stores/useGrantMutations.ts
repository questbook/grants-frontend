import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useEffect } from 'react';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { ToastId, useToast } from '@chakra-ui/react';
import getErrorMessage from 'src/utils/errorUtils';
import ErrorToast from 'src/components/ui/toasts/errorToast';
import { CreateGrantForm } from 'src/types';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import useGrantFactoryContract from '../contracts/useGrantFactoryContract';
import useChainId from '../utils/useChainId';
import useGrantMutationsUtils from './useGrantMutationsUtils';

const useGrantMutations = () => {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionLink, setTransactionLink] = React.useState<string>('');

  // const [chainId, setChainId] = React.useState<SupportedChainId>();
  const [workspaceId, setWorkspaceId] = React.useState<string>();
  const [transactionData, setTransactionData] = React.useState<any>();
  const [transactionType, setTransactionType] = React.useState<string>();
  const subgraphClients = useContext(ApiClientsContext)!;
  const { workspace } = subgraphClients;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  const grantContract = useGrantFactoryContract(chainId);

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const currentChainId = useChainId();
  const grantMutationsUtils = useGrantMutationsUtils();

  useEffect(() => {
    if (error) return;
    // eslint-disable-next-line no-useless-return
    if (loading) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error,
    loading,
    grantContract,
  ]);

  const createGrant = async (
    formData: CreateGrantForm,
    workspaceid?: string,
  ) => {
    let createGrantData;
    if (workspaceid) {
      setWorkspaceId(workspaceid);
    }
    try {
      grantMutationsUtils.checkNetwork();
      grantMutationsUtils.validate(
        formData,
        transactionData,
        setLoading,
      );
      createGrantData = await grantMutationsUtils.createGrantFunction(
        formData,
        workspaceId,
        setTransactionData,
        setLoading,
        setError,
      );
      //   setTransactionData('');
      setTransactionType('create');
    } catch (e) {
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
    setTransactionLink(chainId ?? getSupportedChainIdFromWorkspace(workspace)
      ? `${CHAIN_INFO[chainId ?? getSupportedChainIdFromWorkspace(workspace)!]
        .explorer.transactionHash}${createGrantData?.transactionHash}`
      : '');
  };

  const updateGrant = async (formData: CreateGrantForm, grantUpdateContract: any) => {
    let updateGrantTxnData;

    try {
      grantMutationsUtils.checkNetwork();
      grantMutationsUtils.validate(
        formData,
        transactionData,
        setLoading,
      );

      updateGrantTxnData = await grantMutationsUtils.updateGrantFunction(
        formData,
        grantUpdateContract,
        setError,
        setLoading,
        setTransactionData,
      );
      //   setTransactionData('');
      setTransactionType('update');
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
    setTransactionLink(currentChainId
      ? `${CHAIN_INFO[currentChainId]
        .explorer.transactionHash}${updateGrantTxnData?.transactionHash}`
      : '');
  };

  const archiveGrant = async (
    newState: boolean,
    changeCount: number,
    grantArchiveContract: any,
  ) => {
    let txnData;
    if (newState) {
      setError(undefined);
    }
    if (loading) {
      return;
    }
    if (error) return;
    try {
      grantMutationsUtils.validateArchive(
        transactionData,
        grantArchiveContract,
      );
      txnData = await grantMutationsUtils.archiveGrantFunction(
        newState,
        changeCount,
        setTransactionData,
        setLoading,
        setError,
        grantArchiveContract,
      );
      //   setTransactionData('');
      setTransactionType('archive');
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
    setTransactionLink(currentChainId
      ? `${CHAIN_INFO[currentChainId].explorer.transactionHash}${txnData?.transactionHash}`
      : '');
  };

  return {
    error,
    loading,
    setTransactionData,
    transactionData,
    transactionType,
    transactionLink,
    createGrant,
    updateGrant,
    archiveGrant,
  };
};

export default useGrantMutations;
