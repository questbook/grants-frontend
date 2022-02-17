import { Button, Divider, Flex } from '@chakra-ui/react';
import React, {
  ReactElement, useState, useEffect, useContext,
} from 'react';
import { gql } from '@apollo/client';
import Members from '../src/components/settings_and_members/members';
import Settings from '../src/components/settings_and_members/settings';
import NavbarLayout from '../src/layout/navbarLayout';
import { getWorkspaceDetails } from '../src/graphql/daoQueries';
import SubgraphClient from '../src/graphql/subgraph';
import { ApiClientsContext } from './_app';

function SettingsAndMembers() {
  const tabs = ['Settings', 'Invite Members'];
  const [selected, setSelected] = useState(0);
  const [workspaceData, setWorkspaceData] = useState<any>(null);
  const workspaceId = useContext(ApiClientsContext)?.workspaceId;

  const switchTab = (to: number) => {
    setSelected(to);
  };

  async function getWorkspaceData(workspaceID: string) {
    if (!workspaceID) return;
    const subgraphClient = new SubgraphClient();
    if (!subgraphClient.client) return;
    try {
      const { data } = (await subgraphClient.client.query({
        query: gql(getWorkspaceDetails),
        variables: {
          workspaceID,
        },
      })) as any;
      if (data.workspace) {
        setWorkspaceData(data.workspace);
      }
    } catch (e) {
      // console.log(e);
    }
  }

  useEffect(() => {
    if (!workspaceId) return;
    // console.log('getting called');
    getWorkspaceData(workspaceId);
  }, [workspaceId]);

  return (
    <Flex direction="row" w="100%" justify="space-evenly">
      <Flex w="65%" direction="column">
        <Flex
          direction="row"
          w="full"
          justify="start"
          h={14}
          align="stretch"
          mb={4}
          mt={6}
        >
          {tabs.map((tab, index) => (
            <Button
              variant="link"
              ml={index === 0 ? 0 : 12}
              _hover={{
                color: 'black',
              }}
              _focus={{}}
              fontWeight="700"
              fontStyle="normal"
              fontSize="28px"
              lineHeight="44px"
              letterSpacing={-1}
              borderRadius={0}
              color={index === selected ? '#122224' : '#A0A7A7'}
              onClick={() => switchTab(index)}
            >
              {tab}
            </Button>
          ))}
        </Flex>
        <Divider variant="sidebar" mb={5} />
        {selected === 0 ? (
          <Settings workspaceData={workspaceData} />
        ) : (
          <Members workspaceMembers={workspaceData?.members} />
        )}
      </Flex>
      <Flex w="20%" />
    </Flex>
  );
}

SettingsAndMembers.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default SettingsAndMembers;
