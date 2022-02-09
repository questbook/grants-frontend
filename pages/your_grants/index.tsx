import { gql } from '@apollo/client';
import { Container, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement, useContext, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Heading from '../../src/components/ui/heading';
import AddFunds from '../../src/components/your_grants/add_funds_modal';
import YourGrantCard from '../../src/components/your_grants/yourGrantCard';
import { DAI } from '../../src/constants/assetDetails';
import { getAllGrantsForADao } from '../../src/graphql/daoQueries';
import NavbarLayout from '../../src/layout/navbarLayout';
import { ApiClientsContext } from '../_app';

function YourGrants() {
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient.client;
  const router = useRouter();
  const [addFundsIsOpen, setAddFundsIsOpen] = React.useState(false);

  const toast = useToast();
  const [grants, setGrants] = React.useState<any[]>([]);
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });
  const getGrantData = async () => {
    if (!subgraphClient) return;
    try {
      const { data } = await subgraphClient
        .query({
          query: gql(getAllGrantsForADao),
          variables: {
            first: 20,
            skip: 0,
            creatorID: accountData?.address,
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
    <>
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
          <Heading title="Your grants" />
          {grants.length > 0 && grants.map((grant) => (
            <YourGrantCard
              daoIcon={`https://ipfs.infura.io:5001/api/v0/cat?arg=${grant.workspace.logoIpfsHash}`}
              grantTitle={grant.title}
              grantDesc={grant.summary}
              numOfApplicants={0}
              endTimestamp={new Date(
                grant.deadline,
              ).getTime()}
              grantAmount={grant.reward.committed}
              grantCurrency={grant.reward.asset === DAI ? 'DAI' : 'WETH'}
              grantCurrencyIcon="/images/dummy/Ethereum Icon.svg"
              state="done"
              onEditClick={() => router.push({
                pathname: '/your_grants/edit_grant/',
                query: {
                  account: true,
                },
              })}
              onAddFundsClick={() => setAddFundsIsOpen(true)}
            />
          ))}
          {grants.length === 0 && Array(1)
            .fill(0)
            .map(() => (
              <YourGrantCard
                daoIcon="/images/dummy/Polygon Icon.svg"
                grantTitle="Storage Provider (SP) Tooling Ideas"
                grantDesc="A tool, script or tutorial to set up monitoring for miner GPU, CPU, memory and other and resource and performance metrics, ideally using Prometheus"
                numOfApplicants={0}
                endTimestamp={new Date(
                  'January 2, 2022 23:59:59:000',
                ).getTime()}
                grantAmount={60}
                grantCurrency="ETH"
                grantCurrencyIcon="/images/dummy/Ethereum Icon.svg"
                state="done"
                onEditClick={() => router.push({
                  pathname: '/your_grants/edit_grant/',
                  query: {
                    account: true,
                  },
                })}
                onAddFundsClick={() => setAddFundsIsOpen(true)}
              />
            ))}
          {grants.length === 0 && Array(1)
            .fill(0)
            .map(() => (
              <YourGrantCard
                daoIcon="/images/dummy/Polygon Icon.svg"
                grantTitle="Storage Provider (SP) Tooling Ideas"
                grantDesc="A tool, script or tutorial to set up monitoring for miner GPU, CPU, memory and other and resource and performance metrics, ideally using Prometheus"
                numOfApplicants={10}
                endTimestamp={new Date(
                  'January 2, 2022 23:59:59:000',
                ).getTime()}
                grantAmount={60}
                grantCurrency="ETH"
                grantCurrencyIcon="/images/dummy/Ethereum Icon.svg"
                state="done"
                onEditClick={() => router.push({
                  pathname: '/your_grants/edit_grant/',
                  query: {
                    account: true,
                  },
                })}
                onViewApplicantsClick={() => router.push({
                  pathname: '/your_grants/view_applicants/',
                  query: {
                    account: true,
                  },
                })}
                onAddFundsClick={() => setAddFundsIsOpen(true)}
              />
            ))}
          {grants.length === 0 && Array(1)
            .fill(0)
            .map(() => (
              <YourGrantCard
                daoIcon="/images/dummy/Polygon Icon.svg"
                grantTitle="Storage Provider (SP) Tooling Ideas"
                grantDesc="A tool, script or tutorial to set up monitoring for miner GPU, CPU, memory and other and resource and performance metrics, ideally using Prometheus"
                numOfApplicants={10}
                endTimestamp={new Date(
                  'January 2, 2022 23:59:59:000',
                ).getTime()}
                grantAmount={60}
                grantCurrency="ETH"
                grantCurrencyIcon="/images/dummy/Ethereum Icon.svg"
                state="processing"
                onEditClick={() => router.push({
                  pathname: '/your_grants/edit_grant/',

                })}
                onViewApplicantsClick={() => router.push({
                  pathname: '/your_grants/view_applicants/',
                })}
                onAddFundsClick={() => setAddFundsIsOpen(true)}
              />
            ))}
        </Container>
      </Container>
      <AddFunds
        isOpen={addFundsIsOpen}
        onClose={() => setAddFundsIsOpen(false)}
      />
    </>
  );
}

YourGrants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderGetStarted>{page}</NavbarLayout>;
};
export default YourGrants;
