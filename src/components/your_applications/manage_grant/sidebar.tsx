import {
  Box, Link, Text, Flex, Image, Divider,
} from '@chakra-ui/react';
// import { ExternalLinkIcon } from '@chakra-ui/icons';
import React from 'react';
import FloatingSidebar from '../../ui/sidebar/floatingSidebar';

function Sidebar() {
  return (
    <Box my="115px">
      <FloatingSidebar>
        <Text variant="applicationText" color="#414E50">
          Application Details
        </Text>
        <Flex direction="row" justify="start" w="full" mt={7} align="flex-start">
          <Image h="45px" w="45px" src="/network_icons/eth_mainnet.svg" />
          <Box ml="18px" />
          <Flex direction="column" align="start" w="100%">
            <Text
              fontSize="18px"
              lineHeight="24px"
              letterSpacing={0.5}
              fontWeight="700"
              color="#6200EE"
            >
              0xb79....579268
            </Text>
            <Text variant="applicationText" color="#717A7C">
              Sent on
              {' '}
              <Box
                display="inline-block"
                fontSize="16px"
                lineHeight="32px"
                letterSpacing={0.5}
                fontWeight="700"
                color="#122224"
              >
                2 Jan, 2022
              </Box>
            </Text>
          </Flex>
        </Flex>
        <Divider mt="37px" />
        <Flex mt="22px" mb="3px" direction="row" w="full" alignItems="center">
          <Link
            variant="link"
            fontSize="14px"
            lineHeight="24px"
            fontWeight="500"
            fontStyle="normal"
            color="#414E50"
            href="view grant"
          >
            View Grant
            {' '}
            <Image display="inline-block" h={3} w={3} src="/ui_icons/link.svg" />
          </Link>
          <Link
            variant="link"
            fontSize="14px"
            lineHeight="24px"
            fontWeight="500"
            fontStyle="normal"
            color="#414E50"
            href="view grant"
            ml="auto"
          >
            View Application
            {' '}
            <Image display="inline-block" h={3} w={3} src="/ui_icons/link.svg" />
          </Link>
        </Flex>
      </FloatingSidebar>
    </Box>
  );
}

export default Sidebar;
