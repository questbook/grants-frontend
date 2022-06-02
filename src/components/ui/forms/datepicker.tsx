import React, { ChangeEventHandler } from 'react'
import {
	Box,
	Flex,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	useTheme,
} from '@chakra-ui/react'
import Tooltip from '../tooltip'

interface SingleLineInputProps {
  label?: string;
  value: string | undefined;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;

  isError?: boolean;
  errorText?: string;

  subtext?: string | null | undefined;
  disabled?: boolean;
  tooltip?: string;

  inputRightElement?: React.ReactNode;
}

const defaultProps = {
	label: '',
	placeholder: '',
	subtext: '',
	disabled: false,
	tooltip: '',
	isError: false,
	errorText: '',
	inputRightElement: null,
}

function DateInput({
	label,
	value,
	onChange,
	placeholder,
	isError,
	errorText,
	subtext,
	disabled,
	tooltip,
	inputRightElement,
}: SingleLineInputProps) {
	const theme = useTheme()
	return (
		<Flex
			flex={1}
			direction="column">
			<Text
				lineHeight="20px"
				fontWeight="bold">
				{label}
				{
					tooltip && tooltip.length ? (
						<Tooltip
							label={tooltip}
							icon='/ui_icons/alert_circle.svg'
							placement="top-start" />
					) : null
				}
			</Text>
			<InputGroup>
				<Input
					isDisabled={disabled}
					isInvalid={isError}
					mt={1}
					color="#122224"
					background="#E8E9E9"
					_disabled={{ color: '#A0A7A7', background: '#F3F4F4' }}
					variant="filled"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					focusBorderColor={theme.colors.brand[500]}
					h={12}
					type="date"
					min={new Date().toString()}
				/>
				{
					inputRightElement && (
						<InputRightElement
							h="100%"
							mt={1}>
							{inputRightElement}
						</InputRightElement>
					)
				}
			</InputGroup>
			{
				(subtext && subtext.length)
      || (isError && errorText && errorText?.length) ? (
						<Box mt={1} />
					) : null
			}
			{
				isError && errorText && errorText?.length && (
					<Text
						fontSize="14px"
						color="#EE7979"
						fontWeight="700"
						lineHeight="20px"
					>
						{errorText}
					</Text>
				)
			}
			{
				subtext && subtext?.length && (
					<Text
						fontSize="12px"
						color="#717A7C"
						fontWeight="400"
						lineHeight="20px"
					>
						{subtext}
					</Text>
				)
			}
		</Flex>
	)
}

DateInput.defaultProps = defaultProps
export default DateInput
