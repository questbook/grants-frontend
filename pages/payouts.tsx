import {
  Image, Flex, Heading, Text, Grid, Tooltip, Link,
} from '@chakra-ui/react';
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
import { useAccount } from 'wagmi';
import CopyIcon from 'src/components/ui/copy_icon';

// CONTEXT AND CONSTANTS
import { ApiClientsContext } from './_app';

// UI Components
import NavbarLayout from '../src/layout/navbarLayout';

export default function Payouts() {
  const { subgraphClients, workspace } = useContext(ApiClientsContext)!;
  const [isReviewer, setIsReviewer] = React.useState<boolean>(false);
  const [reviewsDone, setReviewsDone] = React.useState<number>(0);
  const [reviewPayoutsDone, setReviewPayoutsDone] = React.useState<any>([]);
  const [
    reviewPayoutsOutstanding,
    setReviewPayoutsOutstanding,
  ] = React.useState<any>([]);
  const [{ data: account }] = useAccount();

  React.useEffect(() => {
    if (
      workspace
      && workspace.members
      && workspace.members.length > 0
      && account
      && account.address
    ) {
      const tempMember = workspace.members.find(
        (m) => m.actorId.toLowerCase() === account?.address?.toLowerCase(),
      );
      setIsReviewer(
        tempMember?.accessLevel === 'reviewer',
      );
    }
  }, [account, workspace]);

  const { data: reviewsPaidData } = useGetFundSentforReviewerQuery({
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
    if (reviewPayoutsDone.length === 0 && reviewsPaidData) {
      setReviewPayoutsDone(reviewsPaidData!.fundsTransfers);
    }
  }, [reviewPayoutsDone, reviewsPaidData]);

  React.useEffect(() => {
    if (reviewPayoutsOutstanding.length === 0) {
      workspace?.members.forEach(
        (member: any) => member.actorId === account?.address.toLowerCase()
          && member.outstandingReviewIds.filter(
            (review: any) => setReviewPayoutsOutstanding((array: any) => [...array, review]),
          ),
      );
    }
  }, [reviewPayoutsOutstanding, reviewsPaidData, account?.address, workspace?.members]);

  React.useEffect(() => {
    if (reviewsDone === 0) {
      setReviewsDone(reviewPayoutsDone.length + reviewPayoutsOutstanding.length);
    }
    console.log(reviewsDone);
  }, [reviewsDone, reviewPayoutsDone, reviewPayoutsOutstanding]);

  return (
    <Flex>
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
              <Heading fontSize="1.5rem" gridArea="heading">{reviewsDone}</Heading>
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
            pb={2}
            pt={4}
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
                      {utils.formatUnits(data.amount).slice(0, -2)}
                      {' '}
                      {
                        getAssetInfo(
                          data.asset,
                          getSupportedChainIdFromWorkspace(workspace),
                        ).label
                      }
                    </Text>
                    <Text variant="tableBody" justifySelf="left">
                      {getFormattedDateFromUnixTimestampWithYear(
                        data.createdAtS,
                      )}
                    </Text>

                    <Flex direction="row">
                      <Link
                        href={`http://www.polygonscan.com/tx/${data.id.substr(0, data.id.indexOf('.'))}`}
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
              ))
            )}
          </Flex>
        </Flex>
      ) : (
        <Text>You do not have access to this page</Text>
      )}
    </Flex>
  );
}

Payouts.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
