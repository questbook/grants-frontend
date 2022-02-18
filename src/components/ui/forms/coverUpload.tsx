import {
  Box,
  Button, Flex, Image, Text,
} from '@chakra-ui/react';
import React, { useRef } from 'react';

interface CoverUploadProps {
  label?: string;
  subtext?: string;
  image: string | null | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  // onClear: () => void;
  isError: boolean;
}

const defaultProps = {
  label: 'Upload',
  subtext: '',
};

function CoverUpload({
  label, subtext, image, onChange, isError,
}: CoverUploadProps) {
  const ref = useRef(null);

  const openInput = () => {
    if (ref.current) {
      (ref.current as HTMLInputElement).click();
    }
  };

  return (
    <Flex direction="column" align="center">
      <Text lineHeight="20px" fontWeight="bold">
        {label}
      </Text>
      <Flex
        mt={2}
        bg="white"
        w="100%"
        h="300px"
        display="inline-block"
        borderRadius="4px"
        border={isError ? '3px dashed #EE7979' : '2px dashed #717A7C'}
          // padding="5px"
        pos="relative"
      >
        <Button p={0} onClick={() => openInput()} h="100%" w="100%" flex={1}>
          {image && image.length && !image.endsWith('arg=null') && <Image objectFit="cover" src={image} w="100%" h="100%" />}
          {(!image || !(image.length) || image.endsWith('arg=null')) && (
            <Flex direction="column" align="center" justify="start">
              <Image h="30px" w="30px" src="/ui_icons/upload.svg" />
              <Box mt={1} />
              <Text fontSize="12px" lineHeight="24px" letterSpacing={0.5} color="brand.500" fontWeight="500">{subtext}</Text>
            </Flex>
          )}
        </Button>

        <input style={{ visibility: 'hidden' }} ref={ref} type="file" name="myImage" onChange={onChange} />
      </Flex>
    </Flex>
  );
}

CoverUpload.defaultProps = defaultProps;
export default CoverUpload;
