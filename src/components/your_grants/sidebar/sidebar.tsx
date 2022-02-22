import {
  Flex, Text, Image, Box, Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import SidebarComponent from '../../ui/sidebar/sidebar';

function Sidebar() {
  const router = useRouter();
  const listItems = [
    {
      icon: '/ui_icons/first_grant.svg',
      title: 'Create your first grant',
      subtitle: 'Add grant details, set a reward and attract applicants. ',
      onSubmit: () => {
        router.push({
          pathname: '/your_grants/create_grant/',
        });
      },
    }, {
      icon: '/ui_icons/invite_team.svg',
      title: 'Invite Team',
      subtitle: 'Invite core DAO members to set up grants, and add funds to it.',
      onSubmit: () => {
        router.push({
          pathname: '/settings_and_members/',
          query: {
            tab: 'members',
          },
        });
      },
    },
  ];

  return (
    <SidebarComponent
      links={[
        {
          href: '#',
          label: 'Support 24*7',
          iconUrl: '/sidebar/discord_icon.svg',
        },
        {
          href: '#',
          label: 'On Chain Contract',
          iconUrl: '/sidebar/onchain_icon.svg',
        },
      ]}
    >
      <Flex
        flex={1}
        w="100%"
        direction="column"
        py={7}
        px={10}
      >
        <Text variant="heading">
          Here is what you can do
          {' '}
          <Text display="inline-block" color="#EA5050" variant="heading" fontWeight="600" letterSpacing={-1}>
            next?
          </Text>
        </Text>

        <Box mb={9} />

        {listItems.map((item) => (
          <Flex direction="row" align="start" mb={14}>
            <Image src={item.icon} boxSize="30px" />
            <Flex ml={4} direction="column" align="start">
              <Text
                fontSize="18px"
                fontWeight="700"
                lineHeight="26px"
                color="#122224"
              >
                {item.title}
              </Text>
              <Text
                mt={2}
                fontSize="18px"
                fontWeight="400"
                lineHeight="26px"
                color="#122224"
              >
                {item.subtitle}
              </Text>
              <Button mt={5} variant="primaryCta" height="32px" onClick={item.onSubmit}>Start</Button>
            </Flex>
          </Flex>
        ))}

      </Flex>
    </SidebarComponent>
  );
}

export default Sidebar;
