import Markdown from 'react-markdown'
import { Button, Flex, FlexProps, IconButton, Input, InputProps, Text, Textarea } from '@chakra-ui/react'
import remarkGfm from 'remark-gfm'
import { Add, Close } from 'src/generated/icons'

interface Props {
    label: string
	allowMultiple: boolean
	config: InputProps[][] // 2D array of InputProps
	onAdd: () => void
	onRemove: (index: number) => void
    flexProps?: FlexProps
}

function SelectArray({ label, allowMultiple, flexProps, config, onAdd, onRemove }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				direction='column'
				mt={8}
				w='100%'
				{...flexProps}>
				<Flex
					w='100%'
					direction={['column', 'row']}
					align='start'>
					<Text
						mr={8}
						pb={2}
						variant='subheading'
						w={['100%', 'calc(30% - 32px)']}
						fontWeight='500'
						textAlign={['left', 'right']}>
						{label}
					</Text>
					<Flex
						w={['100%', '70%']}
						direction='column'>
						{
							config.map((_, index) => {
								return (
									<Flex
										mt={index === 0 ? 0 : 6}
										direction={['column', 'row']}
										w='100%'
										key={index}>
										<Text
											mt={1}
											color='gray.400'
											variant='heading3'
											fontWeight='500'>
											{index < 9 ? `0${index + 1}` : (index + 1)}
										</Text>

										<Flex
											ml={[0, 5]}
											direction='column'
											w='100%'>
											{
												_.map((inputProps, i) => {
													return (
														<Flex
															key={`${index}-${i}`}
															mt={i === 0 ? 0 : 4}
															direction='column'>
															{
																inputProps?.type === 'textarea' ? (
																	<Textarea
																		variant='flushed'
																		textAlign='left'
																		borderColor='gray.300'
																		isDisabled={inputProps.isDisabled}
																		borderBottom='1px solid'
																		fontSize='20px'
																		maxLength={inputProps.maxLength}
																		height='auto'
																		lineHeight='28px'
																		color='black.100'
																		value={config[index][i]?.value?.toString()}
																		onChange={
																			(e) => {
																				config[index][i].onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)
																			}
																		}
																		placeholder={inputProps.placeholder}
																		onWheel={(e) => (e.target as HTMLElement).blur()}
																		_placeholder={
																			{
																				color: 'gray.500'
																			}
																		}
																	/>
																) :
																	inputProps?.type === 'prefilled' ? (
																		<Markdown
																			remarkPlugins={[remarkGfm]}
																			components={
																				{
																					a: props => {
																						return (
																							<Text
																								display='inline-block'
																								wordBreak='break-all'
																								color='accent.azure'
																								variant='body'
																								fontSize='20px'
																								lineHeight='28px'
																								cursor='pointer'
																								_hover={
																									{
																										textDecoration: 'underline',
																									}
																								}
																								onClick={
																									() => {
																										window.open(props.href, '_blank')
																									}
																								}
																							>
																								{props.href}
																							</Text>

																						)
																					},
																					p: ({ ...props }) => {
																						return (
																							<Text
																								{...props}
																								variant='body'
																								fontSize='20px'
																								lineHeight='28px'
																								mt={2}
																								whiteSpace='pre-line'
																								wordBreak='break-word'
																							/>
																						)
																					},
																				}
																			}
																		>
																			{config[index][i]?.value?.toString()}
																		</Markdown>
																	)
																		: (
																			<>
																				{
																					inputProps.type === 'date' && (
																						<Text
																							variant='metadata'
																							color='gray.500'
																							mb={1}>
																							Deadline for this milestone
																						</Text>

																					)
																				}
																				<Input
																					{...inputProps}
																					variant='flushed'
																					textAlign='left'
																					borderColor='gray.300'
																					borderBottom='1px solid'
																					type={inputProps.type ?? 'text'}
																					fontSize='20px'
																					lineHeight='28px'
																					color='black.100'
																					onWheel={(e) => (e.target as HTMLElement).blur()}
																					defaultValue={inputProps.defaultValue ?? ''}
																					_placeholder={
																						{
																							color: 'gray.500'
																						}
																					}
																				/>
																			</>
																		)
															 }
															{
																!inputProps.isDisabled &&
																inputProps.maxLength && (
																	<Text
																		mt={1}
																		ml='auto'
																		variant='metadata'
																		color='gray.500'>
																		{config[index][i]?.value?.toString()?.length}
																		{' '}
																		/
																		{' '}
																		{inputProps.maxLength}
																	</Text>
																)
															}
														</Flex>

													)
												})
											}
										</Flex>

										<IconButton
											ml={2}
											mt={4}
											aria-label={`remove-${index}`}
											isDisabled={config.length === 1}
											variant='ghost'
											onClick={
												() => {
													onRemove(index)
												}
											}
											icon={<Close boxSize='20px' />} />
									</Flex>
								)
							})
						}

						{
							allowMultiple && (
								<Flex mt={6}>
									<Button
										variant='link'
										leftIcon={<Add boxSize='28px' />}
										onClick={onAdd}>
										<Text
											variant='subheading'
											fontWeight='500'>
											Add another
										</Text>
									</Button>
								</Flex>
							)
						}

					</Flex>
				</Flex>

			</Flex>
		)
	}

	return buildComponent()
}

export default SelectArray