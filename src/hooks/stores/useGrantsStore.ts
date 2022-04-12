import { GrantCreateRequest, GrantUpdateRequest } from '@questbook/service-validator-client';
import { ApiClientsContext } from 'pages/_app';
import React, { useContext, useEffect } from 'react';
import { GetAllGrantsForCreatorQuery } from 'src/generated/graphql';
import { parseAmount } from 'src/utils/formattingUtils';
import { SupportedChainId } from 'src/constants/chains';
import { Grant } from 'src/types';
import { uploadToIPFS } from 'src/utils/ipfsUtils';
import { getSupportedChainIdFromWorkspace, getSupportedValidatorNetworkFromChainId } from 'src/utils/validationUtils';
import { APPLICATION_REGISTRY_ADDRESS, WORKSPACE_REGISTRY_ADDRESS } from 'src/constants/addresses';
import { ToastId, useToast } from '@chakra-ui/react';
import getErrorMessage from 'src/utils/errorUtils';
import ErrorToast from 'src/components/ui/toasts/errorToast';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { useAccount, useNetwork } from 'wagmi';
import ContextGenerator from '../utils/contextGenerator';
import usePaginatedDataStore from './usePaginatedDataStore';
import useGrantFactoryContract from '../contracts/useGrantFactoryContract';
import useChainId from '../utils/useChainId';

// import useGrantContract from '../contracts/useGrantContract';

type YourGrant = GetAllGrantsForCreatorQuery['grants'][0];

const useGrantsStore = () => {
  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [incorrectNetwork, setIncorrectNetwork] = React.useState(false);

  const [data, setData] = React.useState<any>();
  // const [chainId, setChainId] = React.useState<SupportedChainId>();
  const [workspaceId, setWorkspaceId] = React.useState<string>();
  const [transactionData, setTransactionData] = React.useState<any>();
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

  const allGrants = usePaginatedDataStore<Grant>();
  const yourGrants = usePaginatedDataStore<YourGrant>();
  const archivedGrants = usePaginatedDataStore<YourGrant>();

  function checkData(): void {
    if (data) {
      setError(undefined);
      setIncorrectNetwork(false);
    }
  }

  function checkNetwork(): void {
    if (incorrectNetwork) {
      setIncorrectNetwork(false);
    }
  }
  async function createGrant(formData: any) {
    setLoading(true);
    // console.log('calling validate');
    try {
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
          (chainId ?? getSupportedChainIdFromWorkspace(workspace))!,
        ),
        fields: formData.fields,
        grantManagers: formData.grantManagers.length ? formData.grantManagers : [accountData!.address],
      });
      if (!ipfsHash) {
        throw new Error('Error validating grant data');
      }

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

  async function updateGrant(formData: any, grantUpdateContract: any) {
    setLoading(true);
    // console.log('calling validate');
    try {
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

      const createGrantTransaction = await grantUpdateContract.updateGrant(
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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function validate(formData: any, chainId: any) {
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

  useEffect(() => {
    console.log('Inside Grantstore!!');
    checkData();
    checkNetwork();
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
      checkData();
      checkNetwork();
      validate(formData, chainid ?? getSupportedChainIdFromWorkspace(workspace));

      createGrant(formData);
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
    console.log(transactionData, loading, error);
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
      checkData();
      checkNetwork();
      validate(formData, chainId ?? getSupportedChainIdFromWorkspace(workspace));
      updateGrant(formData, grantUpdateContract);
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

  const archiveGrant = async (grantId: string) => {

  };

  return {
    loading,
    transactionData,
    allGrants,
    yourGrants,
    archivedGrants,
    createGrantHandler,
    updateGrantHandler,
    archiveGrant,
  };
};

export const {
  context: GrantsContext,
  contextMaker: GrantsContextMaker,
} = ContextGenerator(useGrantsStore);

export default useGrantsStore;
