import React from 'react'
import {
	Box,
	Flex, Text, } from '@chakra-ui/react'
import { EditorState } from 'draft-js'
import TextEditor from 'src/components/ui/forms/richTextEditor/textEditor'
import Tooltip from 'src/components/ui/tooltip'

interface RichTextEditorProps {
  label?: string
  value: EditorState
  onChange: (e: EditorState) => void
  placeholder?: string
  isError: boolean
  errorText?: string
  subtext?: string | null | undefined
  maxLength?: number
  disabled?: boolean
  tooltip?: string
  visible?: boolean
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
}

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
	disabled,
}: RichTextEditorProps) {
	return (
		<Flex
			flex={1}
			direction='column'
			display={visible ? '' : 'none'}>
			<Text
				lineHeight='20px'
				fontWeight='bold'
				mb={1}>
				{label}
				{tooltip && tooltip.length ? <Tooltip label={tooltip} /> : null}
			</Text>
			<TextEditor
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				readOnly={disabled}
			/>
			{
				(subtext && subtext.length)
      || (isError && errorText && errorText?.length) ? (
	<Box mt={1} />
					) : null
			}
			{
				isError && errorText && errorText?.length && (
					<Text
						fontSize='14px'
						color='#EE7979'
						fontWeight='700'
						lineHeight='20px'
					>
						{errorText}
					</Text>
				)
			}
			{
				subtext && subtext?.length && (
					<Text
						fontSize='12px'
						color='#717A7C'
						fontWeight='400'
						lineHeight='20px'
					>
						{subtext}
					</Text>
				)
			}
		</Flex>
	)
}

RichTextEditor.defaultProps = defaultProps
export default RichTextEditor
