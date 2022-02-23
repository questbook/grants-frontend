import { SupportedNetwork } from '@questbook/service-validator-client';
import { ApiClientsContext } from 'pages/_app';
import React, {
  ReactNode, useCallback, useContext, useMemo,
} from 'react';
import { SupportedChainId } from 'src/constants/chains';
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
  loading: boolean;
  daoData: WorkspaceData | undefined;
  daoCreated: boolean;
};
const daoContextDefaultValues: DaoContextType = {
  createWorkspace: () => {},
  loading: false,
  daoData: undefined,
  daoCreated: false,
};

export const DaoContext = React.createContext<DaoContextType>(daoContextDefaultValues);

export function DaoProvider({ children }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [daoCreated, setDaoCreated] = React.useState(false);
  const [daoData, setDaoData] = React.useState<WorkspaceData>();
  const [{ data: accountData }] = useAccount();
  const apiClients = useContext(ApiClientsContext);
  const { showErrorToast } = useToastContext();
  const workspaceFactoryContract = useWorkspaceRegistryContract(
    apiClients?.chainId || SupportedChainId.RINKEBY,
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
  const value = useMemo(() => ({
    createWorkspace, daoCreated, daoData, loading,
  }), [createWorkspace, daoCreated, daoData, loading]);

  return (
    <DaoContext.Provider value={value}>
      {children}
    </DaoContext.Provider>
  );
}
export function useDaoContext() {
  return useContext(DaoContext);
}
