import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import applicantDetailsList from 'src/constants/applicantDetailsList'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
import { today, validateDate } from 'src/screens/request_proposal/_utils/utils'
import { ApplicantDetailsFieldType, DynamicInputValues } from 'src/types'
import { uploadToIPFS } from 'src/utils/ipfsUtils'


interface Props {
    proposalName: string
    setProposalName: (value: string) => void
    startdate: string
    setStartdate: (value: string) => void
    endDate: string
    setEndDate: (value: string) => void
    requiredDetails: any[]
    moreDetails: string[]
    setMoreDetails: (value: string[]) => void
    link: string
    setLink: (value: string) => void
    doc: FileList | null
    setDoc: (value: FileList) => void
    step: number
    setStep: (value: number) => void
    allApplicantDetails: {[key: string]: ApplicantDetailsFieldType}
    setAllApplicantDetails: (value: {[key: string]: ApplicantDetailsFieldType}) => void
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
		moreDetails,
		setMoreDetails,
		link,
		setLink,
		doc,
		setDoc,
		step,
		setStep,
		allApplicantDetails,
		setAllApplicantDetails
	}: Props) {

	const uploaDocInputref = useRef(null)

	const openInput = () => {
		console.log('open input')
		if(uploaDocInputref.current) {
			(uploaDocInputref.current as HTMLInputElement).click()
		}
	}

	const buildComponent = () => {
		console.log('start date in component', startdate)
		console.log('end date in component', endDate)
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
						onClick={
							() => router.push({
								pathname: '/discover'
							})
						}>
						Back
					</Button>
				</Flex>
				<Flex
					className='rightScreenCard'
					flexDirection='column'
					width='100%'
					gap={6}
					alignSelf='flex-start'>
					{/* TODO: Add Steps complete indicator */}
					<StepIndicator step={step} />
					<Text
						alignSelf='center'
						fontWeight='500'
						fontSize='24px'
						lineHeight='32px'
						marginBottom={8}>
						Proposal Submission
					</Text>

					{/* Proposal title */}
					<Flex
						gap={4}
						alignItems='baseline'>
						<Text variant='requestProposalBody'>
							Receive proposals for
						</Text>
						<FlushedInput
							placeholder='Give a title for inviting proposals.'
							value={proposalName}
							onChange={
								(e) => {
									setProposalName(e.target.value)
								}
							} />
					</Flex>

					{/* Proposal dates */}
					<Flex
						gap={4}
						alignItems='baseline'>
						<Text variant='requestProposalBody'>
							Receive proposal submissions from
						</Text>
						<FlushedInput
							type='datetime-local'
							placeholder='start date'
							value={startdate}
							step='1'
							min={new Date().toISOString().split('.')[0]}
							onChange={
								(e) => {
									console.log('start date', new Date().toLocaleString())
									checkDate(e.target.value)
									setStartdate(e.target.value)
								}
							} />
						{/* <Input type='date' value={startdate} min={todayDate} onChange={
                            (e) => {
                                checkDate(e.target.value)
                                setStartdate(e.target.value)
                            }
                        }></Input> */}
						<Text variant='requestProposalBody'>
							till
						</Text>
						<FlushedInput
							type='datetime-local'
							placeholder='end date'
							min={startdate}
							value={endDate}
							step='1'
							onChange={
								(e) => {
									setEndDate(e.target.value)
								}
							} />
					</Flex>

					{/* Required details */}
					<Flex
						gap={4}
						alignItems='baseline'
						wrap='wrap'>
						<Text variant='requestProposalBody'>
							Proposals must include
						</Text>

						{
							requiredDetails.map((detail, i) => {
								const {
									title, required, id, index, inputType
								} = detail as any
								return (
									<>
										<FlushedInput
											placeholder={detail}
											value={title}
											isDisabled={true} />
										<Text variant='requestProposalBody'>
											,
										</Text>
									</>
								)
							})
						}
						{
							Array.from(Array(detailsCounter)).map((_, index) => {
								return (
									<>
										<FlushedInput
											placeholder='Write more details'
											value={detailInputValues[index]}
											onChange={(e) => handleOnChange(e, index)} />
										<Text variant='requestProposalBody'>
											,
										</Text>
									</>
								)
							})
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
					<Text variant='requestProposalBody'>
						Anything else you want the builder to know?
					</Text>
					<Flex
						gap={4}
						alignItems='baseline'
						wrap='wrap'>
						<FlushedInput
							placeholder='Add a link'
							value={link}
							onChange={(e) => setLink(e.target.value)} />
						<Text variant='requestProposalBody'>
							Or
						</Text>
						<label htmlFor='upload-doc-id'>
							<FlushedInput
								placeholder='Upload a doc'
								onClick={openInput}
								value={doc ? doc[0].name : ''}
								onChange={(e) => handleFile(e)} />
						</label>
						<Input
							id='upload-doc-id'
							ref={uploaDocInputref}
							type='file'
							placeholder='Upload a file'
							onChange={(e) => handleFile(e)}
							style={{ height: '0.1px', width: '0.1px', opacity: 0 }} />
						{/* <Text variant="requestProposalBody" >Upload a doc</Text> */}
						{/* <FlushedInput onClick={() => openInput()}  placeholder='Upload a doc' ref={ref}/> */}
					</Flex>
					{/* CTA */}
					<Button
						className='continueBtn'
						variant='primaryMedium'
						alignSelf='flex-end'
						isDisabled={!proposalName || !startdate || !endDate}
						w='166px'
						h='48px'
						onClick={
							() => {
								handleOnClickContinue()
							}
						}>
						Continue
					</Button>

				</Flex>

				{/* End Proposal Submission Component */}
			</>
		)
	}

	const router = useRouter()
	const [todayDate, setTodayDate] = useState('')

	const [detailsCounter, setDetailsCounter] = useState(0)
	const [detailInputValues, setDetailInputValues] = useState<DynamicInputValues>({})

	const checkDate = (date: string) => {
		const res = validateDate(date)
		console.log('date validation...', res)
	}

	const handleFile = async(e: any) => {
		console.log('file', e.target.files)
		// console.log('file', e.target.files[0])
		const filehash = await uploadToIPFS(e.target.files[0])
		console.log('filehash', filehash)
		setDoc(e.target.files)
	}

	const handleClickAddAnother = () => {
		setDetailsCounter(detailsCounter + 1)
		console.log(detailsCounter)
	}

	const handleOnClickContinue = () => {
		console.log('step 2')
		setStep(2)
		const details: ApplicantDetailsFieldType[] = []
		const detailInputValuesLength = Object.keys(detailInputValues).length
		for(let i = 0; i < detailInputValuesLength; i++) {
			details.push({
				title: detailInputValues[i],
				required: true,
				id: `customField${i}`,
				inputType: 'long-form'
			})
		}
		let allFieldsArray = [...requiredDetails, ...details]
		let allFieldsObject: {[key: string]: ApplicantDetailsFieldType} = {}
		for (let i = 0; i < allFieldsArray.length; i++) {
			allFieldsObject[allFieldsArray[i].id] = allFieldsArray[i]
		}
		console.log('all applicant details', [...requiredDetails, ...details])
		setAllApplicantDetails(allFieldsObject)
	}

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const inputValue: DynamicInputValues = {}
		inputValue[index] = e.target.value
		setDetailInputValues({ ...detailInputValues, ...inputValue })
		console.log({ ...detailInputValues, ...inputValue })
	}


	useEffect(() => {
		const todayDate = today()
		setTodayDate(todayDate)
	})


	return buildComponent()
}

export default ProposalSubmission
