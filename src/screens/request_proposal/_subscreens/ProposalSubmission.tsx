import { useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { useRouter } from 'next/router'
import { CustomSelect } from 'src/libraries/ui/CustomSelect'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
import { RFPForm, RFPFormType } from 'src/screens/request_proposal/_utils/types'
import { ApplicantDetailsFieldType } from 'src/types'


interface Props {
    proposalName: string
    setProposalName: (value: string) => void
    startdate: string
    setStartdate: (value: string) => void
    endDate: string
    setEndDate: (value: string) => void
    requiredDetails: ApplicantDetailsFieldType[]
	extraDetailsFields: ApplicantDetailsFieldType[]
	setExtraDetailsFields: (value: ApplicantDetailsFieldType[]) => void
    link: string
    setLink: (value: string) => void
    doc: FileList | null
    setDoc: (value: FileList) => void
    step: number
    setStep: (value: number) => void
    allApplicantDetails: {[key: string]: ApplicantDetailsFieldType}
    setAllApplicantDetails: (value: {[key: string]: ApplicantDetailsFieldType}) => void
	rfpFormSubmissionType: RFPFormType
	rfpData?: RFPForm
	setRFPData?: (value: RFPForm) => void
	handleOnEditProposalSubmission: (fieldName: string, value: string | ApplicantDetailsFieldType[]) => void
}

function ProposalSubmission(
	{
		proposalName,
		setProposalName,
		startdate,
		setStartdate,
		endDate,
		setEndDate,
		requiredDetails,
		extraDetailsFields,
		setExtraDetailsFields,
		link,
		setLink,
		doc,
		setDoc,
		step,
		setStep,
		setAllApplicantDetails,
		handleOnEditProposalSubmission,
		rfpFormSubmissionType
	}: Props) {

	const uploaDocInputref = useRef(null)
	const startdateRef = useRef<HTMLInputElement>(null)
	const endDateRef = useRef<HTMLInputElement>(null)

	const openInput = () => {
		if(uploaDocInputref.current) {
			(uploaDocInputref.current as HTMLInputElement).click()
		}
	}

	const buildComponent = () => {
		return (
			<>
				{/* Start Proposal Submission Component */}
				<Flex
					className='proposalSubmission'
					alignSelf='flex-start'>
					<Button
						className='backBtn'
						variant='linkV2'
						leftIcon={<BsArrowLeft />}
						onClick={() => router.back()}>
						Back
					</Button>
				</Flex>
				<Flex
					className='rightScreenCard'
					flexDirection='column'
					width='100%'
					height='100%'
					gap={10}
					alignSelf='flex-start'
					marginRight={24}
				>
					{/* TODO: Add Steps complete indicator */}
					<StepIndicator
						step={step}
						formType={rfpFormSubmissionType} />
					<Text
						alignSelf='center'
						fontWeight='500'
						fontSize='24px'
						lineHeight='32px'
						marginBottom={8}>
						What makes a good proposal?
					</Text>

					{/* Proposal title */}
					<Flex
						gap={4}
						alignItems='baseline'>
						<Text variant='v2_subheading'>
							Receive proposals from builders who are building
						</Text>
						<FlushedInput
							placeholder='describe in 4-5 words'
							value={proposalName}
							onChange={
								(e) => {
									setProposalName(e.target.value)
									handleOnEditProposalSubmission('proposalName', e.target.value)
								}
							}
						/>
					</Flex>

					{/* Proposal dates */}
					<Flex
						gap={4}
						alignItems='baseline'>
						<Text
							variant='v2_subheading'
							minW='max-content'>
							Builders can submit proposals between
						</Text>
						<Input
							type={rfpFormSubmissionType === 'submit' ? 'string' : 'datetime-local'}
							variant='flushed'
							placeholder='enter start date'
							_placeholder={{ color: 'gray.5' }}
							isDisabled={rfpFormSubmissionType === 'edit'}
							ref={startdateRef}
							onFocus={
								() => {
									if(startdateRef.current && rfpFormSubmissionType !== 'edit') {
										startdateRef.current.type = 'datetime-local'
									}

								}
							}
							value={startdate ? startdate.split('.')[0] : ''}
							step='1'
							// textPadding={8}
							min={new Date().toISOString().split('.')[0]}

							onChange={
								(e) => {
									if(e.target.value === '' && startdateRef.current) {
										startdateRef.current.type = 'string'
									}

									handleOnEditProposalSubmission('startDate', e.target.value)
									setStartdate(e.target.value)
								}
							}
							// borderColor={endDateRef?.current.value ? 'black' : 'gray.300'}
							fontWeight='400'
							fontSize='20px'
						/>
						<Text variant='v2_subheading'>
							till
						</Text>
						<Input
							type={rfpFormSubmissionType === 'submit' ? 'string' : 'datetime-local'}
							variant='flushed'
							placeholder='enter end date'
							_placeholder={{ color: 'gray.5' }}
							min={startdate}
							value={endDate ? endDate.split('.')[0] : ''}
							step='1'
							ref={endDateRef}
							onFocus={
								() => {
									if(endDateRef.current) {
										endDateRef.current.type = 'datetime-local'
									}

								}
							}
							// textPadding={8}
							onChange={
								(e) => {
									if(e.target.value === '' && endDateRef.current) {
										endDateRef.current.type = 'string'
									}

									handleOnEditProposalSubmission('endDate', e.target.value)
									setEndDate(e.target.value)
								}
							}
							fontWeight='400'
							fontSize='20px'
						/>
					</Flex>


					{/* Required details */}
					<Flex
						gap={4}
						alignItems='baseline'
						wrap='wrap'>
						<Text variant='v2_subheading'>
							Proposals must include
						</Text>

						{
							requiredDetails.map((detail, index) => {
								const {
									title
								} = detail as ApplicantDetailsFieldType
								return (
									<>
										<FlushedInput
											placeholder={title}
											value={title}
											isDisabled={true}
											flexProps={{ w: 'fit-content' }} />
										{
											(index < requiredDetails.length - 1 || extraDetailsFields?.filter(detail => detail.required).length > 0) && (
												<Text variant='v2_subheading'>
													,
												</Text>
											)
										}
									</>
								)
							})
						}
						{
							extraDetailsFields?.filter(detail => detail.required).map((detail, index) => {
								const {
									title
								} = detail as ApplicantDetailsFieldType
								return (
									<>
										<FlushedInput
											placeholder={title}
											value={title}
											isDisabled={true}
											onMouseOver={() => setShowCrossIcon(true)}
											// onMouseOut={() => setShowCrossIcon(false)}
										/>
										{
											showCrossIcon && (
												<Icon
													as={IoMdClose}
													cursor='pointer'
													// onMouseOver={() => setShowCrossIcon(true)}
													onClick={
														() => {
															handleToggleExtraFields(title)
															setShowCrossIcon(false)
														}
													} />
											)
										}
										{
											(index < extraDetailsFields?.filter(detail => detail.required).length - 1) && (
												<Text
													variant='v2_subheading'
												>
													,
												</Text>
											)
										}
									</>
								)
							})
						}
						{/* {
							Array.from(Array(detailsCounter)).map((_, index) => {
								return (
									<>
										<FlushedInput
											placeholder='Write more details'
											value={detailInputValues[index]}
											onChange={(e) => handleOnChange(e, index)} />
										<Text variant='v2_subheading'>
											,
										</Text>
									</>
								)
							})
						} */}

						{
							showExtraFieldDropdown && (
								<CustomSelect
									options={extraDetailsFields}
									setExtraDetailsFields={setExtraDetailsFields}
									setShowExtraFieldDropdown={setShowExtraFieldDropdown}
									width='20%'
									placeholder='Choose one or Type something and press enter...'
								/>
							)
						}
						<Button
							variant='outline'
							leftIcon={<AiOutlinePlus />}
							borderColor='black'
							onClick={() => handleClickAddAnother()}>
							Add another
						</Button>
					</Flex>

					{/* More details */}
					<Text variant='v2_subheading'>
						Builders can also refer to addtional information here
					</Text>
					<Flex
						gap={4}
						alignItems='center'
						wrap='wrap'
					>

						<FlushedInput
							placeholder='Add a link'
							value={link}
							type='url'
							onChange={
								(e) => {
									setLink(e.target.value)
									handleOnEditProposalSubmission('link', e.target.value)
								}
							}
							width='100%'
							// flexProps={{ grow: 1, shrink: 1 }}
						/>
						<Text
							display={rfpFormSubmissionType === 'edit' ? 'none' : ''}
							variant='v2_subheading'>
							Or
						</Text>


						<label htmlFor='upload-doc-id' />
						<FlushedInput
							id='upload-doc-id'
							placeholder='Upload a doc'
							display={rfpFormSubmissionType === 'edit' ? 'none' : ''}
							onClick={openInput}
							value={doc ? doc[0].name : ''}
							onChange={(e) => handleFile(e)}
							width='90%'
							// flexProps={{ grow: 1, shrink: 1 }}
						/>


						<Input
							id='upload-doc-id'
							ref={uploaDocInputref}
							type='file'
							placeholder='Upload a file'
							onChange={(e) => handleFile(e)}
							style={{ height: '0.1px', width: '0.1px', opacity: 0 }} />
					</Flex>
					{/* CTA */}
					<Button
						className='continueBtn'
						variant='primaryMedium'
						alignSelf='flex-end'
						isDisabled={!proposalName || !startdate || !endDate}
						w='166px'
						h='48px'
						position='absolute'
						bottom='50px'
						onClick={
							() => {
								handleOnClickContinue()
							}
						}>
						{ rfpFormSubmissionType === 'edit' ? 'Save & Continue' : 'Continue'}
					</Button>

				</Flex>

				{/* End Proposal Submission Component */}
			</>
		)
	}

	// const extraDetailsFieldsList = applicantDetailsList.filter(detail => detail.isRequired === false).map(({
	// 	title, id, inputType, isRequired, pii
	// }) => {
	// 	return {
	// 		title,
	// 		required: isRequired || false,
	// 		id,
	// 		inputType,
	// 		pii
	// 	}
	// })
	// 	.filter((obj) => obj !== null)

	const router = useRouter()

	const [detailsCounter, setDetailsCounter] = useState(0)

	const [showCrossIcon, setShowCrossIcon] = useState(false)

	// const [extraDetailsFields, setExtraDetailsFields] = useState<ApplicantDetailsFieldType[]>(extraDetailsFieldsList)

	const [showExtraFieldDropdown, setShowExtraFieldDropdown] = useState(false)

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleFile = async(e: any) => {
		setDoc(e.target.files)
		if(rfpFormSubmissionType === 'edit') {
			handleOnEditProposalSubmission('doc', e.target.files)
		}
	}

	const handleClickAddAnother = () => {
		setDetailsCounter(detailsCounter + 1)
		setShowExtraFieldDropdown(true)
	}

	const handleToggleExtraFields = (title: string) => {
		const newExtraFieldList = extraDetailsFields.map((field) => {
			if(field.title === title) {
				return {
					...field,
					required: false
				}
			} else {
				return field
			}
		})
		setExtraDetailsFields(newExtraFieldList)
	}

	const handleOnClickContinue = () => {
		logger.info('step 2')
		// setStep(2)

		//filter true values from extra details fields and add custom field ids
		const filteredExtraDetails = extraDetailsFields.filter((field) => field.required === true).map((item, index) => {
			let inputType: string = item.inputType
			if(item.inputType === 'long_form') {
				inputType = 'long-form'
			} else if(item.inputType === 'short_form') {
				inputType = 'short-form'
			}

			return {
				id: `customField${index}-${item.title}`,
				inputType: inputType,
				required: item.required,
				title: item.title,
				pii: item.pii
			}
		})

		// merge required and extra details
		const allFieldsArray = [...requiredDetails, ...filteredExtraDetails]
		const allFieldsObject: {[key: string]: ApplicantDetailsFieldType} = {}
		for(let i = 0; i < allFieldsArray.length; i++) {
			allFieldsObject[allFieldsArray[i].id] = allFieldsArray[i]
		}

		// const allFieldsObject = [...requiredDetails, ...extraDetailsFields]
		logger.info('all applicant details', [...requiredDetails, ...filteredExtraDetails])
		setAllApplicantDetails(allFieldsObject)

		if(rfpFormSubmissionType === 'edit') {
			handleOnEditProposalSubmission('allApplicantDetails', allFieldsArray)
			setStep(3)
		} else {
			setStep(2)
		}
	}

	return buildComponent()
}

export default ProposalSubmission
