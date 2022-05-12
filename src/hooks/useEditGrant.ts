import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { parseAmount } from 'src/utils/formattingUtils';
import { useAccount, useNetwork } from 'wagmi';
import {
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import getErrorMessage from 'src/utils/errorUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { uploadToIPFS } from 'src/utils/ipfsUtils';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useGrantContract from './contracts/useGrantContract';

export default function useEditGrant(
  data: any,
  grantId?: string,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const grantContract = useGrantContract(grantId);
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const currentChainId = useChainId();
  const chainId = getSupportedChainIdFromWorkspace(workspace);

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
  }, [grantContract]);

  useEffect(() => {
    if (incorrectNetwork) return;
    if (error) return;
    if (loading) return;
    // console.log('calling editGrant');

    async function validate() {
      setLoading(true);
      console.log('calling validate', data);
      try {
        const detailsHash = (await uploadToIPFS(data.details)).hash;
        let reward;
        if (data.rewardToken.address === '') {
          reward = {
            committed: parseAmount(data.reward, data.rewardCurrencyAddress),
            asset: data.rewardCurrencyAddress,
          };
        } else {
          reward = {
            committed: parseAmount(data.reward, data.rewardToken.decimal),
            asset: data.rewardCurrencyAddress,
            token: data.rewardToken,
          };
        }
        const {
          data: { ipfsHash },
        } = await validatorApi.validateGrantUpdate({
          title: data.title,
          summary: data.summary,
          details: detailsHash,
          deadline: data.date,
          reward,
          fields: data.fields,
        });
        if (!ipfsHash) {
          throw new Error('Error validating grant data');
        }

        const createGrantTransaction = await grantContract.updateGrant(
          ipfsHash,
        );
        const createGrantTransactionData = await createGrantTransaction.wait();

        setTransactionData(createGrantTransactionData);
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
    grantContract,
    validatorApi,
    workspace,
    accountData,
    networkData,
    currentChainId,
    data,
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
    error,
  ];
}
