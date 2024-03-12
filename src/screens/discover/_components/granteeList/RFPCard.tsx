import { useContext } from 'react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react'
import config from 'src/constants/config.json'
import { QBAdminsContext } from 'src/libraries/hooks/QBAdminsContext'
import logger from 'src/libraries/logger'
import { getAvatar } from 'src/libraries/utils'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import StateButton from 'src/screens/discover/_components/stateButton'
import { RecentProposals } from 'src/screens/discover/_utils/types'


type RFPCardProps = {
	proposal: RecentProposals[number]
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
						direction='column'
						gap={2}
					>
						<Flex
							my={2}
							direction='column'
						>
							<Text
								color='#7E7E8F'
								fontSize='14px'
								fontWeight='500'
								noOfLines={2}
							>
								{proposal.author[0].values[0].value}
							</Text>
							<Text
								variant='title'
								fontSize='18px'
								fontWeight='500'
								noOfLines={2}
								mt={2}
							>
								{proposal.name[0].values[0].value}
							</Text>

						</Flex>

						{/* <Flex gap={1}>
						<Text variant='subtitle'>
							{isOpen ? 'Deadline on' : 'Ended on'}
							{' '}
						</Text>
						<Text
							variant='subtitle'
							fontWeight='500'
							color='black.100'
						>
							{formattedDeadline}
						</Text>
					</Flex> */}

					</Flex>
					<Flex
						justifyContent='end'
						alignItems='end'
					>

						<Flex gap={2}>
							<StateButton
								state={proposal.milestones.filter((milestone) => milestone.amountPaid === milestone.amount).length === proposal.milestones.length ? 'approved' : 'submitted'}
								title={proposal.milestones.filter((milestone) => milestone.amountPaid === milestone.amount).length === proposal.milestones.length ? 'Completed' : 'In Progress'}
							/>
							<Button
				 borderRadius='8px'
				 bgColor='#F1EEE8'
				 size='sm'
				 _hover={{ bgColor: 'blue.600', color: 'white' }}
				 textColor='#53514F'
				 fontSize='14px'
				 onClick={
									() => {
										/* @ts-ignore */
										window.open(`${window.location.origin}/dashboard/?grantId=${proposal.grant.id}&proposalId=${proposal.id}&chainId=10`, '_blank')
									}
								}
				 rightIcon={<ArrowForwardIcon />}

				 >
								View Proposal
							</Button>
						</Flex>

					</Flex>
				</Box>

				<Flex
					direction='row'
					alignItems='center'
					gap={2}
				>
					<Image
						borderWidth='1px'
						borderColor='black.100'
						borderRadius='10.143px'
						src={proposal.grant.workspace.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(false, proposal.grant.title) : getUrlForIPFSHash(proposal.grant.workspace.logoIpfsHash)}
						boxSize='20px' />
					<Text
						variant='title'
						fontSize='18px'
						fontWeight='500'
						noOfLines={2}
					>
						{proposal.grant.title}
					</Text>
				</Flex>

			</Flex>
		</Box>
	)


	const { isQbAdmin } = useContext(QBAdminsContext)!
	logger.info({ isQbAdmin }, 'isQbAdmin')

	// const isOpen = useMemo(() => {
	// 	return grant.acceptingApplications === true && grant.deadline ? grant.deadline > new Date().toISOString() : false
	// }, [grant])
	return buildComponent()
}


export default RFPCard