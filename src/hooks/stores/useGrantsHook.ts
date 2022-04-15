import { GrantCreateRequest, GrantUpdateRequest } from '@questbook/service-validator-client';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useEffect } from 'react';
import { SupportedChainId } from 'src/constants/chains';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { toast, ToastId } from '@chakra-ui/react';
import getErrorMessage from 'src/utils/errorUtils';
import ErrorToast from 'src/components/ui/toasts/errorToast';

import { CHAIN_INFO } from 'src/constants/chainInfo';
import { useAccount, useNetwork } from 'wagmi';
import useGrantFactoryContract from '../contracts/useGrantFactoryContract';
import useChainId from '../utils/useChainId';
import {
  checkData, checkNetwork, validate, createGrant, updateGrant, archiveGrant, validateArchive,
} from './utils';

const useGrantsHook = () => {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);
  const [transactionLink, setTransactionLink] = React.useState<string>('');

  const [data, setData] = React.useState<any>();
  // const [chainId, setChainId] = React.useState<SupportedChainId>();
  const [workspaceId, setWorkspaceId] = React.useState<string>();
  const [transactionData, setTransactionData] = React.useState<any>();
  const [transactionType, setTransactionType] = React.useState<string>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }, switchNetwork] = useNetwork();
  const subgraphClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = subgraphClients;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  const grantContract = useGrantFactoryContract(
    chainId ?? getSupportedChainIdFromWorkspace(workspace),
  );

  // const grantUpdateContract = useGrantContract();
  const toastRef = React.useRef<ToastId>();

  const currentChainId = useChainId();

  useEffect(() => {
    checkData(data, setError, setIncorrectNetwork);
    checkNetwork(incorrectNetwork, setIncorrectNetwork);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, grantContract]);

  useEffect(() => {
    if (incorrectNetwork) return;
    if (error) return;
    // eslint-disable-next-line no-useless-return
    if (loading) return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error,
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
    chainId,
    incorrectNetwork]);

  const createGrantHandler = async (
    formData: GrantCreateRequest,
    chainid?: SupportedChainId,
    workspaceid?: string,
  ) => {
    let createGrantData;
    if (formData) {
      setData(formData);
    }
    if (workspaceid) {
      setWorkspaceId(workspaceid);
    }
    try {
      checkData(data, setError, setIncorrectNetwork);
      checkNetwork(incorrectNetwork, setIncorrectNetwork);
      validate(
        formData,
        chainId,
        transactionData,
        accountData,
        workspace,
        currentChainId,
        switchNetwork,
        setIncorrectNetwork,
        setLoading,
        validatorApi,
        grantContract,
      );

      createGrantData = await createGrant(
        formData,
        setLoading,
        validatorApi,
        accountData,
        chainId,
        workspace,
        grantContract,
        workspaceId,
        currentChainId,
        setTransactionData,
        getErrorMessage,
        setError,
        toastRef,
        toast,
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

  const updateGrantHandler = async (formData: GrantUpdateRequest, grantUpdateContract: any) => {
    let updateGrantTxnData;
    if (formData) {
      setData(formData);
    }
    try {
      checkData(data, setError, setIncorrectNetwork);
      checkNetwork(incorrectNetwork, setIncorrectNetwork);
      validate(
        formData,
        chainId,
        transactionData,
        accountData,
        workspace,
        currentChainId,
        switchNetwork,
        setIncorrectNetwork,
        setLoading,
        validatorApi,
        grantContract,
      );

      updateGrantTxnData = await updateGrant(
        formData,
        grantUpdateContract,
        setLoading,
        validatorApi,
        setTransactionData,
        getErrorMessage,
        setError,
        toastRef,
        toast,
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

  const archiveGrantHandler = async (
    newState: boolean,
    changeCount: number,
    grantId: string,
    grantArchiveContract: any,
  ) => {
    let txnData;
    if (newState) {
      setError(undefined);
    }
    try {
      validateArchive(
        transactionData,
        accountData,
        currentChainId,
        workspace,
        validatorApi,
        grantArchiveContract,
      );
      txnData = await archiveGrant(
        newState,
        changeCount,
        grantId,
        setTransactionData,
        setLoading,
        error,
        loading,
        getErrorMessage,
        setError,
        toastRef,
        toast,
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
    // yourGrants,
    // archivedGrants,
    createGrantHandler,
    updateGrantHandler,
    archiveGrantHandler,
  };
};

export default useGrantsHook;
