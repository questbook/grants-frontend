/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from 'react';
import {
  Text, Image, Flex, Tooltip, Link,
} from '@chakra-ui/react';
import moment from 'moment';
import Empty from 'src/components/ui/empty';
import { FundTransfer } from 'src/types';
import { SupportedChainId } from 'src/constants/chains';
import { CHAIN_INFO } from 'src/constants/chainInfo';
import { getAssetInfo } from '../../../utils/tokenUtils';
import {
  formatAmount,
  getMilestoneTitle,
  getTextWithEllipses,
} from '../../../utils/formattingUtils';

type Token = {
  label: string;
  address: string;
  icon: string;
  decimals: number
};

const TABLE_HEADERS = {
  milestoneTitle: {
    title: 'Funding Received',
    flex: 0.5,
    content: (
      item: FundTransfer,
      assetId: string,
      assetDecimals: any,
      __: any,
      chainId: SupportedChainId | undefined,
      rewardToken: Token | undefined,
    ) => {
      let icon;
      let label;
      if (rewardToken) {
        icon = rewardToken.icon;
        label = rewardToken.label;
      } else {
        icon = getAssetInfo(assetId, chainId)?.icon;
        label = getAssetInfo(assetId, chainId)?.label;
      }

      return (
        <>
          <Image
            display="inline-block"
            src={icon}
            mr={2}
            h="27px"
            w="27px"
          />
          <Text textAlign="start" variant="applicationText">
            {getMilestoneTitle(item.milestone)}
            {' '}
            -
            {' '}
            <Text
              display="inline-block"
              variant="applicationText"
              fontWeight="700"
            >
              {formatAmount(item.amount, assetDecimals)}
              {' '}
              {label}
            </Text>
          </Text>
        </>
      );
    },
  },
  amount: {
    title: 'Amount',
    flex: 0.35,
    content: (
      item: FundTransfer,
      assetId: string,
      assetDecimals: number,
      _: any,
      chainId: SupportedChainId | undefined,
    ) => (
      <Text display="inline-block" variant="applicationText" fontWeight="700">
        {formatAmount(item.amount, assetDecimals)}
        {' '}
        {getAssetInfo(assetId, chainId)?.label}
      </Text>
    ),
  },
  date: {
    title: 'On',
    flex: 0.2,
    content: (item: FundTransfer) => (
      <Tooltip label={`Transaction ID: ${item.id}`}>
        <Text variant="applicationText">
          {moment(new Date(item.createdAtS * 1000)).format('MMM DD, YYYY')}
        </Text>
      </Tooltip>
    ),
  },
  to: {
    title: 'To',
    flex: 0.15,
    content: (item: FundTransfer) => (
      <Tooltip label={item.to}>
        <Text variant="applicationText" color="#122224">
          {getTextWithEllipses(item.to)}
        </Text>
      </Tooltip>
    ),
  },
  action: {
    title: 'Action',
    flex: 0.1,
    content: (item: FundTransfer, _: any, __: any, ___: any, currentChainId: any) => (
      <Link
        href={currentChainId
          ? `${CHAIN_INFO[currentChainId]
            .explorer.transactionHash}${item.id}`
          : ''}
        isExternal
      >
        <Text
          color="brand.500"
          variant="applicationText"
          fontWeight="500"
          fontSize="14px"
          lineHeight="14px"
        >
          View
          {' '}
          <Image display="inline-block" src="/ui_icons/link.svg" />
        </Text>
      </Link>
    ),
  },
  from: {
    title: 'From',
    flex: 0.2,
    content: (
      item: FundTransfer,
      assetId: string,
      assetDecimals: number,
      grantId: string,
    ) => (
      <Tooltip label={item.sender}>
        <Text variant="applicationText" color="#122224">
          {getTextWithEllipses(item.sender)}
          {' '}
          {item.sender === grantId ? ' (Grant)' : ''}
        </Text>
      </Tooltip>
    ),
  },
  initiator: {
    title: 'Initiated By',
    flex: 0.3,
    content: (item: FundTransfer) => (
      <Tooltip label={item.sender}>
        <Text variant="applicationText" color="#122224">
          {getTextWithEllipses(item.sender)}
        </Text>
      </Tooltip>
    ),
  },
};

export type FundingProps = {
  fundTransfers: FundTransfer[];
  assetId: string;
  columns: (keyof typeof TABLE_HEADERS)[];
  assetDecimals: number;
  grantId: string | null;
  chainId?: SupportedChainId | undefined;
  // eslint-disable-next-line react/require-default-props
  rewardToken?: Token;
};

function Funding({
  fundTransfers,
  assetId,
  columns,
  assetDecimals,
  grantId,
  chainId,
  rewardToken,
}: FundingProps) {
  const tableHeaders = useMemo(
    () => columns.map((column) => TABLE_HEADERS[column]),
    [columns],
  );

  const emptyState = {
    src: '/illustrations/empty_states/funds_received.svg',
    imgHeight: '135px',
    imgWidth: '135px',
    title: 'No funds received yet.',
    subtitle: 'Once you receive funds from the grantor, they will appear here.',
  };

  return (
    <Flex w="100%" my={4} align="center" direction="column" flex={1}>
      {fundTransfers.length === 0 && (
        <Flex mt={14} direction="column" align="center">
          <Empty
            src={emptyState.src}
            imgHeight={emptyState.imgHeight}
            imgWidth={emptyState.imgWidth}
            title={emptyState.title}
            subtitle={emptyState.subtitle}
          />
        </Flex>
      )}
      {fundTransfers.length > 0 && (
        <>
          <Flex
            direction="row"
            w="100%"
            justify="strech"
            align="center"
            mt="32px"
            mb="9px"
          >
            {tableHeaders.map((header) => (
              <Text textAlign="left" flex={header.flex} variant="tableHeader">
                {header.title}
              </Text>
            ))}
          </Flex>
          <Flex
            direction="column"
            w="100%"
            border="1px solid #D0D3D3"
            borderRadius={4}
            align="stretch"
          >
            {fundTransfers.map((item, index) => (
              <Flex
                key={item.id}
                direction="row"
                w="100%"
                justify="stretch"
                align="center"
                bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
                py={4}
                pl="15px"
                pr="15px"
              >
                {grantId
                  && tableHeaders.map(({ title, flex, content }) => (
                    <Flex
                      key={title}
                      direction="row"
                      justify="start"
                      align="center"
                      flex={flex}
                    >
                      {content(item, assetId, assetDecimals, grantId, chainId, rewardToken)}
                    </Flex>
                  ))}
              </Flex>
            ))}
          </Flex>
        </>
      )}
    </Flex>
  );
}

Funding.defaultProps = {
  chainId: SupportedChainId.RINKEBY,
};
export default Funding;
