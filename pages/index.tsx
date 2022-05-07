import { Flex, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import {
  useGetAllGrantsLazyQuery,
  GetAllGrantsQuery,
} from 'src/generated/graphql';
import verify from 'src/utils/grantUtils';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import { useAccount } from 'wagmi';
import GrantCard from '../src/components/browse_grants/grantCard';
import Sidebar from '../src/components/browse_grants/sidebar';
import Heading from '../src/components/ui/heading';
import NavbarLayout from '../src/layout/navbarLayout';
import {
  formatAmount,
} from '../src/utils/formattingUtils';
import { ApiClientsContext } from './_app';

const PAGE_SIZE = 40;

function BrowseGrants() {
  const containerRef = useRef(null);
  const [{ data: accountData }] = useAccount();
  const router = useRouter();
  const { subgraphClients } = useContext(ApiClientsContext)!;

  const allNetworkGrants = Object.keys(subgraphClients)!.map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (key) => useGetAllGrantsLazyQuery({ client: subgraphClients[key].client }),
  );
  useEffect(() => {}, [subgraphClients]);

  const toast = useToast();
  const [grants, setGrants] = useState<GetAllGrantsQuery['grants']>([]);

  const [currentPage, setCurrentPage] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGrantData = async (firstTime: boolean = false) => {
    try {
      const currentPageLocal = firstTime ? 0 : currentPage;
      const promises = allNetworkGrants.map(
        // eslint-disable-next-line no-async-promise-executor
        (allGrants) => new Promise(async (resolve) => {
          // console.log('calling grants');
          const { data } = await allGrants[0]({
            variables: {
              first: PAGE_SIZE,
              skip: currentPageLocal * PAGE_SIZE,
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
        const allGrantsData = [].concat(
          ...values,
        ) as GetAllGrantsQuery['grants'];
        if (firstTime) {
          setGrants(
            allGrantsData.sort((a: any, b: any) => b.createdAtS - a.createdAtS),
          );
        } else {
          setGrants(
            [...grants, ...allGrantsData].sort(
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

  const handleScroll = useCallback(() => {
    const { current } = containerRef;
    if (!current) return;
    const parentElement = (current as HTMLElement)?.parentNode as HTMLElement;
    const reachedBottom = Math.abs(
      parentElement.scrollTop
          - (parentElement.scrollHeight - parentElement.clientHeight),
    ) < 10;
    if (reachedBottom) {
      getGrantData();
    }
  }, [containerRef, getGrantData]);

  useEffect(() => {
    // setCurrentPage(0);
    getGrantData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountData?.address]);

  useEffect(() => {
    const { current } = containerRef;
    if (!current) return;
    const parentElement = (current as HTMLElement)?.parentNode as HTMLElement;
    parentElement.addEventListener('scroll', handleScroll);

    // eslint-disable-next-line consistent-return
    return () => parentElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Flex ref={containerRef} direction="row" justify="center">
      <Flex direction="column" w="55%" alignItems="stretch" pb={8} px={10}>
        <Heading title="Discover grants" />
        {grants.length > 0
          && grants.map((grant) => {
            const chainId = getSupportedChainIdFromSupportedNetwork(
              grant.workspace.supportedNetworks[0],
            );
            const chainInfo = CHAIN_INFO[chainId]?.supportedCurrencies[
              grant.reward.asset.toLowerCase()
            ];
            const [isGrantVerified, funding] = verify(
              grant.funding,
              chainInfo?.decimals,
            );
            console.log('Grants: ', grants);
            return (
              <GrantCard
                daoID={grant.workspace.id}
                key={grant.id}
                grantID={grant.id}
                daoIcon={getUrlForIPFSHash(grant.workspace.logoIpfsHash)}
                daoName={grant.workspace.title}
                isDaoVerified={false}
                grantTitle={grant.title}
                grantDesc={grant.summary}
                numOfApplicants={grant.numberOfApplications}
                endTimestamp={new Date(grant.deadline!).getTime()}
                grantAmount={formatAmount(
                  grant.reward.committed,
                  chainInfo?.decimals ?? 18,
                )}
                grantCurrency={chainInfo?.label ?? 'LOL'}
                grantCurrencyIcon={
                  chainInfo?.icon ?? '/images/dummy/Ethereum Icon.svg'
                }
                isGrantVerified={isGrantVerified}
                funding={funding}
                chainId={chainId}
                onClick={() => {
                  if (!(accountData && accountData.address)) {
                    router.push({
                      pathname: '/connect_wallet',
                      query: {
                        flow: '/',
                        grantId: grant.id,
                        chainId,
                      },
                    });
                    return;
                  }
                  router.push({
                    pathname: '/explore_grants/about_grant',
                    query: {
                      grantId: grant.id,
                      chainId,
                    },
                  });
                }}
                onTitleClick={() => {
                  router.push({
                    pathname: '/explore_grants/about_grant',
                    query: {
                      grantId: grant.id,
                      chainId,
                    },
                  });
                }}
              />
            );
          })}
      </Flex>
      {accountData && accountData.address ? null : (
        <Flex w="26%" pos="sticky" top={0}>
          <Sidebar />
        </Flex>
      )}
    </Flex>
  );
}

BrowseGrants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderGetStarted>{page}</NavbarLayout>;
};
export default BrowseGrants;
