import React, { ChangeEventHandler, useEffect } from 'react';
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
  visible?: boolean;
}

const defaultProps = {
  label: '',
  placeholder: '',
  subtext: '',
  maxLength: -1,
  disabled: false,
  tooltip: '',
  errorText: '',
  visible: true,
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
  visible,
}: MultiLineInputProps) {
  const theme = useTheme();
  const [currentLength, setCurrentLength] = React.useState(value?.length);

  useEffect(() => {
    setCurrentLength(value?.length);
  }, [value]);

  return (
    <Flex flex={1} direction="column" display={visible ? '' : 'none'}>
      <Text lineHeight="20px" fontWeight="bold">
        {label}
        {tooltip && tooltip.length ? <Tooltip label={tooltip} /> : null}
      </Text>
      <Textarea
        isInvalid={isError}
        isDisabled={disabled}
        color="#122224"
        background="#E8E9E9"
        _placeholder={{ color: '#717A7C' }}
        _disabled={{ color: '#122224', background: '#F3F4F4' }}
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
          {`${currentLength}/${maxLength}`}
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
