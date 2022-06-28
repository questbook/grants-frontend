import { useContext, useEffect, useState } from 'react';
import { Box, Grid, Flex, Text, Heading, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SupportedChainId } from 'src/constants/chains';
import { useGetDaoDetailsQuery } from 'src/generated/graphql';
import { DAOWorkspace } from 'src/types';
import { ApiClientsContext } from './_app';
import { getUrlForIPFSHash } from 'src/utils/ipfsUtils'

export default function Embed() {
  const width = '1080px';
  const height = '480px';

  const router = useRouter();
  const { subgraphClients } = useContext(ApiClientsContext)!;

  const [chainID, setChainId] = useState<SupportedChainId>();
  const [daoID, setDaoId] = useState<string>();
  const [workspaceData, setWorkspaceData] = useState<DAOWorkspace>();

  useEffect(() => {
    if (router && router.query) {
      const { chainId: cId, daoId: dId } = router.query;
      setChainId(cId as unknown as SupportedChainId);
      setDaoId(dId?.toString());
    }
  }, [router]);

  const [queryParams, setQueryParams] = useState<any>({
    client: subgraphClients[chainID ?? SupportedChainId.RINKEBY].client,
  });

  useEffect(() => {
    if (!daoID) {
      return;
    }

    if (!chainID) {
      return;
    }

    setQueryParams({
      client: subgraphClients[chainID].client,
      variables: {
        workspaceID: daoID,
        daoID,
      },
    });
  }, [chainID, daoID]);

  const { data, error, loading } = useGetDaoDetailsQuery(queryParams);

  useEffect(() => {
    if (data) {
      setWorkspaceData(data?.workspace!);
    }
  }, [data, error, loading]);

  return (
    <Flex w={width} h={height} bgColor="white" p="3rem" direction="column" borderRadius="1rem" gap="3rem" justifyItems="center"	>
      <Flex justifyContent="center" direction="column" gap="1rem">
        <Heading
          fontFamily="DM Sans"
          color="#122224"
          fontWeight="700"
          fontSize="2rem"
          lineHeight="2.5rem"
		  textAlign="center"
        >
          Help us build the future of web3
        </Heading>
        <Text
			textAlign="center"
          fontFamily="DM Sans"
          color="#373737"
          fontWeight="400"
          fontSize="1rem"
          lineHeight="1.5rem"
		  w="60%"
		  m="auto"
        >
          The ultimate aim through this program is to help developers build
          their dream solution and take it to the masses.
        </Text>
      </Flex>
      <Box
	  border="1px solid #C4C4C4"
	  borderRadius="0.5rem"
	  w="700px"
	  h="140px"
	  alignSelf="center"
	  >
		<Flex 
		w="100%"
		m="auto"
		gap="0.5rem">
		<Image
		objectFit="cover"
		h="2rem"
		w="2rem"
		borderRadius="100%"
		src={getUrlForIPFSHash(workspaceData?.logoIpfsHash!)}
		/>
		<Heading
			fontFamily="DM Sans"
			color="#122224"
			fontWeight="700"
			fontSize="1rem"
			lineHeight="1.5rem"
			textAlign="center"
		>
			{workspaceData?.title}
		</Heading>
		</Flex>
        <Grid>

		</Grid>
      </Box>
    </Flex>
  );
}
