import {
  Flex, Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAccount } from 'wagmi';
import { BigNumber } from '@ethersproject/bignumber';
import Empty from 'src/components/ui/empty';
import Sidebar from 'src/components/your_grants/sidebar/sidebar';
import {
  GetAllGrantsForCreatorQuery,
  useGetAllGrantsForCreatorQuery,
} from 'src/generated/graphql';
import { SupportedChainId } from 'src/constants/chains';
import { getSupportedChainIdFromSupportedNetwork, getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import AddFunds from '../../src/components/funds/add_funds_modal';
import Heading from '../../src/components/ui/heading';
import YourGrantCard from '../../src/components/your_grants/yourGrantCard';
import NavbarLayout from '../../src/layout/navbarLayout';
import { formatAmount } from '../../src/utils/formattingUtils';
import { ApiClientsContext } from '../_app';

const PAGE_SIZE = 5;

function YourGrants() {
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });
  const { workspace, subgraphClients } = useContext(ApiClientsContext)!;

  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [grants, setGrants] = React.useState<
  GetAllGrantsForCreatorQuery['grants']
  >([]);

  const [queryParams, setQueryParams] = useState<any>({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
  });

  useEffect(() => {
    if (!workspace) return;
    if (!accountData) return;

    setQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: {
        first: PAGE_SIZE,
        skip: PAGE_SIZE * currentPage,
        creatorId: accountData?.address,
        workspaceId: workspace?.id,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, workspace, accountData?.address]);

  const { data, error, loading } = useGetAllGrantsForCreatorQuery(queryParams);
  useEffect(() => {
    if (!workspace) return;
    setGrants([]);
    setCurrentPage(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  useEffect(() => {
    if (data && data.grants && data.grants.length > 0) {
      if (grants.length > 0
          && grants[0].workspace.id === data.grants[0].workspace.id
          && grants[0].id !== data.grants[0].id
      ) {
        setGrants([...grants, ...data.grants]);
      } else {
        setGrants(data.grants);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading]);

  const router = useRouter();
  const [addFundsIsOpen, setAddFundsIsOpen] = React.useState(false);
  const [grantForFunding, setGrantForFunding] = React.useState(null);
  const [grantRewardAsset, setGrantRewardAsset] = React.useState<any>(null);

  const initialiseFundModal = async (grant: any) => {
    setAddFundsIsOpen(true);
    setGrantForFunding(grant.id);
    setGrantRewardAsset({
      address: grant.reward.asset,
      committed: BigNumber.from(grant.reward.committed),
      label:
        CHAIN_INFO[
          getSupportedChainIdFromSupportedNetwork(
            grant.workspace.supportedNetworks[0],
          )
        ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.label ?? 'LOL',
      icon:
        CHAIN_INFO[
          getSupportedChainIdFromSupportedNetwork(
            grant.workspace.supportedNetworks[0],
          )
        ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.icon
        ?? '/images/dummy/Ethereum Icon.svg',
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
      setCurrentPage(currentPage + 1);
    }
  }, [containerRef, currentPage]);

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
      <Flex ref={containerRef} direction="row" justify="center">
        <Flex direction="column" w="55%" alignItems="stretch" pb={8} px={10}>
          <Heading title="Your grants" />

          {grants.length > 0
            && grants.map((grant: any) => (
              <YourGrantCard
                grantID={grant.id}
                key={grant.id}
                daoIcon={`https://ipfs.infura.io:5001/api/v0/cat?arg=${grant.workspace.logoIpfsHash}`}
                grantTitle={grant.title}
                grantDesc={grant.summary}
                numOfApplicants={grant.numberOfApplications}
                endTimestamp={new Date(grant.deadline).getTime()}
                grantAmount={formatAmount(grant.reward.committed)}
                grantCurrency={
                    CHAIN_INFO[
                      getSupportedChainIdFromSupportedNetwork(
                        grant.workspace.supportedNetworks[0],
                      )
                    ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.label ?? 'LOL'
                  }
                grantCurrencyIcon={
                    CHAIN_INFO[
                      getSupportedChainIdFromSupportedNetwork(
                        grant.workspace.supportedNetworks[0],
                      )
                    ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]?.icon
                    ?? '/images/dummy/Ethereum Icon.svg'
                  }
                state="done"
                chainId={getSupportedChainIdFromSupportedNetwork(
                  grant.workspace.supportedNetworks[0],
                )}
                onEditClick={() => router.push({
                  pathname: '/your_grants/edit_grant/',
                  query: {
                    grantId: grant.id,
                  },
                })}
                onAddFundsClick={() => initialiseFundModal(grant)}
                onViewApplicantsClick={() => router.push({
                  pathname: '/your_grants/view_applicants/',
                  query: {
                    grantId: grant.id,
                  },
                })}
              />
            ))}

          {grants.length === 0 && (
            <Flex direction="row" w="100%">
              <Flex
                direction="column"
                justify="center"
                h="100%"
                align="center"
                mt={10}
                mx="auto"
              >
                <Empty
                  src={`/illustrations/empty_states/${
                    router.query.done ? 'first_grant.svg' : 'no_grants.svg'
                  }`}
                  imgHeight="174px"
                  imgWidth="146px"
                  title={
                    router.query.done
                      ? 'Your grant is being published..'
                      : 'It’s quite silent here!'
                  }
                  subtitle={
                    router.query.done
                      ? 'You may visit this page after a while to see the published grant. Once published, the grant will be live and will be open for anyone to apply.'
                      : 'Get started by creating your grant and post it in less than 2 minutes.'
                  }
                />

                {!router.query.done && (
                  <Button
                    mt={16}
                    onClick={() => {
                      router.push({
                        pathname: '/your_grants/create_grant/',
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
        {grants.length === 0 && (
          <Flex w="26%" pos="sticky">
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
