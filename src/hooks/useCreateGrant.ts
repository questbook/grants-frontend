import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import config from 'src/constants/config';
import { parseAmount } from 'src/utils/formattingUtils';
import {
  useAccount, useContract, useNetwork, useSigner,
} from 'wagmi';
import ErrorToast from '../components/ui/toasts/errorToast';
import GrantFactoryABI from '../contracts/abi/GrantFactoryAbi.json';

export default function useCreateGrant(data: any, chainId?: number) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const [signerStates] = useSigner();

  const [addressOrName, setAddressOrName] = React.useState<string>();
  useEffect(() => {
    if (!chainId) {
      if (workspace && workspace.chainId && workspace.chainId === 'chain_4') {
        setAddressOrName(config.GrantFactoryAddress);
      }
    }
    if (chainId === 1) {
      setAddressOrName(config.GrantFactoryAddress);
    }
  }, [chainId, workspace]);

  // useEffect(() => {
  //   if (error) {
  //     setError(undefined);
  //   }
  // }, [workspace, error]);

  const grantContract = useContract({
    addressOrName:
      addressOrName ?? '0x0000000000000000000000000000000000000000',
    contractInterface: GrantFactoryABI,
    signerOrProvider: signerStates.data,
  });

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setError(undefined);
    }
  }, [data]);

  useEffect(() => {
    if (error) return;
    if (loading) return;
    console.log('calling createGrant');

    async function validate() {
      setLoading(true);
      console.log('calling validate');
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
        workspaceId: workspace.workspaceId!,
        fields: data.fields,
      });
      if (!ipfsHash) {
        throw new Error('Error validating grant data');
      }
      try {
        const createGrantTransaction = await grantContract.createGrant(
          workspace.workspaceId!,
          ipfsHash,
          config.WorkspaceRegistryAddress,
          config.ApplicationRegistryAddress,
        );
        const createGrantTransactionData = await createGrantTransaction.wait();

        setTransactionData(createGrantTransactionData);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
        toastRef.current = toast({
          position: 'top',
          render: () => ErrorToast({
            content: 'User rejected transaction',
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
      if (!workspace || !workspace.workspaceId) {
        throw new Error('not connected to workspace');
      }
      if (workspace.chainId !== `chain_${networkData.chain?.id}`) {
        throw new Error('connected to wrong network');
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
      setError(e.message);
      setLoading(false);
      toastRef.current = toast({
        position: 'top',
        render: () => ErrorToast({
          content: e.message,
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
    data,
  ]);

  return [transactionData, loading];
}
