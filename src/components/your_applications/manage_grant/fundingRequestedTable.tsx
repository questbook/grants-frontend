import React from 'react';
import {
  Text, Image, Flex, Button,
} from '@chakra-ui/react';
import Modal from '../../ui/modal';
import MilestoneDoneModalContent from './modals/modalContentMilestoneDone';
import MilestoneDoneCheckModalContent from './modals/modalContentMilestoneDoneCheck';
import MilestoneDoneConfirmationModalContent from './modals/modalContentMilestoneDoneConfirmation';
import { timeToString } from '../../../utils/formattingUtils';

function Table() {
  const [isMilestoneDoneModalOpen, setIsMilestoneDoneModalOpen] = React.useState(false);
  const [isMilestoneDoneCheckModalOpen, setIsMilestoneDoneCheckModalOpen] = React.useState(false);
  const [
    isMilestoneDoneConfirmationModalOpen,
    setIsMilestoneDoneConfirmationModalOpen,
  ] = React.useState(false);

  const tableHeaders = [
    {
      title: 'Funding Received',
      flex: 2,
    },
    { title: 'On' },
    { title: 'From' },
    { title: 'Status', flex: 0 },
  ];
  const data = new Array(10);
  data.fill({
    funding_received: {
      milestone: { number: 1, title: 'Milestone 1' },
      fund: {
        amount: 1,
        symbol: 'ETH',
        icon: '/images/dummy/Ethereum Icon.svg',
      },
    },
    on: { timestamp: new Date('January 24, 2022 23:59:59:000').getTime() },
    from: { address: '0x1a...' },
    status: { state: 'done', txnHash: '' },
  });

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
                {timeToString(item.on.timestamp, 'day_first')}
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
              <Button
                variant="link"
                color="brand.500"
                fontWeight="500"
                fontSize="14px"
                lineHeight="14px"
                textAlign="center"
                borderRadius={8}
                borderColor="brand.500"
                _focus={{}}
                rightIcon={<Image src="/ui_icons/link.svg" />}
              >
                View
              </Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Modal
        isOpen={isMilestoneDoneModalOpen}
        onClose={() => setIsMilestoneDoneModalOpen(false)}
        title="Mark Milestone 1 as Done"
        alignTitle="center"
        topIcon={<Image src="/ui_icons/milestone_complete.svg" />}
      >
        <MilestoneDoneModalContent
          onClose={() => {
            setIsMilestoneDoneModalOpen(false);
            setIsMilestoneDoneCheckModalOpen(true);
          }}
        />
      </Modal>
      <Modal
        isOpen={isMilestoneDoneCheckModalOpen}
        onClose={() => setIsMilestoneDoneCheckModalOpen(false)}
        title="Milestone 1"
      >
        <MilestoneDoneCheckModalContent
          onClose={() => {
            setIsMilestoneDoneCheckModalOpen(false);
            setIsMilestoneDoneConfirmationModalOpen(true);
          }}
        />
      </Modal>
      <Modal
        isOpen={isMilestoneDoneConfirmationModalOpen}
        onClose={() => setIsMilestoneDoneConfirmationModalOpen(false)}
        title=""
      >
        <MilestoneDoneConfirmationModalContent
          onClose={() => setIsMilestoneDoneConfirmationModalOpen(false)}
        />
      </Modal>
    </Flex>
  );
}

export default Table;
