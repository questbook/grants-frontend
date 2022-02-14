import { gql } from '@apollo/client';
import {
  Container, Flex, useToast, Image, Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement, useCallback, useContext, useEffect, useRef,
} from 'react';
import { useAccount } from 'wagmi';
import Heading from '../../src/components/ui/heading';
import AddFunds from '../../src/components/your_grants/add_funds_modal';
import YourGrantCard from '../../src/components/your_grants/yourGrantCard';
import supportedCurrencies from '../../src/constants/supportedCurrencies';
import { getAllGrantsForADao } from '../../src/graphql/daoQueries';
import NavbarLayout from '../../src/layout/navbarLayout';
import { formatAmount } from '../../src/utils/formattingUtils';
import { ApiClientsContext } from '../_app';

function YourGrants() {
  const containerRef = useRef(null);
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient.client;
  const router = useRouter();
  const [addFundsIsOpen, setAddFundsIsOpen] = React.useState(false);

  const toast = useToast();
  const [grants, setGrants] = React.useState<any[]>([]);

  const pageSize = 20;
  const [currentPage, setCurrentPage] = React.useState(0);

  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGrantData = async () => {
    if (!subgraphClient || !accountData?.address) return;
    try {
      const { data } = await subgraphClient
        .query({
          query: gql(getAllGrantsForADao),
          variables: {
            first: pageSize,
            skip: pageSize * currentPage,
            creatorId: accountData?.address,
          },
        }) as any;
      // console.log(data);
      if (data.grants.length > 0) {
        setCurrentPage(currentPage + 1);
        setGrants([...grants, ...data.grants]);
      }
    } catch (e: any) {
      console.log(e);
      toast({
        position: 'top',
        duration: null,
        render: ({ onClose }) => (
          <Flex
            alignItems="flex-start"
            bgColor="#FFC0C0"
            border="2px solid #EE7979"
            px="26px"
            py="22px"
            borderRadius="6px"
            mt={4}
            mx={10}
            alignSelf="stretch"
          >
            <Flex
              alignItems="center"
              justifyContent="center"
              bgColor="#F7B7B7"
              border="2px solid #EE7979"
              borderRadius="40px"
              p={2}
              h="40px"
              w="40px"
              mt="5px"
            >
              <Image
                onClick={onClose}
                h="40px"
                w="40px"
                src="/ui_icons/result_rejected_application.svg"
                alt="Rejected"
              />
            </Flex>
            <Flex ml="23px" direction="column">
              <Text fontSize="16px" lineHeight="24px" fontWeight="700" color="#7B4646">
                Error Message
              </Text>
              <Text fontSize="16px" lineHeight="24px" fontWeight="400" color="#7B4646">
                {e.message}
              </Text>
            </Flex>
          </Flex>
        ),
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

  return (
    <>
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
          <Heading title="Your grants" />
          {grants.length > 0
          && grants.map((grant: any) => {
            const grantCurrency = supportedCurrencies.find(
              (currency) => currency.id.toLowerCase()
                === grant.reward.asset.toString().toLowerCase(),
            );
            return (
              <YourGrantCard
                key={grant.id}
                daoIcon={`https://ipfs.infura.io:5001/api/v0/cat?arg=${grant.workspace.logoIpfsHash}`}
                grantTitle={grant.title}
                grantDesc={grant.summary}
                numOfApplicants={0}
                endTimestamp={new Date(
                  grant.deadline,
                ).getTime()}
                grantAmount={formatAmount(grant.reward.committed)}
                grantCurrency={grantCurrency?.label ?? 'LOL'}
                grantCurrencyIcon={grantCurrency?.icon ?? '/images/dummy/Ethereum Icon.svg'}
                state="done"
                onEditClick={() => router.push({
                  pathname: '/your_grants/edit_grant/',
                  query: {
                    account: true,
                    id: grant.id,
                  },
                })}
                onAddFundsClick={() => setAddFundsIsOpen(true)}
              />
            );
          })}
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
