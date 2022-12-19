import { Flex, FlexProps, Input, InputProps, Text } from '@chakra-ui/react'

interface Props extends InputProps {
    helperText?: string
	textPadding?: number
	flexProps?: FlexProps
}

function FlushedInput({ helperText, textPadding = 2, flexProps, ...props }: Props) {
	const { value, onChange } = props
	// const [value, setValue] = useState<string>(props?.value?.toString() || '')

	return (
		<>
			<Flex
				direction='column'
				{...flexProps}
			>
				<Input
					variant='flushed'
					borderBottom='2px solid #0A84FF'
					borderColor={value ? 'black' : 'gray.300'}
					fontWeight='400'
					fontSize='20px'
					value={props.value}
					placeholder={props.placeholder}
					onWheel={(e) => (e.target as HTMLElement).blur()}
					// minWidth={props?.minWidth ? props.minWidth : `${(props?.placeholder?.length || 0) + textPadding * 2}ch`}
					width={props?.width ? props.width : value !== '' ? `${(value?.toString()?.length!) + textPadding}ch` : `${(props?.placeholder?.length!) + textPadding}ch`}
					textAlign={props?.textAlign ? props?.textAlign : 'center'}
					onChange={onChange}
					{...props}
					 />
				{
					helperText || props?.maxLength && (
						<Flex
							w='100%'
							mt={2}>
							{
								helperText && (
									<Text
										className='helperText'
										variant='v2_body'
										color='gray.200'>
										{helperText}
									</Text>
								)
							}
							{
								props?.maxLength && (
									<Text
										ml='auto'
										variant='v2_metadata'
										color='gray.5'>
										{value?.toString().length}
										/
										{props?.maxLength}
									</Text>
								)
							}
						</Flex>
					)
				}

			</Flex>
		</>
	)
}

export default FlushedInput