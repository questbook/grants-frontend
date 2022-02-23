import { Button, Divider, Flex } from '@chakra-ui/react';
import React, {
  ReactElement, useState, useEffect, useContext,
} from 'react';
import { useRouter } from 'next/router';
import { useGetWorkspaceDetailsLazyQuery } from 'src/generated/graphql';
import { Workspace } from 'src/types';
import Members from '../src/components/settings_and_members/members';
import Settings from '../src/components/settings_and_members/settings';
import NavbarLayout from '../src/layout/navbarLayout';
import { ApiClientsContext } from './_app';

function SettingsAndMembers() {
  const { workspaceId, subgraphClient } = useContext(ApiClientsContext)!;
  const router = useRouter();
  const tabs = ['Settings', 'Invite Members'];
  const [selected, setSelected] = useState(router.query.tab === 'members' ? 1 : 0);
  const [workspaceData, setWorkspaceData] = useState<Workspace>();

  const [getWorkspaceDetails] = useGetWorkspaceDetailsLazyQuery({
    client: subgraphClient.client,
  });

  const switchTab = (to: number) => {
    setSelected(to);
  };

  async function getWorkspaceData(workspaceID: string) {
    try {
      const { data } = await getWorkspaceDetails({
        variables: { workspaceID },
      });
      setWorkspaceData(data!.workspace!);
    } catch (e) {
      // console.log(e);
    }
  }

  useEffect(() => {
    if (!workspaceId) return;
    console.log('getting called ', workspaceId);
    getWorkspaceData(workspaceId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  return (
    <Flex direction="row" w="100%" justify="space-evenly">
      <Flex w="45%" direction="column">
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
          <Settings workspaceData={workspaceData!} />
        ) : (
          <Members workspaceMembers={workspaceData?.members} />
        )}
      </Flex>
      <Flex w="auto" />
    </Flex>
  );
}

SettingsAndMembers.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default SettingsAndMembers;
