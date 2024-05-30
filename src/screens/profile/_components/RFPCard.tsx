import { useContext } from 'react'
import { Box, Flex, Grid, GridItem, Image, Text } from '@chakra-ui/react'
import config from 'src/constants/config.json'
import { getAvatar } from 'src/libraries/utils'
import { AmplitudeContext } from 'src/libraries/utils/amplitude'
import { nFormatter } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { WebwalletContext } from 'src/pages/_app'
import { inActiveProposals } from 'src/screens/grantees/_utils/constants'
import StateButton from 'src/screens/profile/_components/stateButton'
import { BuilderProposals } from 'src/screens/profile/_utils/types'

type RFPCardProps = {
	proposal: BuilderProposals
}

function RFPCard({ proposal }: RFPCardProps) {
	const buildComponent = () => (
		<Box
			w='100%'
			h='100%'
			background='white'
			p='12px 12px 16px 12px'
			// h='13'
			position='relative'
			// boxShadow='0px 10px 18px rgba(31, 31, 51, 0.05), 0px 0px 1px rgba(31, 31, 51, 0.31);'
			borderRadius='12px'
			border='1px solid #EFEEEB'
			_hover={
				{
					border: '1px solid #E1DED9',
					boxShadow: '0px 2px 0px 0px #00000010',
				}
			}
			cursor='pointer'
			// className='dao-card'
			onClick={
				(e) => {

					// return if clicked on the link button to open the program details
					if(e.target.toString() === '[object HTMLButtonElement]') {
						return
					}

					trackAmplitudeEvent('Grant_Program_Visits', {
						programName: proposal?.grant?.title,
						isSignedIn: scwAddress ? 'true' : 'false'
					})
					window.open(`${window.location.origin}/dashboard/?grantId=${proposal.grant.id}&proposalId=${proposal.id}&chainId=10`, '_blank')
				}
			}>
			<Flex
				flexDirection='column'
				h='100%'
				gap={4}>
				<Box
					bgColor='#F7F5F2'
					// 12px, 12px, 16px, 12px
					p='12px 12px 16px 12px'
					borderRadius='8px'
				>
					<Flex
						justifyContent='space-between'
						alignItems='flex-start'
					>
						<Image
							src={proposal.grant.workspace?.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(true, proposal.grant?.title) : getUrlForIPFSHash(proposal.grant?.workspace?.logoIpfsHash!)}
							// my='8px'
							w='56px'
							h='56px'
							objectFit='cover'
							borderRadius='4px'
						/>
						<Flex gap={2}>
							<StateButton
								state={
									proposal?.state === 'approved' ?
										inActiveProposals?.includes(proposal.id) ? 'rejected' :
											proposal.milestones.filter((milestone) => milestone.amountPaid === milestone.amount).length === proposal.milestones.length ? 'approved' : 'submitted'
										: proposal?.state
								}
								title={
									proposal?.state === 'approved' ?
										inActiveProposals?.includes(proposal.id) ? 'Inactive' :
											proposal.milestones.filter((milestone) => milestone.amountPaid === milestone.amount).length === proposal.milestones.length ? 'Completed' : 'In Progress'
										: proposal?.state
								}

							/>
							{/* <Text
							variant={isOpen ? 'openTag' : 'closedTag'}
						>
							{isOpen ? 'Open' : 'Closed'}
						</Text> */}

						</Flex>

					</Flex>
					<Flex
						direction='column'
						gap={2}
					>
						<Flex
							gap={2}
							direction='column'

						>
							<Text
								color='#7E7E8F'
								fontSize='14px'
								fontWeight='500'
								noOfLines={2}
								mt={2}
							>
								{proposal.name[0].values[0].value}
							</Text>
							<Text
								variant='title'
								fontSize='18px'
								fontWeight='500'
								noOfLines={2}
								mt={2}
							>
								{proposal.grant.title}
							</Text>
						</Flex>


					</Flex>
				</Box>

				<Flex
					direction='column'
				>
					<Grid
						mt={0}
						templateColumns='repeat(2, 1fr)'
						pt={2}
						px={2}
						justifyContent='space-between'
					>

						<GridItem>
							<Flex direction='column'>
								<Text fontWeight='500'>
									{`$${nFormatter(totalFundsPaidOut.toString(), 0, false)}`}
									{' '}
									/
									{' '}
									{`${nFormatter(totalFundsAsked.toString(), 0, false)}`}

									{/* {grant?.totalGrantFundingDisbursedUSD === '0' ? '-' : `$${nFormatter(grant?.totalGrantFundingDisbursedUSD, 0, grant.id === '0xe92b011b2ecb97dbe168c802d582037e28036f9b')}`} */}
								</Text>
								<Text
									mt={1}
									variant='body'
									color='gray.600'>
									Funds Paid Out
								</Text>
							</Flex>
						</GridItem>
						<GridItem>
							<Flex direction='column'>
								<Text fontWeight='500'>
									{milestonesCompleted}
									{' '}
									/
									{' '}
									{proposal?.milestones?.length}
								</Text>
								<Text
									mt={1}
									variant='body'
									color='gray.600'>
									Milestones Completed
								</Text>
							</Flex>
						</GridItem>

					</Grid>
				</Flex>

			</Flex>
		</Box>
	)

	const { trackAmplitudeEvent } = useContext(AmplitudeContext)!
	const { scwAddress } = useContext(WebwalletContext)!
	const totalFundsAsked = proposal?.milestones?.reduce((acc, milestone) => acc + parseFloat(milestone.amount), 0)
	const totalFundsPaidOut = proposal?.milestones?.reduce((acc, milestone) => acc + parseFloat(milestone.amountPaid), 0)
	const milestonesCompleted = proposal?.milestones?.filter(milestone => parseFloat(milestone.amountPaid) > 0).length ?? 0


	// const isOpen = useMemo(() => {
	// 	return grant.acceptingApplications === true && grant.deadline ? grant.deadline > new Date().toISOString() : false
	// }, [grant])
	return buildComponent()
}

export default RFPCard