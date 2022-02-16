import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Menu, MenuButton, MenuItem, MenuList, Text,
} from '@chakra-ui/react';
import React from 'react';
import FilterStates from '../filterStates';

function Filter({
  filter,
  setFilter,
}: {
  filter: number;
  setFilter: (i: number) => void;
}) {
  const menuOptions = ['All', 'Pending Review', 'Await Resubmit', 'Approved', 'Rejected'];

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
          rightIcon={<ChevronDownIcon color="brand.500" />}
          fontSize="16px"
          fontWeight="500"
          w="fit-content"
          mx="auto"
        >
          Filter By
        </MenuButton>
        <MenuList minW="164px" p={0}>
          {menuOptions.map((option, i) => (
            <MenuItem onClick={() => setFilter(i - 1)}>
              <Text
                fontSize="14px"
                fontWeight="400"
                lineHeight="20px"
                color="#122224"
              >
                {option}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      {filter >= 0 && (
      <FilterStates
        filter={menuOptions[filter + 1]}
        setFilter={setFilter}
      />
      )}
    </Flex>

  );
}

export default Filter;
