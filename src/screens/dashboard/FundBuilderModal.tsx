import { useContext, useEffect, useMemo } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { useSafeContext } from 'src/contexts/safeContext'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
import { getFieldString } from 'src/utils/formattingUtils'

function FundBuilderModal() {
	const buildComponent = () => {
		return (
			<Modal
				isOpen={isModalOpen}
				size='2xl'
				onClose={
					() => {
						setIsModalOpen(false)
					}
				}
				isCentered
				scrollBehavior='outside'>
				<ModalOverlay />
				<ModalContent>
					<ModalCloseButton />
					<ModalBody>
						{
							['unverified', 'verified'].includes(signerVerifiedState) && (
								<Flex
									p={6}
									direction='column'
									align='center'
									w='100%'>
									<Text fontWeight='500'>
										Fund Builder
									</Text>
									<Flex
										mt={7}
										w='100%'
										justify='center'
										align='start'>
										<Text>
											$
										</Text>
										<FlushedInput
											borderBottom='2px solid'
											textPadding={1}
											type='number'
											value={amounts?.[0]}
											onChange={
												(e) => {
													const val = parseFloat(e.target.value)
													setAmounts([val])
												}
											}
											placeholder='0' />
									</Flex>
									<Text
										color='#53514F'
										fontSize='14px'
										mt='8px'>
										≈ 0.11 MATIC
									</Text>
									{
										proposal && (
											<Flex
												mt={6}
												w='100%'
												direction='column'
												border='1px solid #E7E4DD'>
												<PayFromChoose />
												<PayWithChoose />
												<ToChoose
													type='single'
													proposal={proposal}
													index={0} />
												<MilestoneChoose
													proposal={proposal}
													index={0} />
											</Flex>
										)
									}

									<Button
										isDisabled={isDisabled}
										mt={8}
										w='100%'
										variant='primaryLarge'
										onClick={onContinue}>
										<Text
											fontWeight='500'
											color='white'>
											{signerVerifiedState === 'unverified' ? 'Continue' : 'Initiate Transaction'}
										</Text>
									</Button>
								</Flex>
							)
						}

						{
							!['unverified', 'verified'].includes(signerVerifiedState) && (
								<Verify
									signerVerifiedState={signerVerifiedState}
									setSignerVerifiedState={setSignerVerifiedState} />
							)
						}

					</ModalBody>
				</ModalContent>
			</Modal>
		)
	}

	const { safeObj } = useSafeContext()
	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const {
		isModalOpen,
		setIsModalOpen,
		amounts,
		setAmounts,
		milestoneIndices,
		setMilestoneIndices,
		tos,
		setTos,
		tokenInfo,
		signerVerifiedState,
		setSignerVerifiedState
	} = useContext(FundBuilderContext)!

	console.log('tokenInfo', tokenInfo)

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	useEffect(() => {
		if(!proposal) {
			return
		}

		setTos([getFieldString(proposal, 'applicantAddress') ?? tos?.[0]])
		setMilestoneIndices([0])
	}, [proposal])

	const isDisabled = useMemo(() => {
		return !proposal || amounts?.[0] === undefined || !tos?.[0] || milestoneIndices?.[0] === undefined || !tokenInfo || amounts?.[0] <= 0
	}, [amounts, tos, milestoneIndices, tokenInfo])

	const onContinue = async() => {
		if(signerVerifiedState === 'unverified') {
			setSignerVerifiedState('initiate_verification')
		}

		if(signerVerifiedState === 'verified') {
			const temp = [{
				from: safeObj?.safeAddress?.toString(),
				to: tos?.[0],
				applicationId: proposal?.id,
				selectedMilestone: milestoneIndices?.[0],
				selectedToken: { name: tokenInfo?.tokenName, info: tokenInfo?.info },
				amount: amounts?.[0],
			}]

			const proposaladdress = await safeObj?.proposeTransactions('', temp, '')
			logger.info({ proposaladdress }, 'Transaction initiated')
		}
	}

	useEffect(() => {
		console.log('signerVerifiedState', signerVerifiedState)
	}, [signerVerifiedState])

	return buildComponent()
}

export default FundBuilderModal