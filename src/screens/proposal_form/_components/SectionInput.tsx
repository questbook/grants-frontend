import { useState } from 'react'
import { Flex, FlexProps, Input, InputProps, Select, Text } from '@chakra-ui/react'

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
					align={['stretch', 'end']}>
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
						props?.type === 'select' ? (
							<Select
								variant='flushed'
								textAlign='left'
								width={['100%', '70%']}
								fontSize='16px'
								fontWeight='400'
								defaultValue={props?.value}
								placeholder='Select a grant category'
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
										props?.onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)
									}
								} >
								{
									['Telegram Mini Apps: Social Web3 Use Cases inside Telegram', 'DeFi', 'GameFi', 'Developer Education', 'Other'].map((option, index) => {
										return (
											<option
												key={index}
												value={option}>
												{option}
											</option>
										)
									})
								}

							</Select>
						)

							: (
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