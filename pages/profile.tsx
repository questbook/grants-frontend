// UI Components
import SeeMore from 'src/components/profile/see_more';
import DaoData from 'src/components/profile/dao_data';
import DaoAbout from 'src/components/profile/dao_about';
import BrowseGrantCard from 'src/components/profile/grantCard';

import {
  Box,
  Divider,
  Stack,
  Button,
  Flex,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

// APP LAYOUT & STATE
import NavbarLayout from 'src/layout/navbarLayout';
import { ApiClientsContext } from './_app';

// CONSTANTS AND TYPES
import { DAOGrant, DAOWorkspace } from 'src/types';
import { SupportedChainId } from 'src/constants/chains';
import { CHAIN_INFO } from 'src/constants/chainInfo';

// UTILS AND TOOLS
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils';
import { formatAmount } from 'src/utils/formattingUtils';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import verify from 'src/utils/grantUtils';
import { useGetDaoDetailsQuery } from 'src/generated/graphql';

function Profile() {
  const router = useRouter();

  const { subgraphClients } = React.useContext(ApiClientsContext)!;
  const [{ data: accountData }] = useAccount();

  // const [data, setData] = React.useState();
  const [workspaceData, setWorkspaceData] = React.useState<DAOWorkspace>();
  const [grantData, setGrantData] = React.useState<DAOGrant>();
  const [chainID, setChainId] = React.useState<SupportedChainId>();
  const [daoID, setDaoId] = React.useState<string>();

  //Tab section
  const tabs = ['Browse Grants', 'About'];
  const [selected, setSelected] = useState(0);
  const switchTab = (to: number) => {
    setSelected(to);
  };

  useEffect(() => {
    if (router && router.query) {
      const { chainId: cId, daoId: dId } = router.query;
      setChainId((cId as unknown) as SupportedChainId);
      setDaoId(dId?.toString());
    }
  }, [router]);

  const [queryParams, setQueryParams] = useState<any>({
    client: subgraphClients[chainID ?? SupportedChainId.RINKEBY].client,
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
      mb="1rem"
      borderX="1px solid #E8E9E9"
      borderBottom="1px solid #E8E9E9"
    >
      <Stack w="full">
        <Flex
          bg={workspaceData?.coverImageIpfsHash ? 'white' : 'brand.500'}
          h="210px"
          w="fill"
        >
          {workspaceData?.coverImageIpfsHash && (
            <Image
              fit="contain"
              alignSelf="flex-end"
              justifySelf="flex-end"
              src={getUrlForIPFSHash(workspaceData?.coverImageIpfsHash)}
            />
          )}
        </Flex>

        <Flex direction="column" m="auto" w="100%">
          <Flex
            direction="row"
            w="100%"
            align="end"
            mt="-3.5rem"
            px="1.5rem"
            gap="1rem"
          >
            <Image
              src={getUrlForIPFSHash(workspaceData?.logoIpfsHash!)}
              w="120px"
              h="120px"
              borderRadius="12px"
            />

            <Flex direction="column" align="start">
              <Text variant="heading" fontWeight="700" fontSize="1.8rem">
                {workspaceData?.title}
              </Text>
              {chainID && (
                <Text
                  variant="applicationText"
                  fontWeight="400"
                  fontSize="1rem"
                  color="#717A7C"
                >
                  {CHAIN_INFO[chainID].name}
                </Text>
              )}
            </Flex>

            <Box mr="auto" />

            <Flex direction="row" alignSelf="start" justify="right" mt="3.5rem">
              {workspaceData?.socials.map((social) => (
                <IconButton
                  aria-label={social.name}
                  // as={Button}
                  zIndex={10}
                  border="1px solid #E8E9E9"
                  borderRadius="10px"
                  icon={
                    <Image
                      boxSize="1rem"
                      src={`/ui_icons/profile_${social.name}.svg`}
                    />
                  }
                  bg="white"
                  boxSize="2.5rem"
                  onClick={() => {
                    window.open(social.value, '_blank');
                  }}
                />
              ))}
            </Flex>
          </Flex>

          <Stack px="1.5rem">
            {workspaceData?.about && <SeeMore text={workspaceData?.about} />}
          </Stack>

          <Stack px="1.5rem" pb="2rem" pt="1rem">
            <DaoData grants="50000" winners="20" applicants="1000" time="1D" />
          </Stack>

          <Divider />
          <Stack px="1.5rem" py="1rem" direction="row" gap="1rem">
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
                {tab} {tab === 'Browse Grants' && `(${grantData?.length})`}
              </Button>
            ))}
          </Stack>

          <Divider />
        </Flex>
      </Stack>

      {
        // eslint-disable-next-line no-nested-ternary
        selected === 0 ? (
          <>
            {grantData &&
              grantData.length > 0 &&
              grantData.map((grant) => {
                const chainId = getSupportedChainIdFromSupportedNetwork(
                  grant.workspace.supportedNetworks[0]
                );
                const chainInfo =
                  CHAIN_INFO[chainId]?.supportedCurrencies[
                    grant.reward.asset.toLowerCase()
                  ];
                const [isGrantVerified, funding] = verify(
                  grant.funding,
                  chainInfo?.decimals
                );
                return (
                  <BrowseGrantCard
                    daoID={grant.workspace.id}
                    key={grant.id}
                    daoName={grant.workspace.title}
                    isDaoVerified={false}
                    createdAt={grant.createdAtS}
                    grantTitle={grant.title}
                    grantDesc={grant.summary}
                    numOfApplicants={grant.numberOfApplications}
                    endTimestamp={new Date(grant.deadline!).getTime()}
                    grantAmount={formatAmount(
                      grant.reward.committed,
                      chainInfo?.decimals ?? 18
                    )}
                    grantCurrency={chainInfo?.label ?? 'LOL'}
                    grantCurrencyIcon={
                      chainInfo?.icon ?? '/images/dummy/Ethereum Icon.svg'
                    }
                    chainId={chainId}
                    isGrantVerified={isGrantVerified}
                    funding={funding}
                    onClick={() => {
                      if (!(accountData && accountData.address)) {
                        router.push({
                          pathname: '/connect_wallet',
                          query: {
                            flow: '/',
                            grantId: grant.id,
                            chainId,
                          },
                        });
                        return;
                      }
                      router.push({
                        pathname: '/explore_grants/about_grant',
                        query: {
                          grantId: grant.id,
                          chainId,
                        },
                      });
                    }}
                    onTitleClick={() => {
                      router.push({
                        pathname: '/explore_grants/about_grant',
                        query: {
                          grantId: grant.id,
                          chainId,
                        },
                      });
                    }}
                  />
                );
              })}
          </>
        ) : (
          // eslint-disable-next-line no-nested-ternary
          selected === 1 && <DaoAbout />
        )
      }
    </Flex>
  );
}

Profile.getLayout = function getLayout(page: React.ReactElement) {
  return <NavbarLayout renderGetStarted>{page}</NavbarLayout>;
};

export default Profile;
