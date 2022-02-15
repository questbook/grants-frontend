import React from 'react';
import {
  Text, Image, Flex, Button, MenuButton, Menu, MenuList, MenuItem,
} from '@chakra-ui/react';
import {
  ChevronDownIcon, ViewIcon,
} from '@chakra-ui/icons';
import moment from 'moment';
import { ApplicationMilestone } from 'src/graphql/queries';
import AbstractMilestonesTable, { AbstractMilestonesTableProps } from 'src/components/ui/tables/AbstractMilestonesTable';
import Modal from '../../../ui/modal';
import MilestoneDoneModalContent from '../modals/modalContentMilestoneDone';
import MilestoneViewModalContent from '../modals/modalContentMilestoneView';
import MilestoneDoneConfirmationModalContent from '../modals/modalContentMilestoneDoneConfirmation';

function Milestones(props: Omit<AbstractMilestonesTableProps, 'renderStatus'>) {
  const [isMilestoneDoneModalOpen, setIsMilestoneDoneModalOpen] = React.useState(false);
  const [isMilestoneViewModalOpen, setIsMilestoneViewModalOpen] = React.useState(false);
  const [
    isMilestoneDoneConfirmationModalOpen,
    setIsMilestoneDoneConfirmationModalOpen,
  ] = React.useState(false);

  const renderStatus = (status: ApplicationMilestone['state'], updatedAtS: number) => {
    if (status === 'submitted') {
      return (
        <Flex direction="column">
          <Menu placement="bottom">
            <MenuButton
              as={Button}
              aria-label="View More Options"
              rightIcon={<ChevronDownIcon color="brand.500" />}
              variant="outline"
              color="brand.500"
              fontWeight="500"
              fontSize="14px"
              lineHeight="14px"
              textAlign="center"
              borderRadius={8}
              borderColor="brand.500"
              _focus={{}}
            >
              Manage
            </MenuButton>
            <MenuList minW="164px" p={0}>
              <MenuItem icon={<ViewIcon color="#31373D" />} onClick={() => setIsMilestoneDoneModalOpen(true)}>
                <Text fontSize="14px" fontWeight="400" lineHeight="20px" color="#122224">Mark As Done</Text>
              </MenuItem>
              {/* TODO: Need to change the icons */}
              <MenuItem icon={<ViewIcon color="#31373D" />} onClick={() => setIsMilestoneViewModalOpen(true)}>
                <Text fontSize="14px" fontWeight="400" lineHeight="20px" color="#122224">View Grantee Submission</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      );
    }
    if (status === 'requested') {
      return (
        <Flex direction="column" justify="end" align="flex-end">
          <Text
            textAlign="right"
            variant="footer"
            color="#A0A7A7"
            whiteSpace="nowrap"
          >
            Marked as Done
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
              {moment(new Date(updatedAtS * 1000)).format('MMM DD, YYYY')}
            </Text>
          </Text>
          <Button variant="link" _focus={{}} onClick={() => setIsMilestoneViewModalOpen(true)}>
            <Text textAlign="right" variant="footer" color="#6200EE">
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
            {moment(new Date(updatedAtS * 1000)).format('MMM DD, YYYY')}
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
        renderStatus={(milestone) => renderStatus(milestone.state, milestone.updatedAtS || 0)}
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
            setIsMilestoneDoneConfirmationModalOpen(true);
          }}
        />
      </Modal>
      <Modal
        isOpen={isMilestoneViewModalOpen}
        onClose={() => setIsMilestoneViewModalOpen(false)}
        title="Milestone 1"
      >
        <MilestoneViewModalContent
          onClose={() => {
            setIsMilestoneViewModalOpen(false);
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

export default Milestones;
