import {
  Box, Button, Flex, Image, Text,
} from '@chakra-ui/react';
import { useFilePicker } from 'use-file-picker';
import React from 'react';

interface CoverUploadProps {
  label?: string,
  subtext?: string;
}

const defaultProps = {
  label: '',
  subtext: '',
};

function CoverUpload({
  label, subtext,
}: CoverUploadProps) {
  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*',
    multiple: true,
    limitFilesConfig: { max: 1 },
    // minFileSize: 1,
    maxFileSize: 50, // in megabytes
  });

  return (
    <Flex w="100%" align="stretch" direction="column">
      <Text lineHeight="20px" fontWeight="bold" mb={7}>
        {label}
      </Text>
      <Flex
        bg="white"
        w="full"
        h="300px"
        borderRadius={4}
        borderWidth={2}
        borderStyle="dashed"
        borderColor="#717A7C"
        p={2}
      >
        <Button
          _hover={filesContent.length === 1 ? {} : Button.defaultProps}
          onClick={loading ? () => {} : openFileSelector}
          w="full"
          h="full"
          position="relative"
          bg={filesContent.length === 1 ? 'white' : '#E8E9E9'}
        >
          {filesContent.length === 1 && <Image src={filesContent[0].content} w="full" h="full" alt="selected_image" />}
          {filesContent.length === 0
          && (
          <Flex direction="column" align="center" justify="start">
            <Image h="30px" w="30px" src="/ui_icons/upload.svg" />
            <Box mt={1} />
            <Text fontSize="12px" lineHeight="24px" letterSpacing={0.5} color="brand.500" fontWeight="500">{subtext}</Text>
            {errors.length > 0 && <Text>Error!</Text>}
          </Flex>
          )}
        </Button>
      </Flex>
    </Flex>
  );
}

CoverUpload.defaultProps = defaultProps;
export default CoverUpload;
