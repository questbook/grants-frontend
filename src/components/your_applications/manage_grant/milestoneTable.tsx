import React, { useState } from 'react';
import {
  Text, Image, Flex, Button,
} from '@chakra-ui/react';
import AbstractMilestonesTable, { AbstractMilestonesTableProps } from 'src/components/ui/tables/AbstractMilestonesTable';
import { ApplicationMilestone } from 'src/graphql/queries';
import Modal from '../../ui/modal';
import MilestoneDoneModalContent from './modals/modalContentMilestoneDone';
import MilestoneDoneCheckModalContent from './modals/modalContentMilestoneDoneCheck';
import MilestoneDoneConfirmationModalContent from './modals/modalContentMilestoneDoneConfirmation';
import { timeToString } from '../../../utils/formattingUtils';

function Table(props: Omit<AbstractMilestonesTableProps, 'renderStatus'>) {
  const [isMilestoneDoneModalOpen, setIsMilestoneDoneModalOpen] = useState(false);
  const [isMilestoneDoneCheckModalOpen, setIsMilestoneDoneCheckModalOpen] = useState(false);
  const [
    isMilestoneDoneConfirmationModalOpen,
    setIsMilestoneDoneConfirmationModalOpen,
  ] = useState(false);

  const renderStatus = (status: ApplicationMilestone['state'], updatedAtS: number) => {
    if (status === 'submitted') {
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
    if (status === 'requested') {
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
              {timeToString(updatedAtS * 1000)}
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
            {timeToString(updatedAtS * 1000)}
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
    <>
      <AbstractMilestonesTable
        {...props}
        renderStatus={
          (milestone) => renderStatus(milestone.state, milestone.updatedAtS || 0)
        }
      />
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
    </>
  );
}

export default Table;
