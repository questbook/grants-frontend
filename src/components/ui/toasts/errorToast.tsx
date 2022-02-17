import {
  Flex, Image, IconButton, Box,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  content: React.ReactNode;
  close: () => void;
}

function ErrorToast({ content, close }: Props) {
  return (
    <Flex
      p={7}
      bg="#FFC0C0"
      border="2px solid #EE7979"
      borderRadius="6px"
      minW="578px"
          // maxH="94px"
      direction="row"
      justify="center"
      align="center"
    >
      <Image src="/toast/error.svg" mr={6} />
      {content}
      <Box m="auto" />
      <Flex h="full" align="center" justify="center">
        <IconButton
          _hover={{}}
          variant="ghost"
          _active={{}}
          icon={<Image src="/toast/error_close.svg" />}
          aria-label="Close"
          onClick={close}
        />
      </Flex>
    </Flex>
  );
}

export default ErrorToast;
