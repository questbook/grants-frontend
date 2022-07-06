import { Box, Flex, Image, Text } from '@chakra-ui/react'
import CustomSwitch from 'src/components/ui/formsV2/customSwitch'
import SingleLineInput from 'src/components/ui/formsV2/singleLineInput'

function ReviewProjectEvaluation({
	rubricRequired,
	setRubricRequired,
	rubrics,
	setRubrics }) {
	return (
		<Box>

			<Flex
				mt={4}
				bg={'white'}
				paddingTop={'28px'}
				paddingBottom={'28px'}
				paddingLeft={'32px'}
				paddingRight={'32px'}
				borderRadius={'4px'}
				mb={'50px'}
				flexDirection='column'>
				<Flex
					direction="column"
					mb={'24px'}>
					<Text
						color="#122224"
						fontWeight="500"
						fontSize="20px"
						lineHeight="24px"
						mb={'8px'}
					>
            			Evaluation rubric
					</Text>
					<Text
						color="#717A7C"
						fontSize="14px"
						lineHeight="20px">
						Define a set of criteria for reviewers to evaluate the application.
						You can add this later too.
					</Text>
				</Flex>
				<Flex
					flexDirection={'row'}>
					<Text>
						Add evaluation rubric
					</Text>
					<Flex
						alignItems={'center'}
						ml='auto'>
						<CustomSwitch
							id="encrypt"
							isChecked={rubricRequired}
							onChange={
								(checked) => {
									setRubricRequired(checked)
									const newRubrics = rubrics.map((rubric) => ({
										...rubric,
										nameError: false,
										descriptionError: false,
									}))
									setRubrics(newRubrics)
								}
							} />

					</Flex>
				</Flex>
				{
					rubricRequired && rubrics.length > 0 && (
						<>
							<Flex mt={'24px'}>
								<Image src='/new_icons/blue_star_smile.svg' />
								<Text
									fontSize={'14px'}
									color={'#7D7DA0'}
									ml='5px'>
									Each criteria can be rated on a scale of 1-5.
								</Text>
							</Flex>
							{
								rubrics.map((rubric, index) => (
									<>
										<Flex
											mt={4}
											justifyContent="center"
											alignItems="center"
											width={'100%'}>
											<SingleLineInput
												value={rubrics[index].name}
												onChange={
													(e) => {
														const newRubrics = [...rubrics]
														newRubrics[index].name = e.target.value
														newRubrics[index].nameError = false
														setRubrics(newRubrics)
													}
												}
												placeholder="Criteria"
												isError={rubrics[index].nameError}
												errorText="Required"
												maxLength={30}
											/>
										</Flex>
										<Flex
										>
											<Flex
												width='100%'>
												<SingleLineInput
													value={rubrics[index].description}
													onChange={
														(e) => {
															const newRubrics = [...rubrics]
															newRubrics[index].description = e.target.value
															newRubrics[index].descriptionError = false
															setRubrics(newRubrics)
														}
													}
													placeholder="Description"
													isError={rubrics[index].descriptionError}
													errorText="Required"
													maxLength={30}
												/>
											</Flex>
										</Flex>

										<Flex
											mt={2}
											gap="2"
											justifyContent="flex-end">
											<Box
												onClick={
													() => {

														const newRubrics = [...rubrics]
														newRubrics.splice(index, 1)
														setRubrics(newRubrics)
													}
												}
												display="flex"
												alignItems="center"
												cursor="pointer"
											>
												<Image
													h="16px"
													w="15px"
													src="/new_icons/red_delete.svg"
													mr="6px"
												/>
												<Text
													fontWeight="500"
													fontSize="14px"
													color="#DF5252"
													lineHeight="20px">
                									Delete
												</Text>
											</Box>
										</Flex>
									</>
								))
							}
							<Box mt={'5px'}>
								<Box
									display={'flex'}
									flexDirection={'row'}
									mb={'8px'}>
									<img src='/new_icons/idea_bulb.svg' />
									<Text
										fontSize={'14px'}
										fontWeight={'500'}
										marginLeft={'10px'}>
										Here’s how you can define a criteria, and description
									</Text>
								</Box>
								<ul style={{ paddingLeft: '20px', fontSize:'14px' }}>
									<li>
									Criteria - Vision. Description - How good is the vision?
									</li>
									<li>
									Criteria - Impact. Description - What’s the maximum impact possible?
									</li>
								</ul>
							</Box>
						</>
					)
				}
				{
					rubricRequired && (
						<Flex
							mt="19px"
							gap="2"
							justifyContent="flex-start">
							<Box
								onClick={
									() => {
										if(!rubricRequired) {
											return
										}

										const newRubrics = [...rubrics, {
											name: '',
											nameError: false,
											description: '',
											descriptionError: false,
										}]
										setRubrics(newRubrics)
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
            						Add another criteria
								</Text>
							</Box>
						</Flex>
					)
				}
			</Flex>
		</Box>
	)
}

export default ReviewProjectEvaluation