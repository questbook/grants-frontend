import { Button, Flex } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';
import Empty from 'src/components/ui/empty';
import { useGetAllGrantsCountForCreatorQuery, useGetAllGrantsForADaoQuery } from 'src/generated/graphql';
import { SupportedChainId } from 'src/constants/chains';
import {
  getSupportedChainIdFromWorkspace,
} from 'src/utils/validationUtils';
import Heading from 'src/components/ui/heading';
import NavbarLayout from '../src/layout/navbarLayout';
import FundForAGrant from '../src/components/funds';
import { ApiClientsContext } from './_app';

function AddFunds() {
  const { workspace, subgraphClients } = useContext(ApiClientsContext)!;

  const [countQueryParams, setCountQueryParams] = React.useState<any>({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
  });

  const tabs = [
    { index: 0, acceptingApplications: true, label: 'Live Grants' },
    { index: 1, acceptingApplications: false, label: 'Archived' },
  ];
  const [selectedTab, setSelectedTab] = React.useState(
    parseInt(localStorage.getItem('fundsTabSelected') ?? '0', 10),
  );

  const [grantCount, setGrantCount] = React.useState([true, true]);

  React.useEffect(() => {
    if (!workspace) return;

    setCountQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: {
        workspaceId: workspace?.id,
      },
      fetchPolicy: 'network-only',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  const {
    data: allGrantsCountData,
    error: allGrantsCountError,
    loading: allGrantsCountLoading,
  } = useGetAllGrantsCountForCreatorQuery(countQueryParams);

  React.useEffect(() => {
    if (allGrantsCountData) {
      setGrantCount([
        allGrantsCountData.liveGrants.length > 0,
        allGrantsCountData.archived.length > 0,
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGrantsCountData, allGrantsCountError, allGrantsCountLoading]);

  const { data } = useGetAllGrantsForADaoQuery({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
    variables: {
      workspaceId: workspace?.id ?? '',
      acceptingApplications: tabs[selectedTab].acceptingApplications,
    },
  });

  const grants = data?.grants || [];

  return (
    <Flex direction="row" justify="center">
      <Flex w="80%" direction="column" align="start" mt={6}>
        {/* <Text variant="heading">Funds</Text> */}
        <Heading title="Funds" />
        <Flex direction="row" mt={4} mb={4}>
          {tabs.map((tab) => grantCount[tab.index] && (
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
        {grants.map((grant) => (
          <FundForAGrant grant={grant} />
        ))}
        {grants.length === 0 && (
          <Flex direction="column" align="center" w="100%" h="100%" mt={14}>
            <Empty
              src="/illustrations/empty_states/no_grants.svg"
              imgHeight="174px"
              imgWidth="146px"
              title="It's quite silent here!"
              subtitle="Get started by creating your grant and post it in less than 2 minutes."
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}

AddFunds.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default AddFunds;
