import { gql } from '@apollo/client';
import { Container, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';
import GrantCard from '../src/components/browse_grants/grantCard';
import Sidebar from '../src/components/browse_grants/sidebar';
import Heading from '../src/components/ui/heading';
import { DAI } from '../src/constants/assetDetails';
import { getAllGrants } from '../src/graphql/daoQueries';
import NavbarLayout from '../src/layout/navbarLayout';
import { ApiClientsContext } from './_app';

function BrowseGrants() {
  const [{ data: accountData }] = useAccount();
  const router = useRouter();
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient.client;

  const toast = useToast();
  const [grants, setGrants] = React.useState<any[]>([]);

  const getGrantData = async () => {
    if (!subgraphClient) return;
    try {
      const { data } = await subgraphClient
        .query({
          query: gql(getAllGrants),
          variables: {
            first: 20,
            skip: 0,
          },
        }) as any;
      // console.log(data);
      if (data.grants.length > 0) {
        setGrants(data.grants);
      } else {
        toast({
          title: 'Displaying dummy data',
          status: 'info',
        });
        setGrants([]);
      }
    } catch (e) {
      toast({
        title: 'Error getting workspace data',
        status: 'error',
      });
    }
  };

  useEffect(() => {
    getGrantData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxW="100%" display="flex" px="70px">
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
        {grants.length > 0 && grants
          .map((grant) => (
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
                  router.push({ pathname: '/connect_wallet', query: { flow: '/' } });
                  return;
                }
                router.push({ pathname: '/explore_grants/about_grant' });
              }}
            />
          ))}
        {grants.length === 0 && Array(5).fill(0).map((_, index) => (
          <GrantCard
              // eslint-disable-next-line react/no-array-index-key
            key={`grant-card-${index}`}
            daoIcon="/images/dummy/Polygon Icon.svg"
            daoName="Polygon DAO"
            isDaoVerified
            grantTitle="Storage Provider (SP) Tooling Ideas"
            grantDesc="A tool, script or tutorial to set up monitoring for miner GPU, CPU, memory and other and resource and performance metrics, ideally using Prometheus"
            numOfApplicants={0}
            endTimestamp={new Date('January 2, 2022 23:59:59:000').getTime()}
            grantAmount={60}
            grantCurrency="ETH"
            grantCurrencyIcon="/images/dummy/Ethereum Icon.svg"
            isGrantVerified
            onClick={() => {
              if (!(accountData && accountData.address)) {
                router.push({ pathname: '/connect_wallet', query: { flow: '/' } });
                return;
              }
              router.push({ pathname: '/explore_grants/about_grant' });
            }}
          />
        ))}
      </Container>
      {accountData && accountData.address ? null : <Sidebar />}
    </Container>
  );
}

BrowseGrants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderGetStarted>{page}</NavbarLayout>;
};
export default BrowseGrants;
