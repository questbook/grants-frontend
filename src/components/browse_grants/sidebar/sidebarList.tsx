import {
  VStack, Link, Flex, Text, HStack, Image,
} from '@chakra-ui/react';
import React from 'react';

function SidebarList({
  listElements,
  linkText,
  linkHref,
}: {
  listElements: { src: string; text: string }[];
  linkText: string;
  linkHref: string;
}) {
  return (
    <Flex direction="column" justify="start" align="start">
      <Text fontSize="18px" lineHeight="26px" fontWeight="700">
        Protocols & DAOs
      </Text>
      <VStack
        mt={5}
        direction="column"
        spacing={7}
        justify="start"
        align="start"
      >
        {listElements.map(({ src, text }) => (
          <HStack justify="start" spacing={4} align="start" w="full">
            <Image h="21px" src={src} />
            <Text fontWeight="400" lineHeight="19.5px" color="#122224">{text}</Text>
          </HStack>
        ))}
      </VStack>
      <Link mt={6} ml={9} href={linkHref} fontSize="12px">
        {linkText}
        {' '}
        {'>'}
      </Link>
    </Flex>
  );
}

export default SidebarList;
