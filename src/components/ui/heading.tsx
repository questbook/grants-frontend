import React from 'react';
import { Divider, SpaceProps, Text } from '@chakra-ui/react';

type HeadingProps = {
  title: string
  dontRenderDivider?: boolean
  mt?: SpaceProps['mt']
};

function Heading({
  title,
  dontRenderDivider,
  mt,
}: HeadingProps) {
  return (
    <>
      <Text mt={mt} variant="heading">
        {title}
      </Text>
      {dontRenderDivider ? null : <Divider mt={4} mb={3} />}
    </>
  );
}

Heading.defaultProps = {
  dontRenderDivider: false,
  mt: 6,
};
export default Heading;
