import {
  Button,
  Flex,
  Menu, MenuButton, MenuItem, MenuList, Text, Image,
} from '@chakra-ui/react';
import React from 'react';
import FilterStates from '../filterStates';
import { TableFilterNames } from './TableFilters';

function Filter({
  filter,
  setFilter,
}: {
  filter: number;
  setFilter: (i: number) => void;
}) {
  return (
    <Flex direction="row" justify="start" align="center">
      <Menu placement="bottom">
        <MenuButton
          as={Button}
          aria-label="View More Options"
        // mt="-28px"
        // pl="16px"
          variant="link"
          _focus={{}}
          color="#6200EE"
          rightIcon={<Image src="/ui_icons/dropdown_arrow.svg" />}
          fontSize="16px"
          fontWeight="500"
          w="fit-content"
          mx="auto"
        >
          Filter By
        </MenuButton>
        <MenuList minW="164px" p={0}>
          {Object.keys(TableFilterNames).map((option, i) => (
            <MenuItem onClick={() => setFilter(i - 1)}>
              <Text
                fontSize="14px"
                fontWeight="400"
                lineHeight="20px"
                color="#122224"
              >
                {TableFilterNames[option as keyof typeof TableFilterNames]}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {filter >= 0 && (
      <FilterStates
        filter={TableFilterNames[Object
          .keys(TableFilterNames)[filter + 1] as keyof typeof TableFilterNames]}
        setFilter={setFilter}
      />
      )}
    </Flex>

  );
}

export default Filter;
