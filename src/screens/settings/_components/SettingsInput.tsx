import { useState } from 'react'
import { Flex, FlexProps, Input, InputProps, Text } from '@chakra-ui/react'

interface Props extends InputProps {
    helperText?: string
    width?: string
    flexProps?: FlexProps
}

function SettingsInput({ helperText, width, flexProps, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				{...flexProps}
				direction='column'
				// mt={8}
				w='100%'>
				<Flex
					w={width}
				>
					<Input
						{...props}
						w={width}
						variant='flushed'
						textAlign='left'
						borderColor='gray.3'
						borderBottom='1px solid'
						fontSize='20px'
						lineHeight='28px'
						color='black.1'
						onWheel={(e) => (e.target as HTMLElement).blur()}
						_placeholder={
							{
								color: 'gray.5'
							}
						}
						onChange={
							(e) => {
								setValue(e.target.value)
								props?.onChange?.(e)
							}
						} />
				</Flex>
				{
					props?.maxLength && (
						<Text
							mt={1}
							ml='auto'
							variant='v2_metadata'
							color='gray.5'>
							{value?.length}
							/
							{props?.maxLength}
						</Text>
					)
				}
				{
					helperText && (
						<Text
							mt={1}
							variant='v2_metadata'
							color='gray.5'>
							{helperText}
						</Text>
					)
				}
			</Flex>
		)
	}

	const [value, setValue] = useState<string>(props?.value?.toString() ?? '')

	return buildComponent()
}

export default SettingsInput