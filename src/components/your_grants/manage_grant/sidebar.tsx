import {
  Box, Text, Flex, Image, Divider, Button,
} from '@chakra-ui/react';
// import { ExternalLinkIcon } from '@chakra-ui/icons';
import React from 'react';
import Modal from '../../ui/modal';
import FloatingSidebar from '../../ui/sidebar/floatingSidebar';
import AddFunds from './modals/addFundModal';
import SendFundModalContent from './modals/sendFundModalContent';

interface Props {
  funds: number
}

function Sidebar({ funds = 0 }: Props) {
  const [isAddFundModalOpen, setIsAddFundModalOpen] = React.useState(false);
  const [isSendFundModalOpen, setIsSendFundModalOpen] = React.useState(false);

  return (
    <Box my="115px">
      <FloatingSidebar>
        <Text variant="applicationText" color="#414E50">
          Funds available for disbursal
        </Text>
        <Flex direction="row" justify="start" align="center">
          <Image h="26px" w="26px" src="/images/dummy/Ethereum Icon.svg" alt="eth" />
          <Box mx={1} />
          <Text fontWeight="700" fontSize="26px" lineHeight="40px">
            {funds}
          </Text>
          <Box mr={3} />
          {funds > 0 && <Button variant="link" _focus={{}} color="brand.500" onClick={() => setIsAddFundModalOpen(true)}>Add Funds</Button>}
        </Flex>
        {funds === 0 && (
          <>
            <Text fontSize="14px" lineHeight="20px" letterSpacing={0.5} fontWeight="400" mt={3}>
              Is your DAO using a multi-sig?
            </Text>
            <Text fontSize="14px" lineHeight="20px" letterSpacing={0.5} fontWeight="400" mt={3}>
              One multi-sig approval for all milestones.
            </Text>
            <Text fontSize="14px" lineHeight="20px" letterSpacing={0.5} fontWeight="400" mt={3}>
              Add funds to your
              {' '}
              <Box as="span" fontWeight="700" color="#8850EA">verified grant smart contract</Box>
              {' '}
              <Image src="/ui_icons/link.svg" alt="link" display="inline-block" />
              {' '}
              to fund grantees in 1 click.
            </Text>
            <Button variant="primary" mt={6} onClick={() => setIsAddFundModalOpen(true)}>Add Funds</Button>
          </>
        )}
        <Divider mt={3} />
        <Text fontSize="14px" lineHeight="20px" letterSpacing={0.5} fontWeight="400" mt="19px">
          {funds > 0
            ? 'Send funds from your wallet or verified grant smart contract'
            : 'Send funds from your wallet'}
        </Text>
        <Button
          mt="22px"
          variant="outline"
          color="brand.500"
          borderColor="brand.500"
          h="48px"
          w="100%"
          onClick={() => setIsSendFundModalOpen(true)}
        >
          Send Funds
        </Button>
        <AddFunds isOpen={isAddFundModalOpen} onClose={() => setIsAddFundModalOpen(false)} />
        <Modal
          closeOnOverlayClick
          isOpen={isSendFundModalOpen}
          onClose={() => setIsSendFundModalOpen(false)}
          title="Send Funds"
          rightIcon={(
            <Button
              _focus={{}}
              variant="link"
              color="#AA82F0"
              leftIcon={<Image src="/brand_icons/discord_icon.svg" />}
            >
              Support 24*7
            </Button>
          )}
        >
          <SendFundModalContent onClose={() => setIsSendFundModalOpen(false)} />
        </Modal>
      </FloatingSidebar>
    </Box>
  );
}

export default Sidebar;
