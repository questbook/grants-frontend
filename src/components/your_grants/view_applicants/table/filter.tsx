import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu, MenuButton, MenuItem, MenuList, Text,
} from '@chakra-ui/react';
import React from 'react';

function Filter({
  setFilter,
}: {
  setFilter: (i: number) => void;
}) {
  return (
    <Menu placement="bottom">
      <MenuButton
        as={Button}
        aria-label="View More Options"
        mt="-28px"
        pl="16px"
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
        <MenuItem onClick={() => setFilter(-1)}>
          <Text
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color="#122224"
          >
            All
          </Text>
        </MenuItem>
        <MenuItem onClick={() => setFilter(2)}>
          <Text
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color="#122224"
          >
            Pending Review
          </Text>
        </MenuItem>
        <MenuItem onClick={() => setFilter(0)}>
          <Text
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color="#122224"
          >
            Grant Approved
          </Text>
        </MenuItem>
        <MenuItem onClick={() => setFilter(1)}>
          <Text
            fontSize="14px"
            fontWeight="400"
            lineHeight="20px"
            color="#122224"
          >
            Rejected
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default Filter;
