import React from 'react';
import { Image, Button } from '@chakra-ui/react';

interface Props {
  filter: string,
  setFilter: (i: number) => void;
}

function FilterStates({ filter, setFilter } : Props) {
  return (
    <Button
      bg="#F3F4F4"
      borderRadius="12px"
      border="1px solid #D0D3D3"
      m={2}
      p={2}
      h="30px"
      color="#717A7C"
      textAlign="center"
      fontSize="12px"
      lineHeight="20px"
      fontWeight="400"
      rightIcon={<Image m={0} p={0} src="/ui_icons/filter_close.svg" />}
      onClick={() => {
        setFilter(-1);
      }}
      _hover={{}}
      _active={{}}
    >
      {filter}
    </Button>

  );
}

export default FilterStates;
