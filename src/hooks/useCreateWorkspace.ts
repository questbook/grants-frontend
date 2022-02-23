import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import {
  useAccount, useNetwork,
} from 'wagmi';
import { SupportedNetwork } from '@questbook/service-validator-client';
import { uploadToIPFS } from 'src/utils/ipfsUtils';
import ErrorToast from '../components/ui/toasts/errorToast';
import useWorkspaceRegistryContract from './useWorkspaceRegistryContract';

export default function useCreateWorkspace(data: any, chainId?: string) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [imageHash, setImageHash] = React.useState<string>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const workspaceRegistryContract = useWorkspaceRegistryContract(workspace, chainId);

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

      const uploadedImageHash = await uploadToIPFS(data.image);

      const {
        data: { ipfsHash },
      } = await validatorApi.validateWorkspaceCreate({
        title: data.name,
        about: data.description,
        logoIpfsHash: uploadedImageHash.hash,
        creatorId: accountData!.address,
        socials: [],
        supportedNetworks: [data.network as SupportedNetwork],
      });
      if (!ipfsHash) {
        throw new Error('Error validating grant data');
      }
      try {
        const createWorkspaceTransaction = await workspaceRegistryContract.createWorkspace(
          ipfsHash,
        );
        const createWorkspaceTransactionData = await createWorkspaceTransaction.wait();

        setTransactionData(createWorkspaceTransactionData);
        setImageHash(uploadedImageHash.hash);
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
      if (workspace.chainId !== `chain_${networkData.chain?.id}`) {
        throw new Error('connected to wrong network');
      }
      if (!validatorApi) {
        throw new Error('validatorApi or workspaceId is not defined');
      }
      if (
        !workspaceRegistryContract
        || workspaceRegistryContract.address
          === '0x0000000000000000000000000000000000000000'
        || !workspaceRegistryContract.signer
        || !workspaceRegistryContract.provider
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
    workspaceRegistryContract,
    validatorApi,
    workspace,
    accountData,
    networkData,
    data,
  ]);

  return [transactionData, imageHash, loading];
}
