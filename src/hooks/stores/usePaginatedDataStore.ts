import React, { useState, useContext, useEffect } from 'react';
import { ApiClientsContext } from 'pages/_app';
import {
  useGetAllGrantsLazyQuery,
  GetAllGrantsQuery,
  useGetAllGrantsForCreatorQuery,
} from 'src/generated/graphql';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { useAccount } from 'wagmi';
import { useToast } from '@chakra-ui/react';

export type PaginatedData<T> = {
  items: T[]
  loading: boolean
  nextPage?: string
  hasMore: boolean
  error?: Error
};

type YourGrant = GetAllGrantsForCreatorQuery['grants'][0];

function usePaginatedDataStore<T>() {
  const PAGE_SIZE = 40;

  const [grants, setGrants] = useState<GetAllGrantsQuery['grants']>([]);
  const [yourGrants, setYourGrants] = useState<YourGrant>([]);
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;

  const [{ data: accountData }] = useAccount();
  const toast = useToast();

  const allNetworkGrants = Object.keys(subgraphClients)!.map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (key) => useGetAllGrantsLazyQuery({ client: subgraphClients[key].client }),
  );

  const getGrantData = async (
    currentPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    firstTime: boolean = false,
    pageSize: number = PAGE_SIZE,
  ) => {
    try {
      const currentPageLocal = firstTime ? 0 : currentPage;
      const promises = allNetworkGrants.map(
        // eslint-disable-next-line no-async-promise-executor
        (allGrants) => new Promise(async (resolve) => {
          // console.log('calling grants');
          // eslint-disable-next-line @typescript-eslint/no-shadow
          const { data } = await allGrants[0]({
            variables: {
              first: pageSize,
              skip: currentPageLocal * pageSize,
              applicantId: accountData?.address ?? '',
            },
          });
          if (data && data.grants) {
            const filteredGrants = data.grants.filter(
              (grant) => grant.applications.length === 0,
            );
            resolve(filteredGrants);
          } else {
            resolve([]);
          }
        }),
      );
      Promise.all(promises).then((values: any[]) => {
        const allGrantsDatas = [].concat(
          ...values,
        ) as GetAllGrantsQuery['grants'];
        if (firstTime) {
          setGrants(
            allGrantsDatas.sort((a: any, b: any) => b.createdAtS - a.createdAtS),
          );
        } else {
          setGrants(
            [...grants, ...allGrantsDatas].sort(
              (a: any, b: any) => b.createdAtS - a.createdAtS,
            ),
          );
        }
        setCurrentPage(firstTime ? 1 : currentPage + 1);
        // @TODO: Handle the case where a lot of the grants are filtered out.
      });
    } catch (e) {
      // console.log(e);
      toast({
        title: 'Error loading grants',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    // getGrantData(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData?.address]);

  return {
    grants,
    loadMoreGrants: async (
      pageSize: number,
      currentPage: number,
      setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
    ) => {
      getGrantData(currentPage, setCurrentPage, false, pageSize);
    },
  };
}

export default usePaginatedDataStore;
