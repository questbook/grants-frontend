import React from 'react'
import { Box, Button, Flex, Image, Link, Text } from '@chakra-ui/react'
import { SidebarRubrics } from 'src/types'
import TextField from 'src/v2/components/InputFields/TextField'

interface Props {
	rubrics: SidebarRubrics[];
	onRubricChange: (rubric: SidebarRubrics) => void;
	onRubricCriteriaAdd: () => void;
	onRubricCriteriaDelete: (index: number) => void;
}

const RubricsForm = ({ rubrics, onRubricChange, onRubricCriteriaAdd, onRubricCriteriaDelete } : Props) => {
	return (
		<>
			<Text
				fontSize='14px'
				lineHeight='20px'
				fontWeight='500'
			>
				Scoring quality
			</Text>

			<Text
				fontSize='12px'
				lineHeight='16px'
				fontWeight='400'
				color='#7D7DA0'
				mt='2px'
			>
							Total score is the sum of quality scores.
				{' '}
				<Link
					textDecoration={'none'}
					fontWeight='500'
					color='#1F1F33'
				>
								Learn more
				</Link>
			</Text>

			<Flex
				mt={4}
				p={4}
				borderRadius='2px'
				boxShadow={'inset 1px 1px 0px #F0F0F7, inset -1px -1px 0px #F0F0F7'}
				flexDirection='column'
			>
				{
					rubrics.map((rubric, index) => {
						return (
							<Flex
								key={index}
								mt={index > 0 ? 6 : 0}
								direction="column">
								<Flex>
									<Text
										variant="v2_body"
										color="teal.2"
										bg="teal.1"
										h="20px"
										w="20px"
										textAlign="center">
										{index + 1}
									</Text>
									<Box mx="auto" />
									{
										rubrics.length > 1 && (
											<Button
												leftIcon={
													<Image
														src="/ui_icons/rubric_delete_icon.svg"
														boxSize="20px" />
												}
												variant={'linkV2'}
												onClick={
													() => {
														onRubricCriteriaDelete(index)
													}
												}
												color="orange.2"
											>
									Delete
											</Button>
										)
									}
								</Flex>

								<TextField
									placeholder='Criteria'
									maxLength={30}
									value={rubric.criteria}
									onChange={
										(e) => {
											onRubricChange({ index, criteria: e.target.value, description: rubric.description })
										}
									} />
								<TextField
									placeholder='Description'
									maxLength={80}
									value={rubric.description}
									onChange={
										(e) => {
											onRubricChange({ index, criteria: rubric.criteria, description: e.target.value })
										}
									} />


								{
									index === rubrics.length - 1 && (
										<Flex>
											<Button
												leftIcon={
													<Image
														src="/ui_icons/rubric_add_icon.svg"
														boxSize="20px" />
												}
												variant={'linkV2'}
												onClick={onRubricCriteriaAdd}
											>
            Add another
												{' '}
												{index === 0 && 'criterion'}
											</Button>
										</Flex>
									)
								}
							</Flex>
						)
					})
				}
			</Flex>

		</>
	)
}

export default RubricsForm