import { useContext, useEffect, useMemo, useState } from 'react'
import { Box, Button, CircularProgress, Flex, Image, Text } from '@chakra-ui/react'
import { ethers } from 'ethers'
import TextViewer from 'src/components/ui/forms/richTextEditor/textViewer'
import { defaultChainId, USD_ASSET } from 'src/constants/chains'
import logger from 'src/libraries/logger'
import CopyIcon from 'src/libraries/ui/CopyIcon'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { ApiClientsContext } from 'src/pages/_app'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress, getFieldString, getRewardAmountMilestones } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getChainInfo } from 'src/utils/tokenUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function Proposal() {
	const buildComponent = () => {
		if(!decryptedProposal) {
			return (
				<Flex
					w='100%'
					h='100%'
					align='center'
					justify='center'>
					<CircularProgress />
				</Flex>
			)
		}

		return (
			<Flex
				w='100%'
				h='100%'
				overflowY='auto'
				px={5}
				py={6}
				direction='column'
				bg='white'>

				<Flex
					w='100%'
					align='center'
					justify='space-between'>
					<Text
						variant='v2_heading_3'
						fontWeight='500'>
						{getFieldString(decryptedProposal, 'projectName')}
					</Text>
					<Text
						variant='v2_body'
						color='gray.5'>
						{formatTime(decryptedProposal.updatedAtS)}
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
							src={getAvatar(false, decryptedProposal.applicantId)}
						/>
						<Flex
							ml={2}
							direction='column'>
							<Text fontWeight='500'>
								{getFieldString(decryptedProposal, 'applicantName')}
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
										variant='v2_body'
										color='gray.5'>
										{getFieldString(decryptedProposal, 'applicantEmail')}
									</Text>
								</Button>

								{
									getFieldString(decryptedProposal, 'applicantAddress') && (
										<Image
											src='/v2/icons/dot.svg'
											boxSize='4px'
											mx={2} />
									)
								}

								{
									getFieldString(decryptedProposal, 'applicantAddress') && (
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
														text={getFieldString(decryptedProposal, 'applicantAddress')} />
												</Flex>
											}>
											<Text
												fontWeight='400'
												variant='v2_body'
												color='gray.5'>
												{formatAddress(getFieldString(decryptedProposal, 'applicantAddress'))}
											</Text>
										</Button>
									)
								}
							</Flex>
						</Flex>
					</Flex>
				</Flex>

				<Flex
					mt={4}
					w='100%'>
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
									{getRewardAmountMilestones(chainInfo.decimals, decryptedProposal)}
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
							{decryptedProposal.milestones.length}
						</Text>
					</Flex>
				</Flex>

				{
					getFieldString(decryptedProposal, 'tldr') && (
						<Flex
							w='100%'
							mt={4}
							direction='column'>
							<Text color='gray.5'>
								tl;dr
							</Text>
							<Text mt={1}>
								{getFieldString(decryptedProposal, 'tldr')}
							</Text>
						</Flex>
					)
				}

				<Flex
					w='100%'
					mt={4}
					direction='column'>
					<Text color='gray.5'>
						Details
					</Text>
					<Box mt={1} />
					{projectDetails && <TextViewer text={projectDetails} />}
				</Flex>

				<Flex
					w='100%'
					mt={4}
					direction='column'>
					<Text color='gray.5'>
						Milestones
					</Text>
					{
						decryptedProposal.milestones.map((milestone, index) => (
							<Flex
								align='center'
								w='100%'
								key={index}
								mt={index === 0 ? 4 : 2}
							>
								<Text
									color='gray.4'
									variant='v2_heading_3'
									fontWeight='500'>
									{index < 9 ? `0${index + 1}` : (index + 1)}
								</Text>
								<Text
									ml={3}
									variant='v2_body'>
									{milestone?.title}
								</Text>
								{
									chainInfo && (
										<Text ml='auto'>
											{chainInfo?.address === USD_ASSET ? milestone.amount : ethers.utils.formatUnits(milestone.amount, chainInfo.decimals)}
											{' '}
											{chainInfo?.label}
										</Text>
									)
								}
							</Flex>
						))
					}
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

	const [decryptedProposal, setDecryptedProposal] = useState<ProposalType | undefined>(proposal)
	const [projectDetails, setProjectDetails] = useState<string>()

	const { decrypt } = useEncryptPiiForApplication(
		selectedGrant?.id,
		proposal?.applicantPublicKey,
		chainId
	)

	useEffect(() => {
		if(!proposal) {
			return
		}

 		Promise.all([decrypt(proposal), getFromIPFS(getFieldString(proposal, 'projectDetails'))]).then(([decryptedProposal, details]) => {
			logger.info({ decryptedProposal, details }, '(Proposal) decrypted proposal')
			setDecryptedProposal(decryptedProposal)
			setProjectDetails(details)
		})
	}, [proposal])

	return buildComponent()
}

export default Proposal