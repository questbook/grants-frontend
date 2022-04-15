import { ApiClientsContext } from 'pages/_app';
import {
  getSupportedChainIdFromWorkspace,
  getSupportedValidatorNetworkFromChainId,
} from 'src/utils/validationUtils';
import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import getErrorMessage from 'src/utils/errorUtils';
import ErrorToast from 'src/components/ui/toasts/errorToast';
import { CreateGrantForm } from 'src/types';
import { uploadToIPFS } from 'src/utils/ipfsUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { parseAmount } from 'src/utils/formattingUtils';
import { useAccount } from 'wagmi';
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
  const { validatorApi, workspace } = subgraphClients;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  const grantContract = useGrantFactoryContract(chainId);
  const [{ data: accountData }] = useAccount();

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
    const task = 'create';
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
      const detailsHash = (await uploadToIPFS(formData.details)).hash;
      const {
        data: { ipfsHash },
      } = await validatorApi.validateGrantCreate({
        title: formData.title,
        summary: formData.summary,
        details: detailsHash,
        deadline: formData.date,
        reward: {
          committed: parseAmount(formData.reward, formData.rewardCurrencyAddress),
          asset: formData.rewardCurrencyAddress,
        },
        creatorId: accountData!.address,
        workspaceId: getSupportedValidatorNetworkFromChainId(
          chainId!,
        ),
        fields: formData.fields,
        grantManagers: formData.grantManagers.length
          ? formData.grantManagers
          : [accountData!.address],
      });
      if (!ipfsHash) {
        throw new Error('Error validating grant data');
      }
      createGrantData = await grantMutationsUtils.contractMutation(
        task,
        grantContract,
        setTransactionData,
        setLoading,
        setError,
        ipfsHash,
      );
      //   setTransactionData('');
      setTransactionType(task);
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
    const task = 'update';

    try {
      grantMutationsUtils.checkNetwork();
      grantMutationsUtils.validate(
        formData,
        transactionData,
        setLoading,
      );
      const detailsHash = (await uploadToIPFS(formData.details)).hash;
      const {
        data: { ipfsHash },
      } = await validatorApi.validateGrantUpdate({
        title: formData.title,
        summary: formData.summary,
        details: detailsHash,
        deadline: formData.date,
        reward: {
          committed: parseAmount(formData.reward, formData.rewardCurrencyAddress),
          asset: formData.rewardCurrencyAddress,
        },
        fields: formData.fields,
      });
      if (!ipfsHash) {
        throw new Error('Error validating grant data');
      }
      updateGrantTxnData = await grantMutationsUtils.contractMutation(
        task,
        grantUpdateContract,
        setTransactionData,
        setLoading,
        setError,
        ipfsHash,
      );
      //   setTransactionData('');
      setTransactionType(task);
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
    const task = 'archive';
    if (newState) {
      setError(undefined);
    }
    if (loading) {
      return;
    }
    if (error) return;
    if (changeCount === 0) return;
    try {
      grantMutationsUtils.validateArchive(
        transactionData,
        grantArchiveContract,
      );

      txnData = await grantMutationsUtils.contractMutation(
        task,
        grantArchiveContract,
        setTransactionData,
        setLoading,
        setError,
        '',
        newState,
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
