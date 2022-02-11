import { gql } from '@apollo/client';
import { Container, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useContext, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import GrantCard from '../src/components/browse_grants/grantCard';
import Sidebar from '../src/components/browse_grants/sidebar';
import Heading from '../src/components/ui/heading';
import { DAI } from '../src/constants/assetDetails';
import { getAllGrants } from '../src/graphql/daoQueries';
import NavbarLayout from '../src/layout/navbarLayout';
import { ApiClientsContext } from './_app';

const grantsData = [
  {
    id: '1',
    daoIcon: '/images/dummy/Polygon Icon.svg',
    daoName: 'Polygon DAO',
    isDaoVerified: true,
    grantTitle: 'Storage Provider (SP) Tooling Ideas',
    grantDesc:
      'A tool, script or tutorial to set up monitoring for miner GPU, CPU, memory and other and resource and performance metrics, ideally using Prometheus',
    numOfApplicants: 0,
    endTimestamp: new Date('January 2, 2022 23:59:59:000').getTime(),
    grantAmount: 60,
    grantCurrency: 'ETH',
    grantCurrencyIcon: '/images/dummy/Ethereum Icon.svg',
    isGrantVerified: true,
  },
  {
    id: '1',
    daoIcon: '/images/dummy/Polygon Icon.svg',
    daoName: 'Polygon DAO',
    isDaoVerified: true,
    grantTitle: 'Storage Provider (SP) Tooling Ideas',
    grantDesc:
      'A tool, script or tutorial to set up monitoring for miner GPU, CPU, memory and other and resource and performance metrics, ideally using Prometheus',
    numOfApplicants: 0,
    endTimestamp: new Date('January 2, 2022 23:59:59:000').getTime(),
    grantAmount: 60,
    grantCurrency: 'ETH',
    grantCurrencyIcon: '/images/dummy/Ethereum Icon.svg',
    isGrantVerified: true,
  },
  {
    id: '1',
    daoIcon: '/images/dummy/Polygon Icon.svg',
    daoName: 'Polygon DAO',
    isDaoVerified: true,
    grantTitle: 'Storage Provider (SP) Tooling Ideas',
    grantDesc:
      'A tool, script or tutorial to set up monitoring for miner GPU, CPU, memory and other and resource and performance metrics, ideally using Prometheus',
    numOfApplicants: 0,
    endTimestamp: new Date('January 2, 2022 23:59:59:000').getTime(),
    grantAmount: 60,
    grantCurrency: 'ETH',
    grantCurrencyIcon: '/images/dummy/Ethereum Icon.svg',
    isGrantVerified: true,
  },
];

function BrowseGrants() {
  const containerRef = useRef(null);
  const [{ data: accountData }] = useAccount();
  const router = useRouter();
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient.client;

  const toast = useToast();
  const [grants, setGrants] = React.useState<any>([]);

  const pageSize = 20;
  const [currentPage, setCurrentPage] = React.useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGrantData = async () => {
    if (!subgraphClient) return;
    console.log(grants);
    try {
      const { data } = (await subgraphClient.query({
        query: gql(getAllGrants),
        variables: {
          first: pageSize,
          skip: currentPage * pageSize,
        },
      })) as any;
      // console.log(data);
      if (data.grants.length > 0) {
        setCurrentPage(currentPage + 1);
        setGrants([...grants, ...data.grants]);
      }
      // setGrants([...grants, ...grantsData]);
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error getting workspace data',
        status: 'error',
      });
    }
  };

  //   const { current } = currentPageRef;
  //   if (!current) return;
  //   ((current as HTMLElement)?.parentNode as HTMLElement).scrollTo({
  //     top: 0,
  //     left: 0,
  //     behavior: 'smooth',
  //   });
  //   // console.log(currentPageRef.current?.parentNode);
  //   setCurrentStep(step);
  // };

  const handleScroll = useCallback(() => {
    const { current } = containerRef;
    if (!current) return;
    const parentElement = (current as HTMLElement)?.parentNode as HTMLElement;
    // console.log(((current as HTMLElement)?.parentNode as HTMLElement).scrollTop);
    // console.log(parentElement.scrollTop);
    // console.log(parentElement.scrollHeight - parentElement.clientHeight);
    // console.log(Math.abs(parentElement.scrollTop
    //   - (parentElement.scrollHeight - parentElement.clientHeight)));
    const reachedBottom = Math.abs(
      parentElement.scrollTop - (parentElement.scrollHeight - parentElement.clientHeight),
    ) < 10;
    if (reachedBottom) {
      console.log(reachedBottom);
    }

    if (reachedBottom) {
      getGrantData();
      // setGrants([...grants, ...grantsData]);
    }
  }, [containerRef, getGrantData]);

  useEffect(() => {
    getGrantData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { current } = containerRef;
    if (!current) return;
    const parentElement = (current as HTMLElement)?.parentNode as HTMLElement;
    parentElement.addEventListener('scroll', handleScroll);

    // eslint-disable-next-line consistent-return
    return () => parentElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Container ref={containerRef} maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="834px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Heading title="Browse grants" />
        {grants.length > 0
          && grants.map((grant: any) => (
            <GrantCard
              // eslint-disable-next-line react/no-array-index-key
              key={grant.id}
              daoIcon={`https://ipfs.infura.io:5001/api/v0/cat?arg=${grant.workspace.logoIpfsHash}`}
              daoName={grant.workspace.title}
              isDaoVerified
              grantTitle={grant.title}
              grantDesc={grant.summary}
              numOfApplicants={0}
              endTimestamp={new Date(grant.deadline).getTime()}
              grantAmount={grant.reward.committed}
              grantCurrency={grant.reward.asset === DAI ? 'DAI' : 'WETH'}
              grantCurrencyIcon="/images/dummy/Ethereum Icon.svg"
              isGrantVerified={grant.funding > 0}
              onClick={() => {
                if (!(accountData && accountData.address)) {
                  router.push({
                    pathname: '/connect_wallet',
                    query: { flow: '/' },
                  });
                  return;
                }
                router.push({ pathname: '/explore_grants/about_grant' });
              }}
            />
          ))}
        {/* {grants.length === -1
          ? null : (
            grants
              .map((_, index) => (
                <GrantCard
                // eslint-disable-next-line react/no-array-index-key
                  key={`grant-card-${index}`}
                  daoIcon="/images/dummy/Polygon Icon.svg"
                  daoName="Polygon DAO"
                  isDaoVerified
                  grantTitle={`Storage Provider (SP) Tooling Ideas ${index}`}
                  grantDesc="Loremm impum"
                  numOfApplicants={0}
                  endTimestamp={new Date(
                    'January 2, 2022 23:59:59:000',
                  ).getTime()}
                  grantAmount={60}
                  grantCurrency="ETH"
                  grantCurrencyIcon="/images/dummy/Ethereum Icon.svg"
                  isGrantVerified
                  onClick={() => {
                    if (!(accountData && accountData.address)) {
                      router.push({
                        pathname: '/connect_wallet',
                        query: { flow: '/' },
                      });
                      return;
                    }
                    router.push({ pathname: '/explore_grants/about_grant' });
                  }}
                />
              ))
          )} */}
      </Container>
      {accountData && accountData.address ? null : <Sidebar />}
    </Container>
  );
}

BrowseGrants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderGetStarted>{page}</NavbarLayout>;
};
export default BrowseGrants;
