import React from 'react';
import {
  Text, Image, Flex, Button,
} from '@chakra-ui/react';
import Modal from '../../ui/modal';
import MilestoneDoneModalContent from './modals/modalContentMilestoneDone';
import MilestoneDoneCheckModalContent from './modals/modalContentMilestoneDoneCheck';
import MilestoneDoneConfirmationModalContent from './modals/modalContentMilestoneDoneConfirmation';
import { timeToString } from '../../../utils/formattingUtils';
import data from './milestoneTableDummyData';

function Table() {
  const [isMilestoneDoneModalOpen, setIsMilestoneDoneModalOpen] = React.useState(false);
  const [isMilestoneDoneCheckModalOpen, setIsMilestoneDoneCheckModalOpen] = React.useState(false);
  const [
    isMilestoneDoneConfirmationModalOpen,
    setIsMilestoneDoneConfirmationModalOpen,
  ] = React.useState(false);

  const tableHeaders = [
    {
      title: 'Milestone',
      flex: 0.504,
    },
    {
      title: 'Reward / Expected Reward',
      flex: 0.358,
    },
    {
      title: 'Status',
      flex: 0.138,
    },
  ];

  const renderStatus = (status: any) => {
    if (status.state === 'pending') {
      return (
        <Button
          variant="outline"
          color="brand.500"
          fontWeight="500"
          fontSize="14px"
          lineHeight="14px"
          textAlign="center"
          borderRadius={8}
          borderColor="brand.500"
          height="32px"
          onClick={() => setIsMilestoneDoneModalOpen(true)}
        >
          Mark as Done
        </Button>
      );
    }
    if (status.state === 'done') {
      return (
        <Flex direction="column" justify="end" align="end">
          <Text
            variant="footer"
            whiteSpace="nowrap"
            fontWeight="400"
            color="#A0A7A7"
          >
            Marked as Done on
            {' '}
            <Text display="inline-block" variant="footer" fontWeight="500">
              {timeToString(status.done_date.timestamp)}
            </Text>
          </Text>
          <Button variant="link" _focus={{}}>
            <Text variant="footer" color="#6200EE">
              View
            </Text>
          </Button>
        </Flex>
      );
    }
    return (
      <Flex direction="column" justify="end" align="flex-end">
        <Text
          textAlign="right"
          variant="footer"
          fontWeight="bold"
          color="#6200EE"
          whiteSpace="nowrap"
        >
          Approved
          {' '}
          <Text
            textAlign="right"
            display="inline-block"
            variant="footer"
            fontWeight="400"
            color="#A0A7A7"
          >
            on
          </Text>
          {' '}
          <Text
            textAlign="right"
            display="inline-block"
            variant="footer"
            fontWeight="500"
          >
            {timeToString(status.approved_date.timestamp)}
          </Text>
        </Text>
        <Button variant="link" _focus={{}}>
          <Text textAlign="right" variant="footer" color="#6200EE">
            View
          </Text>
        </Button>
      </Flex>
    );
  };

  return (
    <Flex
      w="100%"
      my={4}
      align="center"
      direction="column"
      flex={1}
    >
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
            justifyContent={index === 2 ? 'center' : 'flex-start'}
            flex={header.flex ? header.flex : 1}
            variant="tableHeader"
            display="flex"
            color="#122224"
            minW="180px"
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
            px={0}
            py={4}
          >
            <Flex
              flex={tableHeaders[0].flex ? tableHeaders[0].flex : 1}
              direction="column"
              w="100%"
              pl="19px"
            >
              <Text variant="applicationText" fontWeight="700" color="#122224">
                {item.milestone.title}
              </Text>
              <Text
                fontSize="14px"
                lineHeight="24px"
                letterSpacing={0.5}
                fontStyle="normal"
                fontWeight="400"
                color="#717A7C"
                noOfLines={1}
                textOverflow="ellipsis"
              >
                {item.milestone.subtitle}
              </Text>
            </Flex>
            <Flex
              ml={8}
              direction="row"
              justify="start"
              align="center"
              flex={tableHeaders[1].flex ? tableHeaders[1].flex : 1}
            >
              <Image display="inline-block" src={item.reward.icon} mr={2} />
              <Text
                textAlign="center"
                fontSize="14px"
                letterSpacing={0.5}
                fontWeight="700"
                color="#122224"
              >
                {item.reward.received}
                {' '}
                /
                {' '}
                {item.reward.total}
                {' '}
                {item.reward.symbol}
              </Text>
            </Flex>
            <Flex
              flex={tableHeaders[2].flex ? tableHeaders[2].flex : 1}
              justify="end"
              mr={5}
              minW="180px"
            >
              {renderStatus(item.status)}
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
