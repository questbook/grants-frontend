import { ChangeEvent, useContext, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Text } from '@chakra-ui/react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { WebwalletContext } from 'src/pages/_app'
import SelectDropdown from 'src/screens/request_proposal/_components/SelectDropdown'
import StepIndicator from 'src/screens/request_proposal/_components/StepIndicator'
import { DropdownOption, RFPFormType } from 'src/screens/request_proposal/_utils/types'

interface Props {
	reviewMechanism: DropdownOption
	setReviewMechanism: (value: DropdownOption) => void
	rubrics: {}
	setRubrics: (value: {}) => void
	rubricInputValues: string[]
	setRubricInputValues: (value: string[]) => void
	rfpFormSubmissionType: RFPFormType
	handleOnEdit: (fieldName: string, value: string | string []) => void
}

function ProposalReview(
	{
		reviewMechanism,
		setReviewMechanism,
		rubricInputValues,
		setRubricInputValues,
		setRubrics,
		rfpFormSubmissionType,
		handleOnEdit
	}: Props) {

	const buildComponent = () => {
		return (
			<>
				<Flex alignSelf='flex-start'>
					{
						bigScreen && (
							<Button
								className='backBtn'
								variant='linkV2'
								leftIcon={<BsArrowLeft />}
								onClick={() => setCreatingProposalStep(1)}>
								Back
							</Button>
						)
					}
				</Flex>
				<Flex
					className='rightScreenCard'
					flexDirection='column'
					width='100%'
					height='100%'
					gap={10}
					alignSelf='flex-start'
					// marginRight={24}
				>
					{/* TODO: Add Steps complete indicator */}
					<StepIndicator />
					<Text
						alignSelf='center'
						fontWeight='500'
						fontSize={['20px', '24px']}
						lineHeight='32px' >
						How will proposals be reviewed?
					</Text>

					{/* <Flex
						gap={4}
						alignItems='baseline'>
						<Text variant='subheading'>
							Assign
						</Text>
						<FlushedInput
							placeholder='1'
							value={numberOfReviewers.toString()}
							type='number'
							onChange={
								(e) => {
									setNumberOfReviewers(parseInt(e.target.value))
									handleOnEdit('numberOfReviewers', e.target.value)
								}
							} />
						<Text variant='subheading'>
							reviewer
							{numberOfReviewers > 1 ? 's' : ''}
							{' '}
							for an incoming proposal automatically.
						</Text>
					</Flex> */}

					<Flex
						gap={4}
						alignItems='baseline'
					>
						<Text
							variant='subheading'
							fontSize={['16px', '20px']}
						>
							Review will be based on
						</Text>
						{/* <FlushedInput
							placeholder='Select one'
							value={reviewMechanism}
							isDisabled={true}
							onChange={
								(e) => {
									setReviewMechanism(e.target.value)
								}
							} /> */}
						<SelectDropdown
							options={reviewMechanismOptions}
							placeholder='Select One'
							value={reviewMechanism}
							onChange={
								(item) => {
									handleOnChangeReviewMechanismOption(item)
									handleOnEdit('reviewMechanism', item?.value!)
								}
							}
						/>
					</Flex>

					{/* Rubric Selected */}
					{
						reviewMechanism.label === 'Rubric'
						&&
						(
							<>
								<Flex
									gap={4}
									alignItems='baseline'
									wrap='wrap'>
									<Text
										variant='subheading'
										fontSize={['16px', '20px']}
									>
										Evaluation rubrics will include
									</Text>

									{
										Array.from(Array(rubricsCounter)).map((c, index) => {
											return (
												<>
													<FlushedInput
														placeholder='Add your own'
														value={rubricInputValues[index]}
														onChange={(e) => handleOnChange(e, index)} />
													<Text variant='subheading'>
														,
													</Text>
												</>
											)
										})
									}

								</Flex>
								<Flex
									gap={4}
									alignItems='baseline'
									position='relative'
								>
									<Button
										variant='outline'
										leftIcon={<AiOutlinePlus />}
										borderColor='black'
										onClick={() => handleClick()}>
										Add another
									</Button>
								</Flex>
							</>
						)
					}

					{/* CTA */}
					<Flex
						gap={8}
						width='100%'
						justifyContent='flex-end'
						// position='absolute'
						// bottom='50px'
					>
						<Button
							display={rfpFormSubmissionType === 'edit' ? 'none' : 'block'}
							variant='link'
							onClick={handleSkip}>
							Skip for now
						</Button>
						<Button
							className='continueBtn'
							variant='primaryMedium'
							w='166px'
							h='48px'
							onClick={
								() => {
									handleOnClickContinue()
								}
							}
							isDisabled={!reviewMechanism} >
							{ rfpFormSubmissionType === 'edit' ? 'Save & Continue' : 'Continue'}

						</Button>
					</Flex>


				</Flex>
			</>
		)
	}

	// const [rubricInputValues, setRubricInputValues] = useState<DynamicInputValues>({ 0: 'Team competence', 1: 'Idea Quality', 2: 'Relevance to our ecosystem' })
	const [rubricsCounter, setRubricsCounter] = useState(rubricInputValues.length)
	const { setCreatingProposalStep } = useContext(WebwalletContext)!
	const reviewMechanismOptions = [{ label: 'Voting', value: 'voting' }, { label: 'Rubric', value: 'rubrics' }, { label: 'Community voting', value: 'Community voting', isDisabled: true }]
	const bigScreen = useMediaQuery('(min-width:601px)')
	const handleClick = () => {
		setRubricsCounter(rubricsCounter + 1)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleOnChangeReviewMechanismOption = (item: any) => {
		// console.log('review changes to', item)
		setReviewMechanism({
			label: item.label,
			value: item.value
		})
	}

	const handleSkip = () => {
		setReviewMechanism({
			label: '',
			value: ''
		})
		// setStep(3)
		setCreatingProposalStep(3)
	}

	const handleOnClickContinue = () => {
		// setStep(3)
		setCreatingProposalStep(3)
		const rubrics: { [key: number]: { title: string, details: string, maximumPoints: number } } = {}
		if(reviewMechanism.label === 'Voting') {
			rubrics[0] = {
				title: 'Vote for',
				details: '',
				maximumPoints: 1
			}
		} else if(reviewMechanism.label === 'Rubric') {
			Object.keys(rubricInputValues).forEach((key, index) => {
				rubrics[index] = {
					title: rubricInputValues[index],
					details: '',
					maximumPoints: 5
				}
			})
		}

		logger.info('Setting rubrics: ', rubrics)
		setRubrics(rubrics)
		handleOnEdit('rubrics', rubricInputValues)
	}

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const inputValues: string[] = [...rubricInputValues]
		inputValues[index] = e.target.value
		setRubricInputValues(inputValues)
	}


	return buildComponent()

}


export default ProposalReview
