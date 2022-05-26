import React from 'react'
import {
	Box,
	Divider,
	Flex,
	Grid,
	GridItem,
	Image,
	Switch,
	Text,
} from '@chakra-ui/react'
import Dropdown from 'src/components/ui/forms/dropdown'
import MultiLineInput from 'src/components/ui/forms/multiLineInput'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import applicantDetailsList from '../../../../constants/applicantDetailsList'
import Badge from '../../../ui/badge'

function ApplicantDetails({
	detailsRequired,
	toggleDetailsRequired,

	customFields,
	setCustomFields,
	customFieldsOptionIsVisible,
	setCustomFieldsOptionIsVisible,

	multipleMilestones,
	setMultipleMilestones,
	milestoneSelectOptionIsVisible,
	setMilestoneSelectOptionIsVisible,
	defaultMilestoneFields,
	setDefaultMilestoneFields,

	rubricRequired,
	setRubricRequired,
	rubrics,
	setRubrics,

	setMaximumPoints,
}: {
  detailsRequired: any[];
  toggleDetailsRequired: (index: number) => void;

  customFields: any[];
  setCustomFields: (customFields: any[]) => void;
  customFieldsOptionIsVisible: boolean;
  setCustomFieldsOptionIsVisible: (customFieldsOptionIsVisible: boolean) => void;

  multipleMilestones: boolean;
  setMultipleMilestones: (multipleMilestones: boolean) => void;
  milestoneSelectOptionIsVisible: boolean;
  setMilestoneSelectOptionIsVisible: (milestoneSelectOptionIsVisible: boolean) => void;
  defaultMilestoneFields: any[];
  setDefaultMilestoneFields: (defaultMilestoneFields: any[]) => void;

  rubricRequired: boolean;
  setRubricRequired: (rubricRequired: boolean) => void;
  rubrics: any[];
  setRubrics: (rubrics: any[]) => void;

  setMaximumPoints: (maximumPoints: number) => void;
}) {
	return (
		<Flex
			py={0}
			direction="column">
			<Grid
				templateColumns="repeat(2, 1fr)"
				gap="18px"
				fontWeight="bold">
				{
					detailsRequired.map((detail, index) => {
						const {
							title, required, tooltip, id,
						} = detail as any
						if(id === 'customFields') {
							return (
								<GridItem
									key={id}
									colSpan={1}>
									<Badge
										isActive={customFieldsOptionIsVisible}
										onClick={
											() => {
												setCustomFieldsOptionIsVisible(
													!customFieldsOptionIsVisible,
												)
											}
										}
										label="Add Custom Field"
										tooltip="Get additional details in your application form."
									/>
								</GridItem>
							)
						}

						if(id === 'isMultipleMilestones') {
							return (
								<GridItem
									key={id}
									colSpan={1}>
									<Badge
										isActive={milestoneSelectOptionIsVisible}
										onClick={
											() => {
												setMilestoneSelectOptionIsVisible(
													!milestoneSelectOptionIsVisible,
												)
												setMultipleMilestones(false)
												setDefaultMilestoneFields([])
											}
										}
										label="Milestones"
										tooltip="Add milestones for the applicant to complete"
									/>
								</GridItem>
							)
						}

						return (
							<GridItem
								key={id}
								colSpan={1}>
								<Badge
									isActive={applicantDetailsList[index].isRequired || required}
									onClick={
										() => {
											if(!applicantDetailsList[index].isRequired) {
												toggleDetailsRequired(index)
											}
										}
									}
									label={title}
									tooltip={tooltip}
								/>
							</GridItem>
						)
					})
				}
			</Grid>

			<Box mt={6} />

			{
				customFieldsOptionIsVisible && (
					<>
						{
							customFields?.map((customField, index) => (
								<>
									{
										index > 0 && (
											<Flex
												mt={2}
												mb="-21px"
												gap="2"
												justifyContent="flex-end">
												<Box
													onClick={
														() => {
															const newCustomFields = [...customFields]
															newCustomFields.splice(index, 1)
															setCustomFields(newCustomFields)
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
														src="/ui_icons/delete_red.svg"
														mr="6px"
														mt="-2px"
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
										)
									}
									<SingleLineInput
										label={`Question ${index + 1}`}
										value={customField.value}
										onChange={
											(e) => {
												const newCustomFields = [...customFields]
												newCustomFields[index].value = e.target.value
												newCustomFields[index].isError = false
												setCustomFields(newCustomFields)
											}
										}
										placeholder="Field Label"
										isError={customField.isError}
										errorText="Required"
										maxLength={300}
									/>
									<Box mt={1} />
								</>
							))
						}
						<Flex
							mt="-4px"
							gap="2"
							justifyContent="flex-start">
							<Box
								onClick={
									() => {
										const newCustomFields = [...customFields, {
											value: '',
											isError: false,
										}]
										setCustomFields(newCustomFields)
									}
								}
								display="flex"
								alignItems="center"
								cursor="pointer"
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
                Add another question
								</Text>
							</Box>
						</Flex>
						<Box mt={6} />
					</>
				)
			}

			{
				milestoneSelectOptionIsVisible && (
					<>
						<Flex
							flex={1}
							direction="column">
							<Text
								lineHeight="20px"
								fontWeight="bold">
              Milestones
							</Text>
						</Flex>
						<Flex
							mt={1}
							maxW="420px">
							<Badge
								isActive={!multipleMilestones}
								onClick={
									() => {
										const newDefaultMilestoneFields = [...defaultMilestoneFields]
										newDefaultMilestoneFields.splice(1)
										setDefaultMilestoneFields(newDefaultMilestoneFields)
										setMultipleMilestones(false)
									}
								}
								label="Single Milestone"
								inActiveVariant="solid"
								variant="buttonGroupStart"
							/>
							<Badge
								isActive={multipleMilestones}
								onClick={() => setMultipleMilestones(true)}
								label="Multiple Milestones"
								inActiveVariant="solid"
								variant="buttonGroupEnd"
							/>
						</Flex>

						<Box mb={8} />
						{
							defaultMilestoneFields.map((defaultMilestoneField, index) => (
								<>
									<Flex
										mt={2}
										mb="-21px"
										gap="2"
										justifyContent="flex-end">
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
												src="/ui_icons/delete_red.svg"
												mr="6px"
												mt="-2px"
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
									<SingleLineInput
										label={`Milestone ${index + 1}`}
										value={defaultMilestoneField.value}
										onChange={
											(e) => {
												const newDefaultMilestoneFields = [...defaultMilestoneFields]
												newDefaultMilestoneFields[index].value = e.target.value
												newDefaultMilestoneFields[index].isError = false
												setDefaultMilestoneFields(newDefaultMilestoneFields)
											}
										}
										placeholder="Field Label"
										isError={defaultMilestoneField.isError}
										errorText="Required"
										maxLength={250}
									/>
									<Box mt={1} />
								</>
							))
						}
						{
							(multipleMilestones || (!multipleMilestones && defaultMilestoneFields.length === 0)) && (
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
											src="/ui_icons/plus_circle.svg"
											mr="6px"
										/>
										<Text
											fontWeight="500"
											fontSize="14px"
											color="#8850EA"
											lineHeight="20px">
                  Add a milestone
										</Text>
									</Box>
								</Flex>
							)
						}
						<Box mt={6} />
					</>
				)
			}

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

			<Flex
				opacity={rubricRequired ? 1 : 0.4}
				direction="column"
				mt={6}>
				<Text
					fontSize="18px"
					fontWeight="700"
					lineHeight="26px"
					letterSpacing={0}
				>
          Evaluation Rating
				</Text>
				<Box
					mt={2}
					minW="499px"
					flex={0}>
					<Dropdown
						listItems={
							[{
								label: '5 point rating',
								id: '5',
							}, {
								label: '3 point rating',
								id: '3',
							}]
						}
						onChange={
							rubricRequired ? ({ id }: any) => {
								setMaximumPoints(parseInt(id, 10))
							} : undefined
						}
						listItemsMinWidth="600px"
					/>
				</Box>
			</Flex>
		</Flex>
	)
}

export default ApplicantDetails
