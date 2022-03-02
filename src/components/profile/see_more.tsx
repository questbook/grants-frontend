import React from 'react';
import { Button, Text } from '@chakra-ui/react';

interface Props {
  text: string;
}

function SeeMore({ text }: Props) {
  const [showMore, setShowMore] = React.useState(false);
  const { length } = text;
  const maxLength = 235;

  return (
    <Text fontSize="14px" lineHeight="24px" fontWeight="400" color="#414E50" my={6}>
      {showMore ? text : text.slice(0, maxLength)}

      {length > maxLength && (
      <Button
        variant="link"
        _hover={{}}
        _active={{}}
        onClick={() => setShowMore(!showMore)}
        color="brand.500"
        style={{ textDecoration: 'underline' }}
        fontSize="14px"
        lineHeight="24px"
        fontWeight="400"
        ml={2}
      >
        {showMore ? 'See Less' : 'See More'}
      </Button>
      )}

    </Text>
  );
}

export default SeeMore;
