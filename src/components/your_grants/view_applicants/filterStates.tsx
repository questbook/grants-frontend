import React from 'react';
import {
  IconButton, Text, Image, Flex,
} from '@chakra-ui/react';

interface Props {
  filter: string,
  setFilter: (i: number) => void;
}

function FilterStates({ filter, setFilter } : Props) {
  return (
    <Flex
      direction="row"
      align="center"
      justify="space-evenly"
      bg="#F3F4F4"
      borderRadius="12px"
      border="1px solid #D0D3D3"
      p="3px 16px"
      h="30px"
    >
      <Text
        w="100%"
        color="#717A7C"
        textAlign="center"
        fontSize="12px"
        lineHeight="20px"
        fontWeight="400"
      >
        {filter}
      </Text>
      <IconButton
        aria-label="filter_button"
        variant="ghost"
        _hover={{}}
        _active={{}}
        icon={<Image m={0} p={0} src="/ui_icons/filter_close.svg" />}
        onClick={() => {
          setFilter(-1);
        }}
      />
    </Flex>

  );
}

export default FilterStates;
