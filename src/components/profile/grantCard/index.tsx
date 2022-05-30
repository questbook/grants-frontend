import React from 'react';
import { Image, Text, Button, Flex, Box, Stack, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SupportedChainId } from 'src/constants/chains';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import VerifiedBadge from 'src/components/ui/verified_badge';
import Badge from './badge';
import moment from 'moment';

interface BrowseGrantCardProps {
  daoID: string;
  daoName: string;
  createdAt: number;
  isDaoVerified?: boolean;
  chainId: SupportedChainId | undefined;

  grantTitle: string;
  grantDesc: string;
  isGrantVerified?: boolean;
  funding: string;

  numOfApplicants: number;
  endTimestamp: number;

  grantAmount: string;
  grantCurrency: string;
  grantCurrencyIcon: string;
  disbursedAmount: string;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onTitleClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

function BrowseGrantCard({
  daoID,
  daoName,
  createdAt,
  isDaoVerified,
  chainId,

  grantTitle,
  grantDesc,
  isGrantVerified,
  funding,

  numOfApplicants,
  endTimestamp,

  grantAmount,
  grantCurrency,
  grantCurrencyIcon,
  disbursedAmount,

  onClick,
  onTitleClick,
}: BrowseGrantCardProps) {
  const router = useRouter();

  const currentDate = new Date().getTime();
  const timeDifference = (current: number, previous: number) => {
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerWeek = msPerDay * 7;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return Math.round(elapsed / 1000) + 's';
    } else if (elapsed < msPerHour) {
      return Math.round(elapsed / msPerMinute) + 'min';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + 'h';
    } else if (elapsed < msPerWeek) {
      return Math.round(elapsed / msPerDay) + 'd';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerWeek) + 'w';
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + 'm';
    } else {
      return Math.round(elapsed / msPerYear) + 'y';
    }
  };

  return (
    <Flex borderY="1px solid #E8E9E9">
      <Flex py={6} px="1.5rem" w="100%">
        <Flex flex={1} direction="column">
          <Flex direction="row" alignItems="center">
            <Text maxW="50%">
              <Link
                onClick={onTitleClick}
                whiteSpace="normal"
                textAlign="left"
                lineHeight="26px"
                fontSize="18px"
                fontWeight="700"
                color="#12224"
              >
                {grantTitle}
              </Link>
            </Text>

            <Image
              mx={2}
              src="/ui_icons/green_dot.svg"
              display="inline-block"
            />

            <Text
              fontSize="0.75rem"
              lineHeight="1rem"
              fontWeight="700"
              color="#8C8C8C"
            >
              {timeDifference(currentDate, createdAt * 1000)}
            </Text>

            <Box mr="auto" />
            <Badge numOfApplicants={numOfApplicants} />
          </Flex>

          <Text
            mt={5}
            lineHeight="24px"
            color="#373737"
            fontSize="1rem"
            fontWeight="400"
          >
            {grantDesc}
          </Text>

          <Flex direction="row" mt={8} alignItems="center">
            <Stack
              bgColor="#F5F5F5"
              borderRadius="1.25rem"
              h="1.5rem"
              px="0.5rem"
              justify="center"
            >
              <Text
                fontFamily="DM Sans"
                fontSize="0.85rem"
                lineHeight="1rem"
                fontWeight="400"
                color="#373737"
              >
                <b>${grantAmount}</b>/grantee
                {isGrantVerified && (
                  <VerifiedBadge
                    grantAmount={funding}
                    grantCurrency={grantCurrency}
                    lineHeight="26px"
                    disbursedAmount={disbursedAmount}
                    marginBottom={-1}
                  />
                )}
              </Text>
            </Stack>

            <Image
              mx={4}
              src="/ui_icons/green_dot.svg"
              display="inline-block"
            />
            <Image boxSize={4} src={grantCurrencyIcon} />
            <Text
              ml={2}
              fontSize="0.85rem"
              lineHeight="1rem"
              fontWeight="400"
              color="#373737"
            >
              Paid in <b>{grantCurrency}</b>
            </Text>
            <Image
              mx={4}
              src="/ui_icons/green_dot.svg"
              display="inline-block"
            />

            <Image
              mr="6px"
              boxSize={3}
              src="/ui_icons/deadline.svg"
              display="inline-block"
            />
            <Text fontSize="0.85rem" lineHeight="1rem" display="inline-block">
              Ends on <b>{moment(endTimestamp).format('MMMM D')}</b>
            </Text>

            <Box mr="auto" />
            <Button onClick={onClick} variant="primaryCta" h="105px">
              Apply Now
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

BrowseGrantCard.defaultProps = {
  isGrantVerified: false,
  isDaoVerified: false,
  onClick: () => {},
  onTitleClick: () => {},
};
export default BrowseGrantCard;
