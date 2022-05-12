import { Image, Flex, Heading, Text, Grid, Tooltip, Link, Box } from '@chakra-ui/react';
import React, { ReactElement, useContext } from 'react';

// TOOLS AND UTILS
import {
  trimAddress,
  getFormattedDateFromUnixTimestampWithYear,
} from 'src/utils/formattingUtils';
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils';
import { useGetFundSentforReviewerQuery } from 'src/generated/graphql';
import { utils } from 'ethers';
import { getAssetInfo } from 'src/utils/tokenUtils';
import { SupportedChainId } from 'src/constants/chains';
import router from 'next/router';
import { CHAIN_INFO } from '../src/constants/chainInfo';
import useChainId from '../src/hooks/utils/useChainId';
import { useAccount } from 'wagmi';

// CONTEXT AND CONSTANTS
import { ApiClientsContext } from './_app';

//UI Components
import NavbarLayout from '../src/layout/navbarLayout';
import CopyIcon from 'src/components/ui/copy_icon';

export default function Payouts() {
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;
  const [reviewPayoutsDone, setReviewPayoutsDone] = React.useState<any>([]);
  const [isReviewer, setIsReviewer] = React.useState<boolean>(false);
  const [
    reviewPayoutsOutstanding,
    setReviewPayoutsOutstanding,
  ] = React.useState<any>([]);
  const currentChainId = useChainId();
  const [{ data: account }] = useAccount();

  React.useEffect(() => {
    if (
      workspace &&
      workspace.members &&
      workspace.members.length > 0 &&
      account &&
      account.address
    ) {
      const tempMember = workspace.members.find(
        (m) => m.actorId.toLowerCase() === account?.address?.toLowerCase()
      );
      setIsReviewer(
        tempMember?.accessLevel === 'reviewer' ||
          tempMember?.accessLevel === 'admin'
      );
    }
  }, [account, workspace]);

  const { data: reviewsData } = useGetFundSentforReviewerQuery({
    client:
      subgraphClients[
        getSupportedChainIdFromWorkspace(workspace) ?? SupportedChainId.RINKEBY
      ].client,
    variables: {
      to: account?.address,
    },
  });

  const historyTableHeaders = ['Paid from', 'Amount', 'Paid on', 'Actions'];

  React.useEffect(() => {
    if (!workspace) {
      router.push('/');
    }
  });

  React.useEffect(() => {
    if (reviewPayoutsDone.length === 0 && reviewsData) {
      setReviewPayoutsDone(reviewsData!.fundsTransfers);
    }
    console.log(reviewPayoutsDone);
  });

  React.useEffect(() => {
    if (reviewPayoutsOutstanding.length === 0) {
      workspace?.members.forEach(
        (member: any) =>
          member.actorId === account?.address.toLowerCase() &&
          member.outstandingReviewIds.filter((review: any) =>
            setReviewPayoutsOutstanding((array: any) => [...array, review])
          )
      );
    }
    console.log(reviewPayoutsOutstanding);
  });

  return (
    <>
      {isReviewer ? (
        <Flex direction="column" w={{ base: '95vw', md: '70vw' }} m="auto">
        <Grid mt={6} gap="1.5rem" gridAutoFlow="column">
          <Grid
            border="1px solid #D0D3D3"
            borderRadius="4px"
            py="1rem"
            px="2rem"
            gridTemplateColumns="3fr 1fr"
            gridTemplateAreas='"heading icon" "text icon"'
            alignContent="center"
            gap="0.5rem"
          >
            <Heading fontSize="1.5rem" gridArea="heading">{reviewPayoutsDone.length}</Heading>
            <Text fontSize="1rem" color="#AAAAAA" gridArea="text">Reviews Done</Text>
            <Flex
              w="40px"
              h="40px"
              gridArea="icon"
              justifySelf="center"
              alignSelf="center"
              justifyContent="center"
              alignItems="center"
            >
              <Image
              src="/illustrations/reviews_done.svg"
              />
            </Flex>
          </Grid>
          <Grid
            border="1px solid #D0D3D3"
            borderRadius="4px"
            p="1rem"
            gridTemplateColumns="3fr 1fr"
            gridTemplateAreas='"heading icon" "text icon"'
            alignContent="center"
            gap="0.5rem"
          >
            <Heading fontSize="1.5rem" gridArea="heading">{reviewPayoutsOutstanding.length}</Heading>
            <Text fontSize="1rem" color="#AAAAAA" gridArea="text">Outstanding Review Payouts</Text>
            <Flex
              w="40px"
              h="40px"
              gridArea="icon"
              justifySelf="center"
              alignSelf="center"
              justifyContent="center"
              alignItems="center"
            >
              <Image
                src="/illustrations/reviews_outstanding.svg"
              />
            </Flex>
          </Grid>
          </Grid>
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
            {reviewPayoutsDone.length === 0 ? (
              <Flex p={2} alignItems="center" justifyContent="center">
                <Text>There is no payout history to show</Text>
              </Flex>
            ) : (
              reviewPayoutsDone.map((data: any, index: number) => (
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
                        <CopyIcon h="0.75rem" text={data.sender} />
                      </Flex>
                    </Tooltip>

                    <Text variant="tableBody" justifySelf="left">
                      {utils.formatUnits(data.amount).slice(0, -2)}{' '}
                      {
                        getAssetInfo(
                          data.asset,
                          getSupportedChainIdFromWorkspace(workspace)
                        ).label
                      }
                    </Text>
                    <Text variant="tableBody" justifySelf="left">
                      {getFormattedDateFromUnixTimestampWithYear(
                        data.createdAtS
                      )}
                    </Text>

                    <Flex direction="row">
                      <Link
                        href={`http://www.polygonscan.com/tx/${data.id.substr(0, data.id.indexOf('.'))}`}
                        isExternal
                      >
                        View{' '}
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
              ))
            )}
          </Flex>
        </Flex>
      ) : (
        <Text>You do not have access to this page</Text>
      )}
    </>
  );
}

Payouts.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
