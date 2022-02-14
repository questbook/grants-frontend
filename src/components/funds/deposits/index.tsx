import { Flex, Text, Image, Button } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';

function Deposits() {
  const flex = [0.26, 0.175, 0.217, 0.27, 0.078];
  const tableHeaders = ['From', 'To', 'Amount', 'On', 'Action'];
  const tableData = new Array(5);
  tableData.fill({
    from: { address: '0xb791.. (You)' },
    to: { address: '0xb791..' },
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
            <Text flex={flex[2]} variant="tableBody" fontWeight="400">
              {data.amount.value}
              {' '}
              {data.amount.symbol}
            </Text>
            <Text flex={flex[3]} variant="tableBody" fontWeight="400">{moment(data.on.timestamp).format('DD MMM YYYY')}</Text>
            <Flex flex={flex[4]}>
              <Button variant="link" color="brand.500" rightIcon={<Image src="/ui_icons/link.svg" />}>View</Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

export default Deposits;
