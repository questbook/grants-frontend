import React, { ChangeEventHandler, useRef } from 'react';
import {
  Text,
  Input,
  Flex,
  useTheme,
  Box,
  InputGroup,
  InputRightElement,
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

  labelRightElement?: React.ReactNode;
  inputRightElement?: React.ReactNode;
  type?: string;
  height?: string | number;
}

const defaultProps = {
  label: '',
  placeholder: '',
  subtext: '',
  disabled: false,
  tooltip: '',
  subtextAlign: 'left',
  onClick: () => {},
  isError: false,
  errorText: '',
  labelRightElement: null,
  inputRightElement: null,
  type: 'text',
  height: 12,
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
  subtextAlign,
  onClick,
  labelRightElement,
  inputRightElement,
  type,
  height,

}: SingleLineInputProps) {
  const theme = useTheme();
  const ref = useRef(null);
  return (
    <Flex flex={1} direction="column">
      <Flex direction="row" justify="space-between" align="center">
        <Text lineHeight="20px" fontWeight="bold">
          {label}
          {tooltip && tooltip.length ? <Tooltip label={tooltip} /> : null}
        </Text>
        {labelRightElement}
      </Flex>

      <InputGroup>
        <Input
          ref={ref}
          isDisabled={disabled}
          isInvalid={isError}
          mt={1}
          variant="filled"
          placeholder={placeholder}
          value={value == null ? undefined : value}
          onChange={onChange}
          focusBorderColor={theme.colors.brand[500]}
          h={height}
          onClick={onClick}
          type={type}
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
