import { Button, Divider, Flex, Text } from '@chakra-ui/react';
import React, {
  ReactElement, useState, useEffect, useContext,
} from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { useGetWorkspaceDetailsQuery } from 'src/generated/graphql';
import { Workspace } from 'src/types';
import { SupportedChainId } from 'src/constants/chains';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import Members from '../src/components/manage_dao/members';
import Settings from '../src/components/manage_dao/settings';
import Payouts from '../src/components/manage_dao/payouts';
import NavbarLayout from '../src/layout/navbarLayout';
import { ApiClientsContext } from './_app';

function ManageDAO() {
  const { workspace, subgraphClients } = useContext(ApiClientsContext)!;
  const router = useRouter();
  const tabs = ['Settings', 'Members', 'Payouts'];
  const [selected, setSelected] = useState(
    // eslint-disable-next-line no-nested-ternary
    router.query.tab === 'members' ? 1 : router.query.tab === 'payouts' ? 2 : 0,
  );
  const [workspaceData, setWorkspaceData] = useState<Workspace>();
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  const [{ data: accountData }] = useAccount({ fetchEns: false });

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

    console.log(data);
  }, [data]);

  const switchTab = (to: number) => {
    setSelected(to);
  };

  useEffect(() => {
    if (workspace && workspace.members
      && workspace.members.length > 0 && accountData && accountData.address) {
      const tempMember = workspace.members.find(
        (m) => m.actorId.toLowerCase() === accountData?.address?.toLowerCase(),
      );
      setIsAdmin(tempMember?.accessLevel === 'admin' || tempMember?.accessLevel === 'owner');
    }
  }, [accountData, workspace]);

  return (
    <>
    {isAdmin ? (
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
        {
          // eslint-disable-next-line no-nested-ternary
          selected === 0 ? (
            <Settings workspaceData={workspaceData!} />
          ) // eslint-disable-next-line no-nested-ternary
            : selected === 1 ? (
              <Members workspaceMembers={workspaceData?.members} />
            ) : (
            // eslint-disable-next-line no-nested-ternary
              selected === 2 && <Payouts />
            )
        }
      </Flex>
      <Flex w="auto" />
    </Flex>) : (<Text textAlign="center" p="2rem">You do not have access to this DAO settings</Text>)}
    </>
  );
}

ManageDAO.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default ManageDAO;
