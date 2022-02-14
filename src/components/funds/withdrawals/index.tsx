import { Flex, Text, Image, Button } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';

function Withdrawals() {
  const flex = [
    0.2605769230769231,
    0.2605769230769231,
    0.19423076923076923,
    0.12115384615384615,
    0.16346153846153846,
    0.07788461538461539,
  ];

  const tableHeaders = ['From', 'To', 'Initiated By', 'Amount', 'On', 'Action'];
  const tableData = new Array(5);
  tableData.fill({
    from: { address: '0xb791.. (Grant fund)' },
    to: { address: '0xb791..' },
    initiated_by: { address: '0xb109..' },
    amount: { value: 50, symbol: 'ETH' },
    on: { timestamp: new Date('January 24, 2022 23:59:59:000').getTime() },
  });
  return (
    <Flex w="100%" mt={2} alignItems="flex-start" direction="column">
      <Flex direction="row" w="100%" justify="strech" align="center" py={2}>
        {tableHeaders.map((header, index) => (<Text flex={flex[index]} variant="tableHeader">{header}</Text>))}
      </Flex>
      <Flex direction="column" w="100%" border="1px solid #D0D3D3" borderRadius={4}>
        {tableData.map((data, index) => (
          <Flex direction="row" w="100%" justify="stretch" align="center" bg={index % 2 === 0 ? '#F7F9F9' : 'white'} py={6}>
            <Text ml="24px" mr="-24px" flex={flex[0]} variant="tableBody">{data.from.address}</Text>
            <Text flex={flex[1]} variant="tableBody">{data.to.address}</Text>
            <Text flex={flex[2]} variant="tableBody">{data.initiated_by.address}</Text>
            <Text flex={flex[3]} variant="tableBody" fontWeight="400">
              {data.amount.value}
              {' '}
              {data.amount.symbol}
            </Text>
            <Text flex={flex[4]} variant="tableBody" fontWeight="400">{moment(data.on.timestamp).format('DD MMM YYYY')}</Text>
            <Flex flex={flex[5]}>
              <Button variant="link" color="brand.500" rightIcon={<Image src="/ui_icons/link.svg" />}>View</Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default Withdrawals;
