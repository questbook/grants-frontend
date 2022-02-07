import { Button, Divider, Flex } from '@chakra-ui/react';
import React, { ReactElement, useState } from 'react';
import Members from '../src/components/settings_and_members/members';
import Settings from '../src/components/settings_and_members/settings';
import NavbarLayout from '../src/layout/navbarLayout';

function SettingsAndMembers() {
  const tabs = ['Settings', 'Invite Members'];
  const [selected, setSelected] = useState(0);

  const switchTab = (to: number) => {
    setSelected(to);
  };

  return (
    <Flex direction="row" w="100%" justify="space-evenly">
      <Flex w="65%" direction="column">
        <Flex direction="row" w="full" justify="start" h={14} align="stretch" mb={4} mt={6}>
          {tabs.map((tab, index) => (
            <Button
              variant="link"
              ml={index === 0 ? 0 : 12}
              _hover={{
                color: 'black',
              }}
              _focus={{}}
              fontWeight="700"
              fontStyle="normal"
              fontSize="28px"
              lineHeight="44px"
              letterSpacing={-1}
              borderRadius={0}
              color={index === selected ? '#122224' : '#A0A7A7'}
              onClick={() => switchTab(index)}
            >
              {tab}
            </Button>
          ))}
        </Flex>
        <Divider variant="sidebar" mb={5} />
        {selected === 0 ? <Settings /> : <Members />}
      </Flex>
      <Flex w="20%" />
    </Flex>
  );
}

SettingsAndMembers.getLayout = function getLayout(page: ReactElement) {
  return <NavbarLayout>{page}</NavbarLayout>;
};

export default SettingsAndMembers;
