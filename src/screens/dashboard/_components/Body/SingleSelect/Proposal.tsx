import { useContext, useEffect, useMemo, useState } from 'react'
import ReactLinkify from 'react-linkify'
import Markdown from 'react-markdown'
import {
	Box,
	Button,
	CircularProgress,
	Flex,
	Image,
	List,
	Text,
} from '@chakra-ui/react'
import copy from 'copy-to-clipboard'
import { ContentState, convertFromRaw, EditorState } from 'draft-js'
import remarkGfm from 'remark-gfm'
import { defaultChainId } from 'src/constants/chains'
import { Mail, ShareForward } from 'src/generated/icons'
import useCustomToast from 'src/libraries/hooks/useCustomToast'
import logger from 'src/libraries/logger'
import CopyIcon from 'src/libraries/ui/CopyIcon'
import NotificationPopover from 'src/libraries/ui/NavBar/_components/NotificationPopover'
import TextViewer from 'src/libraries/ui/RichTextEditor/textViewer'
import { getAvatar } from 'src/libraries/utils'
import {
	getFieldString,
	getFieldStrings,
	getRewardAmountMilestones,
} from 'src/libraries/utils/formatting'
import { getFromIPFS } from 'src/libraries/utils/ipfs'
import { useEncryptPiiForApplication } from 'src/libraries/utils/pii'
import { getChainInfo } from 'src/libraries/utils/token'
import { getSupportedChainIdFromWorkspace } from 'src/libraries/utils/validations'
import { GrantsProgramContext, WebwalletContext } from 'src/pages/_app'
import { GRANT_PII } from 'src/screens/dashboard/_utils/constants'
import { formatTime } from 'src/screens/dashboard/_utils/formatters'
import { ProposalType } from 'src/screens/dashboard/_utils/types'
import { DashboardContext } from 'src/screens/dashboard/Context'
import { tonAPACGrants, tonGrants } from 'src/screens/proposal_form/_utils/constants'

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
				px={5}
				py={6}
				direction='column'
				boxShadow='0px 2px 4px rgba(29, 25, 25, 0.1)'
				bg='white'
			>
				<Flex
					w='100%'
					align='center'
					justify='space-between'>
					<Text
						maxW='90%'
						as='span'
						variant='heading3'
						fontWeight='500'>
						{getFieldString(proposal, 'projectName')}
					</Text>
					<Flex
						ml={4}
						gap={4}>
						<NotificationPopover
							type='proposal'
							proposalId={proposal?.id} />
						<ShareForward
							boxSize='20px'
							cursor='pointer'
							onClick={
								() => {
									const href = window.location.href.split('/')
									const protocol = href[0]
									const domain = href[2]
									const link = `${protocol}//${domain}/dashboard/?grantId=${proposal.grant.id
									}&chainId=${chainId}&proposalId=${proposal.id
									}&isRenderingProposalBody=${true}`
									copy(link)
									toast({
										title: 'Copied!',
										status: 'success',
										duration: 3000,
									})
								}
							}
						/>
					</Flex>
				</Flex>
				{
					proposal?.migratedFrom?.title && (
						<Flex
							align='center'
							justify='center'
							transition='all .5s ease'
							w='fit-content'
							mt={1}
							py={1}
							px={3}
							borderRadius='18px'
							maxH='36px'
							border='1px solid'
							bg='#0A84FF66'
							borderColor='#0A84FF66'
						>

							<Text
								variant='metadata'
								fontWeight='500'
								ml={1}>
								Migrated From:
								{' '}
								{proposal?.migratedFrom?.title}
							</Text>
						</Flex>
					)
				}
				{
					shouldShowPII && (
						<Flex
							mt={4}
							direction='column'>
							<Text color='gray.500'>
								By
							</Text>
							<Flex
								align='center'
								mt={4}>
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
										alignContent='flex-start'
										flexDirection='column'
										overflowWrap='break-word'
										align='flex-start'>
										<Button
											variant='link'
											rightIcon={
												getFieldString(decryptedProposal, 'applicantEmail') ? (
													<Flex
														w='20px'
														h='20px'
														bg='gray.300'
														borderRadius='3xl'
														justify='center'
													>
														<Mail
															alignSelf='center'
															boxSize='12px' />
													</Flex>
												) : (
													<Flex />
												)
											}
										>
											<Text
												onClick={
													() => {
														copy(getFieldString(decryptedProposal, 'applicantEmail') ?? '')
														toast({
															title: 'Copied!',
															status: 'success',
															duration: 3000,
														})
													}
												}
												fontWeight='400'
												variant='v2_body'
												color='gray.500'>
												{getFieldString(decryptedProposal, 'applicantEmail')}
											</Text>
										</Button>

										{
											getFieldString(proposal, 'applicantEmail') && (
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
															bg='gray.300'
															borderRadius='3xl'
															justify='center'
														>
															<CopyIcon
																// boxSize='12px'
																text={getFieldString(proposal, 'applicantAddress') ?? ''}
															/>
														</Flex>
													}
												>
													<Text
														onClick={
															() => {
																copy(getFieldString(proposal, 'applicantAddress') ?? '')
																toast({
																	title: 'Copied!',
																	status: 'success',
																	duration: 3000,
																})
															}
														}
														fontWeight='400'
														variant='v2_body'
														color='gray.500'>
														{getFieldString(proposal, 'applicantAddress')}
													</Text>
												</Button>
											)
										}
									</Flex>
								</Flex>
							</Flex>
						</Flex>
					)
				}

				<Flex
					mt={4}
					w='100%'>
					{
						chainInfo && (
							<Flex
								direction='column'
								w='50%'>
								<Text color='gray.500'>
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
						w='50%'>
						<Text color='gray.500'>
							Submitted on
						</Text>
						<Text
							mt={1}
							fontWeight='500'>
							{formatTime(proposal.createdAtS, true)}
						</Text>
					</Flex>
					<Flex
						direction='column'
						w='50%'>
						<Text color='gray.500'>
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
							<Text color='gray.500'>
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
					<Text color='gray.500'>
						Details
					</Text>
					<Box mt={1} />
					{/* {projectDetails} */}
					<TextViewer
						value={editorState}
						onChange={setEditorState} />
				</Flex>

				{
					getFieldString(decryptedProposal, 'memberDetails') && (
						<Flex
							w='100%'
							mt={4}
							direction='column'>
							<Text color='gray.500'>
								Member Details
							</Text>
							{
								getFieldStrings(decryptedProposal, 'memberDetails')?.map(
									(member: string, index: number) => (
										<ReactLinkify
											key={index}
											componentDecorator={
												(
													decoratedHref: string,
													decoratedText: string,
													key: number,
												) => (
													<Text
														display='inline-block'
														wordBreak='break-all'
														color='accent.azure'
														cursor='pointer'
														_hover={
															{
																textDecoration: 'underline',
															}
														}
														key={key}
														onClick={
															() => {
																window.open(decoratedHref, '_blank')
															}
														}
													>
														{decoratedText}
													</Text>
												)
											}
										>
											<Text
												mt={2}>
												{index + 1}
												.
												{' '}
												{member}
											</Text>
										</ReactLinkify>

									),
								)
							}
						</Flex>
					)
				}

				{
					(getFieldString(decryptedProposal, 'applicantTelegram') || (shouldShowPII && builderInfo)) && (
						<Flex
							w='100%'
							mt={4}
							direction='column'>
							<Text color='gray.500'>
								Telegram
							</Text>
							<Text mt={1}>
								{getFieldString(decryptedProposal, 'applicantTelegram') || (shouldShowPII && builderInfo)}
							</Text>
						</Flex>
					)
				}
				{
					getFieldString(decryptedProposal, 'applicantTwitter') && (
						<Flex
							w='100%'
							mt={4}
							direction='column'>
							<Text color='gray.500'>
								Twitter
							</Text>
							<Text mt={1}>
								{getFieldString(decryptedProposal, 'applicantTwitter')}
							</Text>
						</Flex>
					)
				}

				{
					proposal?.fields
						?.filter((field) => field.id
							.substring(field.id.indexOf('.') + 1)
							.startsWith('customField'),
						)?.sort((a, b) => {
							const aId = a.id.substring(a.id.indexOf('.customField') + 12)?.split('-')[0]
							const bId = b.id.substring(b.id.indexOf('.customField') + 12)?.split('-')[0]
							return parseInt(aId) - parseInt(bId)
						})?.map((field, index) => {
							const id = field.id.substring(field.id.indexOf('.') + 1)

							const title = field.id
								.substring(field.id.indexOf('-') + 1)
								.split('\\s')
								.join(' ')
							const value = getFieldString(proposal, id)
							if(value === undefined) {
								return <Flex key={index} />
							}

							if(!shouldShowPII && (proposal?.grant?.id === tonGrants || proposal?.grant?.id === tonAPACGrants) && (GRANT_PII?.some((s) => title === s))) {
								return <Flex key={index} />
							}

							return (
								<Flex
									key={index}
									w='100%'
									mt={4}
									direction='column'>
									<Text color='gray.500'>
										{title}
									</Text>
									<Markdown
										remarkPlugins={[remarkGfm]}
										className='DraftEditor-root DraftEditor-editorContainer public-DraftEditor-content markdown-body'
										components={
											{
												a: props => {
													return (
														<Text
															display='inline-block'
															wordBreak='break-all'
															color='accent.azure'
															fontSize='15px'
															variant='body'
															cursor='pointer'
															_hover={
																{
																	textDecoration: 'underline',
																}
															}
															onClick={
																() => {
																	window.open(props.href, '_blank')
																}
															}
														>
															{props.href}
														</Text>

													)
												},

												p: ({ ...props }) => {
													return (
														<ReactLinkify
															componentDecorator={
																(
																	decoratedHref: string,
																	decoratedText: string,
																	key: number,
																) => (
																	<Text
																		display='inline-block'
																		wordBreak='break-all'
																		color='accent.azure'
																		cursor='pointer'
																		_hover={
																			{
																				textDecoration: 'underline',
																			}
																		}
																		key={key}
																		onClick={
																			() => {
																				window.open(decoratedHref, '_blank')
																			}
																		}
																	>
																		{decoratedText}
																	</Text>
																)
															}
														>

															<Text
																{...props}
																variant='body'
																fontSize='15px'
																mt={1.5}
																whiteSpace='pre-line'
																wordBreak='break-word'
															/>
														</ReactLinkify>
													)
												},
												ul: ({ ...props }) => {
													return (
														<List
															{...props}
															as='ul'
															fontSize='15px'
															className='public-DraftStyleDefault-ul'
														/>
													)
												}
												,
												li: ({ ...props }) => {
													return props && !props?.children?.toString()?.length ? '-' : (
														<li
															{...props}
															className='public-DraftStyleDefault-unorderedListItem public-DraftStyleDefault-reset public-DraftStyleDefault-depth0 public-DraftStyleDefault-listLTR'
														/>
													)

												},


												h1: ({ ...props }) => {
													return (
														<Text
															fontSize='20px'
															fontWeight={600}
															lineHeight={1.2}
															mb='14px'
															mt='14px'
															{...props}
															as='h1'

														/>
													)
												},
												h2: ({ ...props }) => {
													return (
														<Text

															{...props}
															as='h2'
															fontSize='18px'
															fontWeight={600}
															lineHeight={1.2}
															mb='14px'
															mt='14px'
														/>
													)
												},

												h3: ({ ...props }) => {
													return (
														<Text

															{...props}
															as='h3'
															fontSize='16px'
															fontWeight={600}
															lineHeight={1.2}
															mb='14px'
															mt='14px'
														/>
													)
												},


												h4: ({ ...props }) => {
													return (
														<Text
															{...props}
															variant='h4'
															mt={2}
														/>
													)
												},
												h5: ({ ...props }) => {
													return (
														<Text
															{...props}
															variant='h5'
															mt={2}
														/>
													)
												},
												code: ({ ...props }) => {
													return (
														<Text
															{...props}
															as='code'
															fontStyle='normal'
															fontFamily='body'
															variant='body'
															fontSize='15px'
															mt={2}
															whiteSpace='pre-line'
															wordBreak='break-word'
														/>
													)
												},
												img: ({ ...props }) => {
													return (
														<Image
															{...props}
															fallback={<></>}
															fallbackStrategy='onError'
															w='50%'
															mt={2}
															src={props.src}
															alt='comment-image'
														/>
													)
												}
											}
										}
									>
										{value}
									</Markdown>
								</Flex>

							)
						})
				}
			</Flex>
		)
	}

	const { role } = useContext(GrantsProgramContext)!
	const { proposals, selectedProposals, builderInfo } = useContext(DashboardContext)!
	const { scwAddress } = useContext(WebwalletContext)!
	const toast = useCustomToast()

	const proposal = useMemo(() => {
		return proposals.find((p) => selectedProposals.has(p.id))
	}, [proposals, selectedProposals])

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

	const shouldShowPII = useMemo(() => {
		return role !== 'community' && (role === 'builder' ? proposal?.applicantId === scwAddress : true)
	}, [role, proposal?.applicantId, scwAddress])

	const [decryptedProposal, setDecryptedProposal] = useState<
		ProposalType | undefined
	>(proposal)
	const [editorState, setEditorState] = useState<EditorState>(
		EditorState.createEmpty(),
	)
	const migratedId = (proposal?.migratedFrom?.id ?? proposal?.grant?.id) as string
	const { decrypt } = useEncryptPiiForApplication(
		migratedId,
		proposal?.applicantPublicKey,
		chainId,
	)

	useEffect(() => {
		if(!proposal) {
			return
		}

		Promise.all([
			decrypt(proposal),
			typeof getFieldString(proposal, 'projectDetails') === 'string'
			&& getFieldString(proposal, 'projectDetails')?.startsWith('Qm') ? getFromIPFS(getFieldString(proposal, 'projectDetails') ?? '') : Promise.resolve(getFieldString(proposal, 'projectDetails') ?? ''),
		]).then(([decryptedProposal, details]) => {
			logger.info(
				{ decryptedProposal, details },
				'(Proposal) decrypted proposal',
			)
			setDecryptedProposal({ ...proposal, ...decryptedProposal })

			try {
				const o = typeof details === 'string' ? JSON.parse(details) : details
				setEditorState(EditorState.createWithContent(convertFromRaw(o)))
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch(e: any) {
				if(details) {
					setEditorState(
						EditorState.createWithContent(ContentState.createFromText(details)),
					)
				}
			}
		})
	}, [proposal])

	return buildComponent()
}

export default Proposal
