import { useContext, useEffect, useMemo } from 'react'
import { Button, Flex, Image, Text } from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import CopyIcon from 'src/libraries/ui/CopyIcon'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { ApiClientsContext } from 'src/pages/_app'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress, getFieldString, getRewardAmountMilestones } from 'src/utils/formattingUtils'
import { getChainInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function Proposal() {
	const buildComponent = () => {
		if(!proposal) {
			return (
				<Flex>
					<Text>
						Could not proposal data!
					</Text>
				</Flex>
			)
		}

		return (
			<Flex
				w='100%'
				px={5}
				py={6}
				direction='column'
				bg='white'>

				<Flex
					w='100%'
					align='center'
					justify='space-between'>
					<Text
						variant='heading3'
						fontWeight='500'>
						{getFieldString(proposal, 'projectName')}
					</Text>
					<Text
						variant='body'
						color='gray.5'>
						{formatTime(proposal.updatedAtS)}
					</Text>
				</Flex>

				<Flex
					mt={4}
					direction='column'>
					<Text color='gray.5'>
						By
					</Text>
					<Flex align='center'>
						<Image
							borderRadius='3xl'
							boxSize='36px'
							src={getAvatar(false, proposal.applicantId)}
						/>
						<Flex
							ml={2}
							direction='column'>
							<Text fontWeight='500'>
								{getFieldString(proposal, 'applicantName')}
							</Text>
							<Flex
								align='center'>
								<Button
									variant='link'
									rightIcon={
										<Flex
											w='20px'
											h='20px'
											bg='gray.3'
											borderRadius='3xl'
											justify='center'>
											<Image
												alignSelf='center'
												src='/v2/icons/mail.svg'
												boxSize='12px' />
										</Flex>
									}>
									<Text
										fontWeight='400'
										variant='body'
										color='gray.5'>
										{getFieldString(proposal, 'applicantEmail')}
									</Text>
								</Button>

								<Image
									src='/v2/icons/dot.svg'
									boxSize='4px'
									mx={2} />

								<Button
									variant='link'
									rightIcon={
										<Flex
											w='20px'
											h='20px'
											bg='gray.3'
											borderRadius='3xl'
											justify='center'>
											<CopyIcon
												alignSelf='center'
												boxSize='12px'
												text={getFieldString(proposal, 'applicantAddress')} />
										</Flex>
									}>
									<Text
										fontWeight='400'
										variant='body'
										color='gray.5'>
										{formatAddress(getFieldString(proposal, 'applicantAddress'))}
									</Text>
								</Button>
							</Flex>
						</Flex>
					</Flex>
				</Flex>

				<Flex
					mt={4}
					w='100%'
					h='40px'>
					{
						chainInfo && (
							<Flex
								direction='column'
								w='50%'
							>
								<Text color='gray.5'>
									Funding Ask
								</Text>
								<Text
									mt={1}
									fontWeight='500'>
									{getRewardAmountMilestones(chainInfo.decimals, proposal)}
									{' '}
									{chainInfo.label}
								</Text>
							</Flex>
						)
					}
					<Flex
						direction='column'
						w='50%'
					>
						<Text color='gray.5'>
							Milestones
						</Text>
						<Text
							mt={1}
							fontWeight='500'>
							{proposal.milestones.length}
						</Text>
					</Flex>
				</Flex>

			</Flex>
		)
	}

	const { workspace } = useContext(ApiClientsContext)!
	const { proposals, grants, selectedGrantIndex, selectedProposals } = useContext(DashboardContext)!

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(workspace) ?? defaultChainId
	}, [workspace])

	const proposal = useMemo(() => {
		const index = selectedProposals.indexOf(true)

		if(index !== -1) {
			return proposals[index]
		}
	}, [proposals, selectedProposals])

	const selectedGrant = useMemo(() => {
		if(!grants?.length || selectedGrantIndex === undefined || selectedGrantIndex >= grants?.length) {
			return
		}

		return grants[selectedGrantIndex]
	}, [selectedGrantIndex, grants])

	const chainInfo = useMemo(() => {
		if(!selectedGrant || !chainId) {
			return
		}

		return getChainInfo(selectedGrant, chainId)
	}, [chainId, selectedGrant])

	const { decrypt } = useEncryptPiiForApplication(
		selectedGrant?.id,
		proposal?.applicantPublicKey,
		chainId
	)

	useEffect(() => {
		if(!proposal) {
			return
		}

		decrypt(proposal)
	}, [proposal])

	return buildComponent()
}

export default Proposal