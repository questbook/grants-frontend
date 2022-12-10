import { useContext, useEffect, useMemo, useState } from 'react'
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import FlushedInput from 'src/libraries/ui/FlushedInput'
import MilestoneChoose from 'src/screens/dashboard/_components/FundBuilder/MilestoneChoose'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import { SignerVerifiedState } from 'src/screens/dashboard/_utils/types'
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
							['unverified', 'verified_safe', 'verified_phantom'].includes(signerVerifiedState) && (
								<Flex
									p={6}
									direction='column'
									align='center'
									w='100%'>
									<Text fontWeight='500'>
										Fund Builders
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
													const val = parseInt(e.target.value)
													setAmounts([val])
												}
											}
											placeholder='0' />
									</Flex>
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
							!['unverified', 'verified_safe', 'verified_phantom'].includes(signerVerifiedState) && (
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

	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const { isModalOpen, setIsModalOpen, amounts, setAmounts, milestoneIndices, setMilestoneIndices, tos, setTos, tokenInfo } = useContext(FundBuilderContext)!

	const [signerVerifiedState, setSignerVerifiedState] = useState<SignerVerifiedState>('unverified')

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		logger.info({ index, proposals, selectedProposals }, '(Milestone Choose) Selected index')
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

	const onContinue = () => {
		logger.info({ tokenInfo, amounts, tos, milestoneIndices }, 'onContinue')
		if(signerVerifiedState === 'unverified') {
			setSignerVerifiedState('initiate_verification')
		}
	}

	return buildComponent()
}

export default FundBuilderModal