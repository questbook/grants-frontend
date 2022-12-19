import { ChangeEvent, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Input, Text } from '@chakra-ui/react'
import { logger } from 'ethers'
import { useRouter } from 'next/router'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
import { ApplicantDetailsFieldType, DynamicInputValues } from 'src/types'
import { uploadToIPFS } from 'src/utils/ipfsUtils'


interface Props {
    proposalName: string
    setProposalName: (value: string) => void
    startdate: string
    setStartdate: (value: string) => void
    endDate: string
    setEndDate: (value: string) => void
    requiredDetails: ApplicantDetailsFieldType[]
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
		link,
		setLink,
		doc,
		setDoc,
		step,
		setStep,
		setAllApplicantDetails
	}: Props) {

	const uploaDocInputref = useRef(null)

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
					gap={10}
					alignSelf='flex-start'
					marginRight={24}
				>
					{/* TODO: Add Steps complete indicator */}
					<StepIndicator step={step} />
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
						<Text variant='v2_subheading'>
							Receive proposal submissions from
						</Text>
						<FlushedInput
							type='datetime-local'
							placeholder='start date'
							value={startdate}
							step='1'
							textPadding={8}
							min={new Date().toISOString().split('.')[0]}
							onChange={
								(e) => {
									// console.log('start date', new Date().toLocaleString())
									setStartdate(e.target.value)
								}
							} />
						<Text variant='v2_subheading'>
							till
						</Text>
						<FlushedInput
							type='datetime-local'
							placeholder='end date'
							min={startdate}
							value={endDate}
							step='1'
							textPadding={8}
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
						<Text variant='v2_subheading'>
							Proposals must include
						</Text>

						{
							requiredDetails.map((detail) => {
								const {
									title
								} = detail as ApplicantDetailsFieldType
								return (
									<>
										<FlushedInput
											placeholder={title}
											value={title}
											isDisabled={true} />
										<Text variant='v2_subheading'>
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
										<Text variant='v2_subheading'>
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
					<Text variant='v2_subheading'>
						Anything else you want the builder to know?
					</Text>
					<Flex
						gap={4}
						alignItems='center'
						wrap='wrap'
					>

						<FlushedInput
							placeholder='Add a link'
							value={link}
							onChange={(e) => setLink(e.target.value)}
							width='100%'
							// flexProps={{ grow: 1, shrink: 1 }}
						/>
						<Text variant='v2_subheading'>
							Or
						</Text>


						<label htmlFor='upload-doc-id' />
						<FlushedInput
							id='upload-doc-id'
							placeholder='Upload a doc'
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

	const [detailsCounter, setDetailsCounter] = useState(0)
	const [detailInputValues, setDetailInputValues] = useState<DynamicInputValues>({})


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleFile = async(e: any) => {
		await uploadToIPFS(e.target.files[0])
		setDoc(e.target.files)
	}

	const handleClickAddAnother = () => {
		setDetailsCounter(detailsCounter + 1)
	}

	const handleOnClickContinue = () => {
		logger.info('step 2')
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

		const allFieldsArray = [...requiredDetails, ...details]
		const allFieldsObject: {[key: string]: ApplicantDetailsFieldType} = {}
		for(let i = 0; i < allFieldsArray.length; i++) {
			allFieldsObject[allFieldsArray[i].id] = allFieldsArray[i]
		}

		// console.log('all applicant details', [...requiredDetails, ...details])
		setAllApplicantDetails(allFieldsObject)
	}

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const inputValue: DynamicInputValues = {}
		inputValue[index] = e.target.value
		setDetailInputValues({ ...detailInputValues, ...inputValue })
	}


	return buildComponent()
}

export default ProposalSubmission
