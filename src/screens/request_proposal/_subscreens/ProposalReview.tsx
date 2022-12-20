import { ChangeEvent, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Text } from '@chakra-ui/react'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
import SelectDropdown from 'src/screens/request_proposal/_components/SelectDropdown'
import { DynamicInputValues } from 'src/types'

interface Props {
	numberOfReviewers: number
	setNumberOfReviewers: (value: number) => void
	reviewMechanism: string
	setReviewMechanism: (value: string) => void
	rubrics: {}
	setRubrics: (value: {}) => void
	step: number
	setStep: (value: number) => void
}

function ProposalReview(
	{
		numberOfReviewers,
		setNumberOfReviewers,
		reviewMechanism,
		setReviewMechanism,
		setRubrics,
		step,
		setStep
	}: Props) {

	const buildComponent = () => {
		return (
			<>
				<Flex alignSelf='flex-start'>
					<Button
						className='backBtn'
						variant='linkV2'
						leftIcon={<BsArrowLeft />}
						onClick={() => setStep(1)}>
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
					marginRight={24}>
					{/* TODO: Add Steps complete indicator */}
					<StepIndicator step={step} />
					<Text
						alignSelf='center'
						fontWeight='500'
						fontSize='24px'
						lineHeight='32px' >
						How will proposals be reviewed?
					</Text>

					<Flex
						gap={4}
						alignItems='baseline'>
						<Text variant='v2_subheading'>
							Assign
						</Text>
						<FlushedInput
							placeholder='1'
							value={numberOfReviewers.toString()}
							type='number'
							onChange={(e) => setNumberOfReviewers(parseInt(e.target.value))} />
						<Text variant='v2_subheading'>
							reviewers for an incoming proposal automatically.

						</Text>
					</Flex>

					<Flex
						gap={4}
						alignItems='baseline'>
						<Text variant='v2_subheading'>
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
							onChange={(item) => handleOnChangeReviewMechanismOption(item)} />
					</Flex>

					{/* <Flex
						gap={4}
						alignItems='baseline'>
						<Button
							variant='outline'
							leftIcon={<AiOutlinePlus />}
							borderColor='black'
							onClick={() => setReviewMechanism('Voting')}>
							Community Voting
						</Button>
						<Button
							variant='outline'
							leftIcon={<AiOutlinePlus />}
							borderColor='black'
							onClick={() => setReviewMechanism('Rubric')}>
							Rubric
						</Button>
					</Flex> */}

					{/* Rubric Selected */}
					{
						reviewMechanism === 'Rubric'
						&&
						(
							<>
								<Flex
									gap={4}
									alignItems='baseline'
									wrap='wrap'>
									<Text variant='v2_subheading'>
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
													<Text variant='v2_subheading'>
														,
													</Text>
												</>
											)
										})
									}

								</Flex>
								<Flex
									gap={4}
									alignItems='baseline'>
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
						position='absolute'
						bottom='50px'>
						<Button
							variant='link'
							onClick={() => setStep(3)}>
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
							Continue

						</Button>
					</Flex>


				</Flex>
			</>
		)
	}

	const [rubricInputValues, setRubricInputValues] = useState<DynamicInputValues>({ 0: 'Team competence', 1: 'Idea Quality', 2: 'Relevance to our ecosystem' })
	const [rubricsCounter, setRubricsCounter] = useState(3)

	const reviewMechanismOptions = [{ label: 'Voting', value: 'Voting' }, { label: 'Rubric', value: 'Rubric' }, { label: 'Community voting', value: 'Community voting', isDisabled: true }]

	const handleClick = () => {
		setRubricsCounter(rubricsCounter + 1)
	}

	const handleOnChangeReviewMechanismOption = (item: any) => {
		// console.log('review changes to', item)
		setReviewMechanism(item.value)
	}

	const handleOnClickContinue = () => {
		setStep(3)
		const rubrics: { [key: number]: { title: string, details: string, maximumPoints: number } } = {}
		Object.keys(rubricInputValues).forEach((key, index) => {
			rubrics[index] = {
				title: rubricInputValues[index],
				details: '',
				maximumPoints: 5
			}

		})
		setRubrics(rubrics)
	}

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const inputValues: DynamicInputValues = {}
		inputValues[index] = e.target.value
		setRubricInputValues({ ...rubricInputValues, ...inputValues })
	}


	return buildComponent()

}


export default ProposalReview
