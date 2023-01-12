import { useContext, useEffect, useMemo, useState } from 'react'
import { Box, Button, CircularProgress, Flex, Image, Text } from '@chakra-ui/react'
import { defaultChainId } from 'src/constants/chains'
import { Mail } from 'src/generated/icons'
import logger from 'src/libraries/logger'
import CopyIcon from 'src/libraries/ui/CopyIcon'
import TextViewer from 'src/libraries/ui/RichTextEditor/textViewer'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getChainInfo } from 'src/libraries/utils/token'
import { GrantsProgramContext } from 'src/pages/_app'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import getAvatar from 'src/utils/avatarUtils'
import { formatAddress, getFieldString, getRewardAmountMilestones } from 'src/utils/formattingUtils'
import { getFromIPFS } from 'src/utils/ipfsUtils'
import { getSupportedChainIdFromWorkspace } from 'src/utils/validationUtils'

function Proposal() {
	const buildComponent = () => {
		if(!proposal) {
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
				h='60%'
				overflowY='auto'
				px={5}
				py={6}
				direction='column'
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				bg='white'>
				<Flex
					w='100%'
					align='center'
					justify='space-between'>
					<Text
						variant='v2_heading_3'
						fontWeight='500'>
						{getFieldString(proposal, 'projectName')}
					</Text>
					<Text
						variant='v2_body'
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
											<Mail
												alignSelf='center'
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
									getFieldString(proposal, 'applicantAddress') && (
										<Image
											src='/v2/icons/dot.svg'
											boxSize='4px'
											mx={2} />
									)
								}

								{
									getFieldString(proposal, 'applicantAddress') && (
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
														// boxSize='12px'
														text={getFieldString(proposal, 'applicantAddress')} />
												</Flex>
											}>
											<Text
												fontWeight='400'
												variant='v2_body'
												color='gray.5'>
												{formatAddress(getFieldString(proposal, 'applicantAddress'))}
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

				{
					getFieldString(proposal, 'tldr') && (
						<Flex
							w='100%'
							mt={4}
							direction='column'>
							<Text color='gray.5'>
								tl;dr
							</Text>
							<Text mt={1}>
								{getFieldString(proposal, 'tldr')}
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
					{/* {projectDetails} */}
					{projectDetails ? <TextViewer text={projectDetails} /> : null}
				</Flex>

				{
					grant?.fields?.filter((field) => field.id.substring(field.id.indexOf('.') + 1).startsWith('customField')).map((field, index) => {
						const id = field.id.substring(field.id.indexOf('.') + 1)
						const title = field.title.substring(field.title.indexOf('-') + 1)
							.split('\\s')
							.join(' ')
						const value = getFieldString(proposal, id)
						return (
							<Flex
								key={index}
								w='100%'
								mt={4}
								direction='column'>
								<Text color='gray.5'>
									{title}
								</Text>
								<Text mt={1}>
									{value}
								</Text>
							</Flex>
						)
					})
				}

				{/* <Flex
					w='100%'
					mt={4}
					direction='column'>
					<Text color='gray.5'>
						Milestones
					</Text>
					{
						proposal.milestones.map((milestone, index) => {

							return (
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
							)
						})
					}
				</Flex> */}
			</Flex>
		)
	}

	const { grant } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals } = useContext(DashboardContext)!

	const proposal = useMemo(() => {
		return proposals.find(p => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

	const chainId = useMemo(() => {
		return getSupportedChainIdFromWorkspace(proposal?.grant?.workspace) ?? defaultChainId
	}, [proposal])

	const chainInfo = useMemo(() => {
		if(!proposal?.grant?.id || !chainId) {
			return
		}

		return getChainInfo(proposal?.grant, chainId)
	}, [proposal?.grant, chainId])

	const [decryptedProposal, setDecryptedProposal] = useState<ProposalType | undefined>(proposal)
	const [projectDetails, setProjectDetails] = useState<string>()

	const { decrypt } = useEncryptPiiForApplication(
		proposal?.grant?.id,
		proposal?.applicantPublicKey,
		chainId,
	)

	useEffect(() => {
		if(!proposal) {
			return
		}

 		Promise.all([decrypt(proposal), getFromIPFS(getFieldString(proposal, 'projectDetails'))]).then(([decryptedProposal, details]) => {
			logger.info({ decryptedProposal, details }, '(Proposal) decrypted proposal')
			setDecryptedProposal({ ...proposal, ...decryptedProposal })
			setProjectDetails(details)
		})
	}, [proposal])

	return buildComponent()
}

export default Proposal