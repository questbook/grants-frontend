import React from 'react';
import {
  Text, Flex, Box,
} from '@chakra-ui/react';
import { EditorState } from 'draft-js';
import Tooltip from '../../tooltip';
import TextEditor from './textEditor';

interface RichTextEditorProps {
  label?: string;
  value: EditorState;
  onChange: (e: EditorState) => void;
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

function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  isError,
  errorText,
  subtext,
  tooltip,
  visible,
}: RichTextEditorProps) {
  return (
    <Flex flex={1} direction="column" display={visible ? '' : 'none'}>
      <Text lineHeight="20px" fontWeight="bold">
        {label}
        {tooltip && tooltip.length ? <Tooltip label={tooltip} /> : null}
      </Text>
      <TextEditor
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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

RichTextEditor.defaultProps = defaultProps;
export default RichTextEditor;
