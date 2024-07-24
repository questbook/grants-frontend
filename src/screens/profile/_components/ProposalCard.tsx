import { Button, Divider, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import config from 'src/constants/config.json'
import { ProjectDetails } from 'src/generated/icons'
import { getAvatar } from 'src/libraries/utils'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import StateButton from 'src/screens/profile/_components/stateButton'
import { BuilderProposals } from 'src/screens/profile/_utils/types'

interface Props {
	proposal: BuilderProposals
}

function ProposalCard({ proposal }: Props) {
	const buildComponent = () => {
		return (
			<Flex
				w='100%'
				direction='column'
				background='white'
				px={5}
				py={5}
				height='100%'
				position='relative'
				border='1px solid #E7E4DD'
				_hover={
					{
						border: '1px solid #E1DED9',
						boxShadow: '0px 2px 0px 0px #00000010',
					}
				}
			>
				<Flex
					align='flex-start'
					justify='space-between'
					w='100%'>
					<Flex
						direction='column'
						maxW='100%'>
						<Flex
							align='center'
							mt={2}>
							<Image
								borderWidth='1px'
								borderColor='black.100'
								src={proposal.grant.workspace.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(false, proposal.grant.title) : getUrlForIPFSHash(proposal.grant.workspace.logoIpfsHash)}
								boxSize='24px' />
							<Text
								ml={2}
								fontWeight={500}
								fontSize='16px'
								lineHeight='20px'
								variant='heading'>
								{proposal.grant.title}
							</Text>
						</Flex>
					</Flex>
				</Flex>

				<Divider my={4} />
				<Flex>
					<Text
						fontWeight={600}
						fontSize='16px'
						lineHeight='20px'
						variant='heading1'>
						{proposal.name[0].values[0].value}
					</Text>
				</Flex>
				<Flex
					mt={2}
					align='baseline'
					gap={4}>
					<Text
						fontWeight={400}
						color='#8D8B87'
						fontSize='16px'
						lineHeight='20px'
						variant='metadata'>
						{proposal?.milestones?.filter(milestone => parseFloat(milestone.amountPaid) > 0).length}
						{' '}
						Milestones Completed •
						{' '}
						{proposal?.milestones?.reduce((acc, milestone) => acc + parseFloat(milestone.amountPaid), 0)}
						{' '}
						{proposal.grant.workspace.tokens[0].label}
						{' '}
						Paid Out
					</Text>
				</Flex>
				<Flex
					align='center'
					gap={2}
					mt={4}>
					<StateButton
						state={proposal.state}
						title={proposal.state}
						icon={true}
					/>
					<Button
						borderRadius='3xl'
						bgColor='#F1EEE8'
						size='sm'
						textColor='black'
						fontSize='14px'
						onClick={
							() => {
								router.push({
									pathname: '/dashboard/',
									query: {
										grantId: proposal.grant.id,
										chainId: defaultChainId,
										proposalId: proposal.id,
									},
								}, undefined, { shallow: true })
							}

						}
						rightIcon={
							<ProjectDetails
								color='#53514F'

							/>
						}
					>
						View Proposal
					</Button>
				</Flex>
			</Flex>
		)
	}

	const router = useRouter()
	return buildComponent()
}

export default ProposalCard