import React from 'react';
import {
  Text, Image, Flex, Link,
} from '@chakra-ui/react';
import moment from 'moment';
import data from '../data/fundingRequestedDummyData';

function Funding() {
  const tableHeaders = [
    {
      title: 'Funding Received',
      flex: 2,
    },
    { title: 'On' },
    { title: 'From' },
    { title: 'Status', flex: 0.5 },
  ];

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
        {tableHeaders.map((header, index) => (
          <Text
            textAlign="left"
            flex={header.flex != null ? header.flex : 1}
            variant="tableHeader"
            mr={index === 3 ? '28px' : '-28px'}
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
        {data.map((item, index) => (
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
              flex={tableHeaders[0].flex ? tableHeaders[0].flex : 0}
            >
              <Image
                display="inline-block"
                src={item.funding_received.fund.icon}
                mr={2}
                h="27px"
                w="27px"
              />
              <Text textAlign="center" variant="applicationText">
                {item.funding_received.milestone.title}
                {' '}
                -
                {' '}
                <Text
                  display="inline-block"
                  variant="applicationText"
                  fontWeight="700"
                >
                  {item.funding_received.fund.amount}
                  {' '}
                  {item.funding_received.fund.symbol}
                </Text>
              </Text>
            </Flex>

            <Flex
              flex={tableHeaders[1].flex ? tableHeaders[1].flex : 1}
              direction="column"
              w="100%"
            >
              <Text variant="applicationText">
                {moment(item.on.timestamp).format('MMM DD, YYYY')}
              </Text>
            </Flex>

            <Flex
              flex={tableHeaders[2].flex ? tableHeaders[2].flex : 1}
              direction="column"
              w="100%"
            >
              <Text variant="applicationText" color="#122224">
                {item.from.address}
              </Text>
            </Flex>

            <Flex
              flex={tableHeaders[3].flex != null ? tableHeaders[3].flex : 1}
            >
              <Flex direction="column" justify="center" align="end" w="100%">
                {item.status.state === 'processing' && (
                <Flex direction="row" justify="end" align="center">
                  <Image display="inline-block" src="/ui_icons/hourglass.svg" />
                  {' '}
                  <Text variant="footer" color="#717A7C" textAlign="end">Processing...</Text>
                </Flex>
                )}
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
                  {item.status.state === 'processing' ? 'Learn More' : 'View'}
                  {' '}
                  <Image display="inline-block" src="/ui_icons/link.svg" />
                </Link>
              </Flex>

            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default Funding;
