import { useContext, useMemo, useState } from 'react'
import { Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react'
import { useSafeContext } from 'src/contexts/safeContext'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ProposalDetails from 'src/screens/dashboard/_components/FundBuilder/ProposalDetails'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import TransactionInitiated from 'src/screens/dashboard/_components/FundBuilder/TransactionInitiated'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import VerifyDrawer from 'src/screens/dashboard/_components/FundBuilder/VerifyDrawer'
import usePhantomWallet from 'src/screens/dashboard/_hooks/usePhantomWallet'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'
import { getGnosisTansactionLink } from 'src/v2/utils/gnosisUtils'
import { getProposalUrl } from 'src/v2/utils/phantomUtils'

function FundBuilderDrawer() {
	const buildComponent = () => {
		return (
			<>
				<Drawer
					isOpen={isDrawerOpen}
					placement='right'
					onClose={
						() => {
							setIsDrawerOpen(false)
							setSignerVerifiedState('unverified')
						}
					}
					size='lg' >
					<DrawerOverlay />
					<DrawerCloseButton />
					<DrawerContent m={4}>
						{
							['unverified', 'verified'].includes(signerVerifiedState) && (
								<Flex
									p={6}
									direction='column'
									align='center'
									w='100%'
									h='100%'>
									<Text fontWeight='500'>
										Fund Builders
									</Text>

									<Flex
										mt={6}
										w='100%'
										h='100%'
										direction='column'
										border='1px solid #E7E4DD'
										overflowY='auto'>
										<PayFromChoose />
										<PayWithChoose />
										<ToChoose type='multi' />
										{
											selectedProposalsData?.map((selectedProposalData, index) => (
												<ProposalDetails
													key={selectedProposalData.id}
													proposal={selectedProposalData}
													index={index}
													tokenInfo={tokenInfo} />
											))
										}
									</Flex>

									<Box mt='auto' />

									{
										signerVerifiedState === 'verified' ? (
											<Button
												isDisabled={isDisabled}
												mt={8}
												w='100%'
												variant='primaryLarge'
												onClick={onInitiateTransaction}>
												<Text
													fontWeight='500'
													color='white'>
													Initiate Transaction
												</Text>
											</Button>
										) : (
											<Button
												isDisabled={isDisabled}
												mt={8}
												w='100%'
												variant='primaryLarge'
												onClick={onContinue}>
												<Text
													fontWeight='500'
													color='white'>
													Continue
												</Text>
											</Button>
										)
									}
								</Flex>
							)
						}

						{
							['initiate_verification', 'verifying', 'failed' ].includes(signerVerifiedState) && (
								<VerifyDrawer
									signerVerifiedState={signerVerifiedState}
									setSignerVerifiedState={setSignerVerifiedState} />
							)
						}
					</DrawerContent>
				</Drawer>

				{
					['transaction_initiated'].includes(signerVerifiedState) && (
						<Modal
							isOpen={isModalOpen}
							size='2xl'
							onClose={
								() => {
									setIsModalOpen(false)
									setSignerVerifiedState('unverified')
								}
							}
							isCentered
							scrollBehavior='outside'>
							<ModalOverlay />
							<ModalContent>
								<ModalCloseButton />
								<ModalBody>

									<TransactionInitiated
										safeProposalLink={safeProposalLink!} />

								</ModalBody>
							</ModalContent>
						</Modal>
					)
				}
			</>
		)
	}

	const { safeObj } = useSafeContext()
	const {
		isModalOpen,
		setIsModalOpen,
		isDrawerOpen,
		setIsDrawerOpen,
		amounts,
		tos,
		milestoneIndices,
		tokenInfo,
		signerVerifiedState,
		setSignerVerifiedState
	} = useContext(FundBuilderContext)!
	const { phantomWallet } = usePhantomWallet()
	const [safeProposalAddress, setSafeProposalAddress] = useState<string | undefined>(undefined)
	const [safeProposalLink, setSafeProposalLink] = useState<string | undefined>(undefined)

	const { proposals, selectedProposals, selectedGrant } = useContext(DashboardContext)!
	const selectedProposalsData = useMemo(() => {
		if(!proposals || !selectedProposals) {
			return []
		}

		const p: ProposalType[] = []
		for(let i = 0; i < proposals.length; i++) {
			if(selectedProposals[i]) {
				console.log('proposals[i]', proposals[i])
				p.push(proposals[i])
			}
		}

		return p
	}, [proposals, selectedProposals])

	const isDisabled = useMemo(() => {
		return !selectedProposalsData || !amounts?.every((amt) => amt !== undefined && amt > 0) || !tos?.every((to) => to !== undefined) || !milestoneIndices?.every((mi) => mi !== undefined) || !tokenInfo
	}, [selectedProposalsData, amounts, tos, milestoneIndices, tokenInfo])

	const onContinue = () => {
		if(signerVerifiedState === 'unverified') {
			setSignerVerifiedState('initiate_verification')
			return
		}
	}

	const onInitiateTransaction = async() => {
		if(signerVerifiedState === 'verified') {
			const temp = [{
				from: safeObj?.safeAddress?.toString(),
				to: tos?.[0],
				applicationId: proposals[0]?.id,
				selectedMilestone: milestoneIndices?.[0],
				selectedToken: { tokenName: tokenInfo?.tokenName, info: tokenInfo?.info },
				amount: amounts?.[0],
			}]

			let proposaladdress = ''
			if(safeObj.getIsEvm()) {
				proposaladdress = await safeObj?.proposeTransactions('', temp, '')
				setSignerVerifiedState('transaction_initiated')
				setIsDrawerOpen(false)
				setIsModalOpen(true)
				setSafeProposalAddress(proposaladdress)
				setSafeProposalLink(getGnosisTansactionLink(safeObj?.safeAddress, safeObj?.chainId))
			} else {
				proposaladdress = await safeObj?.proposeTransactions(selectedGrant?.title, temp, phantomWallet)
				setSignerVerifiedState('transaction_initiated')
				setIsDrawerOpen(false)
				setIsModalOpen(true)
				setSafeProposalAddress(proposaladdress)
				setSafeProposalLink(getProposalUrl(safeObj.safeAddress, proposaladdress))
			}

			// disburseRewardFromSafe(proposaladdress?.toString()!)
			// 	.then(() => {
			// 	// console.log('Sent transaction to contract - EVM', proposaladdress)
			// 	})
			// 	.catch((err) => {
			// 		console.log('sending transction error:', err)
			// 	})
		}
	}

	return buildComponent()
}

export default FundBuilderDrawer