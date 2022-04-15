import { Divider, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,

} from 'react';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import verify from 'src/utils/grantUtils';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import { useAccount } from 'wagmi';
import { GrantsContext } from 'src/hooks/stores/useGrantsStore';
import GrantCard from '../src/components/browse_grants/grantCard';
import Sidebar from '../src/components/browse_grants/sidebar';
import Heading from '../src/components/ui/heading';
import NavbarLayout from '../src/layout/navbarLayout';
import {
  formatAmount,
} from '../src/utils/formattingUtils';
import { ApiClientsContext } from './_app';

function BrowseGrants() {
  const containerRef = useRef(null);
  const [{ data: accountData }] = useAccount();
  const router = useRouter();
  const { subgraphClients } = useContext(ApiClientsContext)!;

  useEffect(() => { }, [subgraphClients]);

  // const [grants, setGrants] = useState<GetAllGrantsQuery['grants']>([]);
  const { allGrants } = useContext(GrantsContext);
  const allGrantsList = allGrants.data.items;
  const divWidth = Math.floor((1 - allGrants.data.loading) * 100);

  const handleScroll = useCallback(() => {
    const { current } = containerRef;
    if (!current) return;
    const parentElement = (current as HTMLElement)?.parentNode as HTMLElement;
    const reachedBottom = Math.abs(
      parentElement.scrollTop
      - (parentElement.scrollHeight - parentElement.clientHeight),
    ) < 10;
    if (reachedBottom) {
      // getGrantData();
      allGrants.fetchMore();
    }
  }, [containerRef, allGrants]);

  useEffect(() => {
    if (allGrants.requiresFirstFetch) {
      allGrants.fetchMore();
    }
  }, [allGrants]);

  // useEffect(() => {
  //   // setCurrentPage(0);
  //   getGrantData(true);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [accountData?.address]);

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
        <Heading title="Discover grants" dontRenderDivider />
        <Divider width={`${divWidth}%`} mt={4} mb={3} />
        {allGrantsList.length > 0
          && allGrantsList.map((grant) => {
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
