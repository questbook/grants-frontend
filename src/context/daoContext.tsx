import { SupportedNetwork } from '@questbook/service-validator-client';
import { ApiClientsContext } from 'pages/_app';
import React, {
  createContext,
  ReactNode, useCallback, useContext, useMemo, useState,
} from 'react';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { SupportedChainId } from 'src/constants/chains';
import useGetSelectedNetwork from 'src/hooks/useGetSelectedNetwork';
import useIsCorrectNetworkSelected from 'src/hooks/useIsCorrectNetwork';
import useWorkspaceRegistryContract from 'src/hooks/useWorkspaceRegistryContract';
import { WorkspaceData } from 'src/types/workspace';
import { uploadToIPFS } from 'src/utils/ipfsUtils';
import { useAccount } from 'wagmi';
import { useToastContext } from './toastContext';

type Props = {
  children: ReactNode;
};
type DaoContextType = {
  createWorkspace: (data:WorkspaceData) => void;
  editWorkspace: (data:any, workspaceData: any) => void;
  loading: boolean;
  hasClicked: boolean;
  daoData: WorkspaceData | undefined;
  daoCreated: boolean;
};
const daoContextDefaultValues: DaoContextType = {
  createWorkspace: () => {},
  editWorkspace: () => {},
  loading: false,
  hasClicked: false,
  daoData: undefined,
  daoCreated: false,
};

export const DaoContext = createContext<DaoContextType>(daoContextDefaultValues);

export function DaoProvider({ children }: Props) {
  const [loading, setLoading] = useState(false);
  const [daoCreated, setDaoCreated] = useState(false);
  const [daoData, setDaoData] = useState<WorkspaceData>();
  const [{ data: accountData }] = useAccount();
  const apiClients = useContext(ApiClientsContext);
  const { showErrorToast, showInfoToast } = useToastContext();
  const selectedChainId = useGetSelectedNetwork();
  const workspaceFactoryContract = useWorkspaceRegistryContract(
    selectedChainId || SupportedChainId.RINKEBY,
  );
  const createWorkspace = useCallback(async (data: WorkspaceData) => {
    try {
      if (!accountData || !accountData.address) {
        throw new Error('Not connected to wallet');
      }
      if (!apiClients) return;

      setLoading(true);
      const { validatorApi } = apiClients;

      const imageHash = await uploadToIPFS(data.image);

      const {
        data: { ipfsHash },
      } = await validatorApi.validateWorkspaceCreate({
        title: data.name,
        about: data.description,
        logoIpfsHash: imageHash.hash,
        creatorId: accountData.address,
        socials: [],
        supportedNetworks: [data.network.toString() as string as SupportedNetwork],
      });

      const transaction = await workspaceFactoryContract.createWorkspace(
        ipfsHash,
      );
      // console.log(transaction);
      const transactionData = await transaction.wait();
      //   console.log(transactionData);
      //   console.log(transactionData.events[0].args.id);
      if (
        transactionData
        && transactionData.events.length > 0
        && transactionData.events[0].event === 'WorkspaceCreated'
      ) {
        const newId = transactionData.events[0].args.id;
        setDaoData({
          ...data,
          image: imageHash.hash,
          id: Number(newId).toString(),
        });
        setLoading(false);
        setDaoCreated(true);
        apiClients.setChainId(data.network);
        apiClients.setWorkspaceId(Number(newId).toString());
      } else {
        throw new Error('Workspace not indexed');
      }
    } catch (error:any) {
      setLoading(false);
      showErrorToast(error.message);
      // console.log(error);
    }
  }, [accountData, apiClients, showErrorToast, workspaceFactoryContract]);

  const [hasClicked, setHasClicked] = useState(false);
  const workspaceFactoryContractExisting = useWorkspaceRegistryContract(
    apiClients?.chainId || SupportedChainId.RINKEBY,
  );
  const isCorrectNetworkSelected = useIsCorrectNetworkSelected(apiClients?.chainId);
  const editWorkspace = useCallback(async (data: any, workspaceData: any) => {
    if (!apiClients) return;
    try {
      const { validatorApi } = apiClients;

      if (!isCorrectNetworkSelected && apiClients && apiClients.chainId) {
        throw Error(`You are on the wrong network. Please switch to ${CHAIN_INFO[apiClients.chainId].name}`);
      }

      let imageHash = workspaceData.logoIpfsHash;
      let coverImageHash = workspaceData.coverImageIpfsHash;
      const socials = [];

      if (data.image) {
        imageHash = (await uploadToIPFS(data.image)).hash;
      }
      if (data.coverImage) {
        coverImageHash = (await uploadToIPFS(data.coverImage)).hash;
      }

      if (data.twitterHandle) {
        socials.push({ name: 'twitter', value: data.twitterHandle });
      }
      if (data.discordHandle) {
        socials.push({ name: 'discord', value: data.discordHandle });
      }
      if (data.telegramChannel) {
        socials.push({ name: 'telegram', value: data.telegramChannel });
      }

      setHasClicked(true);
      const {
        data: { ipfsHash },
      } = await validatorApi.validateWorkspaceUpdate(coverImageHash ? {
        title: data.name,
        about: data.about,
        logoIpfsHash: imageHash,
        coverImageIpfsHash: coverImageHash,
        socials,
      } : {
        title: data.name,
        about: data.about,
        logoIpfsHash: imageHash,
        socials,
      });

      const workspaceID = Number(workspaceData?.id);

      const txn = await workspaceFactoryContractExisting
        .updateWorkspaceMetadata(workspaceID, ipfsHash);
      const transactionData = await txn.wait();
      setHasClicked(false);
      window.location.reload();

      showInfoToast(`https://etherscan.io/tx/${transactionData.transactionHash}`);
    } catch (error: any) {
      setHasClicked(false);
      // console.log(error);
      showErrorToast(error.message as string);
    }
    // await subgraphClient.waitForBlock(transactionData.blockNumber);
  }, [apiClients,
    isCorrectNetworkSelected, showErrorToast, showInfoToast, workspaceFactoryContractExisting]);

  const value = useMemo(() => ({
    createWorkspace, daoCreated, daoData, loading, editWorkspace, hasClicked,
  }), [createWorkspace, daoCreated, daoData, editWorkspace, hasClicked, loading]);
  return (
    <DaoContext.Provider value={value}>
      {children}
    </DaoContext.Provider>
  );
}
export function useDaoContext() {
  return useContext(DaoContext);
}
