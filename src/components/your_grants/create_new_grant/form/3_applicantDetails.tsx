import React from 'react'
import {
	Box,
	Flex,
	Image,
	Text,
} from '@chakra-ui/react'
import CustomSwitch from 'src/components/ui/formsV2/customSwitch'
import SingleLineInput from 'src/components/ui/formsV2/singleLineInput'
import applicantDetailsList from '../../../../constants/newApplicantDetailsList'

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

	shouldEncrypt,
	setShouldEncrypt,
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
  shouldEncrypt: boolean;
  setShouldEncrypt: (shouldEncrypt: boolean) => void;

  setMaximumPoints: (maximumPoints: number) => void;
}) {

	function renderNewCustomFields() {
		return (
			<>
				{
					customFieldsOptionIsVisible && customFields.length > 0 && (
						<>
							{
								 customFields?.map((customField, index) => (
									<>
										<SingleLineInput
											value={customField.value}
											onChange={
												(e) => {
													const newCustomFields = [...customFields]
													newCustomFields[index].value = e.target.value
													newCustomFields[index].isError = false
													setCustomFields(newCustomFields)
												}
											}
											placeholder="Type the field label"
											isError={customField.isError}
											errorText="Required"
											maxLength={300}
											inputRightElement={
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
														src="/new_icons/red_delete.svg"
														mr="6px"
														mt="-2px"
													/>
												</Box>
											}
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
										src="/new_icons/blue_plus.svg"
										mr="6px"
									/>
									<Text
										fontWeight="500"
										fontSize="14px"
										color="#0065FF"
										lineHeight="20px">
                		Add another field
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
		<Box
			height={'60%'}
			overflow='scroll'>
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
					Get details from applicants
					</Text>
					<Text
						fontSize={'14px'}
						fontWeight={'400'}
						color={'#7D7DA0'}
						marginBottom={'20px'}>
					Applicants will be asked to provide these details.
					</Text>
					<Box
						display={'flex'}
						flexDirection={'row'}
						alignItems={'center'}
						marginBottom={'16px'}>
						<Text
							fontSize={'14px'}
							fontWeight={'500'}
							color={'#1F1F33'}>
					Default Fields
						</Text>
						<Text
							fontSize={'12px'}
							fontWeight={'400'}
							color={'#7D7DA0'}
							ml={'5px'}>
					Mandatory, and cannot be removed from the form
						</Text>
					</Box>

				</Box>
				<Box>
					{
						detailsRequired.map((detail, index) => {
							const {
								title, required, tooltip, id, mandatory
							} = detail as any
							if(mandatory) {
								return (
									<Box
										key={id}
										pt={'8px'}
										pb={'8px'}
										borderBottomWidth={'1px'}
										display='flex'
										flexDirection={'row'}
										mb={'16px'}>
										<Text
											fontSize={'16px'}
											fontWeight={'400'}>
											{title}
										</Text>
										<Image
											ml={'auto'}
											mr={'15px'}
											src='/new_icons/blue_checked_inactive.svg' />
									</Box>
								)
							}


						})
					}
				</Box>

				<Text
					mt={'8px'}
					mb={'8px'}
					fontSize={'14px'}
					fontWeight={'500'}
					color={'#1F1F33'}>
					Custom Fields
				</Text>

				<Box>
					{
						detailsRequired.map((detail, index) => {
							const {
								title, required, tooltip, id, mandatory
							} = detail as any

							if(!mandatory) {
								return (
									<Box
										key={id}
										pt={'8px'}
										pb={'8px'}
										borderBottomWidth={'1px'}
										display='flex'
										flexDirection={'row'}
										mb={'16px'}

									>
										<Text
											fontSize={'16px'}
											fontWeight={'400'}>
											{title}
										</Text>
										<Image
											ml={'auto'}
											mr={'15px'}
											src={applicantDetailsList[index]?.isRequired || required ? '/new_icons/blue_checked_full_opacity.svg' : '/new_icons/blue_unchecked.svg'}
											onClick={
												() => {
													if(!applicantDetailsList[index]?.isRequired) {
														toggleDetailsRequired(index)
													}
												}
											}
										/>

									</Box>
								)
							}
						})
					}
				</Box>

				{
				 	(!customFieldsOptionIsVisible || customFields?.length === 0) && (
						<Box
							onClick={
								() => {
									setCustomFieldsOptionIsVisible(
										!customFieldsOptionIsVisible,
									)
									if(customFields?.length === 0) {
										const newCustomFields = [...customFields, {
											value: '',
											isError: false,
										}]
										setCustomFields(newCustomFields)
									}
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
                Add a field
							</Text>
						</Box>
					)
				}

				{renderNewCustomFields()}


			</Flex>

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

			<Flex
				py={0}
				direction="column"
				bg={'white'}
				paddingTop={'28px'}
				paddingBottom={'28px'}
				paddingLeft={'32px'}
				paddingRight={'32px'}
				borderRadius={'4px'} >

				<Box>
					<Text
						fontSize={'20px'}
						fontWeight={'500'}
						marginBottom={'8px'}>
					Privacy Check
					</Text>
					<Text
						fontSize={'14px'}
						fontWeight={'400'}
						color={'#7D7DA0'}
						marginBottom={'20px'}>
					Contol who can see personal applicant data (email and about team)
					</Text>
				</Box>

				<Box
					display={'flex'}
					flexDirection='row'
					mb={'26px'}
					alignItems="center">
					<Box>
						<Text fontSize={'16px'}>
					Hide applicant personal info
						</Text>
						<Text
							fontSize={'12px'}
							color='#7D7DA0'>
					Visible to only DAO administrators and reviewers
						</Text>
					</Box>
					<Box marginLeft={'auto'}>
						<CustomSwitch
							isChecked={shouldEncrypt}
							onChange={
								(checked) => {
									setShouldEncrypt(checked)
								}
							} />
					</Box>
				</Box>
			</Flex>
		</Box>
	)
}

export default ApplicantDetails
