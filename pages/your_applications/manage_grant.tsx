import {
  Container, Flex, Image, Box, Text, Button,
} from '@chakra-ui/react';
import React from 'react';
import { useApplicationMilestones } from 'src/graphql/queries';
import { getAssetInfo } from 'src/utils/tokenUtils';
import Sidebar from '../../src/components/your_applications/manage_grant/sidebar';
import Breadcrumbs from '../../src/components/ui/breadcrumbs';
import Heading from '../../src/components/ui/heading';
import MilestoneTable from '../../src/components/your_applications/manage_grant/milestoneTable';
import FundingRequestedTable from '../../src/components/your_applications/manage_grant/fundingRequestedTable';
import NavbarLayout from '../../src/layout/navbarLayout';

function ManageGrant() {
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

  const [selected, setSelected] = React.useState(0);
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
        <Breadcrumbs path={['Your Applications', 'Manage Grant']} />
        <Heading mt="18px" title="Storage Provider (SP) Tooling Ideas" />
        <Box mt={5} />

        <Flex direction="row" w="full" align="center">
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

        {
          selected === 0
            ? <MilestoneTable milestones={milestones} rewardAssetId={rewardAsset} />
            : <FundingRequestedTable />
        }
      </Container>

      <Sidebar />
    </Container>
  );
}

ManageGrant.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <NavbarLayout>
      {page}
    </NavbarLayout>
  );
};
export default ManageGrant;
