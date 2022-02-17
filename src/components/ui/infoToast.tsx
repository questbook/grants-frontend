import {
  Flex, Image, IconButton, Box, Text, Link,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  link: string;
  close: () => void;
}

function InfoToast({ link, close }: Props) {
  return (
    <Flex
      p={7}
      bg="#BBDEFF"
      border="2px solid #88BDEE"
      borderRadius="6px"
      minW="578px"
        // maxH="94px"
      direction="row"
      justify="center"
      align="center"
    >
      <Image src="/toast/info.svg" mr={6} />
      <Flex direction="column" align="start" justify="start">
        <Text variant="tableHeader" color="#3E4969">Your last activity is processing and will be live in a few minutes.</Text>
        <Link href={link} isExternal>Learn More</Link>
      </Flex>
      <Box m="auto" />
      <Flex h="full" align="center" justify="center">
        <IconButton
          _hover={{}}
          variant="ghost"
          _active={{}}
          icon={<Image src="/toast/info_close.svg" />}
          aria-label="Close"
          onClick={close}
        />
      </Flex>
    </Flex>
  );
}

export default InfoToast;
