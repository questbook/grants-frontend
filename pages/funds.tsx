import {
  Flex, Text, Image, Box, Button,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import AddFundsModal from '../src/components/your_grants/add_funds_modal';
import NavbarLayout from '../src/layout/navbarLayout';

function AddFunds() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
            <Flex direction="row" w="100%" justify="strech" align="center" px={10} py={6}>
              <Text flex={1} variant="tableHeader">From</Text>
              <Text flex={1} variant="tableHeader">To</Text>
              <Text flex={1} variant="tableHeader">Amount</Text>
              <Text flex={1} variant="tableHeader">On</Text>
              <Text flex={1} variant="tableHeader">Action</Text>
            </Flex>
            <Flex direction="column" w="100%" border="1px solid #D0D3D3" borderRadius={4}>
              <Flex direction="row" w="100%" justify="stretch" align="center" bg="#F7F9F9" px={8} py={4}>
                <Text flex={1} variant="tableBody">0xb791.. (You)</Text>
                <Text flex={1} variant="tableBody">0xb791..</Text>
                <Text flex={1} variant="tableBody">50 ETH</Text>
                <Text flex={1} variant="tableBody">24 Jan, 2022</Text>
                <Flex flex={1}>
                  <Button variant="link" color="brand.500" rightIcon={<Image src="/ui_icons/link.svg" />}>View</Button>
                </Flex>
              </Flex>
              <Flex direction="row" w="100%" justify="stretch" align="center" px={8} py={4}>
                <Text flex={1} variant="tableBody">0xb791.. (You)</Text>
                <Text flex={1} variant="tableBody">0xb791..</Text>
                <Text flex={1} variant="tableBody">50 ETH</Text>
                <Text flex={1} variant="tableBody">24 Jan, 2022</Text>
                <Flex flex={1}>
                  <Button variant="link" color="brand.500" rightIcon={<Image src="/ui_icons/link.svg" />}>View</Button>
                </Flex>
              </Flex>
              <Flex direction="row" w="100%" justify="stretch" align="center" bg="#F7F9F9" px={8} py={4}>
                <Text flex={1} variant="tableBody">0xb791.. (You)</Text>
                <Text flex={1} variant="tableBody">0xb791..</Text>
                <Text flex={1} variant="tableBody">50 ETH</Text>
                <Text flex={1} variant="tableBody">24 Jan, 2022</Text>
                <Flex flex={1}>
                  <Button variant="link" color="brand.500" rightIcon={<Image src="/ui_icons/link.svg" />}>View</Button>
                </Flex>
              </Flex>
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
