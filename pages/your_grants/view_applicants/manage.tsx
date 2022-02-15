import {
  Container, Flex, Image, Box, Text, Link, Button,
} from '@chakra-ui/react';
import React from 'react';
import { useApplicationMilestones } from 'src/graphql/queries';
import { getAssetInfo } from 'src/utils/tokenUtils';
import Breadcrumbs from '../../../src/components/ui/breadcrumbs';
import Heading from '../../../src/components/ui/heading';
import Modal from '../../../src/components/ui/modal';
import ModalContent from '../../../src/components/your_grants/manage_grant/modals/modalContentGrantComplete';
import Sidebar from '../../../src/components/your_grants/manage_grant/sidebar';
import Funding from '../../../src/components/your_grants/manage_grant/tables/funding';
import Milestones from '../../../src/components/your_grants/manage_grant/tables/milestones';
import NavbarLayout from '../../../src/layout/navbarLayout';

function ManageGrant() {
  const path = ['My Grants', 'View Application', 'Manage'];
  const grantTitle = 'Storage Provider (SP) Tooling Ideas';

  const applicantAddress = '0x43Cb....';
  const applicantEmail = 'ankit@gmail.com';
  const applicationDate = '2 January 2022';

  const [selected, setSelected] = React.useState(0);
  const [isGrantCompleteModelOpen, setIsGrantCompleteModalOpen] = React.useState(false);

  const { data: { milestones, rewardAsset }, loading, error } = useApplicationMilestones('0x7');
  const fundingIcon = getAssetInfo(rewardAsset)?.icon;

  const tabs = [
    {
      title: milestones.length.toString(),
      subtitle: milestones.length === 1 ? 'Milestone' : 'Milestones',
    },
    {
      icon: fundingIcon,
      title: '0',
      subtitle: 'Funding Requested',
    },
    {
      icon: fundingIcon,
      title: '20',
      subtitle: 'Funding Recieved',
    },
  ];

  return (
    <Container maxW="100%" display="flex" px="70px">
      <Container
        flex={1}
        display="flex"
        flexDirection="column"
        maxW="834px"
        alignItems="stretch"
        pb={8}
        px={10}
      >
        <Breadcrumbs path={path} />
        <Heading mt="12px" title={grantTitle} dontRenderDivider />
        <Flex mt="3px" direction="row" justify="start" align="baseline">
          <Text
            key="address"
            variant="applicationText"
          >
            By
            {' '}
            <Box as="span" fontWeight="700" display="inline-block">
              {applicantAddress}
            </Box>
          </Text>
          <Box mr={6} />
          <Text key="mail_text" fontWeight="400">
            <Image
              display="inline-block"
              alt="mail_icon"
              src="/ui_icons/mail_icon.svg"
              mr={2}
            />
            {applicantEmail}
          </Text>
          <Box mr={6} />
          <Text key="date_text" fontWeight="400">
            <Image
              alt="date_icon"
              display="inline-block"
              src="/ui_icons/date_icon.svg"
              mr={2}
            />
            {applicationDate}
          </Text>
          <Box mr={6} />
          <Link
            key="link"
            variant="link"
            fontSize="14px"
            lineHeight="24px"
            fontWeight="500"
            fontStyle="normal"
            color="#414E50"
            href="view_grant"
          >
            View Application
            {' '}
            <Image
              display="inline-block"
              h={3}
              w={3}
              src="/ui_icons/link.svg"
            />
          </Link>
        </Flex>

        <Flex mt="29px" direction="row" w="full" align="center">
          {tabs.map((tab, index) => (
            <Button
              variant="ghost"
              h="110px"
              w="full"
              _hover={{
                background: '#F5F5F5',
              }}
              background={index !== selected ? 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F4 100%)' : 'white'}
              _focus={{}}
              borderRadius={index !== selected ? 0 : '8px 8px 0px 0px'}
              borderRightWidth={((index !== (tabs.length - 1) && index + 1 !== selected) || index === selected) ? '2px' : '0px'}
              borderLeftWidth={index !== selected ? 0 : '2px'}
              borderTopWidth={index !== selected ? 0 : '2px'}
              borderBottomWidth={index !== selected ? '2px' : 0}
              borderBottomRightRadius="-2px"
              onClick={() => (index !== tabs.length - 1 ? setSelected(index) : null)}
            >
              <Flex direction="column" justify="center" align="center" w="100%">
                <Flex direction="row" justify="center" align="center">
                  {tab.icon && <Image h="26px" w="26px" src={tab.icon} alt={tab.icon} />}
                  <Box mx={1} />
                  <Text fontWeight="700" fontSize="26px" lineHeight="40px">
                    {tab.title}
                  </Text>
                </Flex>
                <Text variant="applicationText" color="#717A7C">{tab.subtitle}</Text>
              </Flex>
            </Button>
          ))}
        </Flex>

        {selected === 0 ? <Milestones milestones={milestones} rewardAssetId={rewardAsset} /> : <Funding />}

        <Flex direction="row" justify="center" mt={8}>
          <Button variant="primary" onClick={() => setIsGrantCompleteModalOpen(true)}>Mark Grant as Complete</Button>
        </Flex>

      </Container>
      <Sidebar funds={0} />

      <Modal
        isOpen={isGrantCompleteModelOpen}
        onClose={() => setIsGrantCompleteModalOpen(false)}
        title="Mark Grant as Complete"
      >
        <ModalContent
          onClose={() => setIsGrantCompleteModalOpen(false)}
        />
      </Modal>

    </Container>
  );
}

ManageGrant.getLayout = function getLayout(page: React.ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};
export default ManageGrant;
