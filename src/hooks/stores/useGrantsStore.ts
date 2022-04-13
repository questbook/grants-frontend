import { GrantCreateRequest, GrantUpdateRequest } from '@questbook/service-validator-client';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useEffect, useState } from 'react';
import {
  GetAllGrantsForCreatorQuery,
} from 'src/generated/graphql';
import { SupportedChainId } from 'src/constants/chains';
import { Grant } from 'src/types';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { ToastId, useToast } from '@chakra-ui/react';
import getErrorMessage from 'src/utils/errorUtils';
import ErrorToast from 'src/components/ui/toasts/errorToast';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { useAccount, useNetwork } from 'wagmi';
import ContextGenerator from '../utils/contextGenerator';
import usePaginatedDataStore from './usePaginatedDataStore';
import useGrantFactoryContract from '../contracts/useGrantFactoryContract';
import useChainId from '../utils/useChainId';
import {
  checkData, checkNetwork, validate, createGrant, updateGrant,
} from './utils';

// import useGrantContract from '../contracts/useGrantContract';

const useGrantsStore = () => {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);

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
  const toast = useToast();
  const currentChainId = useChainId();

  const grants = usePaginatedDataStore<Grant>();
  // const yourGrants = usePaginatedDataStore<YourGrant>();
  // const archivedGrants = usePaginatedDataStore<YourGrant>();

  useEffect(() => {
    checkData(data, setError, setIncorrectNetwork);
    checkNetwork(incorrectNetwork, setIncorrectNetwork);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, grants.grants, grantContract]);

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

  const createGrantHandler = (
    formData: GrantCreateRequest,
    chainid?: SupportedChainId,
    workspaceid?: string,
  ) => {
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

      createGrant(
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
      setTransactionData('');
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

    return chainId ?? getSupportedChainIdFromWorkspace(workspace)
      ? `${CHAIN_INFO[chainId ?? getSupportedChainIdFromWorkspace(workspace)!]
        .explorer.transactionHash}${transactionData?.transactionHash}`
      : '';
  };

  const updateGrantHandler = async (formData: GrantUpdateRequest, grantUpdateContract: any) => {
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

      updateGrant(
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
      setTransactionData('');
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
    return currentChainId
      ? `${CHAIN_INFO[currentChainId]
        .explorer.transactionHash}${transactionData?.transactionHash}`
      : '';
  };

  return {
    loading,
    transactionData,
    transactionType,
    grants,
    // yourGrants,
    // archivedGrants,
    createGrantHandler,
    updateGrantHandler,
  };
};

export const {
  context: GrantsContext,
  contextMaker: GrantsContextMaker,
} = ContextGenerator(useGrantsStore);

export default useGrantsStore;
