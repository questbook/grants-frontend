import { Select, Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface Props {
  label: string;
  value: string | number | readonly string[] | undefined;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: number[];
  disabled?: boolean;
}

function MySelect({
  label, value, onChange, options, disabled,
}: Props) {
  return (
    <Flex direction="column">
      <Text lineHeight="20px" fontWeight="bold">
        {label}
      </Text>
      <Select
        mt={1}
        value={value}
        onChange={onChange}
        background="#E8E9E9"
        disabled={disabled}
        _disabled={{ color: '#122224', background: '#F3F4F4' }}
        color="#122224"
      >
        {options.map((v) => (
          <option
            key={v}
            value={v}
            style={{
              background: '#E8E9E9',
              color: 'white',
            }}
          >
            {v}
          </option>
        ))}
      </Select>
    </Flex>

  );
}

MySelect.defaultProps = {
  disabled: false,
};

export default MySelect;
