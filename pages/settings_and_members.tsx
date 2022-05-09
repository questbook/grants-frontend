import { Button, Divider, Flex } from '@chakra-ui/react';
import React, {
  ReactElement, useState, useEffect, useContext,
} from 'react';
import { useRouter } from 'next/router';
import { useGetWorkspaceDetailsQuery } from 'src/generated/graphql';
import { Workspace } from 'src/types';
import { SupportedChainId } from 'src/constants/chains';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import Members from '../src/components/settings_and_members/members';
import Settings from '../src/components/settings_and_members/settings';
import NavbarLayout from '../src/layout/navbarLayout';
import { ApiClientsContext } from './_app';

function SettingsAndMembers() {
  const { workspace, subgraphClients } = useContext(ApiClientsContext)!;
  const router = useRouter();
  const tabs = ['Settings', 'Invite Members'];
  const [selected, setSelected] = useState(
    router.query.tab === 'members' ? 1 : 0,
  );
  const [workspaceData, setWorkspaceData] = useState<Workspace>();

  const [queryParams, setQueryParams] = useState<any>({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
  });

  useEffect(() => {
    if (!workspace) return;
    setQueryParams({
      client:
        subgraphClients[getSupportedChainIdFromWorkspace(workspace)!].client,
      variables: { workspaceID: workspace.id },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  const { data } = useGetWorkspaceDetailsQuery(queryParams);

  useEffect(() => {
    if (!data) return;
    setWorkspaceData(data!.workspace!);
  }, [data]);

  const switchTab = (to: number) => {
    setSelected(to);
  };

  return (
    <Flex direction="row" w="100%" justify="space-evenly">
      <Flex
        w={selected === 0 ? '100%' : '100%'}
        maxW="1036px"
        direction="column"
      >
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
          <Members
            workspaceMembers={workspaceData?.members.filter(
              (member) => member.actorId !== member.addedBy.actorId,
            )}
          />
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
