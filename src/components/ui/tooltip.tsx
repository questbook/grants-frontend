import {
  Tooltip as TooltipComponent, Button, Image, PlacementWithLogical,
} from '@chakra-ui/react';
import React from 'react';

function Tooltip({
  label,
  h,
  w,
  icon,
  placement,
}: {
  label:string | (string | JSX.Element)[];
  h?: number | string;
  w?: number | string;
  icon?: string;
  placement?: PlacementWithLogical;
}) {
  return (
    <TooltipComponent
      placement={placement}
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
        as="span"
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
  placement: 'bottom-end',
};
export default Tooltip;
