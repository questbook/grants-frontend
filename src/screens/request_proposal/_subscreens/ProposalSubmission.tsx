/* eslint-disable react/jsx-curly-brace-presence */
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { Button, Flex, Icon, Input, Text } from '@chakra-ui/react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { logger } from 'ethers'
import { useRouter } from 'next/router'
import applicantDetailsList from 'src/constants/applicantDetailsList'
import { defaultChainId } from 'src/constants/chains'
import { useGrantDetailsQuery } from 'src/generated/graphql'
import { useMultiChainQuery } from 'src/libraries/hooks/useMultiChainQuery'
import { CustomSelect } from 'src/libraries/ui/CustomSelect'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { WebwalletContext } from 'src/pages/_app'
import StepIndicator from 'src/screens/request_proposal/_components/StepIndicator'
import { RFPFormContext } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'

function ProposalSubmission() {
	const uploaDocInputref = useRef(null)
	// const startdateRef = useRef<HTMLInputElement>(null)
	// const endDateRef = useRef<HTMLInputElement>(null)
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
								onClick={() => router.back()}
							>
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
					<StepIndicator />
					<Text
						alignSelf={['flex-start', 'center']}
						fontWeight='500'
						fontSize='24px'
						lineHeight='32px'
						marginBottom={[2, 8]}
					>
						What makes a good proposal?
					</Text>

					{/* Proposal title */}
					<Flex
						gap={4}
						alignItems='baseline'
						flexDirection={['column', 'row', 'row', 'row']}
					>
						<Text variant='subheading'>
							Receive proposals for
						</Text>

						<FlushedInput
							placeholder='describe in 4-5 words'
							value={rfpData?.proposalName}
							onChange={
								(e) => {
									handleOnEdit('proposalName', e.target.value)
								}
							}
						/>
					</Flex>

					{/* Required details */}
					<Flex
						gap={4}
						alignItems='baseline'
						wrap='wrap'>
						<Text variant='subheading'>
							Proposals must include
						</Text>

						{
							applicantDetails.map((detail, index) => {
								const { title } = detail as ApplicantDetailsFieldType
								return (
									<>
										<FlushedInput
											placeholder={title}
											value={title}
											isDisabled={true}
											flexProps={{ w: 'fit-content' }}
										/>
										{
											(index < applicantDetails.length - 1 || extraDetailsFieldsList?.filter((detail) => detail.required).length > 0) && (
												<Text variant='subheading'>
													,
												</Text>
											)
										}
									</>
								)
							})
						}
						{
							extraDetailsFieldsList
								?.filter((detail) => detail.required)
								.map((detail, index) => {
									const { title } = detail as ApplicantDetailsFieldType
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
														}
													/>
												)
											}
											{
												index < extraDetailsFieldsList?.filter((detail) => detail.required).length - 1 && (
													<Text variant='subheading'>
														&sbquo;
													</Text>
												)
											}
										</>
									)
								})
						}

						{
							showExtraFieldDropdown && (
								<CustomSelect
									options={extraDetailsFieldsList}
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
							onClick={() => handleClickAddAnother()}
						>
							Add another
						</Button>
					</Flex>

					{/* More details */}
					<Text variant='subheading'>
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
							value={rfpData?.link}
							type='url'
							onChange={
								(e) => {
									handleOnEdit('link', e.target.value)
								}
							}
							width='100%'
							// flexProps={{ grow: 1, shrink: 1 }}
						/>
						<Text
							display={rfpFormType === 'edit' ? 'none' : ''}
							variant='subheading'
							marginBottom={[-6, 0, 0, 0]}
						>
							Or
						</Text>

						<label htmlFor='upload-doc-id' />
						<FlushedInput
							id='upload-doc-id'
							placeholder='Upload a doc'
							display={rfpFormType === 'edit' ? 'none' : ''}
							onClick={openInput}
							value={rfpData?.doc ? rfpData?.doc[0] : ''}
							onChange={(e) => handleFile(e)}
							width='100%'
						/>
						<Input
							id='upload-doc-id'
							ref={uploaDocInputref}
							type='file'
							placeholder='Upload a file'
							onChange={(e) => handleFile(e)}
							style={{ height: '0.1px', width: '0.1px', opacity: 0 }}
						/>
					</Flex>
					{/* CTA */}
					<Button
						className='continueBtn'
						variant='primaryMedium'
						alignSelf={['center', 'flex-end']}
						isDisabled={!rfpData?.proposalName }
						w={['100%', '20%']}
						h='40px'
						marginTop='20px'
						bottom='50px'
						onClick={
							() => {
								handleOnClickContinue()
							}
						}
					>
						{rfpFormType === 'edit' ? 'Save & Continue' : 'Continue'}
					</Button>
				</Flex>

				{/* End Proposal Submission Component */}
			</>
		)
	}

	const { rfpData, setRFPData, rfpFormType } = useContext(RFPFormContext)!
	const router = useRouter()
	const [detailsCounter, setDetailsCounter] = useState(0)
	const [showCrossIcon, setShowCrossIcon] = useState(false)
	const { setCreatingProposalStep } = useContext(WebwalletContext)!
	const [showExtraFieldDropdown, setShowExtraFieldDropdown] = useState(false)

	const [extraDetailsFieldsList, setExtraDetailsFields] = useState<ApplicantDetailsFieldType[]>(
  	applicantDetailsList
  		.filter((detail) => detail.isRequired === false)
  		.map(({ title, id, inputType, isRequired, pii }) => {
  			logger.info(id, 'Populating extra details')
  			return {
  				title,
  				required: isRequired || false,
  				id,
  				inputType,
  				pii,
  			}
  		})
  		.filter((obj) => obj !== null),
	)

	const { grantId, chainId: chainIdString } = router.query

	const chainId = useMemo(() => {
		try {
			return typeof chainIdString === 'string' ? parseInt(chainIdString) : -1
		} catch(e) {
			return -1
		}
	}, [chainIdString])

	const { fetchMore: fetchGrantDetails } = useMultiChainQuery({
		useQuery: useGrantDetailsQuery,
		options: {},
		chains: [chainId === -1 ? defaultChainId : chainId]
	})

	const fetchGrant = useCallback(async() => {
		if(!grantId || !chainId || typeof grantId !== 'string' || typeof chainId !== 'number') {
			return
		}

		const result = await fetchGrantDetails({ grantId }, true)
		if(!result?.length || !result[0]?.grant) {
			return 'could-not-fetch-grant-details'
		}


		const fieldIDs = applicantDetailsList.map(d => d.id)
		logger.info({ fieldIDs }, 'ProposalForm: fetchGrant (fieldIDs)')
		const fields = {
			fields: result[0].grant.fields.filter(f => f.title.includes('customField')).map((field) => {
				const id = field.id.substring(field.id.indexOf('.') + 1)
				return {
					...field,
					title: field.title.substring(field.title.indexOf('-') + 1),
					id,
					value: id === 'isMultipleMilestones' ? 'true' : id === 'teamMembers' ? '1' : '',
					required: true
				}
			})
		}

		return fields.fields
	}, [grantId, chainId])

	useEffect(() => {
		fetchGrant()
			.then((fields) => {
				if(fields === 'could-not-fetch-grant-details') {
					return
				}

				const newApplicantDetails = [...applicantDetailsList
					.filter((detail) => detail.isRequired === false)
					.map(({ title, id, inputType, isRequired, pii }) => {
						logger.info(id, 'Populating extra details')
						return {
							title,
							required: isRequired || false,
							id,
							inputType,
							pii,
						}
					})
					.filter((obj) => obj !== null), ...fields!]
				setExtraDetailsFields(newApplicantDetails)
			})
	}, [])

	const applicantDetails: ApplicantDetailsFieldType[] =
		applicantDetailsList
			.filter((detail) => detail.isRequired)
			.map(({ title, id, inputType, isRequired, pii }) => {
				return {
					title,
					required: isRequired || false,
					id,
					inputType,
					pii,
				}
			})
			.filter((obj) => obj !== null)

	useEffect(() => {
		logger.info({ extraDetailsFieldsList }, 'Extra details field')
	}, [extraDetailsFieldsList])

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleFile = async(e: any) => {
		if(rfpFormType === 'edit') {
			handleOnEdit('doc', e.target.files)
		}
	}

	const handleClickAddAnother = () => {
		setDetailsCounter(detailsCounter + 1)
		setShowExtraFieldDropdown(true)
	}

	const handleToggleExtraFields = (title: string) => {
		const newExtraFieldList = extraDetailsFieldsList.map((field) => {
			if(field.title === title) {
				return {
					...field,
					required: false,
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
		const filteredExtraDetails = extraDetailsFieldsList
			.filter((field) => field.required === true)
			.map((item, index) => {
				let inputType: string = item.inputType
				if(item.inputType === 'long_form') {
					inputType = 'long-form'
				} else if(item.inputType === 'short_form') {
					inputType = 'short-form'
				}

				logger.info(item, 'Filtered extra details')
				return {
					id: applicantDetailsList.map((d) => d.id).includes(item.id)
						? item.id
						: `customField${index}-${item.title}`,
					inputType: inputType,
					required: item.required,
					title: item.title,
					pii: item.pii,
				}
			})
		logger.info(filteredExtraDetails, 'Filtered extra details')

		// merge required and extra details
		const allFieldsArray = [...applicantDetails, ...filteredExtraDetails]
		const allFieldsObject: { [key: string]: ApplicantDetailsFieldType } = {}
		for(let i = 0; i < allFieldsArray.length; i++) {
			allFieldsObject[allFieldsArray[i].id] = allFieldsArray[i]
		}

		// const allFieldsObject = [...requiredDetails, ...extraDetailsFields]
		logger.info('all applicant details', [
			...applicantDetails,
			...filteredExtraDetails,
		])

		handleOnEdit('allApplicantDetails', allFieldsArray)
	}

	const handleOnEdit = (field: string, value: string | ApplicantDetailsFieldType[] | string []) => {
		logger.info('rfp edited', { ...rfpData, [field]: value })
		setRFPData({ ...rfpData, [field]: value })
	}

	return buildComponent()
}

export default ProposalSubmission
