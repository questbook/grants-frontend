import React, { ChangeEventHandler, useRef } from 'react';
import {
  Text,
  Input,
  Flex,
  useTheme,
  Box,
  InputGroup,
  InputRightElement,
  PlacementWithLogical,
} from '@chakra-ui/react';
import Tooltip from '../tooltip';

interface SingleLineInputProps {
  label?: string;
  value: string | number | readonly string[] | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: () => void;
  placeholder?: string;
  isError?: boolean;
  errorText?: string;
  subtext?: string | null | undefined;
  subtextAlign?: 'left' | 'right' | 'center';
  disabled?: boolean;
  tooltip?: string;
  tooltipPlacement?: PlacementWithLogical;

  labelRightElement?: React.ReactNode;
  inputRightElement?: React.ReactNode;
  type?: string;
  height?: string | number;
  visible?: boolean;
}

const defaultProps = {
  label: '',
  placeholder: '',
  subtext: '',
  disabled: false,
  tooltip: '',
  tooltipPlacement: 'bottom-end',
  subtextAlign: 'left',
  onClick: () => {},
  isError: false,
  errorText: '',
  labelRightElement: null,
  inputRightElement: null,
  type: 'text',
  height: 12,
  visible: true,
};

function SingleLineInput({
  label,
  value,
  onChange,
  placeholder,
  isError,
  errorText,
  subtext,
  disabled,
  tooltip,
  tooltipPlacement,
  subtextAlign,
  onClick,
  labelRightElement,
  inputRightElement,
  type,
  height,
  visible,
}: SingleLineInputProps) {
  const theme = useTheme();
  const ref = useRef(null);
  return (
    <Flex flex={1} direction="column" display={visible ? '' : 'none'}>
      <Flex direction="row" justify="space-between" align="center">
        <Text lineHeight="20px" fontWeight="bold">
          {label}
          {tooltip && tooltip.length ? (
            <Tooltip
              label={tooltip}
              placement={tooltipPlacement}
            />
          ) : null}
        </Text>
        {labelRightElement}
      </Flex>

      <InputGroup>
        <Input
          ref={ref}
          isDisabled={disabled}
          isInvalid={isError}
          mt={1}
          color="#122224"
          background="#E8E9E9"
          _placeholder={{ color: '#717A7C' }}
          _disabled={{ color: '#122224', background: '#F3F4F4' }}
          variant="filled"
          placeholder={placeholder}
          value={value == null ? undefined : value}
          onChange={onChange}
          focusBorderColor={theme.colors.brand[500]}
          h={height}
          onClick={onClick}
          type={type}
          onWheel={(e) => (e.target as HTMLElement).blur()}
        />
        {inputRightElement && (
          <InputRightElement h="100%" mt={1}>
            {inputRightElement}
          </InputRightElement>
        )}
      </InputGroup>
      {(subtext && subtext.length)
      || (isError && errorText && errorText?.length) ? (
        <Box mt={1} />
        ) : null}
      {isError && errorText && errorText?.length && (
        <Text
          fontSize="14px"
          color="#EE7979"
          fontWeight="700"
          lineHeight="20px"
        >
          {errorText}
        </Text>
      )}
      {!(isError && errorText && errorText?.length) && subtext && subtext?.length && (
        <Text
          fontSize="12px"
          color="#717A7C"
          fontWeight="400"
          lineHeight="20px"
          textAlign={subtextAlign}
          mt={1}
        >
          {subtext}
        </Text>
      )}
    </Flex>
  );
}

SingleLineInput.defaultProps = defaultProps;
export default SingleLineInput;
