import { useState } from 'react';

export type PaginatedData<T> = {
  items: T[]
  loading: boolean
  nextPage?: string
  hasMore: boolean
  error?: Error
};

function usePaginatedDataStore<T>() {
  const [data, setData] = useState<PaginatedData<T>>();

  return {
    data,
    loadMoreData: async () => {

    },
  };
}

export default usePaginatedDataStore;
