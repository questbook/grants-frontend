import { useContext, useRef, useState } from 'react';
import { DocumentNode, LazyQueryResult, useLazyQuery } from '@apollo/client';
import { ApiClientsContext } from 'pages/_app';
import { ALL_SUPPORTED_CHAIN_IDS, SupportedChainId } from 'src/constants/chains';

const PAGE_SIZE = 15;

export type PaginatedData<T> = {
  items: T[]
  /**
   * fraction of chains data is being loaded from
   * 0 => nothing loading
   * 1 => everything loading
   * */
  loading: number
  nextPage?: string
  hasMore: boolean
  error?: Error
};

export type PaginatedDataStoreProps<T, Q, V> = {
  /** which chains to fetch data from, if not specified -- will use all available chains */
  chains?: SupportedChainId[]
  /** variables to pass to the query function */
  variables?: Partial<V>
  /** extract item list from the query result */
  getItems: (q: LazyQueryResult<Q, V>['data']) => T[]
  /** sort function to help merge the data */
  sort?: (a: T, b: T) => number
  /** the query document used to send the query */
  queryDocument: DocumentNode
};

/** Generic paginated data hook, fetches data from multiple chains and can stitch them together */
function usePaginatedDataStore<T, Q, V extends { first?: number | null, skip?: number | null }>(
  {
    chains, queryDocument, variables, getItems, sort: sortFunction,
  }: PaginatedDataStoreProps<T, Q, V>,
) {
  const { subgraphClients } = useContext(ApiClientsContext)!;

  const chainsToUse = chains || ALL_SUPPORTED_CHAIN_IDS;

  const allNetworkQueries = chainsToUse.map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (key) => useLazyQuery<Q, V>(
      queryDocument,
      {
        client: subgraphClients[key].client,
        // @ts-ignore
        variables: { ...variables, first: PAGE_SIZE, skip: 0 },
      },
    ),
  );
  const prevLengthMap = useRef<{ [chain: string]: number }>({ });

  const [data, setData] = useState<PaginatedData<T>>({ items: [], loading: 0, hasMore: true });
  /** merge new data into the existing set */
  const mergeResults = (result: T[]) => {
    setData(
      (oldData) => {
        let items = [...oldData.items, ...result];
        items = sortFunction ? items.sort(sortFunction) : items;

        return { ...oldData, loading: oldData.loading - (1.0 / chainsToUse.length), items };
      },
    );
  };

  /** Fetch more data from the server */
  const fetchMore = async (force = false) => {
    if (!data.hasMore) {
      return;
    }
    if (data.loading && !force) {
      return;
    }
    // set the loading sign
    setData((old) => ({ ...old, loading: 1 }));

    const results = await Promise.all(
      allNetworkQueries.map(
        async ([fetchMoreData, result], i) => {
          const chain = chainsToUse[i];
          const isFirstFetch = typeof prevLengthMap.current[chain] === 'undefined';
          const hasMore = isFirstFetch
            || (result.data ? getItems(result.data)!.length >= PAGE_SIZE : true);
          if (hasMore) {
            const prevLength = prevLengthMap.current[chain] || 0;
            const { data: newData, error } = await fetchMoreData({
              // @ts-ignore
              variables: { ...variables, first: PAGE_SIZE, skip: prevLength },
            });
            const newItems = newData ? getItems(newData!) : [];
            prevLengthMap.current[chain] = (prevLengthMap.current[chain] || 0) + newItems.length;
            mergeResults(newItems);

            return { newItemLength: newItems.length, error };
          }

          return undefined;
        },
      ),
    );

    setData((old) => {
      const error = results.find((r) => r?.error)?.error;
      const hasMore = !!results.find((r) => (r?.newItemLength || 0) >= PAGE_SIZE);
      return {
        ...old,
        hasMore,
        loading: 0,
        error,
      };
    });
  };

  const clear = () => {
    prevLengthMap.current = { };
    setData({ items: [], loading: 0, hasMore: true });
  };

  return {
    data,
    requiresFirstFetch: !data.items.length && data.hasMore && !data.loading,
    fetchMore,
    clear,
  };
}

export default usePaginatedDataStore;
