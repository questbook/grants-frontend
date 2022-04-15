import { ApiClientsContext } from 'pages/_app';
import { useContext, useEffect } from 'react';
import { SupportedChainId } from 'src/constants/chains';
import {
  GetAllGrantsForCreatorQueryVariables,
  GetAllGrantsDocument,
  GetAllGrantsForCreatorDocument,
  GetAllGrantsForCreatorQuery,
  GetAllGrantsQuery,
  GetAllGrantsQueryVariables,
} from 'src/generated/graphql';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { useAccount } from 'wagmi';
import { CreateGrantForm } from 'src/types';
import ContextGenerator from '../utils/contextGenerator';
import useGrantMutations from './useGrantMutations';
import usePaginatedDataStore from './usePaginatedDataStore';

// import useGrantContract from '../contracts/useGrantContract';

const useGrantsStore = () => {
  const { workspace } = useContext(ApiClientsContext)!;

  const [{ data: accountData }] = useAccount();
  const grantHook = useGrantMutations();

  const myChainId = getSupportedChainIdFromWorkspace(workspace!) || SupportedChainId.RINKEBY;

  const allGrants = usePaginatedDataStore({
    queryDocument: GetAllGrantsDocument,
    variables: { applicantId: accountData?.address || '' } as GetAllGrantsQueryVariables,
    getItems: (q: GetAllGrantsQuery | undefined) => (
      (q?.grants || []).filter((g) => g.applications.length === 0)
    ),
    sort: (a, b) => b.createdAtS - a.createdAtS,
  });

  const yourGrants = usePaginatedDataStore({
    chains: [myChainId],
    queryDocument: GetAllGrantsForCreatorDocument,
    variables: { workspaceId: workspace?.id || '', acceptingApplications: true } as GetAllGrantsForCreatorQueryVariables,
    getItems: (q: GetAllGrantsForCreatorQuery | undefined) => q?.grants || [],
  });

  const archivedGrants = usePaginatedDataStore({
    chains: [myChainId],
    queryDocument: GetAllGrantsForCreatorDocument,
    variables: { workspaceId: workspace?.id || '', acceptingApplications: false } as GetAllGrantsForCreatorQueryVariables,
    getItems: (q: GetAllGrantsForCreatorQuery | undefined) => q?.grants || [],
  });

  const {
    loading, setTransactionData, transactionData, transactionLink, transactionType, error,
  } = grantHook;

  const createGrantHandler = (
    formData: CreateGrantForm,
  ) => grantHook.createGrant(formData);

  const updateGrantHandler = (
    formData: CreateGrantForm,
    grantUpdateContract: any,
  ) => grantHook.updateGrant(formData, grantUpdateContract);

  const archiveGrantHandler = (
    newState: boolean,
    changeCount: number,
    grantId: string,
    grantArchiveContract: any,
  ) => grantHook.archiveGrant(newState, changeCount, grantArchiveContract);

  useEffect(() => {
    yourGrants.clear();
    archivedGrants.clear();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myChainId]);

  return {
    error,
    loading,
    setTransactionData, // so that component can reset transaction data after displaying the toast
    transactionData,
    transactionLink,
    transactionType,
    allGrants,
    yourGrants,
    archivedGrants,
    createGrantHandler,
    updateGrantHandler,
    archiveGrantHandler,
  };
};

export const {
  context: GrantsContext,
  contextMaker: GrantsContextMaker,
} = ContextGenerator(useGrantsStore);

export default useGrantsStore;
