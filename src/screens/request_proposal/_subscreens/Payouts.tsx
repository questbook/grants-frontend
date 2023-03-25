import { ChangeEvent, useContext } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { BsArrowLeft } from 'react-icons/bs'
import { IoMdClose } from 'react-icons/io'
import { Button, Flex, Icon, Text, useMediaQuery } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import NetworkTransactionFlowStepperModal from 'src/libraries/ui/NetworkTransactionFlowStepperModal'
import { getExplorerUrlForTxHash } from 'src/libraries/utils/formatting'
import { GrantsProgramContext, SignInContext, SignInTitleContext, WebwalletContext } from 'src/pages/_app'
import SelectDropdown from 'src/screens/request_proposal/_components/SelectDropdown'
import StepIndicator from 'src/screens/request_proposal/_components/StepIndicator'
import useCreateRFP from 'src/screens/request_proposal/_hooks/useCreateRFP'
import useUpdateRFP from 'src/screens/request_proposal/_hooks/useUpdateRFP'
import { RFPFormContext } from 'src/screens/request_proposal/Context'
import { ApplicantDetailsFieldType } from 'src/types'

function Payouts() {
	const buildComponent = () => {
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
								onClick={
									() => {
										setCreatingProposalStep(2)
									}
								}>
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
					marginRight={bigScreen[0] ? 24 : 0}
				>
					<StepIndicator />
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
						alignItems={bigScreen[0] ? 'baseline' : 'center'}
						direction={bigScreen[0] ? 'row' : 'column'}>
						<Text variant='subheading'>
							Accepted Proposals are paid out
						</Text>

						<SelectDropdown
							options={payoutTypeOptions}
							value={{ label: payoutTypeOptions.find(opt => opt.value === rfpData?.payoutMode)?.label ?? '', value: rfpData?.payoutMode }}
							onChange={
								(item) => {
									handleOnEdit('payoutMode', item?.value!)
								}
							}
						/>
					</Flex>

					{
						(rfpData?.payoutMode === 'milestones') && (
							<>

								{
									rfpData?.milestones?.map((c, index) => {
										return (
											<>
												<Flex
													gap={4}
													alignItems='baseline'>
													<Text
														variant='heading3'
														color='gray.400'>
														{index < 9 ? `0${index + 1}` : (index + 1)}
													</Text>
													{
														bigScreen[0] && (
															<FlushedInput
																placeholder='Add milestone'
																value={rfpData?.milestones[index]}
																onChange={(e) => handleOnChange(e, index)} />
														)
													}
													<Icon
														as={IoMdClose}
														cursor='pointer'
														onClick={
															() => {
																const milestonesCopy = [...rfpData?.milestones].filter((m, i) => i !== index)
																handleOnEdit('milestones', milestonesCopy)
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
									alignItems={bigScreen[0] ? 'baseline' : 'center'}>
									<Button
										variant='outline'
										leftIcon={<AiOutlinePlus />}
										borderColor='black'
										isDisabled={rfpData?.payoutMode !== 'milestones' || rfpData?.milestones?.some(m => m === '')}
										onClick={
											() => {
												if(!rfpData?.milestones) {
													handleOnEdit('milestones', [''])
													return
												}

												const milestones = [...rfpData?.milestones, '']
												logger.info({ milestones }, 'Current milestones')
												handleOnEdit('milestones', milestones)
											}
										}>
										Add another milestone
									</Button>
								</Flex>
							</>
						)
					}

					<Flex
						gap={bigScreen[0] ? 4 : 0}
						direction={bigScreen[0] ? 'row' : 'column'}
						alignItems={bigScreen[0] ? 'baseline' : 'center'}>
						<Text variant='subheading'>
							Per proposal payout is capped at
						</Text>
						<FlushedInput
							placeholder='enter your grant’s sweetspot'
							type='number'
							value={rfpData?.amount}
							onChange={
								(e) => {
									handleOnEdit('amount', e.target.value)
								}
							} />
						<Text variant='subheading'>
							USD.
						</Text>
					</Flex>
					<Text
						as='i'
						color='black.300'
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
							isLoading={(rfpFormType === 'edit' ? updateStep : createStep) !== undefined}
							loadingText='Creating grant program'
							isDisabled={!rfpData?.payoutMode || !rfpData?.amount}
						>
							{/* {shouldCreateRFP ? 'Create RFP' : 'Continue'} */}
							{ rfpFormType === 'edit' ? 'Save All' : 'Create grant program'}
						</Button>
					</Flex>
				</Flex>
				<NetworkTransactionFlowStepperModal
					isOpen={(rfpFormType === 'edit' ? updateStep : createStep) !== undefined}
					currentStepIndex={(rfpFormType === 'edit' ? updateStep : createStep) || 0}
					viewTxnLink={getExplorerUrlForTxHash(chainId, (rfpFormType === 'edit' ? updateTxHash : createTxHash))}
					onClose={
						async() => {
							setRole('admin')
							router.push({
								pathname: '/dashboard',
								query: {
									grantId: grantId.toLowerCase(),
									chainId,
									role: 'admin'
								}
							})
						}
					}
					customStepsHeader={rfpFormType === 'edit' ? updateRFPStepsHeader : customStepsHeader}
					customSteps={customSteps}
				/>
			</>
		)
	}

	const customStepsHeader = ['Creating your grant program on chain']
	const updateRFPStepsHeader = ['Updating your grant program on chain']
	const customSteps = ['Submitting transaction on chain', 'Uploading data to decentralized storage', 'Indexing the data to a subgraph']

	const { setRole } = useContext(GrantsProgramContext)!
	const { grantId, rfpData, setRFPData, rfpFormType, chainId } = useContext(RFPFormContext)!
	const { webwallet, setCreatingProposalStep } = useContext(WebwalletContext)!
	const { setSignIn } = useContext(SignInContext)!
	const { setSignInTitle } = useContext(SignInTitleContext)!
	// const [milestoneCounter, setMilestoneCounter] = useState(!rfpData?.milestones ? 0 : rfpData?.milestones.length)
	const payoutTypeOptions = [{ value: 'in_one_go', label: 'In One Go' }, { value: 'milestones', label: 'Based on Milestones' }]

	const { createRFP, currentStep: createStep, txHash: createTxHash } = useCreateRFP()
	const { updateRFP, currentStep: updateStep, txHash: updateTxHash } = useUpdateRFP()

	const router = useRouter()
	const bigScreen = useMediaQuery('(min-width:601px)')

	const handleOnChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		const _milestones: string[] = [...rfpData?.milestones]
		if(index < _milestones.length) {
			_milestones[index] = e.target.value
			handleOnEdit('milestones', [..._milestones])
		} else {
			_milestones.push(e.target.value)
			handleOnEdit('milestones', [..._milestones])
		}
	}

	const handleOnClickContinue = () => {
		logger.info({ rfpFormType, rfpData }, 'rfpFormType')
		if(!webwallet) {
			setSignInTitle('default')
			setSignIn(true)
			return
		}

		if(rfpFormType === 'edit') {
			updateRFP()
		} else {
			createRFP()
		}
	}

	const handleOnEdit = (field: string, value: string | ApplicantDetailsFieldType[] | string []) => {
		logger.info('rfp edited', { ...rfpData, [field]: value })
		setRFPData({ ...rfpData, [field]: value })
	}

	return buildComponent()

}

export default Payouts