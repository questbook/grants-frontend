import { GrantCreateRequest, GrantUpdateRequest } from '@questbook/service-validator-client';
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
import ContextGenerator from '../utils/contextGenerator';
import useGrantsHook from './useGrantsHook';
import usePaginatedDataStore from './usePaginatedDataStore';

// import useGrantContract from '../contracts/useGrantContract';

const useGrantsStore = () => {
  const { workspace } = useContext(ApiClientsContext)!;

  const [{ data: accountData }] = useAccount();
  const grantHook = useGrantsHook();

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
    loading, setTransactionData, transactionData, transactionType, error,
  } = grantHook;

  const createGrantHandler = (
    formData: GrantCreateRequest,
  ) => grantHook.createGrantHandler(formData);

  const updateGrantHandler = (
    formData: GrantUpdateRequest,
    grantUpdateContract: any,
  ) => grantHook.updateGrantHandler(formData, grantUpdateContract);

  const archiveGrantHandler = (
    newState: boolean,
    changeCount: number,
    grantId: string,
    grantArchiveContract: any,
  ) => grantHook.archiveGrantHandler(newState, changeCount, grantId, grantArchiveContract);

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
