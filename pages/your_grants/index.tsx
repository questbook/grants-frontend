import { Flex, Button } from '@chakra-ui/react';
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
import Sidebar from 'src/components/your_grants/sidebar/sidebar';
import {
  GetAllGrantsForCreatorQuery,
  useGetAllGrantsCountForCreatorQuery,
  useGetAllGrantsForCreatorQuery,
} from 'src/generated/graphql';
import { DefaultSupportedChainId } from 'src/constants/chains';
import {
  getSupportedChainIdFromSupportedNetwork,
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import FirstGrantEmptyState from 'src/components/your_grants/empty_states/first_grant';
import LiveGrantEmptyState from 'src/components/your_grants/empty_states/live_grants';
import ArchivedGrantEmptyState from 'src/components/your_grants/empty_states/archived_grant';
import AddFunds from '../../src/components/funds/add_funds_modal';
import Heading from '../../src/components/ui/heading';
import YourGrantCard from '../../src/components/your_grants/yourGrantCard';
import NavbarLayout from '../../src/layout/navbarLayout';
import { formatAmount } from '../../src/utils/formattingUtils';
import { ApiClientsContext } from '../_app';

const PAGE_SIZE = 5;

function YourGrants() {
  const router = useRouter();
  const [{ data: accountData }] = useAccount({
    fetchEns: false,
  });
  const { workspace, subgraphClients } = useContext(ApiClientsContext)!;
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [grants, setGrants] = React.useState<
  GetAllGrantsForCreatorQuery['grants']
  >([]);

  const [queryParams, setQueryParams] = useState<any>({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? DefaultSupportedChainId
      ].client,
  });

  const [countQueryParams, setCountQueryParams] = useState<any>({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? DefaultSupportedChainId
      ].client,
  });

  const tabs = [
    {
      index: 0,
      acceptingApplications: true,
      label: 'Live Grants',
      emptyState: {
        icon: '/illustrations/empty_states/no_live_grant.svg',
        title: 'It’s quite silent here!',
        description: [
          'Get started by creating your grant and post it in less than 2 minutes.',
        ],
        shouldShowButton: true,
      },
    },
    {
      index: 1,
      acceptingApplications: false,
      label: 'Archived',
      emptyState: {
        icon: '/illustrations/empty_states/no_archived_grant.svg',
        title: 'No Grants archived.',
        description: [
          'When you archive a grant it will no longer be visible to anyone.',
          [
            'To archive a grant, click on the',
            'icon on your live grant and select “Archive grant”.',
          ],
        ],
        shouldShowButton: false,
      },
    },
  ];
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    setSelectedTab(parseInt(localStorage.getItem('yourGrantsTabSelected') ?? '0', 10));
  }, []);

  const [grantCount, setGrantCount] = useState([true, true]);

  useEffect(() => {
    if (!workspace) return;
    if (!accountData) return;

    setCountQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: {
        first: PAGE_SIZE,
        skip: PAGE_SIZE * currentPage,
        workspaceId: workspace?.id,
      },
      fetchPolicy: 'network-only',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, workspace, accountData?.address]);

  useEffect(() => {
    if (
      workspace
      && workspace.members
      && workspace.members.length > 0
      && accountData
      && accountData.address
    ) {
      const tempMember = workspace.members.find(
        (m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
      );
      setIsAdmin(
        tempMember?.accessLevel === 'admin'
          || tempMember?.accessLevel === 'owner',
      );
    }
  }, [accountData, workspace]);

  const {
    data: allGrantsCountData,
    error: allGrantsCountError,
    loading: allGrantsCountLoading,
  } = useGetAllGrantsCountForCreatorQuery(countQueryParams);

  useEffect(() => {
    if (allGrantsCountData) {
      setGrantCount([
        allGrantsCountData.liveGrants.length > 0,
        allGrantsCountData.archived.length > 0,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGrantsCountData, allGrantsCountError, allGrantsCountLoading]);

  useEffect(() => {
    if (!workspace) return;
    if (!accountData) return;

    setQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: {
        first: PAGE_SIZE,
        skip: PAGE_SIZE * currentPage,
        workspaceId: workspace?.id,
        acceptingApplications: tabs[selectedTab].acceptingApplications,
      },
      fetchPolicy: 'network-only',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, workspace, accountData?.address, selectedTab]);

  const { data, error, loading } = useGetAllGrantsForCreatorQuery(queryParams);
  useEffect(() => {
    if (!workspace) return;
    setGrants([]);
    setCurrentPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, selectedTab]);

  useEffect(() => {
    if (data && data.grants && data.grants.length > 0) {
      if (
        grants.length > 0
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

  const [addFundsIsOpen, setAddFundsIsOpen] = React.useState(false);
  const [grantForFunding, setGrantForFunding] = React.useState(null);
  const [grantRewardAsset, setGrantRewardAsset] = React.useState<any>(null);

  const initialiseFundModal = async (grant: any) => {
    setAddFundsIsOpen(true);
    setGrantForFunding(grant.id);
    const chainInfo = CHAIN_INFO[
      getSupportedChainIdFromSupportedNetwork(
        grant.workspace.supportedNetworks[0],
      )
    ]?.supportedCurrencies[grant.reward.asset.toLowerCase()];
    setGrantRewardAsset({
      address: grant.reward.asset,
      committed: BigNumber.from(grant.reward.committed),
      label: chainInfo?.label ?? 'LOL',
      icon: chainInfo?.icon ?? '/images/dummy/Ethereum Icon.svg',
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
          <Flex direction="row" mt={4} mb={4}>
            {tabs.map((tab) => (
              <Button
                padding="8px 24px"
                borderRadius="52px"
                minH="40px"
                bg={selectedTab === tab.index ? 'brand.500' : 'white'}
                color={selectedTab === tab.index ? 'white' : 'black'}
                onClick={() => {
                  setSelectedTab(tab.index);
                  localStorage.setItem(
                    'yourGrantsTabSelected',
                    tab.index.toString(),
                  );
                }}
                _hover={{}}
                fontWeight="700"
                fontSize="16px"
                lineHeight="24px"
                mr={3}
                border={
                  selectedTab === tab.index ? 'none' : '1px solid #A0A7A7'
                }
                key={tab.index}
              >
                {tab.label}
              </Button>
            ))}
          </Flex>
          {grants.length > 0
            && grants.map((grant: any) => (
              <YourGrantCard
                grantID={grant.id}
                key={grant.id}
                daoIcon={getUrlForIPFSHash(grant.workspace.logoIpfsHash)}
                grantTitle={grant.title}
                grantDesc={grant.summary}
                numOfApplicants={grant.numberOfApplications}
                endTimestamp={new Date(grant.deadline).getTime()}
                grantAmount={formatAmount(
                  grant.reward.committed,
                  CHAIN_INFO[
                    getSupportedChainIdFromSupportedNetwork(
                      grant.workspace.supportedNetworks[0],
                    )
                  ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
                    ?.decimals ?? 18,
                )}
                grantCurrency={
                  CHAIN_INFO[
                    getSupportedChainIdFromSupportedNetwork(
                      grant.workspace.supportedNetworks[0],
                    )
                  ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
                    ?.label ?? 'LOL'
                }
                grantCurrencyIcon={
                  CHAIN_INFO[
                    getSupportedChainIdFromSupportedNetwork(
                      grant.workspace.supportedNetworks[0],
                    )
                  ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
                    ?.icon ?? '/images/dummy/Ethereum Icon.svg'
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
                acceptingApplications={grant.acceptingApplications}
                isAdmin={isAdmin}
              />
            ))}

          {grants.length === 0
            && !grantCount[0]
            && !grantCount[1]
            && router.query.done && <FirstGrantEmptyState />}
          {grants.length === 0
            && !router.query.done
            && (selectedTab === 0 ? (
              <LiveGrantEmptyState />
            ) : (
              <ArchivedGrantEmptyState />
            ))}
        </Flex>
        <Flex
          w="26%"
          pos="sticky"
          minH="calc(100vh - 80px)"
          display={isAdmin ? undefined : 'none'}
        >
          <Sidebar showCreateGrantItem={!grantCount[0] && !grantCount[1]} />
        </Flex>
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
