import { Box, Button } from '@chakra-ui/react';
import React, { MouseEventHandler } from 'react';
import Tooltip from './tooltip';

function Badge({
  isActive,
  onClick,
  label,
  tooltip,
  inActiveVariant,
  variant,
}: {
  isActive: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
  label: string;
  tooltip?: string;
  inActiveVariant?: string;
  variant?: String;
}) {
  const getBorderRadius = () => {
    if (variant === 'buttonGroupStart') {
      return '8px 0 0 8px';
    } if (variant === 'buttonGroupEnd') {
      return '0 8px 8px 0';
    }
    return '8px';
  };
  if (isActive) {
    return (
      <Button
        w="100%"
        h={12}
        isActive={isActive}
        variant="outline"
        colorScheme="brand"
        onClick={onClick}
        borderRadius={getBorderRadius()}
      >
        {label}
        <Box as="span" mt="1px">
          {tooltip && tooltip.length ? (
            <Tooltip
              icon="/ui_icons/tooltip_questionmark_brand.svg"
              label={tooltip}
            />
          ) : null}
        </Box>
      </Button>
    );
  }
  return (
    <Button
      w="100%"
      h={12}
      variant={inActiveVariant}
      onClick={onClick}
      alignItems="center"
      borderRadius={getBorderRadius()}
    >
      {label}
      <Box as="span" mt="1px">
        {tooltip && tooltip.length ? <Tooltip label={tooltip} /> : null}
      </Box>
    </Button>
  );
}

Badge.defaultProps = {
  tooltip: '',
  inActiveVariant: 'outline',
  variant: 'normal',
};
export default Badge;
