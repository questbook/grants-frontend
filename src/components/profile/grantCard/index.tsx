/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {
  Image, Text, Button, Flex, Box, Divider, Link,
} from '@chakra-ui/react';
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

  onClick,
  onTitleClick,
}: BrowseGrantCardProps) {
  const router = useRouter();

  return (
    <Flex
      borderY="1px solid #E8E9E9"
    >
      <Flex
      py={6} px="1.5rem" w="100%">

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
              {isGrantVerified && (
              <VerifiedBadge
                grantAmount={funding}
                grantCurrency={grantCurrency}
                lineHeight="26px"
                marginBottom={-1}
              />
              )}
            </Text>

            <Image mx={2} src="/ui_icons/green_dot.svg" display="inline-block" />

            <Box mr="auto" />
            <Badge
              numOfApplicants={numOfApplicants}
            />
          </Flex>

          <Text mt={5} lineHeight="24px" color="#122224" fontWeight="400">
            {grantDesc}
          </Text>

          <Flex direction="row" mt={8} alignItems="center">
            <Image src={grantCurrencyIcon} />
            <Text ml={2} fontWeight="700" color="#3F06A0">
              {grantAmount}
              {' '}
              {grantCurrency}
            </Text>
            <Image mx={2} src="/ui_icons/green_dot.svg" display="inline-block" />

            <Image mr="6px" boxSize={3} src="/ui_icons/deadline.svg" display="inline-block" />
            <Text as="span" fontSize="xs" display="inline-block">
              Ends on
              {' '}
              <b>{moment(endTimestamp).format('MMMM D')}</b>
            </Text>

            <Box mr="auto" />
            <Button onClick={onClick} variant="primaryCta">
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
