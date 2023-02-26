import { ChangeEvent, useContext, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { Button, Flex, Icon, Text, useMediaQuery } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
import { WebwalletContext } from 'src/pages/_app'
import SelectDropdown from 'src/screens/request_proposal/_components/SelectDropdown'
import { DropdownOption, RFPFormType } from 'src/screens/request_proposal/_utils/types'

interface Props {
	payoutMode: DropdownOption
	setPayoutMode: (value: DropdownOption) => void
	amount: number
	setAmount: (value: number) => void
	step: number
	milestones: Array<string>
	setMilestones: (value: Array<string>) => void
	createRFP: () => void
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
		milestones,
		setMilestones,
		createRFP,
		rfpFormSubmissionType,
		handleOnEdit,
		updateRFP
	}: Props) {
	const buildComponentForSmallScreen = () => {
		// eslint-disable-next-line no-restricted-syntax
		enum PayoutMode {
			IN_ONE_GO = 'in one go',
			BASED_ON_MILESTONE = 'based on milestone'
		}
		return (
			<>
				{/* Start Proposal Submission Component */}
				<Flex alignSelf='flex-start'>
					{
						bigScreen[0] && (
							<Button
								className='backBtn'
								variant='linkV2'
								leftIcon={<BsArrowLeft />}
								onClick={() => setCreatingProposalStep(2)}>
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
						alignItems='center'
						flexDirection='column'
					>
						<Text
							variant='subheading'
						>
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

					{
						(payoutMode.label === PayoutMode.BASED_ON_MILESTONE) && (
							<>

								{
									Array.from(Array(milestoneCounter)).map((c, index) => {
										return (
											<>
												<Flex
													gap={4}
													alignItems='baseline'>
													<Text
														variant='heading3'
														color='gray.4'>
														{index < 9 ? `0${index + 1}` : (index + 1)}
													</Text>
													{/* <FlushedInput
														placeholder='Add milestone'
														value={milestones[index]}
														onChange={(e) => handleOnChange(e, index)} /> */}
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
									alignItems='center'>
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
						flexDirection='column'
						alignItems='center'
					>
						<Text variant='subheading'>
							Per proposal payout is capped at
						</Text>
						<Flex
							gap={4}
							alignItems='baseline'>

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
							<Text variant='subheading'>
								USD.
							</Text>
						</Flex>
					</Flex>
					<Text
						as='i'
						color='black.3'
						alignSelf='center'
					>
						Note: You can payout in any token.
					</Text>
					{/* CTA */}
					<Flex
						gap={8}
						width='100%'
						justifyContent='center'
						// position='absolute'
						// bottom='50px'
					>
						<Button
							className='continueBtn'
							variant='primaryMedium'
							w='261px'
							h='48px'
							onClick={handleOnClickContinue}
							isDisabled={!payoutMode || !amount}
						>
							{/* {shouldCreateRFP ? 'Create RFP' : 'Continue'} */}
							{ rfpFormSubmissionType === 'edit' ? 'Save All' : 'Create grant program'}
						</Button>
					</Flex>
				</Flex>
			</>
		)
	}

	const buildComponentForBigScreen = () => {
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
								setCreatingProposalStep(2)
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
						<Text variant='subheading'>
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

					{
						(payoutMode.label === PayoutMode.BASED_ON_MILESTONE) && (
							<>

								{
									Array.from(Array(milestoneCounter)).map((c, index) => {
										return (
											<>
												<Flex
													gap={4}
													alignItems='baseline'>
													<Text
														variant='heading3'
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
						<Text variant='subheading'>
							Per proposal payout is capped at
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
						<Text variant='subheading'>
							USD.
						</Text>
					</Flex>
					<Text
						as='i'
						color='black.3'
					>
						Note: You can payout in any token.
					</Text>
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
							w='261px'
							h='48px'
							onClick={handleOnClickContinue}
							isDisabled={!payoutMode || !amount}
						>
							{/* {shouldCreateRFP ? 'Create RFP' : 'Continue'} */}
							{ rfpFormSubmissionType === 'edit' ? 'Save All' : 'Create grant program'}
						</Button>
					</Flex>
				</Flex>
			</>
		)
	}

	const { setCreatingProposalStep } = useContext(WebwalletContext)!
	const [milestoneCounter, setMilestoneCounter] = useState(!milestones ? 0 : milestones.length)

	const payoutTypeOptions = [{ value: 'in_one_go', label: 'in one go' }, { value: 'milestones', label: 'based on milestone' }]

	const bigScreen = useMediaQuery('(min-width:601px)')

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleOnChangePayoutTypeOption = (item: any) => {
		// console.log('payout changes to', item)
		setPayoutMode({
			label: item.label,
			value: item.value,
		})
		handleOnEdit('payoutMode', item.value)
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
		logger.info({ rfpFormSubmissionType }, 'rfpFormSubmissionType')
		if(rfpFormSubmissionType === 'edit') {
			updateRFP()
		} else {
			createRFP()
		}
	}

	if(bigScreen[0]) {
		return buildComponentForBigScreen()
	}

	return buildComponentForSmallScreen()

}

export default Payouts