import {
  Flex, Text, Image, Box, Button,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import moment from 'moment';
import AddFundsModal from '../src/components/funds/add_funds_modal';
import NavbarLayout from '../src/layout/navbarLayout';

function AddFunds() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
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
    <Flex direction="row" justify="center">
      <Flex w="80%" direction="column" align="start" mt={6}>
        <Text variant="heading">Funds</Text>
        <Flex direction="column" w="100%" mt={3}>
          <Flex direction="row" justify="space-between" w="100%">
            <Text fontWeight="700" fontSize="18px" lineHeight="26px">Storage Provider (SP) Tooling Ideas</Text>
            <Flex direction="row" justify="start" align="center">
              <Image src="/images/dummy/Ethereum Icon.svg" alt="Ethereum Icon" />
              <Box mr={2} />
              <Text fontWeight="700" fontSize="16px" lineHeight="24px" letterSpacing={0.5}>Funds Available</Text>
              <Box mr={2} />
              <Text fontWeight="700" fontSize="16px" lineHeight="24px" letterSpacing={0.5} color="brand.500">40 ETH</Text>
              <Box mr={5} />
              <Button variant="primaryCta" onClick={() => setIsModalOpen(true)}>Add Funds</Button>
            </Flex>
          </Flex>
          <Flex w="100%" mt={8} alignItems="flex-start" direction="column">
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
        </Flex>
      </Flex>
      <AddFundsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Flex>
  );
}

AddFunds.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default AddFunds;
