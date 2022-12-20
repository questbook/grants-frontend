import { ChangeEvent, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { Button, Flex, Text } from '@chakra-ui/react'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import StepIndicator from 'src/libraries/ui/StepIndicator'
import { DynamicInputValues } from 'src/types'

import SelectDropdown from '/src/screens/request_proposal/_components/SelectDropdown'

interface Props {
	payoutMode: string
	setPayoutMode: (value: string) => void
	amount: number
	setAmount: (value: number) => void
	step: number
	setStep: (value: number) => void
	milestones: Array<string>
	setMilestones: (value: Array<string>) => void
}


function Payouts(
	{
		payoutMode,
		setPayoutMode,
		amount,
		setAmount,
		step,
		setStep,
		setMilestones
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
						onClick={() => setStep(2)}>
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
					<StepIndicator step={step} />
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
							onChange={(item) => handleOnChangePayoutTypeOption(item)}

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
						payoutMode === PayoutMode.BASED_ON_MILESTONE && (
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
														value={milestoneInputValues[index]}
														onChange={(e) => handleOnChange(e, index)} />
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
							onChange={(e) => setAmount(parseInt(e.target.value))} />
						<Text variant='v2_subheading'>
							USD. You can payout in any token.
						</Text>
					</Flex>

					{/* CTA */}
					<Flex
						gap={8}
						width='100%'
						justifyContent='flex-end'
						position='absolute'
						bottom='50px' >
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
							isDisabled={!payoutMode || !amount}
						>
							Continue
						</Button>
					</Flex>
				</Flex>
			</>
		)
	}

	const [milestoneInputValues, setMilestoneInputValues] = useState<{ [key: number]: string }>({})
	const [milestoneCounter, setMilestoneCounter] = useState(0)

	const payoutTypeOptions = [{ value: 'in_one_go', label: 'in one go' }, { value: 'milestones', label: 'based on milestone' }]

	const handleOnChangePayoutTypeOption = (item: any) => {
		// console.log('payout changes to', item)
		setPayoutMode(item.label)
	}

	const handleClick = () => {
		setMilestoneCounter(milestoneCounter + 1)
	}

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const milestones: DynamicInputValues = {}
		milestones[index] = e.target.value
		setMilestoneInputValues({ ...milestoneInputValues, ...milestones })
	}

	const handleOnClickContinue = () => {
		setStep(4)
		const keys = Object.keys(milestoneInputValues)
		const milestones = []
		for(let i = 0; i < keys.length; i++) {
			milestones.push(milestoneInputValues[i])
		}

		setMilestones(milestones)
	}


	return buildComponent()


}

export default Payouts