import { useState } from 'react'
import { Flex, FlexProps, InputProps, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react'

interface Props extends InputProps {
	label: string
	helperText?: string
	flexProps?: FlexProps
	errorText?: string
}

function SectionSelection({ label, flexProps, options, ...props }: Props & { options:
    string[]
}) {
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
					<RadioGroup
						value={value}
					>
						<Stack
							spacing={5}
							direction='row'>

							{
								options?.map((radio) => (
									<Radio
										{...props}
										key={radio}

										onChange={
											(e) => {

												setValue(e.target.value)
												props?.onChange?.(e)
											}
										}
						  colorScheme='blue'
										value={radio}>
										{radio}
									</Radio>
								))
							}

						</Stack>
					</RadioGroup>

				</Flex>
			</Flex>
		)
	}

	const [value, setValue] = useState<string>(props?.value?.toString() ?? '')

	return buildComponent()
}

export default SectionSelection