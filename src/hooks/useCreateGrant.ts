import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { parseAmount } from 'src/utils/formattingUtils';
import { useAccount, useNetwork } from 'wagmi';
import { SupportedChainId } from 'src/constants/chains';
import {
  getSupportedChainIdFromWorkspace,
  getSupportedValidatorNetworkFromChainId,
} from 'src/utils/validationUtils';
import {
  APPLICATION_REGISTRY_ADDRESS,
  WORKSPACE_REGISTRY_ADDRESS,
} from 'src/constants/addresses';
import { getMessageFromCode } from 'eth-rpc-errors';
import ErrorToast from '../components/ui/toasts/errorToast';
import useGrantFactoryContract from './contracts/useGrantFactoryContract';
import useChainId from './utils/useChainId';

export default function useCreateGrant(
  data: any,
  chainId?: SupportedChainId,
  workspaceId?: string,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const grantContract = useGrantFactoryContract(
    chainId ?? getSupportedChainIdFromWorkspace(workspace),
  );
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const currentChainId = useChainId();

  useEffect(() => {
    if (data) {
      setError(undefined);
    }
  }, [data]);

  useEffect(() => {
    if (error) return;
    if (loading) return;
    // console.log('calling createGrant');

    async function validate() {
      setLoading(true);
      // console.log('calling validate');
      try {
        const {
          data: { ipfsHash },
        } = await validatorApi.validateGrantCreate({
          title: data.title,
          summary: data.summary,
          details: data.details,
          deadline: data.date,
          reward: {
            committed: parseAmount(data.reward),
            asset: data.rewardCurrencyAddress,
          },
          creatorId: accountData!.address,
          workspaceId: getSupportedValidatorNetworkFromChainId(
            (chainId ?? getSupportedChainIdFromWorkspace(workspace))!,
          ),
          fields: data.fields,
        });
        if (!ipfsHash) {
          throw new Error('Error validating grant data');
        }

        console.log(workspaceId ?? Number(workspace?.id).toString());
        console.log('ipfsHash', ipfsHash);
        console.log(
          WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
          APPLICATION_REGISTRY_ADDRESS[currentChainId!],
        );

        const createGrantTransaction = await grantContract.createGrant(
          workspaceId ?? Number(workspace?.id).toString(),
          ipfsHash,
          WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
          APPLICATION_REGISTRY_ADDRESS[currentChainId!],
        );
        const createGrantTransactionData = await createGrantTransaction.wait();

        setTransactionData(createGrantTransactionData);
        setLoading(false);
      } catch (e: any) {
        console.log('Error: ', e);
        const message = getMessageFromCode(e.code, 'Unknown error occurred!');
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
      if (!data) return;
      if (transactionData) return;
      if (!accountData || !accountData.address) {
        throw new Error('not connected to wallet');
      }
      if (!currentChainId) {
        throw new Error('not connected to valid network');
      }
      if (chainId) {
        if (chainId !== currentChainId) {
          throw new Error('connected to wrong network');
        }
        if (!workspaceId) {
          throw new Error('workspaceId is required');
        }
      } else {
        if (!workspace) {
          throw new Error('not connected to workspace');
        }
        if (getSupportedChainIdFromWorkspace(workspace) !== currentChainId) {
          throw new Error('connected to wrong network');
        }
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
      ) {
        return;
      }
      validate();
    } catch (e: any) {
      console.log('Error: ', e);
      const message = getMessageFromCode(e.code, 'Unknown error occurred!');
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
    validatorApi,
    workspace,
    accountData,
    networkData,
    currentChainId,
    chainId,
    workspaceId,
    data,
  ]);

  return [transactionData, loading, error];
}
