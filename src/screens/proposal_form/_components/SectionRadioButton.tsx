import { useState } from 'react'
import { Box, Flex, FlexProps, InputProps, Radio, RadioGroup, Stack, Text, useBreakpointValue } from '@chakra-ui/react'

interface Props extends InputProps {
	label: string
	helperText?: string
	flexProps?: FlexProps
	errorText?: string
}

function SectionRadioButton({ label, flexProps, options, helperText, errorText, ...props }: Props & { options: string[] }) {
	const [value, setValue] = useState<string>(props?.value?.toString() ?? '')
	const isMobile = useBreakpointValue({ base: true, md: false })

	return (
		<Box
			w='100%'
			mt={8}
			px={[0, 0, 0]}
		>
			<Flex
				{...flexProps}
				direction='column'
				w='100%'
			>
				<Flex
					w='100%'
					direction={['column', 'column', 'row']}
					align={['flex-start', 'flex-start', 'center']}
					gap={[2, 2, 8]}
				>
					<Text
						mb={[2, 2, 0]}
						variant='subheading'
						w={['100%', '100%', 'calc(30% - 32px)']}
						fontWeight='500'
						textAlign={['left', 'left', 'right']}
					>
						{label}
					</Text>

					<Flex
						flex={1}
						direction='column'
						w={['100%', '100%', 'auto']}
					>
						<RadioGroup value={value}>
							<Stack
								spacing={[4, 4, 5]}
								direction={['column', 'column', 'row']}
								align={['flex-start', 'flex-start', 'center']}
								w='100%'
							>
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
											value={radio}
											size={isMobile ? 'lg' : 'md'}
											_hover={
												{
													cursor: 'pointer'
												}
											}
										>
											<Text fontSize={['md', 'md', 'sm']}>
												{radio}
											</Text>
										</Radio>
									))
								}
							</Stack>
						</RadioGroup>

						{
							helperText && (
								<Text
									fontSize='sm'
									color='gray.500'
									mt={2}
								>
									{helperText}
								</Text>
							)
						}

						{
							errorText && (
								<Text
									fontSize='sm'
									color='red.500'
									mt={2}
								>
									{errorText}
								</Text>
							)
						}
					</Flex>
				</Flex>
			</Flex>
		</Box>
	)
}

export default SectionRadioButton