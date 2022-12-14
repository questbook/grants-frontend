import { useEffect, useState } from 'react'
import { Flex, FlexProps, Input, InputProps, Text } from '@chakra-ui/react'

interface Props extends InputProps {
    helperText?: string
	textPadding?: number
	flexProps?: FlexProps
}

function FlushedInput({ helperText, textPadding = 2, flexProps, ...props }: Props) {
	const [value, setValue] = useState<string>(props?.value?.toString() ?? '')

	return (
		<>
			<Flex
				direction='column'
				{...flexProps}
			>
				<Input
					{...props}
					variant='flushed'
					borderBottom='5px solid'
					borderColor={value ? 'black' : 'gray.300'}
					fontWeight='400'
					fontSize='20px'
					onWheel={(e) => (e.target as HTMLElement).blur()}
					minWidth={props?.minWidth ? props.minWidth : `${(props?.placeholder?.length || 0) + textPadding * 2}ch`}
					width={props?.width ? props.width : value !== '' ? `${(value?.toString()?.length || 0) + textPadding}ch` : `${(props?.placeholder?.length || 0) + textPadding}ch`}
					textAlign={props?.textAlign ? props?.textAlign : 'center'}
					onChange={
						(e) => {
							setValue(e.target.value)
							props?.onChange?.(e)
						}
					}

					 />
				{
					helperText || props?.maxLength && (
						<Flex
							w='100%'
							mt={2}>
							{
								helperText && (
									<Text
										variant='v2_helper_text'>
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
										{value?.length}
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