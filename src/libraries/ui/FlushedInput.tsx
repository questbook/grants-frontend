import { Flex, FlexProps, forwardRef, Input, InputProps, Text } from '@chakra-ui/react'

type Props = {
    helperText?: string
	flexProps?: FlexProps
} & InputProps

const FlushedInput = forwardRef<Props, 'input'>((props, ref) => {
	const { value, placeholder, onChange, flexProps, helperText } = props

	return (
		<Flex
			direction='column'
			{...flexProps}
		>
			<Input
				ref={ref}
				variant='flushed'
				// borderBottom='2px solid #0A84FF'
				borderColor={value === undefined || !value ? 'gray.3' : 'black'}
				value={props.value}
				placeholder={placeholder}
				_placeholder={{ color: 'gray.5' }}
				onWheel={(e) => (e.target as HTMLElement).blur()}
				// minWidth={props?.minWidth ? props.minWidth : `${(props?.placeholder?.length || 0) + textPadding * 2}ch`}
				width={props?.width ? props.width : (value === 'NaN' || !value) ? `${(placeholder?.length!)}ch` : `${(value?.toString()?.length!)}ch` }
				textAlign={props?.textAlign ? props?.textAlign : 'center'}
				onChange={onChange}
				{...props}
			/>
			{
				(helperText || props?.maxLength) && (
					<Flex
						w='100%'
						mt={2}>
						{
							helperText && (
								<Text
									// className='helperText'
									variant='v2_body'
									color='gray.5'>
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
	)
})

export default FlushedInput