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
			<InputGroup borderBottomWidth={'1px'}>
				<Input
					isDisabled={disabled}
					isInvalid={isError}
					mt={1}
					color="#122224"
					background="white"
					_disabled={{ color: '#A0A7A7', background: '#F3F4F4' }}
					variant="filled"
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					focusBorderColor={'white'}
					h={12}
					type="date"
					borderRadius={0}
					borderBottomWidth={'1px'}
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
