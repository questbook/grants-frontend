import React, { ChangeEventHandler } from 'react';
import {
  Text, Flex, useTheme, Textarea, Box,
} from '@chakra-ui/react';
import Tooltip from '../tooltip';

interface MultiLineInputProps {
  label?: string;
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  isError: boolean;
  errorText?: string;
  subtext?: string | null | undefined;
  maxLength?: number;
  disabled?: boolean;
  tooltip?: string;
}

const defaultProps = {
  label: '',
  placeholder: '',
  subtext: '',
  maxLength: -1,
  disabled: false,
  tooltip: '',
  errorText: '',
};

function MultiLineInput({
  label,
  value,
  onChange,
  placeholder,
  isError,
  errorText,
  subtext,
  maxLength,
  disabled,
  tooltip,
}: MultiLineInputProps) {
  const theme = useTheme();
  return (
    <Flex flex={1} direction="column">
      <Text lineHeight="20px" fontWeight="bold">
        {label}
        {tooltip && tooltip.length ? <Tooltip label={tooltip} /> : null}
      </Text>
      <Textarea
        isInvalid={isError}
        isDisabled={disabled}
        minH="120px"
        mt={1}
        variant="filled"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (
            maxLength === -1
            || (maxLength && maxLength > 0 && e.target.value.length <= maxLength)
          ) {
            onChange(e);
          }
        }}
        focusBorderColor={theme.colors.brand[500]}
      />
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
      {maxLength && maxLength > 0 && (
        <Text
          fontSize="14px"
          color="#717A7C"
          fontWeight="500"
          lineHeight="20px"
          textAlign="right"
          mt={isError && errorText && errorText?.length ? '-19px' : 1}
        >
          {`0/${maxLength}`}
        </Text>
      )}
      {subtext && subtext?.length && (
        <Text
          fontSize="12px"
          color="#717A7C"
          fontWeight="400"
          lineHeight="20px"
        >
          {subtext}
        </Text>
      )}
    </Flex>
  );
}

MultiLineInput.defaultProps = defaultProps;
export default MultiLineInput;
