import { useState } from 'react'
import { Flex, FlexProps, Select, SelectProps, Text } from '@chakra-ui/react'
import { logger } from 'ethers'

interface Props extends SelectProps {
	label: string
	helperText?: string
	flexProps?: FlexProps
	errorText?: string
}

function SectionDropDown({ label, helperText, flexProps, errorText, options, ...props }: Props & { options:
    string[]
}) {
	const buildComponent = () => {
		logger.info({ label, helperText, errorText, options, props }, 'SectionDropDown')
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
					<Select
						{...props}
						variant='flushed'
						colorScheme='blue'
						placeholder={props.placeholder}
						onChange={
							(e) => {
								setValue(e.target.value)
								props?.onChange?.(e)
							}
						}>
						{
							options?.map((option) => (
								<option
									key={option}
									value={option}>
									{option}
								</option>
							))
						}
					</Select>

				</Flex>
			</Flex>
		)
	}

	const [, setValue] = useState<string>(props?.value?.toString() ?? '')

	return buildComponent()
}

export default SectionDropDown