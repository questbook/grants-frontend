import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import { useAccount } from 'wagmi';
import { ValidationApi, GrantApplicationRequest } from '@questbook/service-validator-client';
import GrantCard from '../src/components/browse_grants/grantCard';
import Sidebar from '../src/components/browse_grants/sidebar';
import Heading from '../src/components/ui/heading';
import NavbarLayout from '../src/layout/navbarLayout';

function BrowseGrants() {
  const [{ data: accountData }] = useAccount();
  const router = useRouter();
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
        {Array(5)
          .fill(0)
          .map(() => (
            <GrantCard
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
function GrantApplicationRequest(): import("@questbook/service-validator-client").GrantApplicationRequest | undefined {
  throw new Error('Function not implemented.');
}

