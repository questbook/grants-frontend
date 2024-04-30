import { ChangeEvent, useState } from 'react'
import { Flex, FlexProps, Input, InputProps, Text, Textarea } from '@chakra-ui/react'

interface Props extends InputProps {
    label: string
    helperText?: string
    flexProps?: FlexProps
	errorText?: string
}

function SectionInput({ label, helperText, flexProps, errorText, ...props }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				{...flexProps}
				direction='column'
				mt={8}
				w='100%'>
				<Flex
					w='100%'
					direction={['column', 'row']}
					align={props?.type === 'textarea' ? 'stretch' : 'end'}>
					<Text
						mr={8}
						pb={2}
						variant='subheading'
						w={['100%', 'calc(30% - 32px)']}
						fontWeight='500'
						textAlign={['left', 'right']}>
						{label}
					</Text>
					{
						props?.type === 'textarea' ? (
							<Textarea
								w={['100%', '70%']}
								h='100px'
								variant='filled'
								textAlign='left'
								placeholder={props?.placeholder}
								borderColor='gray.300'
								borderBottom='1px solid'
								fontSize='20px'
								value={value}
								lineHeight='28px'
								maxLength={props?.maxLength && value?.split(' ')?.length - 1 >= props?.maxLength ? props?.maxLength : undefined}
								borderRadius={0}
								color='black.100'
								backgroundColor='transparent'
								onWheel={(e) => (e.target as HTMLElement).blur()}
								_placeholder={
									{
										color: 'gray.500'
									}
								}
								onChange={
									(e) => {
										if(props?.maxLength && e.target.value.split(' ').length > props?.maxLength) {
											setValue(value)
										} else {
											setValue(e.target.value)
											props?.onChange?.(e as unknown as ChangeEvent<HTMLInputElement>)
										}
									}
								} />
						) : (
							<Input
								{...props}
								w={['100%', '70%']}
								variant='flushed'
								textAlign='left'
								borderColor='gray.300'
								borderBottom='1px solid'
								fontSize='20px'
								lineHeight='28px'
								color='black.100'
								onWheel={(e) => (e.target as HTMLElement).blur()}
								_placeholder={
									{
										color: 'gray.500'
									}
								}
								onChange={
									(e) => {
										setValue(e.target.value)
										props?.onChange?.(e)
									}
								} />
						)
					}
				</Flex>
				{
					props?.maxLength && (
						<Text
							mt={1}
							ml='auto'
							variant='metadata'
							color='gray.500'>
							{
								props?.type === 'textarea' ?
									(value?.length === 0 ? 0 :
										value?.split(' ')?.length) : value?.length
							}
							/
							{props?.maxLength}
						</Text>
					)
				}
				{
					helperText && (
						<Text
							mt={1}
							variant='metadata'
							color='gray.500'>
							{helperText}
						</Text>
					)
				}
				{
					props?.isInvalid && (
						<Text
							mt={1}
							ml='30%'
							variant='metadata'
							color='gray.500'>
							{errorText}
						</Text>
					)
				}
			</Flex>
		)
	}

	const [value, setValue] = useState<string>(props?.value?.toString() ?? '')

	return buildComponent()
}

export default SectionInput