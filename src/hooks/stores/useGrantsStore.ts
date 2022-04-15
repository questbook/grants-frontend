import { GrantCreateRequest, GrantUpdateRequest } from '@questbook/service-validator-client';
import ContextGenerator from '../utils/contextGenerator';
import useGrantsHook from './useGrantsHook';

// import useGrantContract from '../contracts/useGrantContract';

const useGrantsStore = () => {
  const grantHook = useGrantsHook();
  const {
    loading, setTransactionData, transactionData, transactionType, transactionLink, grants, error,
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

  return {
    error,
    loading,
    setTransactionData, // so that component can reset transaction data after displaying the toast
    transactionData,
    transactionType,
    transactionLink,
    grants,
    // yourGrants,
    // archivedGrants,
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
