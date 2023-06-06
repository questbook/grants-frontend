import { useMemo } from 'react'
import { Divider, Flex, Image, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { defaultChainId } from 'src/constants/chains'
import config from 'src/constants/config.json'
import { getAvatar } from 'src/libraries/utils'
import { getRewardAmountMilestones } from 'src/libraries/utils/formatting'
import { getUrlForIPFSHash } from 'src/libraries/utils/ipfs'
import { getChainInfo } from 'src/libraries/utils/token'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { RecentProposals } from 'src/screens/discover/_utils/types'

interface Props {
    proposal: RecentProposals[number]
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
				position='relative'
				borderRadius='2px'
				border='1px solid #E7E4DD'
				_hover={
					{
						border: 'none',
					}
				}
				// cursor='pointer'
				onClick={
					() => {
						return
						router.push({
							pathname: '/dashboard/',
							query: {
								grantId: proposal.grant.id,
								chainId: getSupportedChainIdFromWorkspace(proposal.grant.workspace) ?? defaultChainId,
								proposalId: proposal.id,
							},
						})
					}
				}>
				<Flex
					align='flex-start'
					justify='space-between'
					w='100%'>
					<Flex
						direction='column'
						maxW='80%'>
						<Text
							noOfLines={3}
							fontWeight='500'>
							{proposal.name[0].values[0].value}
						</Text>
						<Flex
							align='center'
							mt={4}>
							<Image
								borderWidth='1px'
								borderColor='black.100'
								borderRadius='3xl'
								src={getAvatar(false, proposal.applicantId)}
								boxSize='16px' />
							<Text
								color='black.300'
								ml={2}
								variant='metadata'>
								{proposal.author[0].values[0].value}
							</Text>
						</Flex>
					</Flex>
					<Text
						color='gray.500'
						variant='metadata'>
						{formatTime(proposal.updatedAtS)}
					</Text>
				</Flex>
				<Flex
					align='center'
					mt={2}>
					<Image
						borderWidth='1px'
						borderColor='black.100'
						borderRadius='3xl'
						src={proposal.grant.workspace.logoIpfsHash === config.defaultDAOImageHash ? getAvatar(false, proposal.grant.title) : getUrlForIPFSHash(proposal.grant.workspace.logoIpfsHash)}
						boxSize='16px' />
					<Text
						color='black.300'
						ml={2}
						variant='metadata'>
						{proposal.grant.title}
					</Text>
				</Flex>
				<Divider my={4} />
				<Flex
					align='baseline'
					gap={2}>
					{
						chainInfo && (
							<Text
								as='span'
								fontWeight='500'>
								{getRewardAmountMilestones(chainInfo.decimals, proposal)}
								{' '}
								{chainInfo.label}
							</Text>
						)
					}
					<Text color='black.300'>
						for
					</Text>
					<Text
						as='span'
						fontWeight='500'>
						{proposal.milestones.length}
					</Text>
					<Text color='black.300'>
						{proposal.milestones.length === 1 ? ' milestone' : ' milestones'}
					</Text>
				</Flex>
			</Flex>
		)
	}

	const router = useRouter()

	const chainId = useMemo(() => {
		return (
			getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ??
            defaultChainId
		)
	}, [proposal])

	const chainInfo = useMemo(() => {
		if(!proposal?.grant?.id || !chainId) {
			return
		}

		return getChainInfo(proposal?.grant, chainId)
	}, [proposal?.grant, chainId])

	return buildComponent()
}

export default ProposalCard