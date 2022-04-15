import {
  getSupportedChainIdFromWorkspace,
  getSupportedValidatorNetworkFromChainId,
} from 'src/utils/validationUtils';
import {
  APPLICATION_REGISTRY_ADDRESS,
  WORKSPACE_REGISTRY_ADDRESS,
} from 'src/constants/addresses';
import { useAccount, useNetwork } from 'wagmi';
import {
  ToastId, useToast,
} from '@chakra-ui/react';

import getErrorMessage from 'src/utils/errorUtils';
import ErrorToast from 'src/components/ui/toasts/errorToast';
import { ApiClientsContext } from 'pages/_app';
import React, { useEffect, useContext } from 'react';
import { CreateGrantForm } from 'src/types';
import useGrantFactoryContract from '../contracts/useGrantFactoryContract';
import useChainId from '../utils/useChainId';

const useGrantMutationsUtils = () => {
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);

  const [{ data: accountData }] = useAccount();
  const subgraphClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = subgraphClients;
  const chainId = getSupportedChainIdFromWorkspace(workspace);
  const workspaceId = getSupportedValidatorNetworkFromChainId(chainId!);
  const currentChainId = useChainId();
  const [{ data: networkData }, switchNetwork] = useNetwork();
  const grantContract = useGrantFactoryContract(chainId);
  const toast = useToast();
  const toastRef = React.useRef<ToastId>();

  // function checkData(
  //   data: any,
  // ): void {
  //   if (data) {
  //     setError(undefined);
  //     setIncorrectNetwork(false);
  //   }
  // }

  function checkNetwork(): void {
    if (incorrectNetwork) {
      setIncorrectNetwork(false);
    }
  }

  function validate(
    formData: CreateGrantForm,
    transactionData: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    if (!formData) return;
    if (transactionData) return;
    if (!accountData || !accountData.address) {
      throw new Error('not connected to wallet');
    }
    if (!workspace) {
      throw new Error('not connected to workspace');
    }
    if (!currentChainId) {
      if (switchNetwork && chainId) { switchNetwork(chainId); }
      setIncorrectNetwork(true);
      setLoading(false);
      return;
    }
    if (chainId !== currentChainId) {
      if (switchNetwork && chainId) { switchNetwork(chainId); }
      setIncorrectNetwork(true);
      setLoading(false);
      return;
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
    // eslint-disable-next-line no-empty
    ) {
    // eslint-disable-next-line no-useless-return
      return;
    }
  }

  function validateArchive(
    transactionData: any,
    grantArchiveContract: any,
  ) {
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
      !grantArchiveContract
      || grantArchiveContract.address
        === '0x0000000000000000000000000000000000000000'
      || !grantArchiveContract.signer
      || !grantArchiveContract.provider
    // eslint-disable-next-line no-useless-return
    ) return;
  }

  // eslint-disable-next-line consistent-return
  async function contractMutation(
    task: string,
    contract: any,
    setTransactionData: React.Dispatch<any>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<string | undefined>>,
    ipfsHash?: string,
    newState?: boolean,
  ) {
    setLoading(true);
    let grantTransaction;
    try {
      if (task === 'create' && ipfsHash) {
        grantTransaction = await contract.createGrant(
          workspaceId ?? Number(workspace?.id).toString(),
          ipfsHash,
          WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
          APPLICATION_REGISTRY_ADDRESS[currentChainId!],
        );
      } else if (task === 'update' && ipfsHash) {
        grantTransaction = contract.updateGrant(ipfsHash);
      } else if (task === 'archive') {
        grantTransaction = await contract.updateGrantAccessibility(newState);
      }
      const createGrantTransactionData = await grantTransaction.wait();
      setTransactionData(createGrantTransactionData);
      setLoading(false);
      return createGrantTransactionData;
    } catch (e: any) {
      const message = getErrorMessage(e);
      setError(message);
      setLoading(false);
      // eslint-disable-next-line no-param-reassign
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

  useEffect(() => {
    // checkData(data);
    checkNetwork();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantContract]);

  useEffect(() => {
    // eslint-disable-next-line no-useless-return
    if (incorrectNetwork) return;
  }, [incorrectNetwork]);

  return {
    checkNetwork,
    validate,
    validateArchive,
    contractMutation,
  };
};
export default useGrantMutationsUtils;
