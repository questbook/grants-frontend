import {
  Flex, Text, Image, Box, Button, Link,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import config from 'src/constants/config';
import useSubmitPublicKey from 'src/hooks/useSubmitPublicKey';
import SidebarComponent from '../../ui/sidebar/sidebar';

interface Props {
  showCreateGrantItem: boolean;
}
function Sidebar({ showCreateGrantItem }: Props) {
  const { RenderModal, setHiddenModalOpen } = useSubmitPublicKey();
  const router = useRouter();
  const [listItems, setListItems] = useState<any[]>([]);

  useEffect(() => {
    let items = [
      {
        icon: '/ui_icons/first_grant.svg',
        title: 'Create your first grant',
        subtitle: 'Add grant details, set a reward and attract applicants. ',
        onSubmit: () => {
          router.push({
            pathname: '/your_grants/create_grant/',
          });
        },
      },
      {
        icon: '/ui_icons/first_grant.svg',
        title: 'Get access to encrypted applicant data',
        subtitle: 'Provide access to your public encryption key ',
        learnMoreText: 'Why is this required?',
        learnMoreLink:
          'https://www.notion.so/questbook/Why-is-public-key-required-e3fa53f34a5240d185d3d34744bb33f4',
        onSubmit: () => {
          setHiddenModalOpen(true);
        },
      },
      {
        icon: '/ui_icons/invite_team.svg',
        title: 'Invite Team',
        subtitle:
          'Invite core DAO members to set up grants, and add funds to it.',
        onSubmit: () => {
          router.push({
            pathname: '/manage_dao/',
            query: {
              tab: 'members',
            },
          });
        },
      },
    ];
    if (!showCreateGrantItem) {
      items = items.filter((item) => item.title !== 'Create your first grant');
    }
    setListItems(items);
  }, [router, setHiddenModalOpen, showCreateGrantItem]);

  return (
    <SidebarComponent
      links={[
        {
          href: config.supportLink,
          label: 'Support 24*7',
          iconUrl: '/sidebar/discord_icon.svg',
        },
        {
          href: 'https://www.notion.so/questbook/Contracts-7cea3bdfb6be47e68f165b4a719c662f',
          label: 'On Chain Contract',
          iconUrl: '/sidebar/onchain_icon.svg',
        },
      ]}
    >
      <Flex flex={1} w="100%" direction="column" py={7} px={10}>
        <Text variant="heading">
          Here is what you can do
          {' '}
          <Text
            as="span"
            display="inline-block"
            color="#EA5050"
            variant="heading"
            fontWeight="600"
            letterSpacing={-1}
          >
            next?
          </Text>
        </Text>

        <Box mb={9} />

        {listItems.map((item) => (
          <Flex key={item.title} direction="row" align="start" mb={14}>
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
              {item.learnMoreText && (
                <Link href={item.learnMoreLink} mt={2} isExternal>
                  <Text
                    color="#122224"
                    fontWeight="normal"
                    fontSize="14px"
                    lineHeight="20px"
                    decoration="underline"
                  >
                    {item.learnMoreText}
                  </Text>
                </Link>
              )}
              <Button
                mt={5}
                variant="primaryCta"
                height="32px"
                onClick={item.onSubmit}
              >
                Start
              </Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <RenderModal />
    </SidebarComponent>
  );
}

export default Sidebar;
