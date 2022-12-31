import { ChangeEvent, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { Button, Flex, Icon, Text } from '@chakra-ui/react'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
import SelectDropdown from 'src/screens/request_proposal/_components/SelectDropdown'
import { DropdownOption, RFPFormType } from 'src/screens/request_proposal/_utils/types'

interface Props {
	payoutMode: DropdownOption
	setPayoutMode: (value: DropdownOption) => void
	amount: number
	setAmount: (value: number) => void
	step: number
	setStep: (value: number) => void
	milestones: Array<string>
	setMilestones: (value: Array<string>) => void
	shouldCreateRFP: boolean
	createRFP: () => void
	setOpenNetworkTransactionModal: (value: boolean) => void
	rfpFormSubmissionType: RFPFormType
	handleOnEdit: (fieldName: string, value: string | string []) => void
	updateRFP: () => void
}


function Payouts(
	{
		payoutMode,
		setPayoutMode,
		amount,
		setAmount,
		step,
		setStep,
		milestones,
		setMilestones,
		shouldCreateRFP,
		createRFP,
		setOpenNetworkTransactionModal,
		rfpFormSubmissionType,
		handleOnEdit,
		updateRFP
	}: Props) {
	const buildComponent = () => {
		// eslint-disable-next-line no-restricted-syntax
		enum PayoutMode {
			IN_ONE_GO = 'in one go',
			BASED_ON_MILESTONE = 'based on milestone'
		}
		return (
			<>
				{/* Start Proposal Submission Component */}
				<Flex alignSelf='flex-start'>
					<Button
						className='backBtn'
						variant='linkV2'
						leftIcon={<BsArrowLeft />}
						onClick={
							() => {
								if(rfpFormSubmissionType === 'edit') {
									setStep(1)
								} else {
									setStep(2)
								}
							}
						}>
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
					<StepIndicator
						step={step}
						formType={rfpFormSubmissionType} />
					<Text
						alignSelf='center'
						fontWeight='500'
						fontSize='24px'
						lineHeight='32px'
					>
						How will builders be paid?
					</Text>

					<Flex
						gap={4}
						alignItems='baseline'>
						<Text variant='v2_subheading'>
							Accepted Proposals are paid out
						</Text>
						{/* <FlushedInput
							placeholder='select one'
							isDisabled={true}
							value={payoutMode}
							onChange={(e) => setPayoutMode(e.target.value)} /> */}

						<SelectDropdown
							options={payoutTypeOptions}
							value={payoutMode}
							onChange={
								(item) => {
									handleOnChangePayoutTypeOption(item)
									handleOnEdit('payoutMode', item?.value!)
								}
							}

						/>
					</Flex>

					{/* <Flex
						gap={4}
						alignItems='baseline'>
						<Button
							variant='outline'
							leftIcon={<AiOutlinePlus />}
							borderColor='black'
							onClick={() => setPayoutMode('in one go')}>
							in one go
						</Button>
						<Button
							variant='outline'
							leftIcon={<AiOutlinePlus />}
							borderColor='black'
							onClick={
								() => {
									setPayoutMode('based on milestone'); handleClick()
								}
							}>
							based on milestone
						</Button>
					</Flex> */}

					{
						payoutMode.label === PayoutMode.BASED_ON_MILESTONE && (
							<>

								{
									Array.from(Array(milestoneCounter)).map((c, index) => {
										return (
											<>
												<Flex
													gap={4}
													alignItems='baseline'>
													<Text
														variant='v2_heading_3'
														color='gray.4'>
														{index < 9 ? `0${index + 1}` : (index + 1)}
													</Text>
													<FlushedInput
														placeholder='Add milestone'
														value={milestones[index]}
														onChange={(e) => handleOnChange(e, index)} />
													<Icon
														as={IoMdClose}
														cursor='pointer'
														onClick={
															() => {
																if(milestoneCounter > 0) {
																	setMilestoneCounter(milestoneCounter - 1)
																}

																setMilestones(milestones.filter((_, i) => i !== index))

															}
														}
														// onMouseOver={() => setShowCrossIcon(true)}
													/>
												</Flex>
											</>
										)
									})
								}
								<Flex
									gap={4}
									alignItems='baseline'>
									<Button
										variant='outline'
										leftIcon={<AiOutlinePlus />}
										borderColor='black'
										onClick={() => handleClick()}>
										Add another milestone
									</Button>
								</Flex>
							</>
						)
					}

					<Flex
						gap={4}
						alignItems='baseline'>
						<Text variant='v2_subheading'>
							Proposals should ideally ask for an amount around
						</Text>
						<FlushedInput
							placeholder='enter your grant’s sweetspot'
							type='number'
							value={amount.toString()}
							onChange={
								(e) => {
									setAmount(parseInt(e.target.value))
									handleOnEdit('amount', e.target.value)
								}
							} />
						<Text variant='v2_subheading'>
							USD. You can payout in any token.
						</Text>
					</Flex>

					{/* CTA */}
					<Flex
						gap={8}
						width='100%'
						justifyContent='flex-end'
						// position='absolute'
						// bottom='50px'
					>
						<Button
							className='continueBtn'
							variant='primaryMedium'
							w='166px'
							h='48px'
							onClick={
								() => {
									shouldCreateRFP ? handleCreateRFP() : handleOnClickContinue()
								}
							}
							isDisabled={!payoutMode || !amount}
						>
							{/* {shouldCreateRFP ? 'Create RFP' : 'Continue'} */}
							{ rfpFormSubmissionType === 'edit' ? 'Save All' : 'Continue'}
						</Button>
					</Flex>
				</Flex>
			</>
		)
	}

	const [milestoneCounter, setMilestoneCounter] = useState(milestones.length)

	const payoutTypeOptions = [{ value: 'in_one_go', label: 'in one go' }, { value: 'milestones', label: 'based on milestone' }]


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleOnChangePayoutTypeOption = (item: any) => {
		// console.log('payout changes to', item)
		setPayoutMode({
			label: item.label,
			value: item.value,
		})
	}

	const handleCreateRFP = () => {
		setOpenNetworkTransactionModal(true)
		createRFP()
	}

	const handleClick = () => {
		setMilestoneCounter(milestoneCounter + 1)
	}

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const _milestones: string[] = [...milestones]
		if(index < _milestones.length) {
			_milestones[index] = e.target.value
			setMilestones(_milestones)
			handleOnEdit('milestones', [..._milestones])
		} else {
			_milestones.push(e.target.value)
			setMilestones(_milestones)
			handleOnEdit('milestones', [..._milestones])
		}


	}

	const handleOnClickContinue = () => {
		if(rfpFormSubmissionType === 'edit') {
			handleSaveChanges()
		} else {
			setStep(4)
		}
	}

	const handleSaveChanges = () => {
		setOpenNetworkTransactionModal(true)
		updateRFP()
	}

	return buildComponent()


}

export default Payouts