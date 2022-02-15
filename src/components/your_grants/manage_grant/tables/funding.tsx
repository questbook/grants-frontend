import React from 'react';
import {
  Text, Image, Flex, Tooltip,
} from '@chakra-ui/react';
import moment from 'moment';
import { FundTransfer } from 'src/graphql/queries';
import { getAssetInfo } from 'src/utils/tokenUtils';
import { text } from 'node:stream/consumers';

const TABLE_HEADERS = [
  {
    title: 'Funding Received',
    flex: 0.6,
  },
  { title: 'On', flex: 0.2 },
  { title: 'To', flex: 0.2 },
  // { title: 'Status', flex: 0.5 },
];

export type FundingProps = {
  fundTransfers: FundTransfer[]
  assetId: string
};

function Funding({ fundTransfers, assetId }: FundingProps) {
  const assetInfo = getAssetInfo(assetId);
  // extract milstone index from ID and generate title like "Milestone (index+1)"
  const getMilestoneTitle = (milestone: FundTransfer['milestone']) => {
    if (milestone) {
      const [, idx] = milestone.id.split('.');
      return `Milestone ${(+idx) + 1}`;
    }
    return 'Unknown Milestone';
  };

  const getTextWithEllipses = (txt: string, maxLength = 10) => (txt.length > maxLength ? `${txt.slice(0, maxLength)}...` : txt);

  return (
    <Flex w="100%" my={4} align="center" direction="column" flex={1}>
      <Flex
        direction="row"
        w="100%"
        justify="strech"
        align="center"
        mt="32px"
        mb="9px"
      >
        {TABLE_HEADERS.map((header) => (
          <Text
            textAlign="left"
            flex={header.flex != null ? header.flex : 1}
            variant="tableHeader"
          >
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
            direction="row"
            w="100%"
            justify="stretch"
            align="center"
            bg={index % 2 === 0 ? '#F7F9F9' : 'white'}
            py={4}
            pl="22px"
            pr="28px"
          >
            <Flex
              direction="row"
              justify="start"
              align="center"
              flex={TABLE_HEADERS[0].flex}
            >
              <Image
                display="inline-block"
                src={assetInfo?.icon}
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
                  {item.amount}
                  {' '}
                  {assetInfo?.label}
                </Text>
              </Text>
            </Flex>

            <Flex
              flex={TABLE_HEADERS[1].flex}
              direction="column"
            >
              <Tooltip label={`Transaction ID: ${item.id}`}>
                <Text variant="applicationText">
                  {moment(new Date(item.createdAtS * 1000)).format('MMM DD, YYYY')}
                </Text>
              </Tooltip>
            </Flex>

            <Flex
              flex={TABLE_HEADERS[2].flex}
              direction="column"
            >
              <Tooltip label={item.to}>
                <Text variant="applicationText" color="#122224">
                  {getTextWithEllipses(item.to)}
                </Text>
              </Tooltip>
            </Flex>

            {/* <Flex
              flex={TABLE_HEADERS[3].flex}
            >
              <Flex direction="column" justify="center" align="end" w="100%">
                <Link
                  href="https://etherscan.io/tx/0x265f00837424f1ef46cb8c6858d6cc9a486ab702f8f019424006dcb029f66e75/"
                  rel="noopener noreferrer"
                  target="_blank"
                  color="brand.500"
                  fontWeight="500"
                  fontSize="14px"
                  lineHeight="14px"
                  // textAlign="right"
                  _focus={{}}
                >
                  View
                  {' '}
                  <Image display="inline-block" src="/ui_icons/link.svg" />
                </Link>
              </Flex>

            </Flex> */}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default Funding;
