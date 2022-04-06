import { GrantCreateRequest, GrantUpdateRequest } from '@questbook/service-validator-client';
import { ApiClientsContext } from 'pages/_app';
import { useContext } from 'react';
import { GetAllGrantsForCreatorQuery } from 'src/generated/graphql';
import { Grant } from 'src/types';
import ContextGenerator from '../utils/contextGenerator';
import usePaginatedDataStore from './usePaginatedDataStore';

type YourGrant = GetAllGrantsForCreatorQuery['grants'][0];

const useGrantsStore = () => {
  const { subgraphClients } = useContext(ApiClientsContext)!;

  const allGrants = usePaginatedDataStore<Grant>();
  const yourGrants = usePaginatedDataStore<YourGrant>();
  const archivedGrants = usePaginatedDataStore<YourGrant>();

  return {
    allGrants,
    yourGrants,
    archivedGrants,
    createGrant: async (request: GrantCreateRequest) => {

    },
    updateGrant: async (grantId: string, request: GrantUpdateRequest) => {

    },
    archiveGrant: async (grantId: string) => {

    },
  };
};

export const {
  context: GrantsContext,
  contextMaker: GrantsContextMaker,
} = ContextGenerator(useGrantsStore);

export default useGrantsStore;
