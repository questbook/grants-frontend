import { Container } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import Heading from '../../src/components/ui/heading';
import AddFunds from '../../src/components/your_grants/add_funds_modal';
import YourGrantCard from '../../src/components/your_grants/yourGrantCard';
import NavbarLayout from '../../src/layout/navbarLayout';

function YourGrants() {
  const router = useRouter();
  const [addFundsIsOpen, setAddFundsIsOpen] = React.useState(false);
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
          {Array(1)
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
          {Array(1)
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
          {Array(1)
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
