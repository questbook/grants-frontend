import {
  Popover,
  PopoverTrigger,
  Image,
  PopoverContent,
  Flex,
  Text,
  Button,
  Box,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  grantAmount: string;
  grantCurrency: string;
}

function VerifiedBadge({ grantAmount, grantCurrency }: Props) {
  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Image
          h={4}
          w={4}
          display="inline-block"
          src="/ui_icons/verified.svg"
          ml="2px"
          mb="-2px"
        />
      </PopoverTrigger>
      <PopoverContent bg="white" borderRadius="8px" p={4} maxW="210px">
        <Flex direction="column" align="start">
          <Text
            fontWeight="700"
            fontStyle="normal"
            fontSize="14px"
            lineHeight="16px"
          >
            Verified Grants
          </Text>
          <Text
            mt={2}
            color="#717A7C"
            fontWeight="400"
            fontStyle="normal"
            fontSize="14px"
            lineHeight="21px"
          >
            Funds deposited as reward
            {' '}
            {grantAmount}
            {' '}
            {grantCurrency}
          </Text>
          <Flex direction="row" w="100%">
            <Box mr="auto" />
            <Button
              mt={2}
              variant="link"
              color="brand.500"
              fontWeight="500"
              fontStyle="normal"
              fontSize="14px"
              lineHeight="16px"
              onClick={() => {}}
            >
              Learn More
            </Button>
          </Flex>
        </Flex>
      </PopoverContent>
    </Popover>
  );
}

export default VerifiedBadge;
