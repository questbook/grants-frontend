import { Text, Image, Button } from '@chakra-ui/react';
import React from 'react';

function Tab({
  label,
  icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={() => onClick()}
      m={0}
      h="100%"
      variant="ghost"
      display="flex"
      alignItems="center"
      borderRadius={0}
    >
      <Image w="19px" h="23px" mr="10px" src={icon} />
      <Text
        color={isActive ? '#8850EA' : '#414E50'}
        fontWeight="500"
        fontSize="16px"
        lineHeight="24px"
      >
        {label}
      </Text>
    </Button>
  );
}

export default Tab;
