import { Box, Flex, Image, Text } from '@chakra-ui/react'
import CustomSwitch from 'src/components/ui/formsV2/customSwitch'
import SingleLineInput from 'src/components/ui/formsV2/singleLineInput'

function ReviewProjectMilestone({
	milestoneSelectOptionIsVisible,
	defaultMilestoneFields,
	setDefaultMilestoneFields,
	setMilestoneSelectOptionIsVisible,
}) {

	function renderNewMileStone() {
		return (
			<>
				{
					milestoneSelectOptionIsVisible && (
						<>
							<Flex
								flex={1}
								direction="row"
								alignItems={'center'}>
								<Text
									lineHeight="14px"
									fontWeight="bold">
              Add milestones
								</Text>
								<Text
									lineHeight="12px"
									color={'#7D7DA0'}
									ml={'5px'}>
             Define milestones which applicants can edit
								</Text>
							</Flex>

							<Box mb={8} />
							{
								defaultMilestoneFields.map((defaultMilestoneField, index) => (
									<>
										<SingleLineInput
											value={defaultMilestoneField.value}
											onChange={
												(e) => {
													const newDefaultMilestoneFields = [...defaultMilestoneFields]
													newDefaultMilestoneFields[index].value = e.target.value
													newDefaultMilestoneFields[index].isError = false
													setDefaultMilestoneFields(newDefaultMilestoneFields)
												}
											}
											placeholder="Type the milestone"
											isError={defaultMilestoneField.isError}
											errorText="Required"
											maxLength={250}
											inputRightElement={
												<>
													<Box
														onClick={
															() => {
																const newDefaultMilestoneFields = [...defaultMilestoneFields]
																newDefaultMilestoneFields.splice(index, 1)
																setDefaultMilestoneFields(newDefaultMilestoneFields)
															}
														}
														display="flex"
														alignItems="center"
														cursor="pointer"
														zIndex={1}
													>
														<Image
															h="12px"
															w="12px"
															src="/new_icons/red_delete.svg"
															mr="6px"
															mt="-2px"
														/>
													</Box>
												</>
											}
										/>
										<Box mt={1} />
									</>
								))
							}

							{
								defaultMilestoneFields.length > 0 && (
									<Box
										mt={'5px'}
										mb={'16px'}>
										<Box
											display={'flex'}
											flexDirection={'row'}
											mb={'8px'}>
											<img src='/new_icons/idea_bulb.svg' />
											<Text
												fontSize={'14px'}
												fontWeight={'500'}
												marginLeft={'10px'}>
						For example, here’s how others write a grant title:
											</Text>
										</Box>
										<ul style={{ paddingLeft: '20px', fontSize:'14px' }}>
											<li>
						Example 1
											</li>
											<li>
						Example 2
											</li>
										</ul>
									</Box>
								)
							}

							<Flex
								mt="-4px"
								gap="2"
								justifyContent="flex-start">
								<Box
									onClick={
										() => {
											const newDefaultMilestoneFields = [...defaultMilestoneFields, {
												value: '',
												isError: false,
											}]
											setDefaultMilestoneFields(newDefaultMilestoneFields)
										}
									}
									display="flex"
									alignItems="center"
									cursor="pointer"
								>
									<Image
										h="16px"
										w="15px"
										src="/new_icons/blue_plus.svg"
										mr="6px"
									/>
									<Text
										fontWeight="500"
										fontSize="14px"
										color="#0065FF"
										lineHeight="20px">
                  Add a milestone
									</Text>
								</Box>
							</Flex>
							<Box mt={6} />
						</>
					)
				}
			</>
		)
	}

	return (
		<Flex
			py={0}
			direction="column"
			bg={'white'}
			paddingTop={'28px'}
			paddingBottom={'28px'}
			paddingLeft={'32px'}
			paddingRight={'32px'}
			borderRadius={'4px'}
			mb={'20px'}>

			<Box>
				<Text
					fontSize={'20px'}
					fontWeight={'500'}
					marginBottom={'8px'}>
					Project Milestones
				</Text>
				<Text
					fontSize={'14px'}
					fontWeight={'400'}
					color={'#7D7DA0'}
					marginBottom={'20px'}>
					You can set milestones or ask applicants to do so.
				</Text>
			</Box>

			<Box
				display={'flex'}
				flexDirection='row'
				mb={'26px'}>
				<Text>
						Milestones
				</Text>
				<Box marginLeft={'auto'}>
					<CustomSwitch
						isChecked={milestoneSelectOptionIsVisible}
						onChange={
							(checked) => {
								setMilestoneSelectOptionIsVisible(
									checked
								)
							}
						} />
				</Box>
			</Box>

			{milestoneSelectOptionIsVisible && renderNewMileStone()}
		</Flex>
	)
}

export default ReviewProjectMilestone