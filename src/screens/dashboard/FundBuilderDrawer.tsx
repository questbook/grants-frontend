import { useContext, useMemo } from 'react'
import { Box, Button, Drawer, DrawerCloseButton, DrawerContent, DrawerOverlay, Flex, Text } from '@chakra-ui/react'
import logger from 'src/libraries/logger'
import PayFromChoose from 'src/screens/dashboard/_components/FundBuilder/PayFromChoose'
import PayWithChoose from 'src/screens/dashboard/_components/FundBuilder/PayWithChoose'
import ProposalDetails from 'src/screens/dashboard/_components/FundBuilder/ProposalDetails'
import ToChoose from 'src/screens/dashboard/_components/FundBuilder/ToChoose'
import Verify from 'src/screens/dashboard/_components/FundBuilder/Verify'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext, FundBuilderContext } from 'src/screens/dashboard/Context'

function FundBuilderDrawer() {
	const buildComponent = () => {
		return (
			<Drawer
				isOpen={isDrawerOpen}
				placement='right'
				onClose={() => setIsDrawerOpen(false)}
				size='lg' >
				<DrawerOverlay />
				<DrawerCloseButton />
				<DrawerContent m={4}>
					{
						['unverified', 'verified_safe', 'verified_phantom'].includes(signerVerifiedState) && (
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
												index={index} />
										))
									}
								</Flex>

								<Box mt='auto' />

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
				</DrawerContent>
			</Drawer>
		)
	}

	const { isDrawerOpen, setIsDrawerOpen, amounts, tos, milestoneIndices, tokenInfo, signerVerifiedState, setSignerVerifiedState } = useContext(FundBuilderContext)!

	const { proposals, selectedProposals } = useContext(DashboardContext)!
	const selectedProposalsData = useMemo(() => {
		if(!proposals || !selectedProposals) {
			return []
		}

		const p: ProposalType[] = []
		for(let i = 0; i < proposals.length; i++) {
			if(selectedProposals[i]) {
				p.push(proposals[i])
			}
		}

		return p
	}, [proposals, selectedProposals])

	const isDisabled = useMemo(() => {
		logger.info({ 1: !selectedProposalsData, 2: !amounts?.every((amt) => amt !== undefined && amt > 0), 3: !tos?.every((to) => to !== undefined), 4: !milestoneIndices?.every((mi) => mi !== undefined), 5: !tokenInfo, amounts, tos, milestoneIndices, tokenInfo }, 'Is Disabled Drawer')
		return !selectedProposalsData || !amounts?.every((amt) => amt !== undefined && amt > 0) || !tos?.every((to) => to !== undefined) || !milestoneIndices?.every((mi) => mi !== undefined) || !tokenInfo
	}, [selectedProposalsData, amounts, tos, milestoneIndices, tokenInfo])

	const onContinue = () => {
		if(signerVerifiedState === 'unverified') {
			setSignerVerifiedState('initiate_verification')
			return
		}
	}

	return buildComponent()
}

export default FundBuilderDrawer