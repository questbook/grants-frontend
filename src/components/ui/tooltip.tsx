import { Tooltip as TooltipComponent, Button, Image } from '@chakra-ui/react';
import React from 'react';

function Tooltip({
  label,
  h,
  w,
  icon,
}: {
  label: string;
  h?: number | string;
  w?: number | string;
  icon?: string;
}) {
  return (
    <TooltipComponent
      placement="bottom-end"
      label={label}
      bg="white"
      color="#122224"
      boxShadow="0px 2px 16px -1px rgba(0, 0, 0, 0.14)"
      borderRadius="8px"
      px="21px"
      pt="18px"
      pb="24px"
      fontWeight="400"
    >
      <Button
        variant="ghost"
        h={4}
        size="xs"
        minWidth={0}
        p={0}
        mx="6px"
        borderRadius={12}
      >
        <Image
          h={h}
          w={w}
          mb={1}
          src={icon}
          alt="help"
        />
      </Button>
    </TooltipComponent>
  );
}

Tooltip.defaultProps = {
  h: 4,
  w: 4,
  icon: '/ui_icons/tooltip_questionmark.svg',
};
export default Tooltip;
