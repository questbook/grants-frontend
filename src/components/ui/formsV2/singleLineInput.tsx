import React, { ChangeEventHandler, useRef } from 'react'
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
  value: string | undefined ;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClick?: () => void;
  placeholder?: string;
  isError?: boolean;
  errorText?: string;
  subtext?: string | null | undefined;
  disabled?: boolean;

  inputRightElement?: React.ReactNode;
  type?: string;
  height?: string | number;
  visible?: boolean;
  maxLength?: number;
}

const defaultProps = {
	placeholder: '',
	disabled: false,
	subtextAlign: 'left',
	onClick: () => {},
	isError: false,
	errorText: '',
	inputRightElement: null,
	type: 'text',
	height: 12,
	visible: true,
	maxLength: -1,
}

function SingleLineInput({
	value,
	onChange,
	placeholder,
	isError,
	errorText,
	subtext,
	disabled,
	onClick,
	inputRightElement,
	type,
	height,
	visible,
	maxLength,
}: SingleLineInputProps) {
	const theme = useTheme()
	const ref = useRef(null)
	const [currentLength, setCurrentLength] = React.useState(value?.length)

	const [isActive, setIsActive] = React.useState(false)

	React.useEffect(() => {
		setCurrentLength(value?.length)
	}, [value])

	return (
		<Flex
			flex={1}
			direction="column"
			display={visible ? '' : 'none'}
			onFocus={() => setIsActive(true)}
			onBlur={
				() => {
					setTimeout(() => {
						setIsActive(false)
					}, 300)
				}
			}>
			<InputGroup>
				<Input
					ref={ref}
					isDisabled={disabled}
					isInvalid={isError}
					color="#122224"
					background="white"
					_placeholder={{ color: '#717A7C' }}
					_disabled={{ color: '#122224', background: '#F3F4F4' }}
					variant="flushed"
					placeholder={placeholder}
					value={value === null ? undefined : value}
					onChange={
						(e) => {
							if(
								maxLength === -1
              || (maxLength && maxLength > 0 && e.target.value.length <= maxLength)
							) {
								onChange(e)
							}
						}
					}
					focusBorderColor={'#4C9AFF'}
					h={height}
					onClick={onClick}
					type={type}
					onWheel={(e) => (e.target as HTMLElement).blur()}
					maxLength={maxLength}
				/>
				{
					isActive && inputRightElement && (
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
				maxLength && maxLength > 0 && (
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
				)
			}
		</Flex>
	)
}

SingleLineInput.defaultProps = defaultProps
export default SingleLineInput
