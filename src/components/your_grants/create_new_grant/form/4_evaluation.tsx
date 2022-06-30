import { Box, Divider, Flex, Image, Switch, Text } from '@chakra-ui/react'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'

function EvaluationDetails({
	rubricRequired,
	setRubricRequired,
	rubrics,
	setRubrics,
}:{
    rubricRequired: boolean;
    setRubricRequired: (rubricRequired: boolean) => void;
    rubrics: any[];
    setRubrics: (rubrics: any[]) => void;
}) {
	return (
		<Box>
			<Flex
				direction="column"
				mt={8}>
				<Text
					fontSize="18px"
					fontWeight="700"
					lineHeight="26px"
					letterSpacing={0}
				>
          Applicant Review
				</Text>
				<Flex>
					<Text
						color="#717A7C"
						fontSize="14px"
						lineHeight="20px">
            Once you receive applications you can assign reviewers to each applicant,
            and setup an evaluation scorecard to get feedback from them.
					</Text>
				</Flex>
			</Flex>

			<Flex
				mt={4}
				gap="2"
				justifyContent="space-between">
				<Flex direction="column">
					<Text
						color="#122224"
						fontWeight="bold"
						fontSize="16px"
						lineHeight="20px"
					>
            Evaluation rubric
					</Text>
					<Flex>
						<Text
							color="#717A7C"
							fontSize="14px"
							lineHeight="20px">
              Define a set of criteria for reviewers to evaluate the application.
              You can add this later too.
						</Text>
					</Flex>
				</Flex>
				<Flex
					justifyContent="center"
					gap={2}
					alignItems="center">
					<Switch
						id="encrypt"
						isChecked={rubricRequired}
						onChange={
							(e) => {
								setRubricRequired(e.target.checked)
								const newRubrics = rubrics.map((rubric) => ({
									...rubric,
									nameError: false,
									descriptionError: false,
								}))
								setRubrics(newRubrics)
							}
						}
					/>
					<Text
						fontSize="12px"
						fontWeight="bold"
						lineHeight="16px">
						{`${rubricRequired ? 'YES' : 'NO'}`}
					</Text>
				</Flex>
			</Flex>

			{
				rubrics.map((rubric, index) => (
					<>
						<Flex
							mt={4}
							gap="2"
							alignItems="flex-start"
							opacity={rubricRequired ? 1 : 0.4}
						>
							<Flex
								direction="column"
								flex={0.3327}>
								<Text
									mt="18px"
									color="#122224"
									fontWeight="bold"
									fontSize="16px"
									lineHeight="20px"
								>
                Criteria
									{' '}
									{index + 1}
								</Text>
							</Flex>
							<Flex
								justifyContent="center"
								gap={2}
								alignItems="center"
								flex={0.6673}>
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
									placeholder="Name"
									isError={rubrics[index].nameError}
									errorText="Required"
									disabled={!rubricRequired}
								/>
							</Flex>
						</Flex>
						<Flex
							mt={6}
							gap="2"
							alignItems="flex-start"
							opacity={rubricRequired ? 1 : 0.4}>
							<Flex
								direction="column"
								flex={0.3327}>
								<Text
									mt="18px"
									color="#122224"
									fontWeight="bold"
									fontSize="16px"
									lineHeight="20px"
								>
                Description
								</Text>
							</Flex>
							<Flex
								justifyContent="center"
								gap={2}
								alignItems="center"
								flex={0.6673}>
								<MultiLineInput
									value={rubrics[index].description}
									onChange={
										(e) => {
											const newRubrics = [...rubrics]
											newRubrics[index].description = e.target.value
											newRubrics[index].descriptionError = false
											setRubrics(newRubrics)
										}
									}
									placeholder="Describe the evaluation criteria"
									isError={rubrics[index].descriptionError}
									errorText="Required"
									disabled={!rubricRequired}
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
										if(!rubricRequired) {
											return
										}

										const newRubrics = [...rubrics]
										newRubrics.splice(index, 1)
										setRubrics(newRubrics)
									}
								}
								display="flex"
								alignItems="center"
								cursor="pointer"
								opacity={rubricRequired ? 1 : 0.4}
							>
								<Image
									h="16px"
									w="15px"
									src="/ui_icons/delete_red.svg"
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
						<Divider mt={4} />
					</>
				))
			}

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
					opacity={rubricRequired ? 1 : 0.4}
				>
					<Image
						h="16px"
						w="15px"
						src="/ui_icons/plus_circle.svg"
						mr="6px"
					/>
					<Text
						fontWeight="500"
						fontSize="14px"
						color="#8850EA"
						lineHeight="20px">
            Add another criteria
					</Text>
				</Box>
			</Flex>
		</Box>
	)
}

export default EvaluationDetails