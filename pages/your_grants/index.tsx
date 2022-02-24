import {
  Flex, useToast, Image, Text, Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { useAccount } from 'wagmi';
import { BigNumber } from '@ethersproject/bignumber';
import Empty from 'src/components/ui/empty';
import Sidebar from 'src/components/your_grants/sidebar/sidebar';
import { useGetAllGrantsForCreatorLazyQuery, GetAllGrantsForCreatorQuery } from 'src/generated/graphql';
import AddFunds from '../../src/components/funds/add_funds_modal';
import Heading from '../../src/components/ui/heading';
import YourGrantCard from '../../src/components/your_grants/yourGrantCard';
import supportedCurrencies from '../../src/constants/supportedCurrencies';
import NavbarLayout from '../../src/layout/navbarLayout';
import { formatAmount } from '../../src/utils/formattingUtils';
import { ApiClientsContext } from '../_app';

const PAGE_SIZE = 20;

function YourGrants() {
  const containerRef = useRef(null);
  const subgraphClient = useContext(ApiClientsContext)?.subgraphClient.client;
  const router = useRouter();
  const [addFundsIsOpen, setAddFundsIsOpen] = React.useState(false);
  const [grantForFunding, setGrantForFunding] = React.useState(null);
  const [grantRewardAsset, setGrantRewardAsset] = React.useState<any>(null);

  const [getAllGrantsForCreator] = useGetAllGrantsForCreatorLazyQuery({
    client: subgraphClient,
  });
  const toast = useToast();
  const [grants, setGrants] = React.useState<GetAllGrantsForCreatorQuery['grants']>([]);

  const [currentPage, setCurrentPage] = React.useState(0);

  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getGrantData = async () => {
    if (!subgraphClient || !accountData?.address) return;
    try {
      const { data } = await getAllGrantsForCreator({
        variables: {
          first: PAGE_SIZE,
          skip: PAGE_SIZE * currentPage,
          creatorId: accountData?.address,
        },
      });
      if (data) {
        setCurrentPage(currentPage + 1);
        setGrants([...grants, ...data.grants]);
      }
    } catch (e: any) {
      // console.log(e);
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
              <Text
                fontSize="16px"
                lineHeight="24px"
                fontWeight="700"
                color="#7B4646"
              >
                Error Message
              </Text>
              <Text
                fontSize="16px"
                lineHeight="24px"
                fontWeight="400"
                color="#7B4646"
              >
                {e.message}
              </Text>
            </Flex>
          </Flex>
        ),
      });
    }
  };

  const initialiseFundModal = async (grant:any) => {
    const grantCurrency = supportedCurrencies.find(
      (currency) => currency.id.toLowerCase()
        === grant.reward.asset.toString().toLowerCase(),
    );
    setAddFundsIsOpen(true);
    setGrantForFunding(grant.id);
    setGrantRewardAsset({
      address: grant.reward.asset,
      committed: BigNumber.from(grant.reward.committed),
      label: grantCurrency?.label ?? 'LOL',
      icon: grantCurrency?.icon ?? '/images/dummy/Ethereum Icon.svg',
    });
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

  const workspaceId = useContext(ApiClientsContext)?.workspace?.id;

  return (
    <>
      <Flex ref={containerRef} direction="row" justify="center">
        <Flex
          direction="column"
          w="55%"
          alignItems="stretch"
          pb={8}
          px={10}
        >
          <Heading title="Your grants" />

          {grants.length > 0
          && grants.filter((item) => item.workspace.id === workspaceId).map((grant: any) => {
            const grantCurrency = supportedCurrencies.find(
              (currency) => currency.id.toLowerCase()
                === grant.reward.asset.toString().toLowerCase(),
            );
            return (
              <YourGrantCard
                grantID={grant.id}
                key={grant.id}
                daoIcon={`https://ipfs.infura.io:5001/api/v0/cat?arg=${grant.workspace.logoIpfsHash}`}
                grantTitle={grant.title}
                grantDesc={grant.summary}
                numOfApplicants={grant.numberOfApplications}
                endTimestamp={new Date(
                  grant.deadline,
                ).getTime()}
                grantAmount={formatAmount(grant.reward.committed)}
                grantCurrency={grantCurrency?.label ?? 'LOL'}
                grantCurrencyIcon={grantCurrency?.label ? getIcon(grantCurrency.label) : '/images/dummy/Ethereum Icon.svg'}
                state="done"
                onEditClick={() => router.push({
                  pathname: '/your_grants/edit_grant/',
                  query: {
                    grantID: grant.id,
                  },
                })}
                onAddFundsClick={() => initialiseFundModal(grant)}
                onViewApplicantsClick={() => router.push({
                  pathname: '/your_grants/view_applicants/',
                  query: {
                    grantID: grant.id,
                  },
                })}
              />
            );
          })}

          {grants.filter((item) => item.workspace.id === workspaceId).length === 0 && (
            <Flex direction="row" w="100%">
              <Flex direction="column" justify="center" h="100%" align="center" mt={10} mx="auto">
                <Empty
                  src={`/illustrations/empty_states/${router.query.done ? 'first_grant.svg' : 'no_grants.svg'}`}
                  imgHeight="174px"
                  imgWidth="146px"
                  title={router.query.done
                    ? 'Your grant is being published..'
                    : 'It’s quite silent here!'}
                  subtitle={router.query.done
                    ? 'You may visit this page after a while to see the published grant. Once published, the grant will be live and will be open for anyone to apply.'
                    : 'Get started by creating your grant and post it in less than 2 minutes.'}
                />

                {!router.query.done && (
                <Button
                  mt={16}
                  onClick={() => {
                    router.push({
                      pathname: '/your_grants/create_grant/',
                      // pathname: '/signup',
                    });
                  }}
                  maxW="163px"
                  variant="primary"
                  mr="12px"
                >
                  Create a Grant
                </Button>
                )}
              </Flex>
            </Flex>
          )}
        </Flex>
        {grants.filter((item) => item.workspace.id === workspaceId).length === 0
        && (
        <Flex
          w="26%"
          pos="sticky"
        >
          <Sidebar />
        </Flex>
        )}
      </Flex>
      {grantForFunding && grantRewardAsset && (
        <AddFunds
          isOpen={addFundsIsOpen}
          onClose={() => setAddFundsIsOpen(false)}
          grantAddress={grantForFunding}
          rewardAsset={grantRewardAsset}
        />
      )}
    </>
  );
}

YourGrants.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout renderGetStarted>{page}</NavbarLayout>;
};
export default YourGrants;
