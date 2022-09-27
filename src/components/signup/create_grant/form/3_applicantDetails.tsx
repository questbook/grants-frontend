import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	Image,
	Text,
} from '@chakra-ui/react'
import Badge from 'src/components/ui/badge'
import SingleLineInput from 'src/components/ui/forms/singleLineInput'
import applicantDetailsList from 'src/constants/applicantDetailsList'

interface Props {
	onSubmit: (data: any) => void
	constructCache: (data: any) => void
	cacheKey: string
}

function ApplicantDetails({ onSubmit, constructCache, cacheKey }: Props) {
	const applicantDetails = applicantDetailsList
		.map(({
			title, tooltip, id, inputType, isRequired,
		}, index) => {
			if(index === applicantDetailsList.length - 1) {
				return null
			}

			if(index === applicantDetailsList.length - 2) {
				return null
			}

			return {
				title,
				required: isRequired || false,
				id,
				tooltip,
				index,
				inputType,
			}
		})
		.filter((obj) => obj !== null)
	const [detailsRequired, setDetailsRequired] = useState(applicantDetails)
	const [milestoneSelectOptionIsVisible, setMilestoneSelectOptionIsVisible] = React.useState(false)
	const [multipleMilestones, setMultipleMilestones] = useState(false)
	const [defaultMilestoneFields, setDefaultMilestoneFields] = useState<any[]>(
		[],
	)

	const [customFieldsOptionIsVisible, setCustomFieldsOptionIsVisible] = React.useState(false)
	const [customFields, setCustomFields] = useState<any[]>([
		{
			value: '',
			isError: false,
		},
	])

	const toggleDetailsRequired = (index: number) => {
		const newDetailsRequired = [...detailsRequired];
		// TODO: create interface for detailsRequired
		(newDetailsRequired[index] as any).required = !(
			newDetailsRequired[index] as any
		).required
		setDetailsRequired(newDetailsRequired)
	}

	// const [extraFieldDetails, setExtraFieldDetails] = useState('');
	// const [extraFieldError, setExtraFieldError] = useState(false);

	const { t } = useTranslation()

	const handleOnSubmit = () => {
		let error = false
		if(customFieldsOptionIsVisible) {
			const errorCheckedCustomFields = customFields.map((customField: any) => {
				const errorCheckedCustomField = { ...customField }
				if(customField.value.length <= 0) {
					errorCheckedCustomField.isError = true
					error = true
				}

				return errorCheckedCustomField
			})
			setCustomFields(errorCheckedCustomFields)
		}

		if(defaultMilestoneFields.length > 0) {
			const errorCheckedDefaultMilestoneFields = defaultMilestoneFields.map(
				(defaultMilestoneField: any) => {
					const errorCheckedDefaultMilestoneField = {
						...defaultMilestoneField,
					}
					if(defaultMilestoneField.value.length <= 0) {
						errorCheckedDefaultMilestoneField.isError = true
						error = true
					}

					return errorCheckedDefaultMilestoneField
				},
			)
			setDefaultMilestoneFields(errorCheckedDefaultMilestoneFields)
		}

		if(!error) {
			const requiredDetails = {} as any
			detailsRequired.forEach((detail) => {
				if(detail && detail.required) {
					requiredDetails[detail.id] = {
						title: detail.title,
						inputType: detail.inputType,
					}
				}
			})
			const fields = { ...requiredDetails }

			if(multipleMilestones) {
				fields.isMultipleMilestones = {
					title: 'Milestones',
					inputType: 'array',
				}
			}

			if(fields.teamMembers) {
				fields.memberDetails = {
					title: 'Member Details',
					inputType: 'array',
				}
			}

			if(fields.fundingBreakdown) {
				fields.fundingAsk = {
					title: 'Funding Ask',
					inputType: 'short-form',
				}
			}

			if(customFieldsOptionIsVisible && customFields.length > 0) {
				customFields.forEach((customField: any, index: number) => {
					const santizedCustomFieldValue = customField.value
						.split(' ')
						.join('\\s')
					fields[`customField${index}-${santizedCustomFieldValue}`] = {
						title: customField.value,
						inputType: 'short-form',
					}
				})
			}

			if(defaultMilestoneFields.length > 0) {
				defaultMilestoneFields.forEach(
					(defaultMilestoneField: any, index: number) => {
						const santizedDefaultMilestoneFieldValue = defaultMilestoneField.value.split(' ').join('\\s')
						fields[
							`defaultMilestone${index}-${santizedDefaultMilestoneFieldValue}`
						] = {
							title: defaultMilestoneField.value,
							inputType: 'short-form',
						}
					},
				)
			}

			onSubmit({
				fields,
				rubric: {
					isPrivate: false,
				},
			})
		}
	}

	React.useEffect(() => {
		if(cacheKey.includes('undefined') || typeof window === 'undefined') {
			return
		}

		const data = localStorage.getItem(cacheKey)
		if(data === 'undefined') {
			return
		}

		const formData = JSON.parse(data || '{}')
		// console.log('Data from cache: ', formData)

		if(formData?.detailsRequired) {
			setDetailsRequired(formData?.detailsRequired)
		}

		if(formData?.customFieldsOptionIsVisible) {
			setCustomFieldsOptionIsVisible(formData?.customFieldsOptionIsVisible)
		}

		if(formData?.customFields) {
			setCustomFields(formData?.customFields)
		}
	}, [cacheKey])

	React.useEffect(() => {
		const formData = {
			detailsRequired,
			customFieldsOptionIsVisible,
			customFields
		}
		constructCache(formData)

	}, [
		customFields,
		customFieldsOptionIsVisible,
		detailsRequired
	])

	return (
		<>
			<Flex
				py={12}
				direction='column'>
				<Text
					variant='heading'
					fontSize='36px'
					lineHeight='48px'>
					{t('/create-grant.proposal_form.title')}
				</Text>

				<Grid
					mt={12}
					templateColumns='repeat(2, 1fr)'
					gap={5}
					fontWeight='bold'
				>
					{
						detailsRequired.map((detail, index) => {
							// if (index === detailsRequired.length - 1) return null;
							// if (index === detailsRequired.length - 2) return null;
							const {
								title, required, id, tooltip,
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
											label='Add Custom Field'
											tooltip='Add a custom field to your proposal form'
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
											label='Milestones'
											tooltip='Add milestones for the applicant to complete'
										/>
									</GridItem>
								)
							}

							return (
								<GridItem
									colSpan={1}
									key={id}>
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
								customFields.map((customField, index) => (
									<>
										{
											index > 0 && (
												<Flex
													mt={2}
													mb='-21px'
													gap='2'
													justifyContent='flex-end'>
													<Box
														onClick={
															() => {
																const newCustomFields = [...customFields]
																newCustomFields.splice(index, 1)
																setCustomFields(newCustomFields)
															}
														}
														display='flex'
														alignItems='center'
														cursor='pointer'
														zIndex={1}
													>
														<Image
															h='12px'
															w='12px'
															src='/ui_icons/delete_red.svg'
															mr='6px'
															mt='-2px'
														/>
														<Text
															fontWeight='500'
															fontSize='14px'
															color='#DF5252'
															lineHeight='20px'
														>
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
											placeholder='Field Label'
											isError={customField.isError}
											errorText='Required'
											maxLength={300}
										/>
										<Box mt={2} />
									</>
								))
							}
							<Flex
								mt={2}
								gap='2'
								justifyContent='flex-start'>
								<Box
									onClick={
										() => {
											const newCustomFields = [
												...customFields,
												{
													value: '',
													isError: false,
												},
											]
											setCustomFields(newCustomFields)
										}
									}
									display='flex'
									alignItems='center'
									cursor='pointer'
								>
									<Image
										h='16px'
										w='15px'
										src='/ui_icons/plus_circle.svg'
										mr='6px'
									/>
									<Text
										fontWeight='500'
										fontSize='14px'
										color='#8850EA'
										lineHeight='20px'
									>
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
								direction='column'>
								<Text
									lineHeight='20px'
									fontWeight='bold'>
									Milestones
								</Text>
							</Flex>
							<Flex
								mt={1}
								maxW='420px'>
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
									label='Single Milestone'
									inActiveVariant='solid'
									variant='buttonGroupStart'
								/>
								<Badge
									isActive={multipleMilestones}
									onClick={() => setMultipleMilestones(true)}
									label='Multiple Milestones'
									inActiveVariant='solid'
									variant='buttonGroupEnd'
								/>
							</Flex>

							<Box mb={8} />
							{
								defaultMilestoneFields.map((defaultMilestoneField, index) => (
									<>
										<Flex
											mt={2}
											mb='-21px'
											gap='2'
											justifyContent='flex-end'>
											<Box
												onClick={
													() => {
														const newDefaultMilestoneFields = [
															...defaultMilestoneFields,
														]
														newDefaultMilestoneFields.splice(index, 1)
														setDefaultMilestoneFields(newDefaultMilestoneFields)
													}
												}
												display='flex'
												alignItems='center'
												cursor='pointer'
												zIndex={1}
											>
												<Image
													h='12px'
													w='12px'
													src='/ui_icons/delete_red.svg'
													mr='6px'
													mt='-2px'
												/>
												<Text
													fontWeight='500'
													fontSize='14px'
													color='#DF5252'
													lineHeight='20px'
												>
													Delete
												</Text>
											</Box>
										</Flex>
										<SingleLineInput
											label={`Milestone ${index + 1}`}
											value={defaultMilestoneField.value}
											onChange={
												(e) => {
													const newDefaultMilestoneFields = [
														...defaultMilestoneFields,
													]
													newDefaultMilestoneFields[index].value = e.target.value
													newDefaultMilestoneFields[index].isError = false
													setDefaultMilestoneFields(newDefaultMilestoneFields)
												}
											}
											placeholder='Field Label'
											isError={defaultMilestoneField.isError}
											errorText='Required'
											maxLength={250}
										/>
										<Box mt={1} />
									</>
								))
							}
							{
								(multipleMilestones
									|| (!multipleMilestones && defaultMilestoneFields.length === 0)) && (
									<Flex
										mt='-4px'
										gap='2'
										justifyContent='flex-start'>
										<Box
											onClick={
												() => {
													const newDefaultMilestoneFields = [
														...defaultMilestoneFields,
														{
															value: '',
															isError: false,
														},
													]
													setDefaultMilestoneFields(newDefaultMilestoneFields)
												}
											}
											display='flex'
											alignItems='center'
											cursor='pointer'
										>
											<Image
												h='16px'
												w='15px'
												src='/ui_icons/plus_circle.svg'
												mr='6px'
											/>
											<Text
												fontWeight='500'
												fontSize='14px'
												color='#8850EA'
												lineHeight='20px'
											>
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
			</Flex>
			<Button
				mt='auto'
				variant='primary'
				onClick={handleOnSubmit}>
				Continue
			</Button>
		</>
	)
}

export default ApplicantDetails