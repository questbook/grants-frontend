import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import {
  useAccount, useNetwork,
} from 'wagmi';
import { SupportedChainId } from 'src/constants/chains';
import { GrantApplicationRequest } from '@questbook/service-validator-client';
import getErrorMessage from 'src/utils/errorUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { uploadToIPFS } from 'src/utils/ipfsUtils';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useApplicationRegistryContract from './contracts/useApplicationRegistryContract';

export default function useSubmitApplication(
  data: GrantApplicationRequest,
  chainId?: SupportedChainId,
  grantId?: string,
  workspaceId?: string,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi } = apiClients;

  const currentChainId = useChainId();
  const applicationRegistryContract = useApplicationRegistryContract(chainId);

  const toastRef = React.useRef<ToastId>();
  const toast = useToast();

  useEffect(() => {
    if (data) {
      setError(undefined);
      setIncorrectNetwork(false);
    }
  }, [data]);

  useEffect(() => {
    if (incorrectNetwork) {
      setIncorrectNetwork(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationRegistryContract]);

  useEffect(() => {
    if (incorrectNetwork) return;
    if (error) return;
    if (loading) return;
    // console.log('calling createGrant');

    async function validate() {
      setLoading(true);
      // console.log('calling validate');
      try {
        const detailsHash = (
          await uploadToIPFS(data.fields.projectDetails[0].value)
        ).hash;
        // eslint-disable-next-line no-param-reassign
        data.fields.projectDetails[0].value = detailsHash;
        console.log('Details hash: ', detailsHash);
        const {
          data: { ipfsHash },
        } = await validatorApi.validateGrantApplicationCreate(data);
        // console.log(ipfsHash);
        if (!ipfsHash) {
          throw new Error('Error validating grant data');
        }

        const txn = await applicationRegistryContract.submitApplication(
          grantId,
          Number(workspaceId).toString(),
          ipfsHash,
          data.milestones.length,
        );
        const txnData = await txn.wait();

        setTransactionData(txnData);
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
      if (!data) return;
      if (transactionData) return;
      if (!chainId) return;
      if (!accountData || !accountData.address) {
        throw new Error('not connected to wallet');
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
        !applicationRegistryContract
        || applicationRegistryContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationRegistryContract.signer
        || !applicationRegistryContract.provider
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
    applicationRegistryContract,
    validatorApi,
    accountData,
    networkData,
    currentChainId,
    chainId,
    data,
    grantId,
    workspaceId,
    incorrectNetwork,
  ]);

  return [
    transactionData,
    chainId
      ? `${CHAIN_INFO[chainId].explorer.transactionHash}${transactionData?.transactionHash}`
      : '',
    loading,
    error,
  ];
}
