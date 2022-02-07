import { Flex, Box, Text } from '@chakra-ui/react';
import React from 'react';
import SidebarComponent from '../../ui/sidebar/sidebar';
import SidebarList from './sidebarList';

function Sidebar() {
  return (
    <SidebarComponent
      links={[
        {
          href: '#',
          label: 'Support 24*7',
          iconUrl: '/brand_icons/discord_icon.svg',
        },
        {
          href: '#',
          label: 'On Chain Contract',
          iconUrl: '/brand_icons/onchain_icon.svg',
        },
      ]}
    >
      <Flex
        flex={1}
        w="full"
        direction="column"
        py={7}
        px={10}
        overflow="scroll"
      >
        <Text fontSize="28px" lineHeight="35.5px">
          What is
          <br />
          <Text display="inline-block" fontWeight="700">
            Questbook?
          </Text>
        </Text>

        <Box mt={8}>
          <SidebarList
            listElements={[
              {
                src: '/home/sidebar/create_grants.svg',
                text: 'Create Grants',
              },
              {
                src: '/home/sidebar/attract_applicants.svg',
                text: 'Attract Applicants',
              },
              {
                src: '/home/sidebar/review_application.svg',
                text: 'Review Application',
              },
              {
                src: '/home/sidebar/deploy_funds.svg',
                text: 'Deploy funds',
              },
            ]}
            linkText="See our guide"
            linkHref="#"
          />
        </Box>

        <Box mt={8}>
          <SidebarList
            listElements={[
              {
                src: '/home/sidebar/explore_grants.svg',
                text: 'Explore Grants',
              },
              {
                src: '/home/sidebar/apply_for_grants.svg',
                text: 'Apply for grants',
              },
            ]}
            linkText="See our guide"
            linkHref="#"
          />
        </Box>
      </Flex>
    </SidebarComponent>
  );
}

export default Sidebar;
