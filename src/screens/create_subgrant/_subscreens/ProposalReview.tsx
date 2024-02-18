import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Text } from '@chakra-ui/react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import { WebwalletContext } from 'src/pages/_app'
import SelectDropdown from 'src/screens/create_subgrant/_components/SelectDropdown'
import StepIndicator from 'src/screens/create_subgrant/_components/StepIndicator'
import { RFPFormContext } from 'src/screens/create_subgrant/Context'
import { ApplicantDetailsFieldType } from 'src/types'

function ProposalReview() {
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
						<SelectDropdown
							options={reviewMechanismOptions}
							placeholder='Select One'
							value={{ label: reviewMechanismOptions.find(opt => opt.value === rfpData?.reviewMechanism)?.label ?? '', value: rfpData?.reviewMechanism }}
							onChange={
								(item) => {
									handleOnEdit('reviewMechanism', item?.value!)
								}
							}
						/>
					</Flex>

					{/* Rubric Selected */}
					{
						rfpData?.reviewMechanism === 'rubrics'
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
					>
						<Button
							variant='link'
							onClick={
								() => {
									handleOnEdit('reviewMechanism', '')
									setCreatingProposalStep(3)
								}
							}>
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
							isDisabled={!rfpData?.reviewMechanism} >
							{ rfpFormType === 'edit' ? 'Save & Continue' : 'Continue'}
						</Button>
					</Flex>


				</Flex>
			</>
		)
	}

	const { rfpData, setRFPData, rfpFormType } = useContext(RFPFormContext)!

	const [rubricInputValues, setRubricInputValues] = useState<string[]>(['Team competence', 'Idea Quality', 'Relevance to our ecosystem'])
	const [rubricsCounter, setRubricsCounter] = useState(rubricInputValues.length)
	const { setCreatingProposalStep } = useContext(WebwalletContext)!
	const reviewMechanismOptions = [{ label: 'Voting', value: 'voting' }, { label: 'Rubric', value: 'rubrics' }, { label: 'Community voting', value: 'Community voting', isDisabled: true }]
	const bigScreen = useMediaQuery('(min-width:601px)')

	useEffect(() => {
		if(rfpFormType === 'edit') {
			setRubricsCounter(rfpData?.rubrics?.length)
			const rubrics = rfpData?.rubrics?.map(rubric => rubric)
			setRubricInputValues(rubrics.length > 0 ? rubrics : ['Team competence', 'Idea Quality', 'Relevance to our ecosystem'])
		}
	}, [])

	const handleClick = () => {
		setRubricsCounter(rubricsCounter + 1)
	}

	const handleOnClickContinue = () => {
		// setStep(3)
		setCreatingProposalStep(3)
		const rubrics: { [key: number]: { title: string, details: string, maximumPoints: number } } = {}
		if(rfpData?.reviewMechanism === 'voting') {
			rubrics[0] = {
				title: 'Vote for',
				details: '',
				maximumPoints: 1
			}
		} else if(rfpData?.reviewMechanism === 'rubrics') {
			Object.keys(rubricInputValues).forEach((key, index) => {
				rubrics[index] = {
					title: rubricInputValues[index],
					details: '',
					maximumPoints: 5
				}
			})
		}

		logger.info('Setting rubrics: ', rubrics)
		handleOnEdit('rubrics', rubrics)
	}

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const inputValues: string[] = [...rubricInputValues]
		inputValues[index] = e.target.value
		setRubricInputValues(inputValues)
	}

	const handleOnEdit = (field: string, value: string | ApplicantDetailsFieldType[] | string [] | { [key: number]: { title: string, details: string, maximumPoints: number } }) => {
		logger.info('rfp edited', { field, value }, { ...rfpData, [field]: value })
		setRFPData({ ...rfpData, [field]: value })
	}

	return buildComponent()
}

export default ProposalReview
