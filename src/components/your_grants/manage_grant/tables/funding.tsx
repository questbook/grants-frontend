/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from 'react';
import {
  Text, Image, Flex, Tooltip, Link,
} from '@chakra-ui/react';
import moment from 'moment';
import { ethers } from 'ethers';
import { FundTransfer } from 'src/types';
import { getAssetInfo } from '../../../../utils/tokenUtils';
import { formatAmount, getMilestoneTitle, getTextWithEllipses } from '../../../../utils/formattingUtils';

type TableContent = {
  title: string
  flex?: number
  content: (
    item: FundTransfer,
    assetId: string,
    assetDecimals: number,
    grantId: string
  ) => React.ReactChild
};

const TABLE_HEADERS: { [id: string]: TableContent } = {
  milestoneTitle: {
    title: 'Funding Received',
    flex: 0.5,
    content: (item, assetId) => (
      <>
        <Image
          display="inline-block"
          src={getAssetInfo(assetId)?.icon}
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
            {formatAmount(item.amount)}
            {' '}
            {getAssetInfo(assetId)?.label}
          </Text>
        </Text>
      </>
    ),
  },
  amount: {
    title: 'Amount',
    flex: 0.35,
    content: (item, assetId, assetDecimals: number) => (
      <Text display="inline-block" variant="applicationText" fontWeight="700">
        {ethers.utils.formatUnits(item.amount, assetDecimals)}
        {' '}
        {getAssetInfo(assetId)?.label}
      </Text>
    ),
  },
  date: {
    title: 'On',
    flex: 0.2,
    content: (item) => (
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
    content: (item) => (
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
    content: (item) => (
      <Link
        href={`https://etherscan.io/tx/${item.id}/`}
        target="_blank"
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
    content: (item, _, __, grantId) => (
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
    content: (item) => (
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
};

function Funding({
  fundTransfers,
  assetId,
  columns,
  assetDecimals,
  grantId,
}: FundingProps) {
  const tableHeaders = useMemo(
    () => columns.map((column) => TABLE_HEADERS[column]),
    [columns],
  );
  return (
    <Flex w="100%" my={4} align="center" direction="column" flex={1}>
      {fundTransfers.length === 0 && <>No Transactions</>}
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
                {grantId && tableHeaders.map(({ title, flex, content }) => (
                  <Flex
                    key={title}
                    direction="row"
                    justify="start"
                    align="center"
                    flex={flex}
                  >
                    {content(item, assetId, assetDecimals, grantId)}
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

export default Funding;
