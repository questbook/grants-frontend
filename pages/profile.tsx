import {
  Divider, Flex, IconButton, Image, Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useGetDaoDetailsQuery } from 'src/generated/graphql';
import NavbarLayout from 'src/layout/navbarLayout';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import { DAOGrant, DAOWorkspace } from 'src/types';
import BrowseGrantCard from 'src/components/profile/grantCard';
import { formatAmount, getChainIdFromResponse } from 'src/utils/formattingUtils';
import { BigNumber } from 'ethers';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import SeeMore from 'src/components/profile/see_more';
import { DefaultSupportedChainId, SupportedChainId } from 'src/constants/chains';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import { ApiClientsContext } from './_app';

function Profile() {
  const router = useRouter();

  const { subgraphClients } = React.useContext(ApiClientsContext)!;
  const [{ data: accountData }] = useAccount();

  // const [data, setData] = React.useState();
  const [workspaceData, setWorkspaceData] = React.useState<DAOWorkspace>();
  const [grantData, setGrantData] = React.useState<DAOGrant>();
  const [chainID, setChainId] = React.useState<SupportedChainId>();
  const [daoID, setDaoId] = React.useState<string>();

  useEffect(() => {
    if (router && router.query) {
      const { chainId: cId, daoId: dId } = router.query;
      setChainId(cId as unknown as SupportedChainId);
      setDaoId(dId?.toString());
    }
  }, [router]);

  const [queryParams, setQueryParams] = useState<any>({
    client: subgraphClients[chainID ?? DefaultSupportedChainId].client,
  });

  useEffect(() => {
    if (!daoID) return;
    if (!chainID) return;

    setQueryParams({
      client: subgraphClients[chainID].client,
      variables: {
        workspaceID: daoID,
        daoID,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainID, daoID]);

  const { data, error, loading } = useGetDaoDetailsQuery(queryParams);

  useEffect(() => {
    if (data) {
      setWorkspaceData(data?.workspace!);
      setGrantData(data?.grants);
      // console.log(`Supported Network: ${data?.workspace?.supportedNetworks}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading]);

  return (
    <Flex
      direction="column"
      w={{
        base: '100%',
        sm: '70%',
        lg: '52%',
      }}
      mx="auto"
    >
      <Flex direction="column" w="100%" h="300px" align="end" pos="relative">
        <Flex
          w="100%"
          h="210px"
          bg={workspaceData?.coverImageIpfsHash ? 'white' : 'brand.500'}
        >
          {workspaceData?.coverImageIpfsHash && (
            <Image
              w="100%"
              h="210px"
              src={getUrlForIPFSHash(workspaceData?.coverImageIpfsHash)}
            />
          )}
        </Flex>

        <Flex direction="row">
          {workspaceData?.socials.map((social) => (
            <IconButton
              aria-label={social.name}
              // as={Button}
              zIndex={10}
              ml={3}
              mt={3}
              p={3}
              border="1px solid #E8E9E9"
              borderRadius="10px"
              icon={(
                <Image
                  boxSize="24px"
                  src={`/ui_icons/profile_${social.name}.svg`}
                />
              )}
              bg="white"
              boxSize="48px"
              onClick={() => { window.open(social.value, '_blank'); }}
            />
          ))}
        </Flex>

        <Flex pos="absolute" left="5%" bottom={0} w="100%">
          <Flex direction="row" w="100%" align="end">
            <Image
              src={getUrlForIPFSHash(workspaceData?.logoIpfsHash!)}
              w="120px"
              h="120px"
            />
            <Flex direction="column" align="start" ml={5}>
              <Text variant="heading">{workspaceData?.title}</Text>
              {chainID && (
                <Flex
                  direction="row"
                  align="center"
                  bg="#F3F4F4"
                  border="1px solid #E8E9E9"
                  borderRadius="8px"
                  py={2}
                  pr={4}
                  pl={2}
                >
                  <Image mr={3} boxSize="18px" src={CHAIN_INFO[chainID].icon} />
                  <Text
                    variant="applicationText"
                    fontWeight="500"
                    color="#717A7C"
                  >
                    {CHAIN_INFO[chainID].name}
                  </Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {workspaceData?.about && <SeeMore text={workspaceData?.about} />}

      <Divider />

      <Text my={4} variant="heading">
        Browse Grants
      </Text>

      <Divider />

      {grantData
        && grantData.length > 0
        && grantData.map((grant) => (
          <BrowseGrantCard
            daoID={grant.workspace.id}
            key={grant.id}
            daoIcon={getUrlForIPFSHash(grant.workspace.logoIpfsHash)}
            daoName={grant.workspace.title}
            isDaoVerified={false}
            grantTitle={grant.title}
            grantDesc={grant.summary}
            numOfApplicants={grant.numberOfApplications}
            endTimestamp={new Date(grant.deadline!).getTime()}
            grantAmount={formatAmount(grant.reward.committed)}
            grantCurrency={
                CHAIN_INFO[
                  chainID ?? DefaultSupportedChainId
                ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
                  ?.label ?? 'LOL'
              }
            grantCurrencyIcon={
                CHAIN_INFO[
                  chainID ?? DefaultSupportedChainId
                ]?.supportedCurrencies[grant.reward.asset.toLowerCase()]
                  ?.icon ?? '/images/dummy/Ethereum Icon.svg'
              }
            chainId={getSupportedChainIdFromSupportedNetwork(
              grant.workspace.supportedNetworks[0],
            )}
            isGrantVerified={BigNumber.from(grant.funding).gt(0)}
            onClick={() => {
              if (!(accountData && accountData.address)) {
                router.push({
                  pathname: '/connect_wallet',
                  query: {
                    flow: '/',
                    grantId: grant.id,
                    chainId: getChainIdFromResponse(
                      grant.workspace.supportedNetworks[0],
                    ),
                  },
                });
                return;
              }
              router.push({
                pathname: '/explore_grants/about_grant',
                query: {
                  grantId: grant.id,
                  chainId: getChainIdFromResponse(
                    grant.workspace.supportedNetworks[0],
                  ),
                },
              });
            }}
          />
        ))}
    </Flex>
  );
}

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <NavbarLayout renderGetStarted>{page}</NavbarLayout>;
};

export default Profile;
