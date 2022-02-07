import {
  Heading, Flex, Text, Image, Box, Button,
} from '@chakra-ui/react';
import React from 'react';
import FloatingSidebar from '../../ui/sidebar/floatingSidebar';

function Sidebar({
  onAcceptApplicationClick,
  onRejectApplicationClick,
  onResubmitApplicationClick,
}: {
  onAcceptApplicationClick: () => void;
  onRejectApplicationClick: () => void;
  onResubmitApplicationClick: () => void;
}) {
  return (
    <Box mt="8px">
      <FloatingSidebar>
        <Heading
          fontSize="16px"
          fontWeight="400"
          color="#414E50"
          lineHeight="26px"
          fontStyle="normal"
        >
          Application Details
        </Heading>
        <Flex direction="row" justify="start" w="full" mt={6} align="center">
          <Image h="45px" w="45px" src="/network_icons/eth_mainnet.svg" />
          <Box mx={3} />
          <Heading variant="applicationHeading" color="brand.500">
            0xb79....579268
          </Heading>
        </Flex>
        <Box my={4} />
        <Flex direction="row" justify="space-between" w="full" align="center">
          <Text variant="applicationText" lineHeight="32px">
            Name
          </Text>
          <Heading variant="applicationHeading" lineHeight="32px">
            Ankit Nair
          </Heading>
        </Flex>
        <Flex direction="row" justify="space-between" w="full" align="center">
          <Text variant="applicationText" lineHeight="32px">
            Email
          </Text>
          <Heading variant="applicationHeading" lineHeight="32px">
            ankit@gmail.com
          </Heading>
        </Flex>
        <Flex direction="row" justify="space-between" w="full" align="center">
          <Text variant="applicationText" lineHeight="32px">
            Sent On
          </Text>
          <Heading variant="applicationHeading" lineHeight="32px">
            2nd January, 2022
          </Heading>
        </Flex>
        <Flex direction="column" w="full" align="start" mb={8} mt={4}>
          <Box
            // variant="dashed"
            border="1px dashed #A0A7A7"
            h={0}
            w="100%"
            m={0}
          />
          <Text fontSize="10px" mt={6} lineHeight="12px">
            FUNDING REQUESTED
          </Text>
          <Text
            fontSize="28px"
            lineHeight="40px"
            fontWeight="500"
            fontStyle="normal"
            color="#122224"
          >
            40 ETH
          </Text>
          <Box
            // variant="dashed"
            border="1px dashed #A0A7A7"
            h={0}
            w="100%"
            mt="17px"
            mb={0}
          />
        </Flex>
        <Button
          onClick={() => onAcceptApplicationClick()}
          variant="primary"
          mt={7}
        >
          Approve Grant
        </Button>
        <Button
          onClick={() => onResubmitApplicationClick()}
          variant="resubmit"
          mt={4}
        >
          Ask to Resubmit
        </Button>
        <Button
          onClick={() => onRejectApplicationClick()}
          variant="reject"
          mt={4}
        >
          Reject Application
        </Button>
      </FloatingSidebar>
    </Box>
  );
}

export default Sidebar;
