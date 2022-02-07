import {
  Box, Flex, Image, Text,
} from '@chakra-ui/react';
import React from 'react';

interface CoverUploadProps {
  label?: string,
  subtext?: string;
}

const defaultProps = {
  label: '',
  subtext: '',
};

function CoverUpload({ label, subtext }: CoverUploadProps) {
  return (
    <Flex w="100%" align="stretch" direction="column">
      <Text lineHeight="20px" fontWeight="bold" mb={7}>
        {label}
      </Text>
      <Flex
        bg="white"
        w="full"
        h="150px"
        borderRadius={4}
        borderWidth={2}
        borderStyle="dashed"
        borderColor="#717A7C"
        p={2}
      >
        <Flex w="full" h="full" position="relative" bg="#E8E9E9" align="center" justify="center">
          <Flex direction="column" align="center" jutify="start">
            <Image h="30px" w="30px" src="/ui_icons/upload.svg" />
            <Box mt={1} />
            <Text fontSize="12px" lineHeight="24px" letterSpacing={0.5} color="brand.500" fontWeight="500">{subtext}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

CoverUpload.defaultProps = defaultProps;
export default CoverUpload;
