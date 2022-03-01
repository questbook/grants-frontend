import { Flex, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useContext, useEffect, useRef, useState,
} from 'react';
import { useGetAllGrantsLazyQuery, GetAllGrantsQuery } from 'src/generated/graphql';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import { useAccount } from 'wagmi';
import GrantCard from '../src/components/browse_grants/grantCard';
import Sidebar from '../src/components/browse_grants/sidebar';
import Heading from '../src/components/ui/heading';
import supportedCurrencies from '../src/constants/supportedCurrencies';
import NavbarLayout from '../src/layout/navbarLayout';
import { formatAmount } from '../src/utils/formattingUtils';
import { ApiClientsContext } from './_app';

const PAGE_SIZE = 20;

function BrowseGrants() {
  const containerRef = useRef(null);
  const [{ data: accountData }] = useAccount();
  const router = useRouter();
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient.client;

  const [getAllGrants] = useGetAllGrantsLazyQuery({ client: subgraphClient });

  const toast = useToast();
  const [grants, setGrants] = useState<GetAllGrantsQuery['grants']>([]);

  const [currentPage, setCurrentPage] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGrantData = async () => {
    if (!subgraphClient) return;
    try {
      const { data } = await getAllGrants({
        variables: {
          first: PAGE_SIZE,
          skip: currentPage * PAGE_SIZE,
        },
      });
      if (data) {
        setCurrentPage(currentPage + 1);
        setGrants([...grants, ...data.grants]);
      }
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
    getGrantData();
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

  const getIcon = (currency: string) => {
    if (currency === 'DAI') return '/ui_icons/brand/currency/dai.svg';
    if (currency === 'WMATIC') return '/ui_icons/brand/currency/wmatic.svg';
    return '/ui_icons/brand/currency/weth.svg';
  };

  return (
    <Flex ref={containerRef} direction="row" justify="center">
      <Flex
        direction="column"
        w="55%"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Heading title="Discover grants" />
        {grants.length > 0
          && grants.map((grant: any) => {
            const grantCurrency = supportedCurrencies.find(
              (currency) => currency.id.toLowerCase()
                === grant.reward.asset.toString().toLowerCase(),
            );
            return (
              <GrantCard
                key={grant.id}
                grantID={grant.id}
                daoIcon={getUrlForIPFSHash(grant.workspace.logoIpfsHash)}
                daoName={grant.workspace.title}
                isDaoVerified={false}
                grantTitle={grant.title}
                grantDesc={grant.summary}
                numOfApplicants={grant.numberOfApplications}
                endTimestamp={new Date(grant.deadline).getTime()}
                grantAmount={formatAmount(grant.reward.committed)}
                grantCurrency={grantCurrency?.label ?? 'LOL'}
                grantCurrencyIcon={grantCurrency?.label ? getIcon(grantCurrency.label) : '/images/dummy/Ethereum Icon.svg'}
                isGrantVerified={grant.funding > 0}
                onClick={() => {
                  if (!(accountData && accountData.address)) {
                    router.push({
                      pathname: '/connect_wallet',
                      query: { flow: '/' },
                    });
                    return;
                  }
                  router.push({
                    pathname: '/explore_grants/about_grant',
                    query: { grantID: grant.id },
                  });
                }}
              />
            );
          })}
      </Flex>
      {accountData && accountData.address ? null : (
        <Flex
          w="26%"
          h="100%"
          pos="sticky"
          top={0}
        >
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
