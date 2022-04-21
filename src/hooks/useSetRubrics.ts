import React, { useContext, useEffect } from 'react';
import { ToastId, useToast } from '@chakra-ui/react';
import { ApiClientsContext } from 'pages/_app';
import { useAccount, useNetwork } from 'wagmi';
import { SupportedChainId } from 'src/constants/chains';
import {
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import getErrorMessage from 'src/utils/errorUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import ErrorToast from '../components/ui/toasts/errorToast';
import useChainId from './utils/useChainId';
import useApplicationReviewRegistryContract from './contracts/useApplicationReviewRegistryContract';

export default function useSetRubrics(
  data: any,
  chainId?: SupportedChainId,
  workspaceId?: string,
  grantAddress?: string,
) {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);
  const [transactionData, setTransactionData] = React.useState<any>();
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const apiClients = useContext(ApiClientsContext)!;
  const { validatorApi, workspace } = apiClients;
  const applicationReviewContract = useApplicationReviewRegistryContract(
    chainId ?? getSupportedChainIdFromWorkspace(workspace),
  );
  if (!chainId) {
    // eslint-disable-next-line no-param-reassign
    chainId = getSupportedChainIdFromWorkspace(workspace);
  }
  const toastRef = React.useRef<ToastId>();
  const toast = useToast();
  const currentChainId = useChainId();

  useEffect(() => {
    console.log('data', data);
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
  }, [applicationReviewContract]);

  useEffect(() => {
    if (incorrectNetwork) return;
    if (error) return;
    if (loading) return;

    async function validate() {
      setLoading(true);
      // console.log('calling validate');
      try {
        let rubricHash = '';
        if (data.rubric) {
          const {
            data: { ipfsHash: auxRubricHash },
          } = await validatorApi.validateRubricSet({
            rubric: data.rubric,
          });

          if (!auxRubricHash) {
            throw new Error('Error validating rubric data');
          }

          rubricHash = auxRubricHash;
        }

        console.log('rubricHash', rubricHash);

        // console.log(workspaceId ?? Number(workspace?.id).toString());
        // console.log('ipfsHash', ipfsHash);
        // console.log(
        //   WORKSPACE_REGISTRY_ADDRESS[currentChainId!],
        //   APPLICATION_REGISTRY_ADDRESS[currentChainId!],
        // );

        const createGrantTransaction = await applicationReviewContract.setRubrics(
          workspaceId ?? Number(workspace?.id).toString(),
          grantAddress,
          rubricHash,
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
      if (!grantAddress) return;
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
        !applicationReviewContract
        || applicationReviewContract.address
          === '0x0000000000000000000000000000000000000000'
        || !applicationReviewContract.signer
        || !applicationReviewContract.provider
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
    applicationReviewContract,
    validatorApi,
    workspace,
    accountData,
    networkData,
    currentChainId,
    chainId,
    workspaceId,
    data,
    grantAddress,
    incorrectNetwork,
  ]);

  return [
    transactionData,
    chainId ?? getSupportedChainIdFromWorkspace(workspace)
      ? `${CHAIN_INFO[chainId ?? getSupportedChainIdFromWorkspace(workspace)!]
        .explorer.transactionHash}${transactionData?.transactionHash}`
      : '',
    loading,
    error,
  ];
}
