import React, {useEffect, useState} from 'react';
import { Text, Heading, Grid, Flex } from '@chakra-ui/react';
import {useTimeDifference} from '../../utils/calculatingUtils';
import { useGetFundSentDisburseforGrantQuery } from 'src/generated/graphql';
import { getSupportedChainIdFromSupportedNetwork } from 'src/utils/validationUtils';
import { SupportedChainId } from 'src/constants/chains';
import { ApiClientsContext } from '../../../pages/_app';

interface Props {
  disbursed: Array<number>;
  applicants: Array<number>;
  winners: Array<number>;
  grants: any;
  // fundingTime: Array<number>;
  workspaceNetwork: any;
}

function DaoData({ workspaceNetwork, disbursed, applicants, winners, grants }: Props) {
  const { subgraphClients } = React.useContext(ApiClientsContext)!

  const [grantToCheck, setGrantoCheck] = useState(null);

  useEffect(() => {
    console.log(grants);

    if (grants && grants.length >= 1 && grantToCheck !== null) {
          grants.forEach((grant: any) => {
          setGrantoCheck(grant.id)
        })
    }
    // var orderedGrantDates = grantTime.sort(function(a, b) {
    //   return Date.parse(a) - Date.parse(b);
    // });
    //
    // var orderedFundingDates = grantTime.sort(function(a, b) {
    //   return Date.parse(a) - Date.parse(b);
    // });
    //
    // console.log(useTimeDifference(orderedFundingDates[1], orderedGrantDates[1] * 1000))
  }, [grants])

  const { data: fundsData } = useGetFundSentDisburseforGrantQuery({
    client:
      subgraphClients[
        getSupportedChainIdFromSupportedNetwork(workspaceNetwork) ?? SupportedChainId.RINKEBY
      ].client,
      variables: {
        grant: grantToCheck ?? '',
      },
  });

  console.log(fundsData)

  return (
    <Grid
    gap="1rem"
    gridTemplateColumns="repeat(4, 1fr)"
    w={{
      base: '100%',
      sm: '85%',
      lg: '70%',
    }}>
      <Flex direction="column">
        <Heading
        color="#122224"
        fontSize="1.2rem"
        lineHeight="1.5rem"
        >${disbursed.reduce((sum, a) => sum + a, 0).toFixed(0)}</Heading>
        <Text
          fontSize="0.875rem"
          lineHeight="24px"
          fontWeight="400"
          color="#AAAAAA"
        >
          Grants Disbursed
        </Text>
      </Flex>

      <Flex direction="column">
      <Heading
      color="#122224"
      fontSize="1.2rem"
      lineHeight="1.5rem">{applicants.reduce((sum, a) => sum + a, 0)}</Heading>
        <Text
          fontSize="0.875rem"
          lineHeight="24px"
          fontWeight="400"
          color="#AAAAAA"
        >Applicants</Text>
      </Flex>

      <Flex direction="column">
      <Heading
      color="#122224"
      fontSize="1.2rem"
      lineHeight="1.5rem">{winners.length}</Heading>
        <Text
          fontSize="0.875rem"
          lineHeight="24px"
          fontWeight="400"
          color="#AAAAAA"
        >Winners</Text>
      </Flex>

      <Flex direction="column">
      <Heading
      color="#122224"
      fontSize="1.2rem"
      lineHeight="1.5rem"></Heading>
        <Text
          fontSize="0.875rem"
          lineHeight="24px"
          fontWeight="400"
          color="#AAAAAA"
        >Time to release funds</Text>
      </Flex>
    </Grid>
  );
}

export default DaoData;
