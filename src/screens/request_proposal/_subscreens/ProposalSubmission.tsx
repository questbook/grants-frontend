/* eslint-disable react/jsx-curly-brace-presence */
import { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { logger } from 'ethers'
import { useRouter } from 'next/router'
import applicantDetailsList from 'src/constants/applicantDetailsList'
import { CustomSelect } from 'src/libraries/ui/CustomSelect'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
import { WebwalletContext } from 'src/pages/_app'
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
	const bigScreen = useMediaQuery('(min-width:601px)')

	const openInput = () => {
		if(uploaDocInputref.current) {
			(uploaDocInputref.current as HTMLInputElement).click()
		}
	}

	const buildComponent = () => {
		return (
			<>
				{/* Start Proposal Submission Component */}
				{
					bigScreen && (
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
					)
				}
				<Flex
					className='rightScreenCard'
					flexDirection='column'
					width='100%'
					height='100%'
					gap={[6, 10]}
					alignSelf='flex-start'
				>
					{/* TODO: Add Steps complete indicator */}
					<StepIndicator
						step={step}
						formType={rfpFormSubmissionType} />
					<Text
						alignSelf={['flex-start', 'center']}
						fontWeight='500'
						fontSize='24px'
						lineHeight='32px'
						marginBottom={[2, 8]}>
						What makes a good proposal?
					</Text>

					{/* Proposal title */}
					<Flex
						gap={4}
						alignItems='baseline'
						flexDirection={['column', 'row', 'row', 'row']}>

						<Text variant='v2_subheading'>
							Receive proposals for
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
						alignItems='baseline'
						flexDirection={['column', 'column', 'row']}>

						<Text
							variant='v2_subheading'
							minW='max-content'>
							Receive proposal submissions from

						</Text>

						<Input
							type={rfpFormSubmissionType === 'submit' ? 'string' : 'date'}
							variant='flushed'
							placeholder='enter start date'
							_placeholder={{ color: 'gray.5' }}
							// isDisabled={rfpFormSubmissionType === 'edit'}
							ref={startdateRef}
							onFocus={
								() => {
									if(startdateRef.current && rfpFormSubmissionType !== 'edit') {
										startdateRef.current.type = 'date'
									}

								}
							}
							value={startdate ? startdate.split('T')[0] : ''}
							step='1'
							// textPadding={8}
							min={new Date().toISOString().split('T')[0]}

							onChange={
								(e) => {
									if(e.target.value === '' && startdateRef.current) {
										startdateRef.current.type = 'string'
									}

									logger.info('e.target.value', new Date(e.target.value!).toISOString())
									handleOnEditProposalSubmission('startDate', new Date(e.target.value!).toISOString())
									setStartdate(new Date(e.target.value!).toISOString())
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
							type={rfpFormSubmissionType === 'submit' ? 'string' : 'date'}
							variant='flushed'
							placeholder='enter end date'
							_placeholder={{ color: 'gray.5' }}
							min={startdate}
							value={endDate ? endDate.split('T')[0] : ''}
							step='1'
							ref={endDateRef}
							onFocus={
								() => {
									if(endDateRef.current) {
										endDateRef.current.type = 'date'
									}

								}
							}

							onChange={
								(e) => {
									if(e.target.value === '' && endDateRef.current) {
										endDateRef.current.type = 'string'
									}

									const eod = new Date(e.target.value!)
									eod.setUTCHours(23, 59, 59, 999)

									handleOnEditProposalSubmission('endDate', eod.toISOString())
									setEndDate(eod.toISOString())
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
						Builders can also refer to additional information here
					</Text>
					<Flex
						gap={4}
						alignItems='center'
						wrap='wrap'
						flexDirection={['column', 'column', 'row', 'row']}
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
							variant='v2_subheading'
							marginBottom={[-6, 0, 0, 0]}>
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
							width='100%'
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
						alignSelf={['center', 'flex-end']}
						isDisabled={!proposalName || !startdate || !endDate}
						w={['100%', '20%']}
						h='40px'
						marginTop='20px'
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

	const router = useRouter()

	const [detailsCounter, setDetailsCounter] = useState(0)

	const [showCrossIcon, setShowCrossIcon] = useState(false)

	const { createingProposalStep, setCreatingProposalStep } = useContext(WebwalletContext)!

	const [showExtraFieldDropdown, setShowExtraFieldDropdown] = useState(false)

	useEffect(() => {
		logger.info({ extraDetailsFields }, 'Extra details field')
	}, [extraDetailsFields])

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
		logger.info('Setting extra details 2')
		setExtraDetailsFields(newExtraFieldList)
	}

	const handleOnClickContinue = () => {
		logger.info('step 2')
		// setStep(2)
		setCreatingProposalStep(2)
		//filter true values from extra details fields and add custom field ids
		const filteredExtraDetails = extraDetailsFields.filter((field) => field.required === true).map((item, index) => {
			let inputType: string = item.inputType
			if(item.inputType === 'long_form') {
				inputType = 'long-form'
			} else if(item.inputType === 'short_form') {
				inputType = 'short-form'
			}

			logger.info(item, 'Filtered extra details')
			return {
				id: applicantDetailsList.map(d => d.id).includes(item.id) ? item.id : `customField${index}-${item.title}`,
				inputType: inputType,
				required: item.required,
				title: item.title,
				pii: item.pii
			}
		})
		logger.info(filteredExtraDetails, 'Filtered extra details')

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
			// setStep(3)
		}
	}

	return buildComponent()
}

export default ProposalSubmission
