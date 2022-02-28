import { gql } from '@apollo/client';
import { Flex, useToast } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import config from 'src/constants/config';
import {
  useGetAllGrantsLazyQuery,
  GetAllGrantsQuery,
} from 'src/generated/graphql';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import { useAccount } from 'wagmi';
import GrantCard from '../src/components/browse_grants/grantCard';
import Sidebar from '../src/components/browse_grants/sidebar';
import Heading from '../src/components/ui/heading';
import supportedCurrencies from '../src/constants/supportedCurrencies';
import NavbarLayout from '../src/layout/navbarLayout';
import { formatAmount, formatAmountUpto2Decimals, getMultiplier } from '../src/utils/formattingUtils';
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
  const [conversionRate, setConversionRate] = useState<{ [x: string]: any }>();

  // useEffect(() => {
  //   console.log('Conversion Rate: ', conversionRate);
  // }, [conversionRate]);

  const getConversionRates = async () => {
    if (!subgraphClient) return;
    const CONVERSION_QUERY = gql(`query conversionRates {
      rates {
        id,
        rate
      }
    }`);
    const ret = await subgraphClient.readQuery({ query: CONVERSION_QUERY });
    if (ret) {
      const conversionMap = {};
      ret.rates.reduce(
        (
          map: { [x: string]: any },
          obj: { id: string | number; rate: any },
        ) => {
          // eslint-disable-next-line no-param-reassign
          map[obj.id] = { usd: obj.rate };
          return map;
        },
        conversionMap,
      );
      console.log('Set from cache: ', conversionMap);
      setConversionRate(conversionMap);
    } else {
      const res = await fetch(config.conversionRateAPI);
      if (res.status === 200) {
        const data = await res.json();
        const rates: { id: string; rate: any }[] = [];
        Object.keys(data).forEach((rate) => {
          rates.push({
            id: rate,
            rate: data[rate].usd,
          });
        });
        subgraphClient.writeQuery({ query: CONVERSION_QUERY, data: { rates } });
        console.log('Set from API: ', data);
        setConversionRate(data);
      }
    }
  };

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
      await getConversionRates();
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
      <Flex direction="column" w="55%" alignItems="stretch" pb={8} px={10}>
        <Heading title="Discover grants" />
        {grants.length > 0
          && grants.map((grant: any) => {
            const grantCurrency = supportedCurrencies.find(
              (currency) => currency.id.toLowerCase()
                === grant.reward.asset.toString().toLowerCase(),
            );
            const { usd } = conversionRate ? conversionRate[grantCurrency?.symbol!] : 0;
            const mul = usd !== 0 ? getMultiplier(usd) : -1;
            const amount = mul !== -1 ? BigNumber.from(grant.reward.committed)
              .mul(BigNumber.from(parseInt((usd * mul).toString(), 10)))
              .div(parseInt(mul.toString(), 10)) : -1;
            // console.log(formatAmountUpto2Decimals(amount.toString()));

            return (
              <GrantCard
                key={grant.id}
                daoIcon={getUrlForIPFSHash(grant.workspace.logoIpfsHash)}
                daoName={grant.workspace.title}
                isDaoVerified={false}
                grantTitle={grant.title}
                grantDesc={grant.summary}
                numOfApplicants={grant.numberOfApplications}
                endTimestamp={new Date(grant.deadline).getTime()}
                grantAmount={formatAmount(grant.reward.committed)}
                grantCurrency={grantCurrency?.label ?? 'LOL'}
                grantCurrencyIcon={
                  grantCurrency?.label
                    ? getIcon(grantCurrency.label)
                    : '/images/dummy/Ethereum Icon.svg'
                }
                grantAmountInUSD={amount !== -1 ? formatAmountUpto2Decimals(amount.toString()) : ''}
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
        <Flex w="26%" h="100%" pos="sticky" top={0}>
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
