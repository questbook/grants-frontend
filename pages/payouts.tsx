import {
  Image,
  Flex,
  Text,
  Grid,
  Tooltip,
  Link,
  Box,
} from '@chakra-ui/react';
import React, {ReactElement,  useContext } from 'react';

// TOOLS AND UTILS
import {
  trimAddress,
  getFormattedDateFromUnixTimestampWithYear,
} from 'src/utils/formattingUtils';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { useGetFundSentforReviewsQuery } from 'src/generated/graphql';
import { utils } from 'ethers';
import { getAssetInfo } from 'src/utils/tokenUtils';
import { SupportedChainId } from 'src/constants/chains';
import router from 'next/router';
import { CHAIN_INFO } from '../src/constants/chainInfo';
import useChainId from '../src/hooks/utils/useChainId';
import {useAccount} from 'wagmi';

// CONTEXT AND CONSTANTS
import { ApiClientsContext } from './_app';

//UI Components
import NavbarLayout from '../src/layout/navbarLayout';
import CopyIcon from 'src/components/ui/copy_icon';

export default function Payouts() {
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;
  const [reviewPayoutsDone, setReviewPayoutsDone] = React.useState<any>([]);
  const currentChainId = useChainId();
  const [{data: account}] = useAccount();

  const { data: reviewsData } = useGetFundSentforReviewsQuery({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
  });

  const historyTableHeaders = [
    'Paid from',
    'Amount',
    'Paid on',
    'Actions',
  ];

  React.useEffect(() => {
    if (!workspace) {
      router.push('/');
    }
  });

  React.useEffect(() => {
    if (reviewPayoutsDone.length === 0 && reviewsData) {
      reviewsData!.fundsTransfers.filter(
        (review: any) => setReviewPayoutsDone((array: any) => [...array, review]))
    }
    console.log(reviewPayoutsDone)
  });

  return (
    <Flex
      direction="column"
      w={{base: "100vw", md: '70vw'}}
      m="auto"
    >
      <Grid
        gridAutoFlow="column"
        gridTemplateColumns="repeat(3, 1fr)"
        w="100%"
        justifyContent="space-between"
        alignContent="center"
        py={4}
        px={5}
      >
        {' '}
        {historyTableHeaders.map((header) => (
          <Text w="fit-content" variant="tableHeader" color="black">
            {header}
          </Text>
        ))}
      </Grid>
      <Flex
        direction="column"
        w="100%"
        border="1px solid #D0D3D3"
        borderRadius={4}
      >
        {reviewPayoutsDone.length === 0
          ? (
            <Flex p={2} alignItems="center" justifyContent="center">
              <Text>There is no payout history to show</Text>
            </Flex>
          )
          : reviewPayoutsDone.map((data: any, index: number) => (
            <Flex>
              <Grid
                gridAutoFlow="column"
                gridTemplateColumns="repeat(3, 1fr)"
                w="100%"
                justifyContent="space-between"
                alignContent="center"
                bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
                py={4}
                px={5}
              >
                <Tooltip justifySelf="left" label={data.sender}>
                  <Flex alignItems="center" gap="0.5rem">
                    <Text textAlign="center" variant="tableBody">
                      {trimAddress(data.sender, 4)}
                    </Text>
                    <CopyIcon
                      h="0.75rem"
                      text={data.sender}
                    />
                  </Flex>
                </Tooltip>

                <Text variant="tableBody" justifySelf="left">
                  {utils.formatUnits(data.amount).slice(0, -2)}
                  {' '}
                  {getAssetInfo(
                    data.asset,
                    getSupportedChainIdFromWorkspace(workspace),
                  ).label}
                </Text>
                <Text variant="tableBody" justifySelf="left">
                  {getFormattedDateFromUnixTimestampWithYear(data.createdAtS)}
                </Text>

                <Flex direction="row">
                  <Link
                    href={`
                      ${CHAIN_INFO[currentChainId as number].explorer.transactionHash}${data.id.substr(0, data.id.indexOf('.'))}`}
                    isExternal
                  >
                    View
                    {' '}
                    <Image
                      display="inline-block"
                      h="10px"
                      w="10px"
                      src="/ui_icons/link.svg"
                    />
                  </Link>
                </Flex>
              </Grid>
            </Flex>
          ))}
      </Flex>
      </Flex>
  )
}

Payouts.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
