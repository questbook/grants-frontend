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
  useGetGrantsAppliedToLazyQuery,
} from 'src/generated/graphql';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import { useAccount } from 'wagmi';
import GrantCard from '../src/components/browse_grants/grantCard';
import Sidebar from '../src/components/browse_grants/sidebar';
import Heading from '../src/components/ui/heading';
import NavbarLayout from '../src/layout/navbarLayout';
import {
  formatAmount,
  getChainIdFromResponse,
  parseAmount,
} from '../src/utils/formattingUtils';
import { ApiClientsContext } from './_app';

const PAGE_SIZE = 5;

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

  const allGrantsAppliedTo = Object.keys(subgraphClients)!.map(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    (key) => useGetGrantsAppliedToLazyQuery({ client: subgraphClients[key].client }),
  );

  const toast = useToast();
  const [grants, setGrants] = useState<GetAllGrantsQuery['grants']>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [grantsAppliedTo, setGrantsAppliedTo] = React.useState<string[]>();

  const getGrantsAppliedToData = async () => {
    setCurrentPage(0);
    if (!accountData?.address) {
      setGrantsAppliedTo(['']);
      return;
    }
    try {
      const promises = allGrantsAppliedTo.map(
        // eslint-disable-next-line no-async-promise-executor
        (allGrants) => new Promise(async (resolve) => {
          // console.log('calling grants');
          const { data } = await allGrants[0]({
            variables: {
              applicantID: accountData?.address,
            },
          });
          if (data && data.grantApplications) {
            const temp: string[] = [];
            data.grantApplications.forEach((grantApplication) => {
              temp.push(grantApplication.grant.id);
            });
            resolve(temp);
          } else {
            resolve(['']);
          }
        }),
      );
      Promise.all(promises).then((values: any[]) => {
        const allGrantsData = [].concat(...values);
        setGrantsAppliedTo(allGrantsData);
      });
    } catch (e) {
      // console.log(e);
      toast({
        title: 'Error loading grants',
        status: 'error',
      });
    }
  };

  // const getGrantsAppliedToData = async () => {
  //   if (!subgraphClient) return;
  //   setCurrentPage(0);
  //   if (!accountData?.address) {
  //     setGrantsAppliedTo(['']);
  //     return;
  //   }

  //   try {
  //     const { data } = await getGrantsAppliedTo({
  //       variables: {
  //         applicantID: accountData?.address,
  //       },
  //     });
  //     if (data) {
  //       const temp: string[] = [];
  //       data.grantApplications.forEach((grantApplication) => {
  //         temp.push(grantApplication.grant.id);
  //       });
  //       setGrantsAppliedTo(temp);
  //     }
  //   } catch (e) {
  //     // console.log(e);
  //     toast({
  //       title: 'Error loading grants applied to',
  //       status: 'error',
  //     });
  //   }
  // };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGrantData = async () => {
    // if (!subgraphClient) return;
    try {
      const promises = allNetworkGrants.map(
        // eslint-disable-next-line no-async-promise-executor
        (allGrants) => new Promise(async (resolve) => {
          // console.log('calling grants');
          const { data } = await allGrants[0]({
            variables: {
              first: PAGE_SIZE,
              skip: currentPage * PAGE_SIZE,
            },
          });
          if (data && data.grants) {
            resolve(data.grants);
          } else {
            resolve([]);
          }
        }),
      );
      Promise.all(promises).then((values: any[]) => {
        const allGrantsData = [].concat(...values);
        setGrants([...grants, ...allGrantsData]);
        setCurrentPage(currentPage + 1);
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
    getGrantsAppliedToData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('grantsAppliedTo', grantsAppliedTo);
    getGrantData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grantsAppliedTo]);

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
            // console.log(grant.workspace.supportedNetworks[0]);
            // console.log(grant.reward);
            const isGrantVerified = parseInt(parseAmount(grant.funding), 10) > 0;
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
                grantAmount={formatAmount(grant.reward.committed)}
                grantCurrency={
                  CHAIN_INFO[
                    getSupportedChainIdFromSupportedNetwork(
                      grant.workspace.supportedNetworks[0],
                    )
                  ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.label ?? 'LOL'
                }
                grantCurrencyIcon={
                  CHAIN_INFO[
                    getSupportedChainIdFromSupportedNetwork(
                      grant.workspace.supportedNetworks[0],
                    )
                  ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.icon
                  ?? '/images/dummy/Ethereum Icon.svg'
                }
                isGrantVerified={isGrantVerified}
                chainId={getSupportedChainIdFromSupportedNetwork(
                  grant.workspace.supportedNetworks[0],
                )}
                onClick={() => {
                  if (!(accountData && accountData.address)) {
                    router.push({
                      pathname: '/connect_wallet',
                      query: {
                        flow: '/',
                        grantId: grant.id,
                        chainId: getChainIdFromResponse(
                          grant.workspace.supportedNetworks[0],
                        ),
                      },
                    });
                    return;
                  }
                  router.push({
                    pathname: '/explore_grants/about_grant',
                    query: {
                      grantId: grant.id,
                      chainId: getChainIdFromResponse(
                        grant.workspace.supportedNetworks[0],
                      ),
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
