import { ChangeEventHandler } from 'react'
import React from 'react'
import { CheckIcon } from '@chakra-ui/icons'
import { Box, Flex, Input, InputGroup, InputRightElement, Link, Text } from '@chakra-ui/react'

interface Props {
	label?: string
	optionalText?: string
	helperText?: string
	helperLinkText?: string
	helperLinkUrl?: string
	placeholder?: string
	maxLength?: number
	value: string | number
	onChange: ChangeEventHandler<HTMLInputElement>
	isError?: boolean
	errorText?: string
	isPasted?: boolean
	isVerified?: boolean
	isDisabled?: boolean
}

function TextField({ label, optionalText, helperText, helperLinkText, helperLinkUrl, placeholder, maxLength, value, onChange, isPasted, isVerified, isDisabled, isError, errorText }: Props) {
	const [currentLength, setCurrentLength] = React.useState(value?.toString().length)

	React.useEffect(() => {
		setCurrentLength(value?.toString().length)
	}, [value])

	return (
		<Flex direction='column'>
			<Flex>
				{
					label && (
						<Text
							variant='v2_body'
							fontWeight='500'>
							{label}
						</Text>
					)
				}
				{
					optionalText && (
						<Text
							ml={1}
							variant='v2_metadata'
							color='black.3'>
							{optionalText}
						</Text>
					)
				}
			</Flex>
			{
				helperText && (
					<Text
						variant='v2_metadata'
						color='black.3'>
						{helperText}
						{' '}
						{
							helperLinkText && (
								<Link
									display='inline-block'
									fontWeight='500'
									color='black.3'
									isExternal
									href={helperLinkUrl}>
									{helperLinkText}
								</Link>
							)
						}
					</Text>
				)
			}
			<InputGroup>
				<Input
					variant='flushed'
					placeholder={placeholder}
					fontSize='14px'
					maxLength={maxLength}
					color='black.1'
					onChange={onChange}
					value={value}
					errorBorderColor='orange.2'
					isDisabled={isDisabled}
				/>
				<InputRightElement>
					{
						isPasted !== undefined && !isPasted && (
							<Text
								variant='v2_title'
								color='violet.2'
								fontWeight='500'
								cursor='pointer'
								onClick={() => { }}>
								Paste
							</Text>
						)
					}
					{isVerified && <CheckIcon color='green.2' />}
				</InputRightElement>
			</InputGroup>
			<Flex mt={1}>
				{
					isError && (
						<Text
							variant='v2_metadata'
							color='orange.2'>
							{errorText}
						</Text>
					)
				}
				<Box mx='auto' />
				{
					maxLength && maxLength > 0 && (
						<Text
							variant='v2_metadata'
							color='black.3'
							mt={1}
							textAlign='right'
						>
							{`${currentLength}/${maxLength}`}
						</Text>
					)
				}
			</Flex>
		</Flex>
	)
}

export default TextField